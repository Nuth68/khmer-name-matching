#!/usr/bin/env python3
"""Generate T34 baseline graphs from summary/results."""
from __future__ import annotations
import csv, json
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

REPO = Path(__file__).resolve().parent.parent
SUMMARY = REPO / 'test/T34_baseline/T34_baseline_summary.json'
RESULTS = REPO / 'test/T34_baseline/T34_baseline_results.csv'
OUT = REPO / 'test/T34_baseline/graphs'
OUT.mkdir(parents=True, exist_ok=True)

summary = json.loads(SUMMARY.read_text())
rows = list(csv.DictReader(RESULTS.open(encoding='utf-8-sig')))
thresholds = summary['thresholds']

# 1) Overall metrics by threshold
metrics = ['precision','recall','f1','accuracy_excluding_unavailable']
plt.figure(figsize=(8,5))
for m in metrics:
    vals = [summary['overall'][str(t)][m] for t in thresholds]
    plt.plot(thresholds, vals, marker='o', label=m)
unavail = [summary['overall'][str(t)]['unavailable_rate'] for t in thresholds]
plt.plot(thresholds, unavail, marker='x', linestyle='--', label='unavailable_rate')
plt.ylim(0,1.05)
plt.xlabel('Threshold')
plt.ylabel('Score / Rate')
plt.title('T34 Baseline - Overall Metrics by Threshold')
plt.grid(alpha=0.3)
plt.legend(loc='best', fontsize=8)
plt.tight_layout()
plt.savefig(OUT/'01_overall_metrics_by_threshold.png', dpi=160)
plt.close()

# 2) Confusion counts by threshold
plt.figure(figsize=(8,5))
cats = ['TP','FP','TN','FN','unavailable']
x = np.arange(len(thresholds))
width = 0.15
for i,c in enumerate(cats):
    vals = [summary['overall'][str(t)][c] for t in thresholds]
    plt.bar(x + i*width, vals, width, label=c)
plt.xticks(x + width*2, thresholds)
plt.xlabel('Threshold')
plt.ylabel('Count')
plt.title('T34 Baseline - Outcome Counts by Threshold')
plt.legend()
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig(OUT/'02_outcome_counts_by_threshold.png', dpi=160)
plt.close()

# 3) Dataset/mode F1 at threshold 80
labels=[]; f1s=[]; precs=[]; recs=[]; unavs=[]
for ds, modes in summary['by_dataset_mode'].items():
    for mode, mm in modes.items():
        m = mm['80']
        labels.append(f"{ds}\n{mode}")
        f1s.append(m['f1'] or 0)
        precs.append(m['precision'] or 0)
        recs.append(m['recall'] or 0)
        unavs.append(m['unavailable_rate'] or 0)
x = np.arange(len(labels))
plt.figure(figsize=(10,5))
plt.bar(x-0.2, precs, 0.2, label='precision')
plt.bar(x, recs, 0.2, label='recall')
plt.bar(x+0.2, f1s, 0.2, label='f1')
plt.plot(x, unavs, 'k--o', label='unavailable_rate')
plt.xticks(x, labels, fontsize=8)
plt.ylim(0,1.05)
plt.title('T34 Baseline - Metrics by Dataset/Mode (T=80)')
plt.legend(fontsize=8)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig(OUT/'03_dataset_mode_metrics_t80.png', dpi=160)
plt.close()

# 4) Case type F1 for fictional pairs
ct = summary['by_case_type']['fictional_pairs']
names = list(ct.keys())
f1s = [(ct[n]['80']['f1'] or 0) for n in names]
tps = [ct[n]['80']['TP'] for n in names]
fps = [ct[n]['80']['FP'] for n in names]
fns = [ct[n]['80']['FN'] for n in names]
unav = [ct[n]['80']['unavailable'] for n in names]
fig, ax = plt.subplots(figsize=(11,6))
x = np.arange(len(names))
ax.bar(x-0.3, tps,0.2,label='TP')
ax.bar(x-0.1, fps,0.2,label='FP')
ax.bar(x+0.1, fns,0.2,label='FN')
ax.bar(x+0.3, unav,0.2,label='unavailable')
ax.set_xticks(x)
ax.set_xticklabels(names, rotation=35, ha='right', fontsize=7)
ax.set_title('T34 Baseline - Fictional Pairs by Case Type (T=80)')
ax.legend(fontsize=8)
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig(OUT/'04_fictional_case_type_t80.png', dpi=160)
plt.close()

# 5) Score distribution
scored = [float(r['score']) for r in rows if r['score'] not in ('', 'None', None)]
unavailable_n = sum(1 for r in rows if r['score'] in ('', 'None', None))
plt.figure(figsize=(8,5))
plt.hist(scored, bins=20, color='#4C78A8', edgecolor='white')
plt.axvline(80, color='red', linestyle='--', label='T=80')
plt.xlabel('Score')
plt.ylabel('Count')
plt.title(f'T34 Baseline - Score Distribution (scored={len(scored)}, unavailable={unavailable_n})')
plt.legend()
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig(OUT/'05_score_distribution.png', dpi=160)
plt.close()

# 6) Outcome by script pair for splits_test
sp = summary['by_script_pair']['splits_test']
names = list(sp.keys())
fig, ax = plt.subplots(figsize=(8,5))
x = np.arange(len(names))
for i,c in enumerate(['TP','FP','TN','FN','unavailable']):
    vals=[sp[n]['80'][c] for n in names]
    ax.bar(x+i*0.15, vals, 0.15, label=c)
ax.set_xticks(x+0.3)
ax.set_xticklabels(names)
ax.set_title('T34 Baseline - Splits Test by Script Pair (T=80)')
ax.legend()
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig(OUT/'06_splits_script_pair_t80.png', dpi=160)
plt.close()

print('Wrote graphs to', OUT)
for p in sorted(OUT.glob('*.png')):
    print(p.name)
