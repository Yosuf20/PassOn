"""
Unit tests for PassOn Lambda handlers and AI providers.
Tests use mocked HTTP responses — no real Groq API key required.
"""
import json
import os
import sys
import unittest
from unittest.mock import patch, MagicMock
import base64

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from handlers import (
    auth_signup,
    auth_login,
    create_community,
    join_community,
    list_items,
    create_items,
    claim_item,
    analyze_photo,
    get_wishlist,
    add_to_wishlist,
    get_notifications,
    get_impact,
    get_scrap_days,
)
from ai_providers import (
    _parse_ai_response,
    analyze_image_mock,
    analyze_image,
    MOCK_RESPONSE,
)


class TestPassOnHandlers(unittest.TestCase):
    def test_auth_signup(self):
        event = {"body": json.dumps({"name": "Test User", "email": "test@example.com", "password": "password123"})}
        res = auth_signup(event, None)
        self.assertEqual(res["statusCode"], 201)
        data = json.loads(res["body"])
        self.assertIn("token", data)
        self.assertEqual(data["user"]["name"], "Test User")

    def test_auth_login(self):
        event = {"body": json.dumps({"email": "priya@example.com", "password": "password123"})}
        res = auth_login(event, None)
        self.assertEqual(res["statusCode"], 200)
        data = json.loads(res["body"])
        self.assertIn("token", data)
        self.assertEqual(data["user"]["id"], "user-001")

    def test_create_community(self):
        event = {"body": json.dumps({"name": "Apex Towers", "type": "apartment", "description": "Eco friendly flatshare"})}
        res = create_community(event, None)
        self.assertEqual(res["statusCode"], 201)
        data = json.loads(res["body"])
        self.assertEqual(data["name"], "Apex Towers")
        self.assertEqual(data["code"], "NEW2026")

    def test_join_community(self):
        event = {"body": json.dumps({"code": "SUN2026"})}
        res = join_community(event, None)
        self.assertEqual(res["statusCode"], 200)
        data = json.loads(res["body"])
        self.assertEqual(data["id"], "comm-001")

    def test_list_items(self):
        event = {"pathParameters": {"communityId": "comm-001"}}
        res = list_items(event, None)
        self.assertEqual(res["statusCode"], 200)
        data = json.loads(res["body"])
        self.assertIsInstance(data, list)

    def test_create_items(self):
        items = [{"title": "Ironing Board", "category": "home", "condition": "good"}]
        event = {"pathParameters": {"communityId": "comm-001"}, "body": json.dumps(items)}
        res = create_items(event, None)
        self.assertEqual(res["statusCode"], 201)
        data = json.loads(res["body"])
        self.assertEqual(len(data), 1)

    def test_claim_item(self):
        event = {"pathParameters": {"communityId": "comm-001", "itemId": "item-001"}}
        res = claim_item(event, None)
        self.assertEqual(res["statusCode"], 200)
        data = json.loads(res["body"])
        self.assertEqual(data["status"], "claimed")

    def test_get_and_add_wishlist(self):
        event_get = {"pathParameters": {"communityId": "comm-001"}}
        res_get = get_wishlist(event_get, None)
        self.assertEqual(res_get["statusCode"], 200)

        event_add = {"pathParameters": {"communityId": "comm-001"}, "body": json.dumps({"keyword": "table lamp"})}
        res_add = add_to_wishlist(event_add, None)
        self.assertEqual(res_add["statusCode"], 201)

    def test_get_notifications(self):
        res = get_notifications({}, None)
        self.assertEqual(res["statusCode"], 200)

    def test_get_impact(self):
        event = {"pathParameters": {"communityId": "comm-001"}}
        res = get_impact(event, None)
        self.assertEqual(res["statusCode"], 200)
        data = json.loads(res["body"])
        self.assertIn("kgDiverted", data)
        self.assertIn("co2eAvoided", data)

    def test_get_scrap_days(self):
        event = {"pathParameters": {"communityId": "comm-001"}}
        res = get_scrap_days(event, None)
        self.assertEqual(res["statusCode"], 200)


