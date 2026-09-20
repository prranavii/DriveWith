import requests
import json
import os
from typing import Dict, Any
from app.services.llm_provider import llm

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

class ConciergeAgent:
    def parse_and_process(self, user_message: str, user_id: str = "c1010000-0000-0000-0000-000000000001") -> Dict[str, Any]:
        """
        AI Concierge Agent extracting booking parameters and orchestrating backend tools.
        """
        system_prompt = """
        You are DriveWith AI Concierge. Extract booking details from the user's natural language request.
        Required extraction keys: pickup, destination, date, time, transmission (MANUAL/AUTOMATIC), vehicle_type (SEDAN/SUV/LUXURY/HATCHBACK).
        Return strict JSON format.
        """
        llm_response = llm.chat_completion(system_prompt, user_message)

        # Parse JSON or handle structured intent
        try:
            extracted = json.loads(llm_response)
        except Exception:
            extracted = {
                "pickup": "Sector 62, Noida",
                "destination": "DLF Cyber City, Gurgaon",
                "date": "Tomorrow",
                "time": "09:00 AM",
                "transmission": "AUTOMATIC",
                "vehicle_type": "SEDAN",
                "special_notes": user_message
            }

        pickup = extracted.get("pickup", "Sector 62, Noida")
        destination = extracted.get("destination", "DLF Cyber City, Gurgaon")
        transmission = extracted.get("transmission", "AUTOMATIC").upper()
        vehicle_type = extracted.get("vehicle_type", "SEDAN").upper()

        # Step 1: Call Backend Search Drivers Tool
        search_payload = {
            "pickupLat": 28.5355,
            "pickupLng": 77.3910,
            "transmission": transmission,
            "vehicleType": vehicle_type,
            "isHighwayTrip": True
        }

        matched_drivers = []
        try:
            res = requests.post(f"{BACKEND_URL}/api/matching/search", json=search_payload, timeout=5)
            if res.status_code == 200:
                matched_drivers = res.json().get("drivers", [])
        except Exception as err:
            print(f"[Concierge Agent Backend Tool Error]: {err}")

        # Step 2: Auto-select top compatible driver if available
        selected_driver = matched_drivers[0] if matched_drivers else None

        # Step 3: Create Booking via Backend API (Source of Truth)
        booking_created = False
        booking_data = None

        if selected_driver:
            booking_payload = {
                "bookingType": "SCHEDULED" if "tomorrow" in user_message.lower() else "NORMAL",
                "pickupAddress": pickup,
                "destinationAddress": destination,
                "driverId": selected_driver["driverId"],
                "pickupLat": 28.5355,
                "pickupLng": 77.3910,
                "destLat": 28.4595,
                "destLng": 77.0266,
                "specialNotes": f"Extracted via AI Concierge: {user_message}"
            }
            try:
                b_res = requests.post(f"{BACKEND_URL}/api/bookings", json=booking_payload, timeout=5)
                if b_res.status_code == 201:
                    booking_created = True
                    booking_data = b_res.json().get("booking")
            except Exception as err:
                print(f"[Concierge Agent Booking Creation Error]: {err}")

        return {
            "extractedIntent": extracted,
            "matchedDrivers": matched_drivers[:3],
            "selectedDriver": selected_driver,
            "bookingCreated": booking_created,
            "booking": booking_data,
            "summaryMessage": f"Parsed request for {transmission} {vehicle_type} from {pickup} to {destination}. " +
                             (f"Created Booking #{booking_data['id'][-6:]} with {selected_driver['name']} ({selected_driver['compatibilityScore']}% match)." if booking_created else "Searched available drivers.")
        }

concierge_agent = ConciergeAgent()
