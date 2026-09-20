# DriveWith — AI-Powered Personal Driver Orchestration Platform

> **Your Car. Our Driver. AI-Powered Mobility.**

DriveWith is an enterprise agentic AI mobility platform designed for customers who own or have access to a vehicle but require a verified professional driver. Whether for medical appointments, fatigue, late-night events (Safe Return), remote family booking, or long-distance travel, DriveWith matches, schedules, tracks, and manages trips using deterministic scoring, multi-agent LLM workflows (LangGraph), RAG policy retrieval, computer vision vehicle inspection, and real-time GPS tracking.

---

## 🌟 Key Features & AI Differentiators

### 1. Deterministic 7-Factor Driver Matching Engine
First-class mathematical scoring engine prioritizing factual telemetry:
- **Distance & ETA** (25%)
- **Vehicle Compatibility** (20% - Transmission manual/auto & Sedan/SUV/Luxury certs)
- **Reliability** (15% - On-time rate & low cancellation rate)
- **Experience** (15% - Years of driving experience)
- **Rating** (10% - Customer score out of 5.0)
- **Trip Suitability** (10% - Night driving, highway, emergency experience)
- **Availability** (5% - Online status)

### 2. Multi-Agent Orchestration Architecture (LangGraph)
- **Concierge Agent**: Parses natural language requests (e.g., *"Book a driver tomorrow at 9 AM for my automatic Honda City from Noida to Gurgaon"*), extracts structured intent, queries matching tools, and creates bookings.
- **Matching Agent**: Evaluates candidates and provides factual "Why this driver?" recommendations.
- **Autonomous Resolution Agent**: Instantly detects driver cancellations, queries nearby compatible drivers within a 5 km radius, rebooks replacement drivers within 30 seconds, and notifies customers with zero price change.
- **Safety Agent**: Continuously monitors trip telemetry via WebSockets; triggers status checks and incident alerts if route deviation exceeds 500m.
- **Driver AI Copilot Assistant**: Voice and text command assistant handling traffic delays, route changes, and break schedules.

### 3. RAG Policy Knowledge Retrieval
Ground-truth retrieval over 8 verified platform policy documents (`cancellation-policy.md`, `driver-policy.md`, `safety-policy.md`, `payment-policy.md`, `refund-policy.md`, `vehicle-policy.md`, `emergency-guidelines.md`, `customer-guidelines.md`) preventing LLM hallucinations.

### 4. Computer Vision Vehicle Inspection
OpenCV pre- and post-trip photograph comparison pipeline identifying visual differences on bumpers, body panels, and lights.

---

## 🏗️ Target Architecture

```
                      ┌───────────────────────────┐
                      │    React Application      │
                      │  (Customer/Driver/Admin)  │
                      └─────────────┬─────────────┘
                                    │ REST / WebSocket
                                    ▼
                      ┌───────────────────────────┐
                      │    Node.js + Express      │
                      │  TypeScript Core Backend │
                      └─────────────┬─────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ PostgreSQL + PostGIS│    │      Redis        │     │  Python FastAPI   │
│  Primary Database │     │ Availability/Locks│     │    AI Service     │
└───────────────────y     └───────────────────┘     └─────────┬─────────┘
                                                              │
                                                              ▼
                                                    ┌───────────────────┐
                                                    │ LangGraph Agents  │
                                                    │ ChromaDB / RAG    │
                                                    │ OpenCV Vision     │
                                                    └───────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Leaflet Maps, Recharts, Zustand, Lucide React.
- **Core Backend**: Node.js, Express.js, TypeScript, PostgreSQL + PostGIS, Redis, WebSockets (`ws`).
- **AI Microservice**: Python 3.11, FastAPI, LangGraph, OpenCV, Pydantic.
- **Multi-Provider LLM Abstraction**: OpenAI, Groq, Gemini, local Ollama, and built-in Mock AI Fallback Engine.

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Start Core Backend (`/backend`)
```bash
cd backend
npm install
npm run dev
# Server running on http://localhost:5000 (Database automatically seeded with 20 drivers & Skill Passports)
```

### 2. Start AI Microservice (`/ai-service`)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
# Microservice running on http://localhost:8000
```

### 3. Start Premium Frontend (`/frontend`)
```bash
cd frontend
npm install
npm run dev
# Application running on http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role | Email | Password | Role View Path |
|------|-------|----------|----------------|
| **Customer** | `aarav@example.com` | `password123` | `/customer` |
| **Driver** | `driver1@drivewith.ai` | `password123` | `/driver` |
| **Admin** | `admin@drivewith.ai` | `password123` | `/admin` & `/admin/ai-activity` |

---

## 🧪 Verification & Testing

- **Backend Unit Tests**:
  ```bash
  cd backend
  npm test
  ```
- **Live Agent Audit Feed**: Visit `/admin/ai-activity` to inspect real-time agent tool invocations, state transitions, and decision factors.
