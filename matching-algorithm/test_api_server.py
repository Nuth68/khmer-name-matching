import unittest

from fastapi.testclient import TestClient

from api_server import app


class SimilarityApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_compare_endpoint_returns_dictionary_result(self):
        response = self.client.post(
            "/api/compare",
            json={"firstName": "សុខ ដារ៉ា", "secondName": "Sokh Dara"},
        )
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["score"], 100)
        self.assertEqual(body["matchedVariant"], "Sokh Dara")
        self.assertEqual(body["dictionaryEntry"]["khmer"], "សុខ ដារ៉ា")

    def test_v1_compare_endpoint_returns_dictionary_result(self):
        response = self.client.post(
            "/api/v1/names/compare",
            json={"firstName": "សុខ ដារ៉ា", "secondName": "Sokh Dara"},
        )
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["score"], 100)
        self.assertEqual(body["matchedVariant"], "Sokh Dara")
        self.assertEqual(body["dictionaryEntry"]["khmer"], "សុខ ដារ៉ា")

    def test_compare_endpoint_validates_missing_field(self):
        response = self.client.post("/api/compare", json={"firstName": "Sok Dara"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("must both be strings", response.json()["error"])

    def test_v1_compare_endpoint_validates_wrong_type(self):
        response = self.client.post(
            "/api/v1/names/compare",
            json={"firstName": 1, "secondName": "Sok Dara"},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("must both be strings", response.json()["error"])

    def test_v1_compare_endpoint_rejects_extra_field(self):
        response = self.client.post(
            "/api/v1/names/compare",
            json={"firstName": "A", "secondName": "B", "extra": True},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Unexpected field", response.json()["error"])

    def test_v1_compare_endpoint_rejects_too_long_name(self):
        response = self.client.post(
            "/api/v1/names/compare",
            json={"firstName": "a" * 1001, "secondName": "b"},
        )
        self.assertEqual(response.status_code, 413)
        self.assertIn("at most 1000", response.json()["error"])

    def test_v1_compare_endpoint_rejects_invalid_json(self):
        response = self.client.post(
            "/api/v1/names/compare",
            data="not-json",
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("valid UTF-8 JSON", response.json()["error"])

    def test_openapi_documents_compare_endpoints(self):
        response = self.client.get("/openapi.json")
        self.assertEqual(response.status_code, 200)
        paths = response.json()["paths"]
        self.assertIn("/api/compare", paths)
        self.assertIn("/api/v1/names/compare", paths)
        self.assertIn("/api/health", paths)


if __name__ == "__main__":
    unittest.main()
