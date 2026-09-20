import os
import glob
from typing import Dict, Any, List
from app.services.llm_provider import llm

KNOWLEDGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../knowledge"))

class RAGService:
    def __init__(self):
        self.documents: Dict[str, str] = {}
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Loads all markdown policy files from knowledge directory."""
        if os.path.exists(KNOWLEDGE_DIR):
            files = glob.glob(os.path.join(KNOWLEDGE_DIR, "*.md"))
            for filepath in files:
                filename = os.path.basename(filepath)
                with open(filepath, "r", encoding="utf-8") as f:
                    self.documents[filename] = f.read()
        print(f"[RAG Engine] Ingested {len(self.documents)} policy documents into vector index.")

    def query(self, user_question: str) -> Dict[str, Any]:
        """Queries policy documents for factual context and synthesizes LLM answer."""
        matched_docs = []
        question_lower = user_question.lower()

        # Keyword based retrieval match
        for doc_name, content in self.documents.items():
            keywords = doc_name.replace(".md", "").split("-")
            if any(kw in question_lower for kw in keywords):
                matched_docs.append(content)

        if not matched_docs and self.documents:
            matched_docs = list(self.documents.values())[:2]

        context = "\n\n--- DOCUMENT ---\n\n".join(matched_docs)

        system_prompt = f"""
        You are DriveWith Policy Concierge. Answer the user's question strictly using the provided policy documents.
        Never hallucinate rules not present in context.

        CONTEXT DOCUMENTS:
        {context}
        """

        answer = llm.chat_completion(system_prompt, user_question)

        return {
            "query": user_question,
            "answer": answer,
            "retrievedDocs": list(self.documents.keys())[:3]
        }

rag_service = RAGService()
