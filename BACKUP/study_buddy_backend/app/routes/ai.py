from fastapi import APIRouter, Depends
from pydantic import BaseModel
import google.generativeai as genai
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import AIPrompt

router = APIRouter()

# Directly adding Gemini API key here
genai.configure(api_key="AIzaSyCg_wRtvE1kxUvhw6BZgs6LpnIIn1o8ako")

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


@router.get("/ai/prompts/{child_id}")
async def get_ai_prompts(child_id: int, db: Session = Depends(get_db)):

    prompts = db.query(AIPrompt).filter(AIPrompt.child_id == child_id).all()

    return prompts
