# DriveWith Deployment & Local Running Guide

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker & Docker Compose (Optional for containerized PostGIS & Redis)

## Quick Start (Local Standalone Execution)

### 1. Core Backend (`/backend`)
```bash
cd backend
npm install
npm run dev
# Backend API running on http://localhost:5000
```

### 2. AI Microservice (`/ai-service`)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
# AI Microservice running on http://localhost:8000
```

### 3. Premium Frontend (`/frontend`)
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:3000
```

## Docker Compose Deployment
```bash
docker-compose up --build
```
This boots:
- PostgreSQL 15 + PostGIS Spatial Database on port 5432
- Redis Server on port 6379
- DriveWith Express Backend on port 5000
- FastAPI AI Microservice on port 8000
