# T34 Baseline Graphs

Generated from `T34_baseline_summary.json` and `T34_baseline_results.csv` by `matching-algorithm/plot_t34_baseline.py`.

| File | What it shows |
|---|---|
| `01_overall_metrics_by_threshold.png` | Precision/Recall/F1/Accuracy/Unavailable rate across thresholds 70/80/85/90. |
| `02_outcome_counts_by_threshold.png` | TP/FP/TN/FN/Unavailable counts by threshold. |
| `03_dataset_mode_metrics_t80.png` | Precision/Recall/F1 and unavailable rate by dataset+mode at T=80. |
| `04_fictional_case_type_t80.png` | Fictional pairs outcome counts by case type at T=80. |
| `05_score_distribution.png` | Score histogram; red line marks T=80; includes unavailable count. |
| `06_splits_script_pair_t80.png` | Splits test outcomes by script pair at T=80. |

Regenerate:
```bash
python3 matching-algorithm/plot_t34_baseline.py
```
