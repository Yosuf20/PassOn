"""
PassOn — AI Provider abstraction layer.

Modular design: each provider implements `analyze_image(image_base64, mime_type) -> list[dict]`.
Supported providers: Amazon Bedrock (multimodal vision), Groq (vision), Mock (offline/tests).
"""
import json
import os
import re
import logging
import copy

logger = logging.getLogger(__name__)

# Try importing boto3 for Amazon Bedrock runtime
try:
    import boto3
except ImportError:
    boto3 = None

# ─── Structured response schema ───────────────────────────────────────
ANALYSIS_SCHEMA = {
    "name": "string — item name",
    "category": "string — one of: electronics, books, home, appliances, fitness, furniture, clothing, paper",
    "condition": "string — one of: like_new, good, fair, broken",
    "description": "string — brief factual description of the item",
    "suggestedPrice": {"min": "number (INR)", "max": "number (INR)"},
    "route": "string — one of: reuse, scrap, ewaste",
}

SYSTEM_PROMPT = """You are a smart assistant for PassOn, a community reuse and recycling marketplace in India.

Analyze the uploaded photo and identify every distinct physical item visible.
For EACH item, return a JSON object with these fields:
- "name": short item name (e.g., "LED Desk Lamp")
- "category": one of [electronics, books, home, appliances, fitness, furniture, clothing, paper]
- "condition": one of [like_new, good, fair, broken] — judge from visual appearance
- "description": one-sentence factual description of the item's visible state
- "suggestedPrice": {"min": <number>, "max": <number>} in Indian Rupees. Use 0 for broken/scrap items.
- "route": one of [reuse, scrap, ewaste] — "reuse" for working items, "ewaste" for broken electronics, "scrap" for recyclable waste

Rules:
- Only list items you can actually identify in the image. Never invent items.
- If you cannot identify any items, return an empty array [].
- If the image is unclear, blurry, or not a photo of physical objects, return an empty array [].
- Return ONLY a valid JSON array. No markdown, no explanation, no code fences. Just the JSON array.
"""


def _parse_ai_response(raw_text):
    """Parse the AI response text into a list of item dicts. Tolerates markdown fences."""
    text = raw_text.strip()
    # Strip markdown code fences if present
    fence_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if fence_match:
        text = fence_match.group(1).strip()
    
    # Try to find a JSON array in the text
    bracket_start = text.find('[')
    bracket_end = text.rfind(']')
    if bracket_start != -1 and bracket_end != -1 and bracket_end > bracket_start:
        text = text[bracket_start:bracket_end + 1]

    try:
        items = json.loads(text)
    except json.JSONDecodeError as e:
        logger.warning("Failed to parse AI response as JSON: %s", e)
        return []

    if not isinstance(items, list):
        return []

    # Validate and sanitize each item
    valid_categories = {"electronics", "books", "home", "appliances", "fitness", "furniture", "clothing", "paper"}
    valid_conditions = {"like_new", "good", "fair", "broken"}
    valid_routes = {"reuse", "scrap", "ewaste"}
    sanitized = []

    for item in items:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name", "")).strip()
        if not name:
            continue

        category = str(item.get("category", "home")).strip().lower()
        if category not in valid_categories:
            category = "home"

        condition = str(item.get("condition", "good")).strip().lower()
        if condition not in valid_conditions:
            condition = "good"

        route = str(item.get("route", "reuse")).strip().lower()
        if route not in valid_routes:
            route = "reuse"

        price = item.get("suggestedPrice", {})
        if not isinstance(price, dict):
            price = {"min": 0, "max": 0}
        price_min = max(0, int(price.get("min", 0) or 0))
        price_max = max(price_min, int(price.get("max", 0) or 0))

        description = str(item.get("description", "")).strip()

        sanitized.append({
            "name": name,
            "category": category,
            "condition": condition,
            "description": description,
            "suggestedPrice": {"min": price_min, "max": price_max},
            "route": route,
        })

    return sanitized


# Try importing Groq at module level for clean mocking and performance
try:
    from groq import Groq
except ImportError:
    Groq = None

# Default vision model on Groq — currently active multimodal vision model
DEFAULT_GROQ_VISION_MODEL = "qwen/qwen3.8-27b"
GROQ_VISION_MODEL = os.environ.get("GROQ_VISION_MODEL", DEFAULT_GROQ_VISION_MODEL)


def analyze_image_groq(image_base64, mime_type="image/jpeg"):
    """
    Send an image to Groq's vision model and return structured item analysis.
    Raises RuntimeError on API/config errors.
    """
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured. Set it in backend/.env")

    if Groq is None:
        raise RuntimeError("groq package is not installed. Run: pip install groq")

    model = os.environ.get("GROQ_VISION_MODEL", DEFAULT_GROQ_VISION_MODEL).strip() or DEFAULT_GROQ_VISION_MODEL

    client = Groq(api_key=api_key)
    data_uri = f"data:{mime_type};base64,{image_base64}"

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": SYSTEM_PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {"url": data_uri},
                        },
                    ],
                }
            ],
            temperature=0.3,
            max_tokens=2048,
        )
    except Exception as e:
        error_msg = str(e)
        logger.error("Groq API error: %s", error_msg)
        if "401" in error_msg or "authentication" in error_msg.lower():
            raise RuntimeError("Invalid GROQ_API_KEY. Check your API key.")
        if "model" in error_msg.lower() and ("not found" in error_msg.lower() or "not supported" in error_msg.lower() or "decommissioned" in error_msg.lower() or "deprecated" in error_msg.lower()):
            raise RuntimeError(f"Groq model '{model}' is not available. Check GROQ_VISION_MODEL setting.")
        raise RuntimeError(f"Groq API error: {error_msg}")

    raw_text = response.choices[0].message.content
    items = _parse_ai_response(raw_text)
    return items


