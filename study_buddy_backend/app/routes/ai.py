from fastapi import APIRouter, Depends
from pydantic import BaseModel
import google.generativeai as genai
import os
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import AIPrompt
from app.core.config import GEMINI_API_KEY

router = APIRouter()

# Configure Gemini with the secure API key from config.py
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


class ChatRequest(BaseModel):
    message: str
    child_id: int


SYSTEM_PROMPT = """
You are Study Buddy AI — a focused academic assistant.

Your role is to help students understand concepts quickly during study sessions.

Rules:
- Explain in the simplest possible language.
- Use short paragraphs or bullet points.
- Use memory tricks, analogies, or mnemonics.
- Do NOT provide external links.
- Do NOT give irrelevant information.
- Focus on clarity and retention.

Always structure answers like:

Concept:
Simple Explanation:
Memory Trick (if possible):
Example (if useful):
"""


@router.post("/ai/chat")
async def chat_ai(data: ChatRequest, db: Session = Depends(get_db)):
    try:
        final_prompt = f"{SYSTEM_PROMPT}\n\nStudent Question:\n{data.message}"

        response = model.generate_content(final_prompt)
        reply = response.text

        # Save prompt for analytics
        prompt_record = AIPrompt(
            child_id=data.child_id, prompt=data.message, response=reply
        )

        db.add(prompt_record)
        db.commit()

        return {"reply": reply}
    except Exception as e:
        print(f"AI Chat Error: {str(e)}")
        return {
            "reply": "Sorry, I'm having trouble thinking right now. Please try again!",
            "error": str(e),
        }


@router.get("/ai/prompts/{child_id}")
async def get_ai_prompts(child_id: int, db: Session = Depends(get_db)):

    prompts = db.query(AIPrompt).filter(AIPrompt.child_id == child_id).all()

    return prompts
