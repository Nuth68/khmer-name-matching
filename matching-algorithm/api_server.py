"""Local HTTP API that exposes the standalone name similarity demo."""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlsplit

from name_similarity import compare_names

MAX_REQUEST_BYTES = 16_384
MAX_NAME_LENGTH = 1_000


class SimilarityRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if urlsplit(self.path).path == "/api/health":
            self._send_json(200, {"status": "ok"})
            return
        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if urlsplit(self.path).path != "/api/compare":
            self._send_json(404, {"error": "Not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self._send_json(400, {"error": "Invalid Content-Length"})
            return

        if content_length <= 0:
            self._send_json(400, {"error": "Request body is required"})
            return
        if content_length > MAX_REQUEST_BYTES:
            self._send_json(413, {"error": "Request body is too large"})
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(400, {"error": "Request body must be valid UTF-8 JSON"})
            return

        if not isinstance(payload, dict):
            self._send_json(400, {"error": "Request body must be a JSON object"})
            return

        first_name = payload.get("firstName")
        second_name = payload.get("secondName")
        if not isinstance(first_name, str) or not isinstance(second_name, str):
            self._send_json(
                400,
                {"error": "firstName and secondName must both be strings"},
            )
            return
        if len(first_name) > MAX_NAME_LENGTH or len(second_name) > MAX_NAME_LENGTH:
            self._send_json(
                413,
                {"error": f"Each name must be at most {MAX_NAME_LENGTH} characters"},
            )
            return

        result = asdict(compare_names(first_name, second_name))
        dictionary_entry = result["dictionary_entry"]
        self._send_json(
            200,
            {
                "score": result["score"],
                "explanation": result["explanation"],
                "distance": result["edit_distance"],
                "maxLength": result["compared_length"],
                "method": (
                    "dictionary-assisted"
                    if result["method"] == "dictionary-assisted Levenshtein"
                    else result["method"].lower()
                ),
                "matchedVariant": result["matched_variant"],
                "variantType": result["variant_type"],
                "dictionaryEntry": dictionary_entry,
            },
        )


def create_server(host: str, port: int) -> ThreadingHTTPServer:
    return ThreadingHTTPServer((host, port), SimilarityRequestHandler)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the local similarity API.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    server = create_server(args.host, args.port)
    print(f"Similarity API listening at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping similarity API.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
