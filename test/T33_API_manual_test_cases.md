# T33 - API Manual Test Cases

## Scope
Manual API test cases for current NestJS backend. Current implemented endpoints are limited (`GET /`, Swagger docs). Cases include positive, negative, and contract checks.

## Environment
- Backend running: `npm run start:dev` in `backend/`.
- Base URL: `http://localhost:3000` (or configured `PORT`).
- Tools: browser, curl, Postman/Insomnia.

## Test Cases

| ID | Title | Priority | Preconditions | Test Data | Steps | Expected Result | Postconditions |
|---|---|---|---|---|---|---|---|
| API-TC-001 | Get root greeting | High | Backend running. | N/A | 1. Send `GET /`. | HTTP 200; body is `Hello World!`; content-type text/plain or equivalent. | None. |
| API-TC-002 | Root method not allowed/handled | Medium | Backend running. | N/A | 1. Send `POST /` with empty JSON body. | HTTP 404 or 405 (per Nest default behavior) returned consistently; no server crash/500. | None. |
| API-TC-003 | Swagger UI loads | High | Swagger configured. | N/A | 1. Send `GET /api`. | HTTP 200; HTML contains Swagger UI and title `Khmer Name Matching API Docs`. | None. |
| API-TC-004 | OpenAPI JSON contract | High | Backend running. | N/A | 1. Send `GET /api-json`. | HTTP 200; JSON has `info.title=Khmer Name Matching API`; `paths['/'].get` exists; response schema/string documented. | None. |
| API-TC-005 | OpenAPI YAML contract | Medium | Backend running. | N/A | 1. Send `GET /api-yaml`. | HTTP 200; YAML/text response contains API title and `/` path definition. | None. |
| API-TC-006 | Swagger UI static assets | Medium | Swagger UI loaded. | N/A | 1. Open `/api` in browser. 2. Check network assets. | CSS/JS assets load with 200; no missing asset causing broken UI. | None. |
| API-TC-007 | Invalid route returns not found | High | Backend running. | `/not-exist` | 1. Send `GET /not-exist`. | HTTP 404 with Nest default error body; no stack trace leak in production config. | None. |
| API-TC-008 | Health/basic availability under repeated calls | Medium | Backend running. | 20 sequential requests. | 1. Send 20 `GET /` requests. | All return 200 with same body; no intermittent 5xx. | None. |
| API-TC-009 | CORS behavior for web origin | Medium | If web app calls API cross-origin. | Origin `http://localhost:5173`. | 1. Send `GET /` with browser origin or `curl -H "Origin: ..." -I`. | CORS headers present/absent per configured policy; behavior matches intended deployment. Document actual result. | None. |
| API-TC-010 | Response headers sanity | Low | Backend running. | N/A | 1. Inspect headers for `GET /` and `/api-json`. | No sensitive internal headers leaked; content-type correct; cache behavior acceptable. | None. |
| API-TC-011 | API startup with default PORT | Medium | No `PORT` env set. | N/A | 1. Start backend. 2. Call `GET http://localhost:3000/`. | Server listens on default 3000; endpoint responds 200. | Stop server. |
| API-TC-012 | API startup with custom PORT | Medium | `PORT=3100`. | N/A | 1. Start backend with `PORT=3100`. 2. Call `GET http://localhost:3100/`. | Server listens on configured port; `/` and `/api-json` respond 200. | Stop server. |
| API-TC-013 | Swagger reflects controller metadata | Medium | Backend running. | N/A | 1. Open `/api-json`. 2. Inspect `/` operation. | Operation has summary/description/tags consistent with `AppController` decorators. | None. |
| API-TC-014 | Error handling for malformed Accept header | Low | Backend running. | `Accept: application/vnd.invalid` | 1. Send `GET /` with malformed/rare Accept header. | Endpoint returns stable response (200 or documented behavior); no 500. | None. |
| API-TC-015 | E2E parity smoke check | High | Test env ready. | N/A | 1. Run `npm run test:e2e`. | Existing e2e tests pass: root greeting, Swagger UI, OpenAPI JSON. | None. |

## Future API Test Cases (when matching endpoints are implemented)

| ID | Title | Priority | Preconditions | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| API-TC-F01 | Name compare endpoint success | High | `/compare` or matching endpoint exists. | `name_a`, `name_b` Khmer/Latin. | POST valid pair. | 200 with score, decision, explanation fields; schema matches OpenAPI. |
| API-TC-F02 | Name compare validation | High | Endpoint exists. | Missing/empty names. | POST invalid payload. | 400 with field-level validation errors. |
| API-TC-F03 | Batch dataset evaluation | High | Batch endpoint exists. | Task53 CSV/JSONL sample. | Upload/submit dataset. | 200/202; returns per-pair labels/scores and aggregate metrics. |
| API-TC-F04 | Auth/rate limit | High | Security enabled. | Missing/invalid token, burst requests. | Call protected endpoint. | 401/403 for auth failures; 429 for rate limit; no data leak. |
