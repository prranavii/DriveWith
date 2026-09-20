# DriveWith Demo Scenarios Walkthrough

## Scenario 1 — Natural Language Booking via AI Concierge
- User types: *"Book a driver tomorrow at 9 AM for my automatic Honda City from Noida to Gurgaon."*
- AI Concierge extracts: `{pickup: "Noida", destination: "Gurgaon", vehicle: "Honda City", transmission: "AUTOMATIC"}`
- Concierge Agent executes backend driver search, selects top driver, creates booking, and confirms.

## Scenario 2 — Driver Cancellation & Autonomous Resolution Agent
- Driver cancels accepted booking.
- Resolution Agent activates autonomously, searches nearby compatible drivers within 5 km.
- Rebooks replacement driver within 30 seconds and notifies customer.

## Scenario 3 — Remote Booking for Family Member
- Requester books driver for recipient (e.g. elderly parent).
- Recipient details and phone provided for OTP receipt.
- Driver arrives and verifies recipient OTP before trip starts.

## Scenario 4 — Emergency Mode Priority Dispatch
- Emergency booking created for medical appointment or family emergency.
- Priority matching engine filters drivers with verified emergency experience & lowest ETA.

## Scenario 5 — Safety Agent Route Monitoring
- Trip telemetry monitored via WebSockets.
- Route deviation > 500m triggers Safety Agent status check & incident creation.

## Scenario 6 — Computer Vision Vehicle Inspection
- Customer uploads pre-trip vehicle photos.
- Driver uploads post-trip vehicle photos.
- OpenCV visual difference engine compares images and generates Inspection Report.
