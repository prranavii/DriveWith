# DriveWith API Specifications

## Backend Core REST Endpoints (`http://localhost:5000/api`)
- `POST /api/auth/register`: Register user
- `POST /api/auth/login`: Login user
- `GET /api/users/me`: Current user session
- `GET /api/vehicles`: List customer vehicles
- `POST /api/vehicles`: Add vehicle
- `PUT /api/vehicles/:id`: Update vehicle
- `DELETE /api/vehicles/:id`: Delete vehicle
- `GET /api/drivers`: List drivers
- `GET /api/drivers/:id`: Driver profile & Skill Passport
- `PUT /api/drivers/availability`: Toggle online/offline
- `PUT /api/drivers/skills`: Update skill passport
- `GET /api/drivers/nearby`: Nearby drivers for map
- `POST /api/matching/search`: 7-Factor deterministic driver matching search
- `POST /api/bookings`: Create booking
- `GET /api/bookings`: List bookings
- `GET /api/bookings/:id`: Booking details
- `POST /api/bookings/:id/accept`: Driver accept booking
- `POST /api/bookings/:id/cancel`: Cancel booking & trigger Resolution Agent
- `POST /api/bookings/:id/otp`: Verify trip security OTP
- `POST /api/bookings/trips/:id/start`: Start trip
- `POST /api/bookings/trips/:id/complete`: Complete trip
- `POST /api/payments/create`: Create Razorpay order
- `POST /api/payments/verify`: Verify payment
- `GET /api/admin/analytics`: Platform KPIs & analytics
- `GET /api/admin/agent-logs`: Agent log feed

## AI Microservice Endpoints (`http://localhost:8000/ai`)
- `POST /ai/concierge`: Natural language booking intent extraction
- `POST /ai/match`: Driver recommendation explanation
- `POST /ai/resolve`: Autonomous driver cancellation rebooking
- `POST /ai/safety`: Real-time telemetry monitoring
- `POST /ai/driver-assistant`: Driver AI assistant command parser
- `POST /ai/rag/query`: RAG Policy QA retrieval
- `POST /ai/inspection`: OpenCV pre/post trip visual diff analysis
