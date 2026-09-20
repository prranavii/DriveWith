import os
import requests
import json
from typing import Dict, Any, Optional

class LLMProvider:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "mock").lower()
        self.api_key = os.getenv("LLM_API_KEY", "")
        self.model = os.getenv("LLM_MODEL", "gpt-4o-mini")
        self.base_url = os.getenv("LLM_BASE_URL", "")

    def chat_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Multi-provider LLM completion supporting OpenAI, Groq, Gemini, Ollama, and Mock AI Fallback.
        """
        if self.provider == "openai" and self.api_key:
            return self._call_openai(system_prompt, user_prompt)
        elif self.provider == "groq" and self.api_key:
            return self._call_groq(system_prompt, user_prompt)
        elif self.provider == "gemini" and self.api_key:
            return self._call_gemini(system_prompt, user_prompt)
        elif self.provider == "ollama":
            return self._call_ollama(system_prompt, user_prompt)
        else:
            return self._call_mock(system_prompt, user_prompt)

    def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        try:
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=15)
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[LLMProvider OpenAI Error]: {e}")
        return self._call_mock(system_prompt, user_prompt)

    def _call_groq(self, system_prompt: str, user_prompt: str) -> str:
        try:
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": self.model or "llama3-70b-8192",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            }
            res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=15)
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[LLMProvider Groq Error]: {e}")
        return self._call_mock(system_prompt, user_prompt)

    def _call_gemini(self, system_prompt: str, user_prompt: str) -> str:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser Request: {user_prompt}"}]}
                ]
            }
            res = requests.post(url, json=payload, timeout=15)
            if res.status_code == 200:
                return res.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"[LLMProvider Gemini Error]: {e}")
        return self._call_mock(system_prompt, user_prompt)

    def _call_ollama(self, system_prompt: str, user_prompt: str) -> str:
        try:
            base = self.base_url or "http://localhost:11434"
            payload = {
                "model": self.model or "llama3",
                "prompt": f"System: {system_prompt}\nUser: {user_prompt}",
                "stream": False
            }
            res = requests.post(f"{base}/api/generate", json=payload, timeout=15)
            if res.status_code == 200:
                return res.json()["response"]
        except Exception as e:
            print(f"[LLMProvider Ollama Error]: {e}")
        return self._call_mock(system_prompt, user_prompt)

    def _call_mock(self, system_prompt: str, user_prompt: str) -> str:
        """Smart local mock engine for offline development."""
        prompt_lower = user_prompt.lower()
        if "cancel" in prompt_lower:
            return json.dumps({
                "action": "CANCEL_INFO",
                "response": "According to DriveWith Policy, cancellations made more than 15 minutes before scheduled pickup are 100% free. If a driver cancels, our Autonomous Resolution Agent automatically rebooks a verified replacement within 30 seconds."
            })
        elif "noida" in prompt_lower or "gurgaon" in prompt_lower or "tomorrow" in prompt_lower or "book" in prompt_lower:
            return json.dumps({
                "intent": "BOOKING_REQUEST",
                "pickup": "Sector 62, Noida",
                "destination": "DLF Cyber City, Gurgaon",
                "date": "Tomorrow",
                "time": "09:00 AM",
                "transmission": "AUTOMATIC",
                "vehicle_type": "SEDAN",
                "special_notes": "Comfortable highway driver needed",
                "extracted": True
            })
        else:
            return json.dumps({
                "intent": "GENERAL_QUERY",
                "response": f"DriveWith AI Assistant at your service. I can help you book drivers, answer policy questions, or handle emergency requests."
            })

llm = LLMProvider()
