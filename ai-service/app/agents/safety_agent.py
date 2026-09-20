from typing import Dict, Any

class SafetyAgent:
    def analyze_telemetry(self, trip_id: str, current_lat: float, current_lng: float, speed_kmh: float, deviation_meters: float) -> Dict[str, Any]:
        """
        Safety Agent: monitors trip telemetry against deterministic safety thresholds.
        """
        alerts = []
        severity = "NORMAL"

        if deviation_meters > 500:
            alerts.append(f"Route deviation detected ({int(deviation_meters)}m off prescribed route).")
            severity = "HIGH"

        if speed_kmh > 110:
            alerts.append(f"High speed anomaly detected ({int(speed_kmh)} km/h).")
            severity = "MEDIUM"

        if deviation_meters > 1000:
            severity = "CRITICAL"

        action = "MONITORING"
        if severity == "HIGH":
            action = "SEND_CUSTOMER_STATUS_CHECK"
        elif severity == "CRITICAL":
            action = "DISPATCH_SAFETY_COMMAND_CENTER"

        return {
            "tripId": trip_id,
            "status": severity,
            "alerts": alerts,
            "action": action,
            "message": f"Safety Agent Telemetry Scan: Status {severity}. Action: {action}."
        }

safety_agent = SafetyAgent()
