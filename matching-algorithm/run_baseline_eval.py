#!/usr/bin/env python3
"""Run Task 34 baseline matching tests and record mistakes/limitations.

Outputs:
- test/T34_baseline/T34_baseline_results.csv
- test/T34_baseline/T34_baseline_summary.json
- test/T34_baseline/T34_baseline_report.md
"""
from __future__ import annotations

import argparse
import csv
import json
import platform
import subprocess
import sys
from collections import Counter, defaultdict
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
sys.path.insert(0, str(HERE))

from name_similarity import compare_names  # noqa: E402

THRESHOLDS = [70, 80, 85, 90]
DEFAULT_THRESHOLD = 80


def git(cmd: list[str]) -> str:
    try:
        return subprocess.check_output(cmd, cwd=REPO, text=True).strip()
    except Exception as e:
        return f"<unavailable: {e}>"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def predict(score, threshold: int) -> str:
    if score is None:
        return "unavailable"
    return "match" if score >= threshold else "non_match"


def outcome(label: int, pred: str) -> str:
    if label == -1:
        return "excluded_uncertain"
    if pred == "unavailable":
        return "unavailable"
    if label == 1 and pred == "match":
        return "TP"
    if label == 0 and pred == "match":
        return "FP"
    if label == 0 and pred == "non_match":
        return "TN"
    if label == 1 and pred == "non_match":
        return "FN"
    return "unknown"


def metrics(rows: list[dict], threshold: int) -> dict:
    counts = Counter()
    for r in rows:
        if int(r["label"]) == -1:
            counts["excluded_uncertain"] += 1
            continue
        pred = predict(r["score"], threshold)
        o = outcome(int(r["label"]), pred)
        counts[o] += 1
    tp, fp, tn, fn = counts["TP"], counts["FP"], counts["TN"], counts["FN"]
    unavail = counts["unavailable"]
    evaluated = tp + fp + tn + fn + unavail
    binary_eval = tp + fp + tn + fn
    precision = tp / (tp + fp) if (tp + fp) else None
    recall = tp / (tp + fn) if (tp + fn) else None
    f1 = (2 * precision * recall / (precision + recall)) if precision and recall else (0.0 if precision == 0 or recall == 0 else None)
    accuracy = (tp + tn) / binary_eval if binary_eval else None
    return {
        "threshold": threshold,
        "total_rows": len(rows),
        "excluded_uncertain": counts["excluded_uncertain"],
        "evaluated_binary_or_unavailable": evaluated,
        "binary_evaluated_excluding_unavailable": binary_eval,
        "TP": tp, "FP": fp, "TN": tn, "FN": fn,
        "unavailable": unavail,
        "unavailable_rate": unavail / evaluated if evaluated else None,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "accuracy_excluding_unavailable": accuracy,
    }


def eval_fictional(path: Path) -> list[dict]:
    rows = read_csv(path)
    out = []
    modes = [
        ("latin-latin", "left_full_name_en", "right_full_name_en"),
        ("khmer-khmer", "left_full_name_kh", "right_full_name_kh"),
        ("khmer-latin", "left_full_name_kh", "right_full_name_en"),
    ]
    for r in rows:
        label = int(r["label"])
        for mode, left_k, right_k in modes:
            left, right = r.get(left_k, ""), r.get(right_k, "")
            res = compare_names(left, right)
            row = {
                "dataset": "fictional_pairs",
                "pair_id": r.get("pair_id", ""),
                "mode": mode,
                "name_a": left,
                "name_b": right,
                "label": label,
                "label_status": r.get("label_status", ""),
                "case_type": r.get("label_reason", ""),
                "split": r.get("dataset_split", ""),
                "script_pair": {"latin-latin":"la-la","khmer-khmer":"kh-kh","khmer-latin":"kh-la"}[mode],
                "score": res.score,
                "method": res.method,
                "matched_variant": res.matched_variant,
                "variant_type": res.variant_type,
                "edit_distance": res.edit_distance,
                "compared_length": res.compared_length,
                "explanation": res.explanation,
            }
            for t in THRESHOLDS:
                row[f"pred_t{t}"] = predict(res.score, t)
                row[f"outcome_t{t}"] = outcome(label, row[f"pred_t{t}"])
            out.append(row)
    return out


