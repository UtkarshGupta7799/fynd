from fastapi import APIRouter
from ..models import ReviewSubmission, ReviewResponse
from ..services.llm import generate_user_response, generate_admin_summary, generate_action_items
from ..database import reviews_db
import uuid

router = APIRouter()

@router.post("/submit", response_model=ReviewResponse)
def submit_review(submission: ReviewSubmission):
    # 1. Generate AI Response
    ai_reply = generate_user_response(submission.text, submission.stars)
    
    # 2. Generate Admin Insights (Async in real world, sync here for simplicity)
    summary = generate_admin_summary(submission.text)
    actions = generate_action_items(submission.text, submission.stars)

    # 3. Save to DB
    new_review = {
        "id": str(uuid.uuid4()),
        "stars": submission.stars,
        "text": submission.text,
        "ai_response": ai_reply,
        "ai_summary": summary,
        "ai_actions": actions
    }
    reviews_db.append(new_review)

    return new_review

@router.get("/submissions")
def get_submissions():
    return reviews_db
