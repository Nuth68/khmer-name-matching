# T33 - Manual Test Cases (UI, API, Algorithm)

This folder contains manual test cases prepared separately for **UI**, **API**, and **Algorithm** for the Khmer Name Matching project.

## Files

| File | Scope | Description |
|---|---|---|
| `T33_UI_manual_test_cases.md` | UI | Manual test cases for web UI flows, validation, navigation, and states. |
| `T33_API_manual_test_cases.md` | API | Manual test cases for current backend endpoints and Swagger/OpenAPI behavior. |
| `T33_Algorithm_manual_test_cases.md` | Algorithm | Manual test cases for name-matching/normalization algorithm behavior using Task52/53 dataset concepts. |

## Scope Notes

- **UI** cases are based on routes/components present in `web/src/App.tsx` and `web/src/pages/*`.
- **API** cases are based on current NestJS backend implementation (`GET /`, Swagger UI `/api`, OpenAPI `/api-json`, `/api-yaml`) as of repo state.
- **Algorithm** cases are dataset-oriented/manual verification cases; they can be used for future matching service implementation and for validating evaluation logic against Task52/53 labels.
- Test data should be fictional/synthetic or properly authorized. Use `../data/samples/fictional_pairs.csv` where applicable.

## Execution Fields

Each test case includes: `ID`, `Title`, `Priority`, `Preconditions`, `Test Data`, `Steps`, `Expected Result`, `Postconditions/Cleanup`.