def eval_split(path: Path) -> list[dict]:
    rows = read_csv(path)
    out = []
    for r in rows:
        label = int(r["label"])
        left, right = r.get("name_a", ""), r.get("name_b", "")
        res = compare_names(left, right)
        row = {
            "dataset": "splits_test",
            "pair_id": r.get("pair_id", ""),
            "mode": "as-is",
            "name_a": left,
            "name_b": right,
            "label": label,
            "label_status": "",
            "case_type": r.get("case_type", ""),
            "split": r.get("split", ""),
            "script_pair": r.get("script_pair", ""),
            "score": res.score,
            "method": res.method,
            "matched_variant": res.matched_variant,
            "variant_type": res.variant_type,
            "edit_distance": res.edit_distance,
            "compared_length": res.compared_length,
            "explanation": res.explanation,
        }
        for t in THRESHOLDS:
            row[f"pred_t{t}"] = predict(res.score, t)
            row[f"outcome_t{t}"] = outcome(label, row[f"pred_t{t}"])
        out.append(row)
    return out


def group_metrics(rows: list[dict], by: str, threshold: int) -> dict:
    groups = defaultdict(list)
    for r in rows:
        groups[r.get(by, "") or "<empty>"].append(r)
    return {k: metrics(v, threshold) for k, v in sorted(groups.items())}


def write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    keys = list(rows[0].keys())
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=keys)
        w.writeheader()
        w.writerows(rows)


def fmt(v):
    if v is None:
        return "N/A"
    if isinstance(v, float):
        return f"{v:.4f}"
    return str(v)


def md_table(headers: list[str], rows: list[list[str]]) -> str:
    lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for r in rows:
        lines.append("| " + " | ".join(r) + " |")
    return "\n".join(lines)


