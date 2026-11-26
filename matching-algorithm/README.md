# Khmer Name Matching

## Khmer romanisation reference

The web app's Romanisation page includes a first-pass Khmer Unicode normalization guide and three common romanisation examples. The examples are reference spellings, not output from a complete Khmer-to-Latin transliteration engine; personal and official spellings may differ.

The comparison key applies Unicode NFC, trims leading and trailing whitespace, and collapses repeated whitespace. It keeps the entered name for display, preserves Khmer vowels and marks and coeng sequences, and does not apply compatibility normalization (NFKC). Visually similar or historical spelling variants remain distinct unless reviewed as explicit aliases.

The reference UI is implemented in `web/src/pages/tools/RomanisationPage.tsx` and styled in `web/src/index.css`.

## Khmer-to-Latin variant dictionary

Open **Language Engine → Romanisation Dictionary** in the app. The page is backed by `web/src/data/khmerRomanisationDictionary.ts`. Its three entries are seeded from existing project mock names; prior demo suggestions are labeled as mock references or candidates (spelling, spacing, or name order). Each entry records its seed provenance and each variant explains its review caveat.

These are unverified search candidates, not an official romanisation standard or confirmed aliases. Do not use a candidate by itself to merge identities; confirm it against a trusted record or the person's preferred spelling. A general Khmer romanisation system is available in the [UNGEGN Khmer romanization report](https://unstats.un.org/unsd/ungegn/working_groups/wg5/documents/wgrr4khmer.pdf); it provides background, not validation of these name-specific variants.

## Baseline name similarity

The Name Comparison page sends requests to `demo/api_server.py`, which calls the Python implementation in `demo/name_similarity.py`. The browser's `web/src/utils/nameSimilarity.ts` is an API client and validates the response. The Python baseline NFC-normalizes, trims and collapses whitespace, case-folds, then compares Unicode code points. Similarity is `round((maxLength - editDistance) / maxLength × 100)`. This is a simple character-level baseline, not a phonetic score; Khmer marks count as code points and are not stripped.

For Khmer-to-Latin comparisons, the input Khmer name must exactly match a dictionary entry after normalization. The score is the best edit-distance result against that entry's Latin variants. If no entry exists, the page reports that no baseline is available rather than scoring across unrelated scripts. Dictionary variants are unverified candidates, so every score is for review only and must not trigger an automatic identity merge.

## Standalone Python demo

The dependency-free Python CLI is in `demo/name_similarity.py`. From the project root, run:

```powershell
python demo/name_similarity.py "សុខ ដារ៉ា" "Sokh Dara"
```

It prints JSON containing the score, edit distance, method, selected dictionary variant (for cross-script comparisons), and a plain-language explanation. Same-script examples use Levenshtein distance; Khmer-to-Latin comparisons need an exact Khmer entry. Unknown cross-script pairs return a null score. The HTTP wrapper is in `demo/api_server.py`. Run the Python and API tests with:

```powershell
python -m unittest discover -s demo -p "test_*.py"
```

## Similarity limitations and false-match examples

This is a demonstration baseline, not a production identity-matching decision:

- Levenshtein measures character edits, not pronunciation, meaning, or identity. Every code point has the same edit cost; Khmer marks and spacing can affect the score.
- A high score can be a false match. For example, `Sok Dara` vs `Sok Darra` scores **89%** (one insertion), and `Chan Sophea` vs `Chann Sophea` scores **92%**. Those spellings could belong to different people; the score cannot distinguish them.
- `សុខ ដារ៉ា` vs `Sokh Dara` scores **100%** in the demo because `Sokh Dara` is explicitly listed as a spelling candidate. This is not proof the Latin name belongs to the Khmer-name holder; the candidate has not been verified against an official record.
- False negatives are also possible: valid transliterations absent from the small dictionary return no cross-script score, and real spelling variants may receive low character similarity.
- Name order is not generally reinterpreted, and this score is not calibrated to a dataset or a match threshold. Do not automatically accept, reject, or merge identities from it.

Use the score only to prioritize human review alongside independent evidence such as date of birth or verified documents. Treat dictionary variants as suggestions until validated.

## Run the web app with the Python API

The Name Comparison page calls the Python similarity API. Start both processes in separate PowerShell terminals.

Terminal 1, from the project root:

```powershell
cd C:\Users\Laihe\Downloads\khmer-name-match\khmer-name-matching
python demo\api_server.py
```

The API listens at `http://127.0.0.1:8000`; its health check is `http://127.0.0.1:8000/api/health`.

Terminal 2:

In PowerShell:

```powershell
cd C:\Users\Laihe\Downloads\khmer-name-match\khmer-name-matching\web
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`), then choose **Intelligent Tools → Name Comparison**. Vite forwards `/api` requests to the Python service. If the Python API is stopped, the page displays an error and asks you to start it. In PowerShell, use `npm.cmd` to avoid script execution policy issues with `npm.ps1`.
