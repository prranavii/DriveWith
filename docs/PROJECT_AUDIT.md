# DriveWith — Project Audit & Architecture Overview

## 1. Repository Status & Audit Findings
- **Repository URL**: `https://github.com/prranavii/DriveWith.git`
- **Audit Date**: 2026-09-17
- **Branch**: `main`
- **Initial Commit**: `135ef0aa00ac8c7c78b734435e852c9e0442a73c`
- **Current State**: Greenfield repository. Fresh initialization with clean commit history.
- **Existing Files / Legacy Code**: None present.
- **Technical Debt**: 0 lines of debt. Ideal setup for strict TypeScript, clean modular separation, and microservices architecture.

---

## 2. Target Architecture Overview

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
└───────────────────┘     └───────────────────┘     └─────────┬─────────┘
                                                              │
                                                              ▼
                                                    ┌───────────────────┐
                                                    │ LangGraph Agents  │
                                                    │ ChromaDB / RAG    │
                                                    │ OpenCV Vision     │
                                                    └───────────────────┘
```

---

## 3. Technology Stack Specification

### Frontend (`/frontend`)
- **Framework & Build**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Lucide React icons, Recharts for analytics
- **Routing & State**: React Router v6, Zustand (global state), TanStack Query
- **Maps & Tracking**: Leaflet / Mapbox / OpenStreetMap integration
- **Single App, Role-Based Routes**:
  - `/customer/*`: Vehicle management, AI Concierge, driver search, booking flow, OTP verification, live tracking, payment, ratings.
  - `/driver/*`: Availability toggle, incoming requests, navigation, OTP verification, vehicle inspection photo upload, earnings, Skill Passport, Driver AI Assistant.
  - `/admin/*`: System stats, user management, pending verification, live trips, incidents, analytics charts, `/admin/ai-activity` live log feed.

### Core Backend (`/backend`)
- **Runtime & Language**: Node.js, Express.js, TypeScript (strict mode)
- **Database Access**: PostgreSQL + PostGIS (`pg` / `knex` or TypeORM / Prisma with raw spatial queries)
- **Caching & Real-Time**: Redis client, WebSockets (`ws` or `socket.io`)
- **Modular Directory Structure**:
  - `config/`, `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `middleware/`, `validators/`, `websocket/`

### AI Service (`/ai-service`)
- **Runtime & Framework**: Python 3.11, FastAPI, Uvicorn
- **Agentic Workflow**: LangGraph, LangChain, Tool Calling
- **LLM Abstraction**: Multi-provider support (OpenAI, Groq, Gemini, Ollama) with fallback Mock AI engine when no key is configured
- **Vector DB & RAG**: ChromaDB / pgvector storing policy documents (`knowledge/`)
- **Computer Vision**: OpenCV / PyTorch for before/after vehicle condition inspection

---

## 4. Target Database Schema (PostgreSQL + PostGIS)
- `users`: ID, name, email, phone, role (`CUSTOMER`, `DRIVER`, `ADMIN`), password_hash, timestamps.
- `drivers`: user_id, license_number, verification_status (`PENDING`, `VERIFIED`, `REJECTED`), is_online, current_location (GEOMETRY(Point, 4326)), rating, total_trips.
- `driver_skills`: driver_id, transmission_manual, transmission_auto, sedan_exp, suv_exp, luxury_exp, night_exp_years, highway_exp_years, emergency_exp_years, on_time_rate, cancellation_rate.
- `driver_documents`: driver_id, doc_type, doc_url, status.
- `vehicles`: id, customer_id, make, model, year, license_plate, transmission (`MANUAL`, `AUTOMATIC`), vehicle_type (`SEDAN`, `SUV`, `HATCHBACK`, `LUXURY`), color.
- `bookings`: id, customer_id, driver_id, vehicle_id, booking_type (`NORMAL`, `SCHEDULED`, `EMERGENCY`, `REMOTE_BOOKING`, `SAFE_RETURN`), status, pickup_location, destination_location, pickup_address, destination_address, estimated_fare, actual_fare, scheduled_at, otp.
- `trips`: id, booking_id, driver_id, start_time, end_time, status, distance_km, duration_mins.
- `trip_locations`: trip_id, location (GEOMETRY), timestamp.
- `payments`: id, booking_id, amount, status, payment_method, razorpay_order_id, razorpay_payment_id.
- `ratings`: booking_id, customer_id, driver_id, score, review.
- `emergency_requests`: id, customer_id, category, status, coordinates.
- `vehicle_inspections`: id, trip_id, before_images (JSON), after_images (JSON), visual_diff_notes, damage_detected (boolean).
- `agent_logs`: id, agent_name, step_name, tool_name, details (JSON), timestamp.
- `incidents`: id, trip_id, severity, description, status.

---

## 5. Phased Migration & Implementation Roadmap

| Phase | Description | Deliverables |
|-------|-------------|--------------|
| **Phase 0** | Repository Audit & Project Plan | `docs/PROJECT_AUDIT.md`, `implementation_plan.md` |
| **Phase 1** | Foundation & Project Scaffolding | Docker Compose (PostGIS, Redis), backend TS setup, frontend Vite TS setup, AI service FastAPI setup |
| **Phase 2** | Core Backend & Authentication | User auth JWT, Driver skills/passport backend, Vehicle CRUD, Database migrations & seeding |
| **Phase 3** | Deterministic Driver Matching & Booking Engines | 7-factor scoring engine, booking lifecycle APIs (NORMAL, EMERGENCY, REMOTE, SAFE_RETURN, SCHEDULED) |
| **Phase 4** | Premium Frontend Dashboards | Role-based router, Customer dashboard, Driver dashboard & Skill Passport, Admin dashboard |
| **Phase 5** | Real-Time WebSocket & GPS Simulation | WebSocket server, GPS simulation tick engine, Live tracking UI with Leaflet maps, OTP verification |
| **Phase 6** | Python AI Service & LLM Abstraction | FastAPI app, multi-provider LLM connector, Mock AI provider, Tool calling bridge |
| **Phase 7** | Multi-Agent Orchestration Engine | LangGraph setup: Concierge Agent, Matching Agent (with factual explanations), Resolution Agent (auto-rebooking), Safety Agent, Driver AI Assistant, `/admin/ai-activity` feed |
| **Phase 8** | RAG Policy Assistant | Vector DB setup (ChromaDB), Ingestion of 8 policy MD docs, RAG search & QA endpoints |
| **Phase 9** | Computer Vision Vehicle Inspection | OpenCV difference detection pipeline, Before/After image upload, Inspection Report generator |
| **Phase 10** | Testing, Analytics & Final Verification | Automated API & unit tests, Seed demo scenarios, Final integration verification, Walkthrough documentation |
