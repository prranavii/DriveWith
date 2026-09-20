# DriveWith Database & Spatial PostGIS Schema

## Spatial PostgreSQL Tables
- `users`: User profiles with roles (`CUSTOMER`, `DRIVER`, `ADMIN`).
- `drivers`: Driver records, current spatial location (`GEOMETRY(Point, 4326)`), online status, rating.
- `driver_skills`: Skill Passport metrics (years exp, transmission manual/auto, sedan/suv/luxury, night/highway/emergency exp, on-time %, cancellation rate, badge).
- `vehicles`: Registered customer vehicles (make, model, year, license plate, transmission, vehicle_type, color).
- `bookings`: Core booking lifecycle supporting 5 service types (`NORMAL`, `SCHEDULED`, `EMERGENCY`, `REMOTE_BOOKING`, `SAFE_RETURN`), status, pickup & destination spatial coordinates, OTP, estimated/actual fare.
- `trips`: Active trip monitoring entities.
- `trip_locations`: Spatial telemetry tracking history.
- `payments`: Razorpay transaction records.
- `vehicle_inspections`: OpenCV visual difference inspection reports.
- `agent_logs`: System agent activity logs displayed on `/admin/ai-activity`.
