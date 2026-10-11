"""
PassOn Backend — Local development server.

Run: python server.py
Serves the /api/analyze endpoint for local frontend development.
Reads GROQ_API_KEY from backend/.env if present.
"""
import os
import sys

# Load .env from the backend directory
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

from flask import Flask, request, jsonify

try:
    from flask_cors import CORS
    has_cors_ext = True
except ImportError:
    has_cors_ext = False

from handlers import analyze_photo

app = Flask(__name__)
if has_cors_ext:
    CORS(app)
else:
    @app.after_request
    def add_cors(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return response


@app.route("/api/analyze", methods=["POST", "OPTIONS"])
def api_analyze():
    """Proxy the Lambda-style handler for local development."""
    if request.method == "OPTIONS":
        return "", 204

    event = {"body": request.get_data(as_text=True)}
    result = analyze_photo(event, None)
    
    import json
    body = json.loads(result["body"])
    return jsonify(body), result["statusCode"]


@app.route("/api/health", methods=["GET"])
def health():
    """Health check — also reports whether Groq is configured."""
    has_key = bool(os.environ.get("GROQ_API_KEY", "").strip())
    return jsonify({
        "status": "ok",
        "groq_configured": has_key,
        "provider": "groq" if has_key else "mock",
    })


if __name__ == "__main__":
    port = int(os.environ.get("BACKEND_PORT", 3001))
    has_key = bool(os.environ.get("GROQ_API_KEY", "").strip())
    
    print(f"\n[PassOn Backend] Local Dev Server")
    print(f"   Port:      {port}")
    print(f"   AI Mode:   {'Groq Vision (real AI)' if has_key else 'Mock (no GROQ_API_KEY)'}")
    print(f"   Endpoint:  http://localhost:{port}/api/analyze")
    print(f"   Health:    http://localhost:{port}/api/health\n")

    
    app.run(host="0.0.0.0", port=port, debug=True)
