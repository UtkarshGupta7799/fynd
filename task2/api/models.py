from pydantic import BaseModel
from typing import Optional, List

class ReviewSubmission(BaseModel):
    stars: int
    text: str

class ReviewResponse(BaseModel):
    id: str
    stars: int
    text: str
    ai_response: str
    ai_summary: Optional[str] = None
    ai_actions: Optional[List[str]] = None
