"""FastAPI API that exposes the name similarity service."""

from __future__ import annotations

from dataclasses import asdict

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from name_similarity import compare_names
from schemas import (
    MAX_NAME_LENGTH,
    CompareRequest,
    CompareResponse,
    ErrorResponse,
    HealthResponse,
)

MAX_REQUEST_BYTES = 16_384

app = FastAPI(
    title="Khmer Name Matching API",
    version="0.1.0",
    description=(
        "Baseline Khmer/Latin name similarity API. Scores are character-level "
        "signals for review only and do not establish identity."
    ),
    openapi_tags=[
        {"name": "health", "description": "Service health checks."},
        {"name": "names", "description": "Name comparison operations."},
    ],
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request."},
        413: {"model": ErrorResponse, "description": "Request too large."},
    },
)


def _validation_error_response(exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    for error in errors:
        loc = error.get("loc", ())
        field = loc[-1] if loc else None
        err_type = error.get("type", "")

        if field in {"firstName", "secondName"}:
            if err_type in {"missing", "string_type"}:
                return JSONResponse(
                    status_code=400,
                    content={"error": "firstName and secondName must both be strings"},
                )
            if err_type == "string_too_long":
                return JSONResponse(
                    status_code=413,
                    content={"error": f"Each name must be at most {MAX_NAME_LENGTH} characters"},
                )
            if err_type == "extra_forbidden":
                return JSONResponse(
                    status_code=400,
                    content={"error": f"Unexpected field: {field}"},
                )
            return JSONResponse(
                status_code=400,
                content={"error": "firstName and secondName must both be strings"},
            )

        if err_type == "extra_forbidden" and isinstance(field, str):
            return JSONResponse(
                status_code=400, content={"error": f"Unexpected field: {field}"}
            )
        if err_type == "json_invalid":
            return JSONResponse(
                status_code=400, content={"error": "Request body must be valid UTF-8 JSON"}
            )

    return JSONResponse(status_code=400, content={"error": "Invalid request body"})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return _validation_error_response(exc)


@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_BYTES:
                return JSONResponse(
                    status_code=413, content={"error": "Request body is too large"}
                )
        except ValueError:
            return JSONResponse(
                status_code=400, content={"error": "Invalid Content-Length"}
            )
    return await call_next(request)


@app.get(
    "/api/health",
    response_model=HealthResponse,
    tags=["health"],
    summary="Health check",
    description="Returns service health status.",
)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


async def _compare_names(payload: CompareRequest, request: Request) -> CompareResponse:
    raw_body = await request.body()
    if not raw_body:
        raise HTTPException(status_code=400, detail="Request body is required")
    if len(raw_body) > MAX_REQUEST_BYTES:
        raise HTTPException(status_code=413, detail="Request body is too large")

    if len(payload.firstName) > MAX_NAME_LENGTH or len(payload.secondName) > MAX_NAME_LENGTH:
        raise HTTPException(
            status_code=413,
            detail=f"Each name must be at most {MAX_NAME_LENGTH} characters",
        )

    result = asdict(compare_names(payload.firstName, payload.secondName))
    method = (
        "dictionary-assisted"
        if result["method"] == "dictionary-assisted Levenshtein"
        else result["method"].lower()
    )
    return CompareResponse(
        score=result["score"],
        explanation=result["explanation"],
        distance=result["edit_distance"],
        maxLength=result["compared_length"],
        method=method,
        matchedVariant=result["matched_variant"],
        variantType=result["variant_type"],
        dictionaryEntry=result["dictionary_entry"],
    )


COMPARE_RESPONSES = {
    400: {"model": ErrorResponse, "description": "Invalid request body or fields."},
    413: {"model": ErrorResponse, "description": "Request body or name too large."},
}


@app.post(
    "/api/compare",
    response_model=CompareResponse,
    responses=COMPARE_RESPONSES,
    tags=["names"],
    summary="Compare two names (legacy)",
    description="Legacy compare endpoint. Prefer /api/v1/names/compare for new clients.",
)
async def compare(payload: CompareRequest, request: Request) -> CompareResponse:
    return await _compare_names(payload, request)


@app.post(
    "/api/v1/names/compare",
    response_model=CompareResponse,
    responses=COMPARE_RESPONSES,
    tags=["names"],
    summary="Compare two names",
    description=(
        "Compares two names using normalized Levenshtein distance. Khmer-Latin "
        "comparisons use dictionary-assisted matching only for exact Khmer dictionary entries. "
        "Scores are review signals, not identity evidence."
    ),
)
async def compare_names_v1(payload: CompareRequest, request: Request) -> CompareResponse:
    return await _compare_names(payload, request)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, str) else "Request failed"
    return JSONResponse(status_code=exc.status_code, content={"error": detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content={"error": "Internal server error"})


def main() -> None:
    import argparse

    import uvicorn

    parser = argparse.ArgumentParser(description="Run the local similarity API.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    uvicorn.run("api_server:app", host=args.host, port=args.port, reload=False)


if __name__ == "__main__":
    main()