def collect_mistakes(rows: list[dict], threshold: int) -> list[dict]:
    mistakes = []
    for r in rows:
        label = int(r["label"])
        pred = r[f"pred_t{threshold}"]
        o = r[f"outcome_t{threshold}"]
        if o in {"FP", "FN", "unavailable"} or (label == -1):
            mistakes.append({
                "dataset": r["dataset"], "pair_id": r["pair_id"], "mode": r["mode"],
                "case_type": r["case_type"], "script_pair": r["script_pair"],
                "name_a": r["name_a"], "name_b": r["name_b"], "label": label,
                "score": r["score"], "method": r["method"], "pred": pred, "outcome": o,
                "explanation": r["explanation"],
            })
    return mistakes


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--outdir", default=str(REPO / "test" / "T34_baseline"))
    args = parser.parse_args()
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    fic_path = REPO / "data" / "samples" / "fictional_pairs.csv"
    split_path = REPO / "data" / "splits" / "test.csv"
    rows = eval_fictional(fic_path) + eval_split(split_path)
    write_csv(outdir / "T34_baseline_results.csv", rows)

    summary = {
        "task": "T34",
        "description": "Run baseline matching tests and record mistakes and limitations",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "git_commit": git(["git", "rev-parse", "HEAD"]),
        "git_status_short": git(["git", "status", "--short"]),
        "python": sys.version,
        "platform": platform.platform(),
        "baseline": {
            "module": "matching-algorithm/name_similarity.py",
            "function": "compare_names",
            "api": "matching-algorithm/api_server.py",
            "notes": "Normalized Levenshtein for same-script; Khmer-Latin only for exact KHMER_VARIANTS dictionary hit; otherwise score=None."
        },
        "datasets": {
            "fictional_pairs": str(fic_path.relative_to(REPO)),
            "splits_test": str(split_path.relative_to(REPO)),
        },
        "thresholds": THRESHOLDS,
        "default_threshold": DEFAULT_THRESHOLD,
        "overall": {},
        "by_dataset": {},
        "by_dataset_mode": {},
        "by_case_type": {},
        "by_script_pair": {},
    }

    for t in THRESHOLDS:
        summary["overall"][str(t)] = metrics(rows, t)
    for ds in ["fictional_pairs", "splits_test"]:
        ds_rows = [r for r in rows if r["dataset"] == ds]
        summary["by_dataset"][ds] = {str(t): metrics(ds_rows, t) for t in THRESHOLDS}
        by_mode = defaultdict(list)
        for r in ds_rows:
            by_mode[r["mode"]].append(r)
        summary["by_dataset_mode"][ds] = {m: {str(t): metrics(mrows, t) for t in THRESHOLDS} for m, mrows in sorted(by_mode.items())}
        summary["by_case_type"][ds] = {ct: {str(t): metrics(crows, t) for t in THRESHOLDS} for ct, crows in sorted(defaultdict(list, {k:[] for k in []}).items())}
        ct_groups = defaultdict(list)
        for r in ds_rows: ct_groups[r.get("case_type","") or "<empty>"].append(r)
        summary["by_case_type"][ds] = {ct: {str(t): metrics(crows, t) for t in THRESHOLDS} for ct, crows in sorted(ct_groups.items())}
        sp_groups = defaultdict(list)
        for r in ds_rows: sp_groups[r.get("script_pair","") or "<empty>"].append(r)
        summary["by_script_pair"][ds] = {sp: {str(t): metrics(crows, t) for t in THRESHOLDS} for sp, crows in sorted(sp_groups.items())}

    (outdir / "T34_baseline_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    mistakes = collect_mistakes(rows, DEFAULT_THRESHOLD)
    mistake_rows = [m for m in mistakes if m["outcome"] in {"FP","FN","unavailable"}]
    uncertain_rows = [m for m in mistakes if m["outcome"] == "excluded_uncertain"]

    # report
    lines = []
    lines.append("# T34 - Baseline Matching Test Report")
    lines.append("")
    lines.append("## Summary")
    lines.append(f"- Generated: {summary['generated_at']}")
    lines.append(f"- Git commit: `{summary['git_commit']}`")
    lines.append(f"- Baseline: `matching-algorithm/name_similarity.py::compare_names` (Levenshtein; dictionary-assisted Khmer-Latin only for exact `KHMER_VARIANTS` hit)")
    lines.append(f"- Datasets: `{summary['datasets']['fictional_pairs']}` ({len([r for r in rows if r['dataset']=='fictional_pairs'])} evaluations = 52 pairs x 3 modes), `{summary['datasets']['splits_test']}` ({len([r for r in rows if r['dataset']=='splits_test'])} rows as-is)")
    lines.append(f"- Default threshold: {DEFAULT_THRESHOLD}; sensitivity also reported at {THRESHOLDS}")
    lines.append(f"- Uncertain label `-1` excluded from binary P/R/F1/confusion matrix; counted separately.")
    lines.append("")
    lines.append("## Overall Metrics")
    hdr = ["Threshold","Total","Excluded -1","Binary+Unavail","Binary eval","TP","FP","TN","FN","Unavailable","Unavail rate","Precision","Recall","F1","Acc(excl unavail)"]
    trows = []
    for t in THRESHOLDS:
        m = summary["overall"][str(t)]
        trows.append([str(t),str(m['total_rows']),str(m['excluded_uncertain']),str(m['evaluated_binary_or_unavailable']),str(m['binary_evaluated_excluding_unavailable']),str(m['TP']),str(m['FP']),str(m['TN']),str(m['FN']),str(m['unavailable']),fmt(m['unavailable_rate']),fmt(m['precision']),fmt(m['recall']),fmt(m['f1']),fmt(m['accuracy_excluding_unavailable'])])
    lines.append(md_table(hdr,trows))
    lines.append("")

    for ds in ["fictional_pairs","splits_test"]:
        lines.append(f"## Dataset: {ds}")
        hdr = ["Mode/Group","Threshold","Total","Excl -1","TP","FP","TN","FN","Unavail","Precision","Recall","F1"]
        trows=[]
        for mode, mm in summary["by_dataset_mode"][ds].items():
            for t in THRESHOLDS:
                m=mm[str(t)]
                trows.append([mode,str(t),str(m['total_rows']),str(m['excluded_uncertain']),str(m['TP']),str(m['FP']),str(m['TN']),str(m['FN']),str(m['unavailable']),fmt(m['precision']),fmt(m['recall']),fmt(m['f1'])])
        lines.append(md_table(hdr,trows))
        lines.append("")
        lines.append(f"### {ds} by case_type (threshold {DEFAULT_THRESHOLD})")
        hdr=["case_type","Total","Excl -1","TP","FP","TN","FN","Unavail","Precision","Recall","F1"]
        trows=[]
        for ct, mm in summary["by_case_type"][ds].items():
            m=mm[str(DEFAULT_THRESHOLD)]
            trows.append([ct,str(m['total_rows']),str(m['excluded_uncertain']),str(m['TP']),str(m['FP']),str(m['TN']),str(m['FN']),str(m['unavailable']),fmt(m['precision']),fmt(m['recall']),fmt(m['f1'])])
        lines.append(md_table(hdr,trows))
        lines.append("")

    lines.append("## Mistakes and Unavailable Cases (default threshold 80)")
    lines.append(f"- Total flagged rows: {len(mistakes)} (FP/FN/unavailable/uncertain-excluded)")
    lines.append(f"- FP/FN/unavailable: {len(mistake_rows)}; uncertain excluded: {len(uncertain_rows)}")
    lines.append("")
    lines.append("### FP/FN/Unavailable Details")
    hdr=["dataset","pair_id","mode","script","case_type","label","score","method","pred","outcome","name_a","name_b","explanation"]
    trows=[]
    for m in mistake_rows[:250]:
        trows.append([m['dataset'],m['pair_id'],m['mode'],m['script_pair'],m['case_type'],str(m['label']),fmt(m['score']),m['method'],m['pred'],m['outcome'],m['name_a'],m['name_b'],(m['explanation'] or '')[:160]])
    lines.append(md_table(hdr,trows))
    if len(mistake_rows)>250:
        lines.append(f"\n_... {len(mistake_rows)-250} more rows in `T34_baseline_results.csv`._")
    lines.append("")
    lines.append("### Uncertain (-1) Cases (excluded from binary metrics)")
    hdr=["dataset","pair_id","mode","script","case_type","score","method","pred","name_a","name_b","explanation"]
    trows=[]
    for m in uncertain_rows:
        trows.append([m['dataset'],m['pair_id'],m['mode'],m['script_pair'],m['case_type'],fmt(m['score']),m['method'],m['pred'],m['name_a'],m['name_b'],(m['explanation'] or '')[:160]])
    lines.append(md_table(hdr,trows))
    lines.append("")

    lines.append("## Limitations")
    lines.append("- **Small dictionary for cross-script**: Khmer-Latin scoring only works for exact `KHMER_VARIANTS` hits (3 entries). Most cross-script pairs return `score=None` (unavailable), inflating unavailability and hiding potential matches/mismatches.")
    lines.append("- **Character-level only**: Normalized Levenshtein measures edit distance, not phonetic similarity, romanization conventions, or Khmer script/phonology; valid romanization variants can be under-scored.")
    lines.append("- **No identity attributes**: Baseline ignores DOB, gender, province, doc ID, phone, and source; it cannot resolve same-name-different-person or different-name-same-person identity cases.")
    lines.append("- **No hard rules/conflict handling**: Conflicting strong identifiers (e.g., different doc IDs) are not enforced; uncertain cases need adjudication workflow.")
    lines.append("- **Threshold sensitivity**: Fixed threshold changes FP/FN tradeoff; no calibrated confidence model.")
    lines.append("- **Dataset limitations**: Fictional/synthetic small sample; split test schema differs (name_a/name_b/case_type). Not representative of real-world noise, OCR errors, or full Khmer name distribution.")
    lines.append("- **Uncertain labels**: `-1` excluded from binary metrics; production needs review queue/adjudication policy.")
    lines.append("- **Explainability is baseline-level**: Explanation reports edit distance/dictionary variant, not identity evidence; UI/API must not present as identity confirmation.")
    lines.append("")
    lines.append("## Next Steps")
    lines.append("- Expand reviewed Khmer-Latin romanization dictionary and add fuzzy/phonetic romanization candidate generation.")
    lines.append("- Add Khmer-specific normalization (script order/diacritics/spacing), phonetic encoding, and transliteration model.")
    lines.append("- Build hybrid scorer: name similarity + attribute agreement/conflict rules + calibrated threshold.")
    lines.append("- Evaluate on larger labeled real/authorized benchmark with fixed splits and error analysis by case type.")
    lines.append("- Add `unavailable`/`uncertain` handling in API/UI and persist evaluation artifacts in CI.")

    (outdir / "T34_baseline_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"outdir": str(outdir), "total_rows": len(rows), "mistakes": len(mistake_rows), "uncertain": len(uncertain_rows)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
