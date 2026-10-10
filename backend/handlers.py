"""
PassOn Backend — Lambda Handlers (Stubs) + AI Analysis Endpoint

These are placeholder handlers that will be deployed as AWS Lambda functions.
For MVP, the frontend uses its own mock service layer.
The analyze_photo endpoint has a real Groq AI integration.
"""
import json
import os
import base64

from ai_providers import analyze_image, MOCK_RESPONSE


# Common response helper
def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        "body": json.dumps(body),
    }


def auth_signup(event, context):
    """POST /auth/signup — Register a new user via Cognito."""
    # TODO: Integrate with Amazon Cognito
    body = json.loads(event.get("body", "{}"))
    return response(201, {
        "token": "mock-jwt-token",
        "user": {
            "id": "user-new",
            "name": body.get("name", ""),
            "email": body.get("email", ""),
            "avatar": body.get("name", "U")[0:2].upper(),
        },
    })


def auth_login(event, context):
    """POST /auth/login — Authenticate via Cognito."""
    # TODO: Integrate with Amazon Cognito
    body = json.loads(event.get("body", "{}"))
    return response(200, {
        "token": "mock-jwt-token",
        "user": {
            "id": "user-001",
            "name": "Priya Sharma",
            "email": body.get("email", ""),
            "avatar": "PS",
        },
    })


def create_community(event, context):
    """POST /communities — Create a new community."""
    # TODO: DynamoDB put_item
    body = json.loads(event.get("body", "{}"))
    return response(201, {
        "id": "comm-new",
        "name": body.get("name", ""),
        "code": "NEW2026",
        "type": body.get("type", "pg"),
        "memberCount": 1,
        "description": body.get("description", ""),
    })


def join_community(event, context):
    """POST /communities/join — Join by invite code."""
    # TODO: DynamoDB query by code
    return response(200, {
        "id": "comm-001",
        "name": "Sunshine PG – Koramangala",
        "code": "SUN2026",
        "type": "pg",
        "memberCount": 25,
    })


def list_items(event, context):
    """GET /communities/{communityId}/items — List items."""
    # TODO: DynamoDB query
    return response(200, [])


def create_items(event, context):
    """POST /communities/{communityId}/items — Batch create items."""
    # TODO: DynamoDB batch_write_item
    body = json.loads(event.get("body", "[]"))
    return response(201, body)


def claim_item(event, context):
    """POST /communities/{communityId}/items/{itemId}/claim — Claim an item."""
    # TODO: DynamoDB update_item, SES notification
    return response(200, {"status": "claimed"})


def analyze_photo(event, context):
    """POST /analyze — AI photo analysis.

    Accepts JSON body with:
      - image: base64-encoded image data (required)
      - mimeType: MIME type (default: image/jpeg)
      - provider: "groq" | "mock" (optional, auto-detected)

    Returns JSON array of detected items + metadata.
    Uses Groq vision AI when GROQ_API_KEY is set, else falls back to mock.
    """
    try:
        body = json.loads(event.get("body", "{}"))
    except (json.JSONDecodeError, TypeError):
        return response(400, {"error": "Invalid JSON body"})

    image_b64 = body.get("image", "")
    mime_type = body.get("mimeType", "image/jpeg")
    requested_provider = body.get("provider", None)

    if not image_b64 or len(image_b64) < 100:
        return response(400, {"error": "No valid image data provided. Send a base64-encoded image."})

    # Validate base64
    try:
        decoded = base64.b64decode(image_b64, validate=True)
        if len(decoded) > 20 * 1024 * 1024:  # 20MB limit
            return response(400, {"error": "Image too large. Maximum size is 20MB."})
    except Exception:
        return response(400, {"error": "Invalid base64 image data."})

    try:
        items, provider_used = analyze_image(image_b64, mime_type, requested_provider)
        return response(200, {
            "items": items,
            "provider": provider_used,
            "mock": provider_used == "mock",
        })
    except RuntimeError as e:
        return response(503, {
            "error": str(e),
            "provider": requested_provider or "auto",
        })
    except Exception as e:
        return response(500, {
            "error": f"Unexpected analysis error: {str(e)}",
        })


def get_wishlist(event, context):
    """GET /communities/{communityId}/wishlist"""
    # TODO: DynamoDB query
    return response(200, [])


def add_to_wishlist(event, context):
    """POST /communities/{communityId}/wishlist"""
    # TODO: DynamoDB put_item
    body = json.loads(event.get("body", "{}"))
    return response(201, body)


def get_notifications(event, context):
    """GET /notifications"""
    # TODO: DynamoDB query
    return response(200, [])


def get_impact(event, context):
    """GET /communities/{communityId}/impact"""
    # TODO: DynamoDB aggregation
    return response(200, {
        "itemsReused": 42,
        "itemsScrapped": 18,
        "kgDiverted": 156,
        "co2eAvoided": 234,
    })


def get_scrap_days(event, context):
    """GET /communities/{communityId}/scrap-days"""
    # TODO: DynamoDB query
    return response(200, [])