# ─── Mock Provider (for dev/tests) ────────────────────────────────────

MOCK_RESPONSE = [
    {
        "name": "Milton Stainless Steel Water Bottle (750ml)",
        "category": "home",
        "condition": "good",
        "description": "Stainless steel Milton insulated water bottle with flip-top lid. Clean and functional.",
        "suggestedPrice": {"min": 150, "max": 250},
        "route": "reuse",
    },
    {
        "name": "Study Table Lamp",
        "category": "electronics",
        "condition": "good",
        "description": "Adjustable LED desk lamp with flexible arm. Appears functional with minor wear.",
        "suggestedPrice": {"min": 150, "max": 300},
        "route": "reuse",
    },
    {
        "name": "Phone Charger Cable (USB-C)",
        "category": "electronics",
        "condition": "broken",
        "description": "USB-C cable with frayed insulation near connector. Not safe for use.",
        "suggestedPrice": {"min": 0, "max": 0},
        "route": "ewaste",
    },
]



import copy


def analyze_image_mock(image_base64=None, mime_type=None):
    """Return fixed mock data for development and testing."""
    return copy.deepcopy(MOCK_RESPONSE)


# ─── Amazon Bedrock Provider (Claude 3 / Titan Multimodal) ─────────────

DEFAULT_BEDROCK_MODEL = "anthropic.claude-3-sonnet-20240229-v1:0"
BEDROCK_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", DEFAULT_BEDROCK_MODEL)


def analyze_image_bedrock(image_base64, mime_type="image/jpeg"):
    """
    Send an image to Amazon Bedrock multimodal vision model
    and return structured item analysis conforming to ANALYSIS_SCHEMA.
    """
    if boto3 is None:
        raise RuntimeError("boto3 package is not installed. Run: pip install boto3")

    region = os.environ.get("AWS_REGION", os.environ.get("AWS_DEFAULT_REGION", "us-east-1"))
    model_id = os.environ.get("BEDROCK_MODEL_ID", DEFAULT_BEDROCK_MODEL).strip() or DEFAULT_BEDROCK_MODEL

    client = boto3.client("bedrock-runtime", region_name=region)

    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
        "temperature": 0.3,
        "system": SYSTEM_PROMPT,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": mime_type,
                            "data": image_base64,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Identify all distinct physical items in this photo and categorize them.",
                    },
                ],
            }
        ],
    }

    try:
        response = client.invoke_model(
            modelId=model_id,
            body=json.dumps(payload),
            contentType="application/json",
            accept="application/json",
        )
        response_body = json.loads(response["body"].read().decode("utf-8"))
        raw_text = response_body["content"][0]["text"]
        return _parse_ai_response(raw_text)
    except Exception as e:
        error_msg = str(e)
        logger.error("Amazon Bedrock invocation error: %s", error_msg)
        raise RuntimeError(f"Bedrock API error: {error_msg}")


# ─── Provider registry ────────────────────────────────────────────────

_PROVIDERS = {
    "bedrock": analyze_image_bedrock,
    "groq": analyze_image_groq,
    "mock": analyze_image_mock,
}


def get_provider(name=None):
    """
    Return the analysis function for the given provider name.
    Priority if not explicitly specified:
    1. AI_PROVIDER environment variable ('bedrock', 'groq', or 'mock')
    2. BEDROCK_MODEL_ID or AWS_EXECUTION_ENV -> 'bedrock'
    3. GROQ_API_KEY -> 'groq'
    4. Default -> 'mock'
    """
    if name is None:
        env_provider = os.environ.get("AI_PROVIDER", "").strip().lower()
        if env_provider in _PROVIDERS:
            name = env_provider
        elif os.environ.get("BEDROCK_MODEL_ID"):
            name = "bedrock"
        elif os.environ.get("GROQ_API_KEY", "").strip():
            name = "groq"
        else:
            name = "mock"
    
    provider = _PROVIDERS.get(name)
    if provider is None:
        raise ValueError(f"Unknown AI provider: {name}. Available: {list(_PROVIDERS.keys())}")
    return provider


def analyze_image(image_base64, mime_type="image/jpeg", provider_name=None):
    """
    High-level entry point: analyze an image using the configured provider.
    Returns (items_list, provider_used_name).
    """
    provider_fn = get_provider(provider_name)
    if provider_name is None:
        env_provider = os.environ.get("AI_PROVIDER", "").strip().lower()
        if env_provider in _PROVIDERS:
            actual_name = env_provider
        elif os.environ.get("BEDROCK_MODEL_ID"):
            actual_name = "bedrock"
        elif os.environ.get("GROQ_API_KEY", "").strip():
            actual_name = "groq"
        else:
            actual_name = "mock"
    else:
        actual_name = provider_name

    items = provider_fn(image_base64, mime_type)
    return items, actual_name
