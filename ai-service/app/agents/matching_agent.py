import requests
import os
from typing import Dict, Any, List

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

class MatchingAgent:
    def evaluate_and_explain(self, requirements: Dict[str, Any]) -> Dict[str, Any]:
        """
        Receives trip parameters, queries deterministic matching engine, and generates factual explanation.
        """
        try:
            res = requests.post(f"{BACKEND_URL}/api/matching/search", json=requirements, timeout=5)
            if res.status_code == 200:
                data = res.json()
                drivers = data.get("drivers", [])
                if not drivers:
                    return {"status": "NO_DRIVERS", "explanation": "No online drivers available matching criteria."}

                top_driver = drivers[0]
                explanation = f"Recommended Driver: {top_driver['name']} ({top_driver['compatibilityScore']}% compatibility match). " + \
                              f"Key factors: {', '.join(top_driver['reasons'])}."

                return {
                    "topDriver": top_driver,
                    "candidates": drivers[:4],
                    "explanation": explanation,
                    "reasons": top_driver["reasons"]
                }
        except Exception as e:
            print(f"[Matching Agent Error]: {e}")

        return {
            "topDriver": None,
            "explanation": "Matching engine query failed. Using backend default match."
        }

matching_agent = MatchingAgent()