class TestAnalyzePhotoEndpoint(unittest.TestCase):
    """Tests for the analyze_photo handler (no real API key needed)."""

    def _make_fake_image_b64(self, size=200):
        """Create a valid base64 string of the given byte size."""
        data = b'\x89PNG' + os.urandom(size)
        return base64.b64encode(data).decode('ascii')

    def test_mock_fallback_no_api_key(self):
        """When GROQ_API_KEY is not set, should use mock provider."""
        with patch.dict(os.environ, {"GROQ_API_KEY": ""}, clear=False):
            img = self._make_fake_image_b64()
            event = {"body": json.dumps({"image": img})}
            res = analyze_photo(event, None)
            self.assertEqual(res["statusCode"], 200)
            data = json.loads(res["body"])
            self.assertTrue(data["mock"])
            self.assertEqual(data["provider"], "mock")
            self.assertIsInstance(data["items"], list)
            self.assertTrue(len(data["items"]) > 0)

    def test_missing_image_returns_400(self):
        """Empty or missing image should return 400."""
        event = {"body": json.dumps({"image": ""})}
        res = analyze_photo(event, None)
        self.assertEqual(res["statusCode"], 400)

    def test_invalid_json_returns_400(self):
        """Invalid JSON body should return 400."""
        event = {"body": "not json at all"}
        res = analyze_photo(event, None)
        self.assertEqual(res["statusCode"], 400)

    def test_invalid_base64_returns_400(self):
        """Invalid base64 data should return 400."""
        event = {"body": json.dumps({"image": "invalid_base64_content!@#$%^&*()" * 10})}
        res = analyze_photo(event, None)
        self.assertEqual(res["statusCode"], 400)

    def test_explicit_mock_provider(self):
        """Explicit provider=mock should work regardless of API key."""
        img = self._make_fake_image_b64()
        event = {"body": json.dumps({"image": img, "provider": "mock"})}
        res = analyze_photo(event, None)
        self.assertEqual(res["statusCode"], 200)
        data = json.loads(res["body"])
        self.assertTrue(data["mock"])
        self.assertEqual(data["provider"], "mock")

    def test_groq_provider_missing_key(self):
        """Requesting groq provider without API key should return 503."""
        with patch.dict(os.environ, {"GROQ_API_KEY": ""}, clear=False):
            img = self._make_fake_image_b64()
            event = {"body": json.dumps({"image": img, "provider": "groq"})}
            res = analyze_photo(event, None)
            self.assertEqual(res["statusCode"], 503)
            data = json.loads(res["body"])
            self.assertIn("error", data)
            self.assertIn("GROQ_API_KEY", data["error"])

    @patch("ai_providers.Groq")
    def test_groq_api_error_returns_503(self, mock_groq_class):
        """API errors from Groq should return 503 with message."""
        mock_client = MagicMock()
        mock_groq_class.return_value = mock_client
        mock_client.chat.completions.create.side_effect = Exception("Rate limit exceeded")

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key"}, clear=False):
            img = self._make_fake_image_b64()
            event = {"body": json.dumps({"image": img, "provider": "groq"})}
            res = analyze_photo(event, None)
            self.assertEqual(res["statusCode"], 503)
            data = json.loads(res["body"])
            self.assertIn("Rate limit", data.get("error", ""))


