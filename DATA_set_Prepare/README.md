# Task52/53: Name Matching Dataset Preparation

This directory contains Task52 schema/label definitions and Task53 fictional name-pair dataset for Khmer name/identity matching.

## Files

| File | Purpose |
|---|---|
| `README.md` | Schema, labels, and dataset notes. |
| `schema/task52_pairwise_schema.json` | Machine-readable pairwise schema. |
| `task52_name_matching_pairs.sample.csv` | Task52 small sample (8 rows). |
| `task52_name_matching_pairs.sample.jsonl` | Task52 small sample (JSONL). |
| `task53_fictional_name_pairs.csv` | Task53 fictional/authorized-safe dataset (52 pairs). |
| `task53_fictional_name_pairs.jsonl` | Task53 dataset (JSONL). |

## Task52 - Dataset Columns

One row = one candidate pair.

| Column | Type | Required | Description |
|---|---|---:|---|
| `pair_id` | string | Yes | Unique stable pair identifier. |
| `left_record_id`,`right_record_id` | string | Yes | Source record IDs. |
| `left_full_name_kh`,`right_full_name_kh` | string | Yes | Raw Khmer names. |
| `left_full_name_en`,`right_full_name_en` | string | Yes | Raw Latin/romanized names. |
| `left_dob`,`right_dob` | date `YYYY-MM-DD` | No | Empty if unknown. |
| `left_gender`,`right_gender` | enum | No | `Male`, `Female`, `Unknown`. |
| `left_phone`,`right_phone` | string | No | Normalized/masked phone. |
| `left_province`,`right_province` | string | No | Canonical province. |
| `left_doc_id`,`right_doc_id` | string | No | Mask/hash in shareable data. |
| `left_source`,`right_source` | string | No | Source system. |
| `label` | int enum | Yes | Ground-truth label. |
| `label_status` | enum | Yes | `draft`, `adjudicated`, `verified`. |
| `label_reason` | string | No | Rationale/code. |
| `labeled_by`,`labeled_at` | string | No | Auditor/timestamp (ISO 8601). |
| `dataset_split` | enum | No | `train`, `val`, `test`, `benchmark`. |

## Match / Non-Match Labels

| Label | Value | Meaning | Metrics |
|---|---:|---|---|
| `non_match` | `0` | Different people. | Negative class. |
| `match` | `1` | Same person despite name/script/phonetic/format variants. | Positive class. |
| `uncertain` | `-1` | Insufficient evidence. | Exclude/adjudicate before binary P/R/F1/confusion matrix. |

## Labeling Rules

- Label identity, not string similarity.
- Use supporting evidence (DOB, doc ID, phone, province, source).
- Preserve raw names; normalize in separate processing.
- Use only `verified` rows for official benchmarks.
- No duplicate `pair_id`; avoid unordered duplicate pairs.
- Prevent entity leakage across splits.

## Task53 - Fictional Name Pairs

- **Count**: 52 pairs (>=50 requested).
- **Data safety**: all rows are fictional/synthetic; phones/doc IDs are masked/hashed placeholders. No real-person PII.
- **Coverage**: exact matches, romanization/phonetic variants, Khmer spelling/diacritic variants, name-order variants, clear non-matches, and uncertain/adjudication cases.
- **Intended use**: development/testing/benchmark scaffolding.

## Validation

```bash
python3 - <<'PY'
import csv,collections
rows=list(csv.DictReader(open('task53_fictional_name_pairs.csv',encoding='utf-8')))
print('rows',len(rows))
print('labels',collections.Counter(r['label'] for r in rows))
print('unique_pair_id',len({r['pair_id'] for r in rows})==len(rows))
PY
```
