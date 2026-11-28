# T33 - Algorithm Manual Test Cases

## Scope
Manual test cases for Khmer name-matching algorithm/evaluation behavior. These cover normalization, romanization/transliteration variance, phonetic similarity, identity conflict handling, and label-based evaluation using Task52/53.

## References
- Dataset schema: `../data/schema/pairwise_schema.json`
- Sample dataset: `../data/samples/fictional_pairs.csv`
- Labels: `1=match`, `0=non_match`, `-1=uncertain` (exclude/adjudicate for binary metrics)

## Test Cases

| ID | Title | Priority | Preconditions | Test Data | Steps | Expected Result | Postconditions |
|---|---|---|---|---|---|---|---|
| ALG-TC-001 | Exact match pair | High | Matching function/evaluator available. | `T53-P001` Sok Dara / Sok Dara, same DOB/doc. | 1. Load pair. 2. Compute similarity/decision. | Decision `match`; high score (near 100). | Log result. |
| ALG-TC-002 | Romanization variant match | High | Algorithm supports Latin variants. | `T53-P002` Chan Sophea / Chan Sophear. | 1. Compare pair. | Decision `match`; explanation indicates romanization/transliteration variant. | None. |
| ALG-TC-003 | Phonetic variant match | High | Phonetic matching enabled. | `T53-P003` Ly Sreypich / Ly Sreypech. | 1. Compare pair. | Decision `match`; phonetic similarity high. | None. |
| ALG-TC-004 | Name order variant | Medium | Order-insensitive option or logic defined. | `T53-P012` Neary Sokha / Sokha Neary. | 1. Compare pair. | Decision `match` or flagged as order variant with high confidence per spec. | None. |
| ALG-TC-005 | Khmer script spelling variant | High | Khmer normalization enabled. | `T53-P005`/`T53-P045` Khmer spelling variants. | 1. Compare Khmer names. 2. Check normalization. | Spelling/diacritic variants normalized consistently; same-person pairs not penalized excessively. | None. |
| ALG-TC-006 | Clear non-match different person | High | Algorithm uses identity attributes. | `T53-P021` Sok Dara / Sok Davin different DOB. | 1. Compare pair. | Decision `non_match`; conflicting DOB/identity lowers score. | None. |
| ALG-TC-007 | Similar name different gender/doc | High | Attribute weighting configured. | `T53-P022` same name-like pair, different gender/doc. | 1. Compare pair. | Decision `non_match`; explanation shows conflicting attributes. | None. |
| ALG-TC-008 | Same name different doc confirmed different | High | Strong ID conflict rule. | `T53-P052`. | 1. Compare pair. | Decision `non_match` despite identical names. | None. |
| ALG-TC-009 | Uncertain case exclusion | High | Evaluation pipeline exists. | `T53-P041` label `-1`. | 1. Run binary metric evaluation. | Pair excluded from P/R/F1/confusion matrix or routed to adjudication; not counted as match/non-match. | None. |
| ALG-TC-010 | Missing field robustness | Medium | Null/empty handling implemented. | `T53-P042`, `T53-P049` missing DOB/doc/phone. | 1. Compare pairs with missing attributes. | No crash; algorithm returns score with reduced confidence or uncertainty; handles empty fields safely. | None. |
| ALG-TC-011 | Diacritic/Unicode normalization | Medium | Unicode NFC/NFKC policy defined. | Khmer names with diacritics/order variants. | 1. Input visually similar Unicode forms. 2. Normalize. | Equivalent names normalize to expected canonical form; comparison stable. | None. |
| ALG-TC-012 | Case/punctuation/spacing normalization | Medium | Text normalization enabled. | Latin variants: `Sok  Dara`, `sok dara`, `Sok-Dara`. | 1. Compare normalized variants. | Normalized forms equivalent; similarity not reduced by formatting noise. | None. |
| ALG-TC-013 | Transliteration collision handling | Medium | Collision/ambiguity handling defined. | Different Khmer names mapping to similar Latin. | 1. Compare collision candidates. | Algorithm does not auto-match on Latin only when Khmer/attributes conflict; confidence/explanation reflects ambiguity. | None. |
| ALG-TC-014 | Threshold decision boundary | High | Configurable threshold. | Pairs near threshold (design set). | 1. Evaluate at 80/85/90. | Decisions change only at boundary per score; threshold behavior deterministic and documented. | Restore default threshold. |
| ALG-TC-015 | Precision/Recall/F1 calculation | High | Labeled evaluation dataset available. | Task53 verified non-uncertain subset. | 1. Run evaluation. 2. Compute TP/FP/TN/FN. 3. Calculate metrics. | Metrics match manual calculation; uncertain rows excluded. | Save report. |
| ALG-TC-016 | Confusion matrix correctness | High | Evaluation report available. | Same as ALG-TC-015. | 1. Generate confusion matrix. | TP+FP+TN+FN equals evaluated row count; counts align with labels/decisions. | None. |
| ALG-TC-017 | Determinism/idempotency | High | Same environment/model/version. | Any 10 Task53 pairs. | 1. Run comparison twice. | Same scores/decisions/explanations for identical input and config. | None. |
| ALG-TC-018 | Performance sanity on 50+ pairs | Medium | Local runtime available. | Full `task53_fictional_name_pairs.csv` (52 rows). | 1. Batch evaluate all rows. 2. Measure time. | Completes without error; runtime within acceptable local baseline; no memory crash. | Record timing. |
| ALG-TC-019 | Explainability output | Medium | Explanation feature implemented. | Match and non-match samples. | 1. Compare selected pairs. 2. Inspect explanation. | Explanation references meaningful signals (name variant, DOB, doc ID, phonetic) and matches decision. | None. |
| ALG-TC-020 | Dataset schema compliance | High | Task52 schema present. | Task53 CSV/JSONL. | 1. Validate required columns/types/enums. 2. Check duplicate `pair_id`. | Dataset passes schema checks; invalid labels/statuses rejected. | None. |