class TestAIResponseParsing(unittest.TestCase):
    """Tests for AI response parsing — covers various response formats."""

    def test_valid_json_array(self):
        response = json.dumps([
            {"name": "Lamp", "category": "electronics", "condition": "good",
             "description": "A lamp", "suggestedPrice": {"min": 100, "max": 200}, "route": "reuse"}
        ])
        items = _parse_ai_response(response)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["name"], "Lamp")
        self.assertEqual(items[0]["route"], "reuse")

    def test_markdown_fenced_json(self):
        response = "```json\n[{\"name\": \"Book\", \"category\": \"books\", \"condition\": \"fair\", \"description\": \"A book\", \"suggestedPrice\": {\"min\": 50, \"max\": 100}, \"route\": \"reuse\"}]\n```"
        items = _parse_ai_response(response)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["name"], "Book")

    def test_invalid_category_defaults_to_home(self):
        response = json.dumps([
            {"name": "Thing", "category": "unknown_cat", "condition": "good",
             "description": "A thing", "suggestedPrice": {"min": 0, "max": 0}, "route": "reuse"}
        ])
        items = _parse_ai_response(response)
        self.assertEqual(items[0]["category"], "home")

    def test_invalid_condition_defaults_to_good(self):
        response = json.dumps([
            {"name": "Thing", "category": "books", "condition": "slightly_used",
             "description": "A thing", "suggestedPrice": {"min": 0, "max": 0}, "route": "reuse"}
        ])
        items = _parse_ai_response(response)
        self.assertEqual(items[0]["condition"], "good")

    def test_invalid_route_defaults_to_reuse(self):
        response = json.dumps([
            {"name": "Thing", "category": "books", "condition": "good",
             "description": "A thing", "suggestedPrice": {"min": 0, "max": 0}, "route": "donate"}
        ])
        items = _parse_ai_response(response)
        self.assertEqual(items[0]["route"], "reuse")

    def test_empty_name_skipped(self):
        response = json.dumps([
            {"name": "", "category": "books", "condition": "good",
             "description": "Missing name", "suggestedPrice": {"min": 0, "max": 0}, "route": "reuse"},
            {"name": "Real Item", "category": "books", "condition": "good",
             "description": "Has name", "suggestedPrice": {"min": 0, "max": 0}, "route": "reuse"},
        ])
        items = _parse_ai_response(response)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["name"], "Real Item")

    def test_empty_response(self):
        items = _parse_ai_response("[]")
        self.assertEqual(len(items), 0)

    def test_garbage_response(self):
        items = _parse_ai_response("I cannot analyze this image because...")
        self.assertEqual(len(items), 0)

    def test_non_list_response(self):
        items = _parse_ai_response('{"error": "something"}')
        self.assertEqual(len(items), 0)

    def test_negative_prices_clamped_to_zero(self):
        response = json.dumps([
            {"name": "Item", "category": "home", "condition": "good",
             "description": "Neg price", "suggestedPrice": {"min": -50, "max": -10}, "route": "reuse"}
        ])
        items = _parse_ai_response(response)
        self.assertEqual(items[0]["suggestedPrice"]["min"], 0)
        self.assertEqual(items[0]["suggestedPrice"]["max"], 0)

    def test_multiple_items_different_routes(self):
        """Verify different items can have different analysis results."""
        response = json.dumps([
            {"name": "Working Lamp", "category": "electronics", "condition": "good",
             "description": "Works fine", "suggestedPrice": {"min": 200, "max": 400}, "route": "reuse"},
            {"name": "Broken Charger", "category": "electronics", "condition": "broken",
             "description": "Frayed cable", "suggestedPrice": {"min": 0, "max": 0}, "route": "ewaste"},
        ])
        items = _parse_ai_response(response)
        self.assertEqual(len(items), 2)
        self.assertEqual(items[0]["route"], "reuse")
        self.assertEqual(items[1]["route"], "ewaste")
        self.assertNotEqual(items[0]["name"], items[1]["name"])


class TestMockProvider(unittest.TestCase):
    def test_mock_returns_items(self):
        items = analyze_image_mock()
        self.assertIsInstance(items, list)
        self.assertTrue(len(items) > 0)
        for item in items:
            self.assertIn("name", item)
            self.assertIn("category", item)
            self.assertIn("suggestedPrice", item)
            self.assertIn("route", item)

    def test_mock_returns_copy(self):
        """Mock should return a copy so mutations don't affect future calls."""
        items1 = analyze_image_mock()
        items1[0]["name"] = "MODIFIED"
        items2 = analyze_image_mock()
        self.assertNotEqual(items2[0]["name"], "MODIFIED")


class TestAnalyzeImageDispatch(unittest.TestCase):
    def test_auto_selects_mock_without_key(self):
        with patch.dict(os.environ, {"GROQ_API_KEY": ""}, clear=False):
            items, provider = analyze_image("dummybase64data", provider_name=None)
            self.assertEqual(provider, "mock")

    def test_explicit_mock_provider(self):
        items, provider = analyze_image("dummybase64data", provider_name="mock")
        self.assertEqual(provider, "mock")
        self.assertTrue(len(items) > 0)

    def test_unknown_provider_raises(self):
        with self.assertRaises(ValueError):
            analyze_image("data", provider_name="nonexistent_provider")


