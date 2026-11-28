# Matching Algorithm / Name Similarity API

FastAPI service for Khmer name similarity comparison. It exposes the same contract used by the web app (`/api/health`, `/api/compare`) and reuses `name_similarity.py`.

## Setup

From `matching-algorithm/`:

```bash
python3 -m venv --without-pip .venv   # or: python3 -m venv .venv
curl -sS https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py && .venv/bin/python /tmp/get-pip.py  # only if venv has no pip
.venv/bin/python -m pip install -r requirements.txt
```

## Run

```bash
cd matching-algorithm
.venv/bin/python -m uvicorn api_server:app --host 127.0.0.1 --port 8000
# or
.venv/bin/python api_server.py --host 127.0.0.1 --port 8000
```

Health check: `http://127.0.0.1:8000/api/health`

## API

### `POST /api/compare`

Request:

```json
{ "firstName": "សុខ ដារ៉ា", "secondName": "Sokh Dara" }
```

Response fields: `score`, `explanation`, `distance`, `maxLength`, `method`, `matchedVariant`, `variantType`, `dictionaryEntry`.

This is a baseline character-level similarity signal for review only. It does not establish identity.

## Tests

```bash
cd matching-algorithm
.venv/bin/python -m unittest discover -s . -p "test_*.py" -v
```

## Notes

- `name_similarity.py` contains the comparison logic and dictionary-assisted Khmer-Latin matching.
- The web app proxies `/api` to `http://127.0.0.1:8000` during development (`web/vite.config.ts`).
