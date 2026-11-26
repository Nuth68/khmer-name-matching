import json
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from api_server import create_server


class SimilarityApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = create_server("127.0.0.1", 0)
        cls.thread = threading.Thread(target=cls.server.serve_forever)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def request_json(self, path, method="GET", body=None):
        data = None
        headers = {}
        if body is not None:
            data = json.dumps(body, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"
        request = Request(
            self.base_url + path,
            data=data,
            headers=headers,
            method=method,
        )
        try:
            response = urlopen(request)
        except HTTPError as error:
            response = error
        with response:
            return response.status, json.loads(response.read().decode("utf-8"))

    def test_health_endpoint(self):
        status, response = self.request_json("/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(response, {"status": "ok"})

    def test_compare_endpoint_returns_dictionary_result(self):
        status, response = self.request_json(
            "/api/compare",
            method="POST",
            body={"firstName": "សុខ ដារ៉ា", "secondName": "Sokh Dara"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(response["score"], 100)
        self.assertEqual(response["matchedVariant"], "Sokh Dara")
        self.assertEqual(response["dictionaryEntry"]["khmer"], "សុខ ដារ៉ា")

    def test_compare_endpoint_validates_payload(self):
        status, response = self.request_json(
            "/api/compare",
            method="POST",
            body={"firstName": "Sok Dara"},
        )
        self.assertEqual(status, 400)
        self.assertIn("must both be strings", response["error"])


if __name__ == "__main__":
    unittest.main()
