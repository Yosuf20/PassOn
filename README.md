# PassOn 🌱

**PassOn** is a mobile-first web application designed for hyper-local communities such as hostels, PGs, flat-shares, university campuses, and residential housing societies.

The goal is to help residents clearing out their living spaces give unwanted items to another neighbour, sell them cheaply, or route them to verified e-waste/scrap recyclers instead of throwing usable goods into dumpsters and landfills.

---

## 🌟 Core Features & User Flow

1. **Quick Sign In / Sign Up**: Minimal friction auth with session persistence.
2. **Community Circles**: Join with an invite code (e.g. `SUN2026`) or create a new community (Hostel, PG, Flat, Society).
3. **Community Home**: Real-time view of available items, urgent alerts, wishlist matches, and live community impact stats.
4. **"Clearing Out" AI Listing Flow**:
   - Snap or upload a photo of a room, shelf, or pile of items.
   - AI detects items, recommends sensible routing (**Reuse**, **Scrap**, or **E-Waste**), and suggests pricing or marking free.
   - One-tap batch publishing directly to the community marketplace.
5. **Community Marketplace**: Search, filter by category or recycling route, view detailed item profiles, and claim items.
6. **Wishlist & Matching**: Register wishlist keywords (e.g., "study lamp", "kettle") to get notified immediately when neighbours post matches.
7. **Scrap Day Drives**: Aggregate community e-waste, broken appliances, and scrap paper for scheduled recycling drives.
8. **Environmental Impact Dashboard**: Track collective kilograms diverted, CO₂e avoided, tree seedling equivalents, and unlocked milestones.
9. **User Profile & Hub**: View personal listings, claimed items, shareable invite code, and account settings.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS | Mobile-first SPA, custom design system, Lucide icons |
| **State & Mock Services** | React Context + Mock API | LocalStorage session persistence, seeded realistic data |
| **Backend** | Python 3.12 | AWS Lambda handlers (Cognito, DynamoDB, Bedrock AI stubs) |
| **Contracts** | OpenAPI 3.0.3 | Full REST API specification (`contracts/openapi.yaml`) |
| **Infrastructure** | AWS SAM (Serverless Application Model) | DynamoDB tables, API Gateway, Lambda configurations |
| **Seed Data** | JSON | Comprehensive mock datasets (`seed/mock_data.json`) |

---

## 📁 Repository Structure

```
PassOn/
├── frontend/                     # React Vite application
│   ├── src/
│   │   ├── components/           # Reusable UI (BottomNav, ItemCard, Toast, LoadingSpinner)
│   │   ├── context/              # AppContext with auth & community state persistence
│   │   ├── pages/                # All application views:
│   │   │   ├── LoginPage.jsx
│   │   │   ├── JoinCommunityPage.jsx
│   │   │   ├── CommunityHomePage.jsx
│   │   │   ├── ClearingOutPage.jsx
│   │   │   ├── AIResultsPage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── ItemDetailPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── ScrapDayPage.jsx
│   │   │   ├── ImpactPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/             # Mock API service layer & icon mappings
│   │   ├── App.jsx               # Route definitions & protected guards
│   │   ├── main.jsx              # App entry point
│   │   └── index.css             # Tailwind design tokens & animations
│   ├── package.json
│   └── vite.config.js
├── backend/                      # Python Lambda handlers
│   ├── handlers.py               # Serverless endpoint handlers
│   └── test_handlers.py          # Python handler test suite
├── contracts/
│   └── openapi.yaml              # OpenAPI 3.0.3 specification
├── infra/
│   └── template.yaml             # AWS SAM template
├── seed/
│   └── mock_data.json            # Seed data for users, communities, items, impact
├── .env.example
└── README.md
```

---

## 🚀 Running Locally

### 1. Frontend Web App

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your mobile browser or browser mobile emulator.

Demo accounts:
- Default User: `priya@example.com` / `password123`
- Default Community Code: `SUN2026` (Sunshine PG) or `GVA2026` (Green Valley Apartments)

### 2. Backend Dev Server & Groq AI Vision

The backend server runs locally on port 3001 and provides the `/api/analyze` endpoint for image vision analysis:

```bash
# Install backend dependencies (optional virtualenv)
pip install -r backend/requirements.txt

# Configure your Groq API key in backend/.env:
# GROQ_API_KEY=gsk_your_key_here

# Start the local development server:
python backend/server.py
```

- When `GROQ_API_KEY` is provided, the backend performs live multimodal image analysis using Groq's `qwen/qwen3.8-27b` model.
- If `GROQ_API_KEY` is not provided or the backend is offline, the app seamlessly falls back to mock mode so development and UI testing remain fully functional.

### 3. Frontend Production Build

```bash
cd frontend
npm run build
```

### 4. Backend Unit Tests

Unit tests run with mocked HTTP responses and require zero real API keys:

```bash
python backend/test_handlers.py
```

---

## 🔍 System Implementation Status

| Feature / Subsystem | Status | Details |
|---|---|---|
| **AI Vision Analysis** | 🟢 Implemented (Groq) | Modular provider layer (`ai_providers.py`) with Groq `qwen/qwen3.8-27b`, image base64 analysis, auto-fallback to mock mode |
| **Responsive Web App** | 🟢 Implemented | Mobile-first SPA with desktop top navigation bar, responsive product grids (2-4 cols), full user zoom |
| **Batch Listing Flow** | 🟢 Implemented | Photo upload, progressive analysis progress, item editing, route selection (Reuse / Scrap / E-Waste), community publishing |
| **Session Claiming** | 🟢 Implemented | Double-claim prevention in session, contact info reveal upon claim |
| **Impact Dashboard** | 🟢 Implemented | Real-world equivalencies (trees, driving, LED energy) with honest demo disclosures |
| **AWS DynamoDB & Cognito** | 🟡 Stubs / Infrastructure Ready | SAM template (`infra/template.yaml`) and OpenAPI 3.0.3 spec (`contracts/openapi.yaml`) defined; Lambda handlers structured as serverless stubs |
| **Amazon Bedrock AI** | ⚪ Pluggable Architecture | AI provider abstraction supports plugging in Bedrock when AWS credentials are configured |