# DriveWith Architecture Documentation

## Overview
DriveWith is an enterprise AI-powered personal driver orchestration platform built with a 3-tier microservice architecture:
1. **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Leaflet maps. Single app with role-based routing (`/customer/*`, `/driver/*`, `/admin/*`, `/admin/ai-activity`).
2. **Core Backend**: Node.js, Express.js, TypeScript. Handles authentication, vehicle CRUD, deterministic 7-factor driver matching engine, OTP trip security verification, Razorpay payments, and WebSocket GPS telemetry broadcasting.
3. **AI Microservice**: Python FastAPI. Executes LangGraph autonomous agents (Concierge Agent, Matching Agent, Resolution Agent, Safety Agent, Driver AI Assistant), RAG Policy retrieval engine, and OpenCV pre/post trip vehicle inspection visual difference analysis.
4. **Data Layer**: PostgreSQL + PostGIS (geospatial indexes & queries) and Redis (real-time driver availability & matching queues).