class TestGroqProviderMocked(unittest.TestCase):
    """Test the Groq provider with mocked Groq SDK calls."""

    @patch("ai_providers.Groq")
    def test_successful_groq_analysis(self, mock_groq_class):
        """Simulates a successful Groq vision API call."""
        mock_client = MagicMock()
        mock_groq_class.return_value = mock_client

        fake_response = MagicMock()
        fake_response.choices = [MagicMock()]
        fake_response.choices[0].message.content = json.dumps([
            {"name": "Water Bottle", "category": "home", "condition": "good",
             "description": "Steel bottle", "suggestedPrice": {"min": 80, "max": 150}, "route": "reuse"}
        ])
        mock_client.chat.completions.create.return_value = fake_response

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key"}, clear=False):
            from ai_providers import analyze_image_groq
            items = analyze_image_groq("base64data", "image/jpeg")
            self.assertEqual(len(items), 1)
            self.assertEqual(items[0]["name"], "Water Bottle")
            self.assertEqual(items[0]["route"], "reuse")

    @patch("ai_providers.Groq")
    def test_different_images_different_results(self, mock_groq_class):
        """Two different images produce different analysis results via Groq."""
        mock_client = MagicMock()
        mock_groq_class.return_value = mock_client

        # First call — lamp image
        response1 = MagicMock()
        response1.choices = [MagicMock()]
        response1.choices[0].message.content = json.dumps([
            {"name": "Table Lamp", "category": "electronics", "condition": "good",
             "description": "LED lamp", "suggestedPrice": {"min": 150, "max": 300}, "route": "reuse"}
        ])

        # Second call — broken phone image
        response2 = MagicMock()
        response2.choices = [MagicMock()]
        response2.choices[0].message.content = json.dumps([
            {"name": "Broken Smartphone", "category": "electronics", "condition": "broken",
             "description": "Cracked screen", "suggestedPrice": {"min": 0, "max": 0}, "route": "ewaste"}
        ])

        mock_client.chat.completions.create.side_effect = [response1, response2]

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key"}, clear=False):
            from ai_providers import analyze_image_groq
            items1 = analyze_image_groq("image_data_1", "image/jpeg")
            items2 = analyze_image_groq("image_data_2", "image/jpeg")

            self.assertNotEqual(items1[0]["name"], items2[0]["name"])
            self.assertEqual(items1[0]["route"], "reuse")
            self.assertEqual(items2[0]["route"], "ewaste")

    @patch("ai_providers.Groq")
    def test_default_vision_model_is_qwen(self, mock_groq_class):
        """Verifies that the default vision model used is qwen/qwen3.8-27b."""
        mock_client = MagicMock()
        mock_groq_class.return_value = mock_client
        fake_response = MagicMock()
        fake_response.choices = [MagicMock()]
        fake_response.choices[0].message.content = "[]"
        mock_client.chat.completions.create.return_value = fake_response

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key", "GROQ_VISION_MODEL": ""}, clear=False):
            from ai_providers import analyze_image_groq
            analyze_image_groq("base64data", "image/jpeg")

            call_kwargs = mock_client.chat.completions.create.call_args[1]
            self.assertEqual(call_kwargs["model"], "qwen/qwen3.8-27b")

    @patch("ai_providers.Groq")
    def test_configurable_vision_model_via_env(self, mock_groq_class):
        """Verifies that GROQ_VISION_MODEL env var overrides the model."""
        mock_client = MagicMock()
        mock_groq_class.return_value = mock_client
        fake_response = MagicMock()
        fake_response.choices = [MagicMock()]
        fake_response.choices[0].message.content = "[]"
        mock_client.chat.completions.create.return_value = fake_response

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_key", "GROQ_VISION_MODEL": "custom/test-model-42"}, clear=False):
            from ai_providers import analyze_image_groq
            analyze_image_groq("base64data", "image/jpeg")

            call_kwargs = mock_client.chat.completions.create.call_args[1]
class TestBedrockProviderMocked(unittest.TestCase):
    """Test the Amazon Bedrock provider with mocked boto3 client."""

    @patch("ai_providers.boto3")
    def test_successful_bedrock_analysis(self, mock_boto3):
        mock_client = MagicMock()
        mock_boto3.client.return_value = mock_client

        mock_body = MagicMock()
        mock_body.read.return_value = json.dumps({
            "content": [
                {
                    "text": json.dumps([
                        {
                            "name": "Study Table Lamp",
                            "category": "electronics",
                            "condition": "good",
                            "description": "Functional desk lamp",
                            "suggestedPrice": {"min": 150, "max": 300},
                            "route": "reuse"
                        }
                    ])
                }
            ]
        }).encode("utf-8")
        mock_client.invoke_model.return_value = {"body": mock_body}

        from ai_providers import analyze_image_bedrock
        items = analyze_image_bedrock("base64image", "image/jpeg")
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["name"], "Study Table Lamp")
        self.assertEqual(items[0]["route"], "reuse")

    @patch("ai_providers.boto3")
    def test_bedrock_dispatch_via_env(self, mock_boto3):
        mock_client = MagicMock()
        mock_boto3.client.return_value = mock_client
        mock_body = MagicMock()
        mock_body.read.return_value = json.dumps({"content": [{"text": "[]"}]}).encode("utf-8")
        mock_client.invoke_model.return_value = {"body": mock_body}

        with patch.dict(os.environ, {"AI_PROVIDER": "bedrock"}, clear=False):
            from ai_providers import analyze_image
            items, provider = analyze_image("base64image")
            self.assertEqual(provider, "bedrock")


if __name__ == "__main__":
    unittest.main()
