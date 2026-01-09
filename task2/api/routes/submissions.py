from fastapi import APIRouter, HTTPException
from ..models import ReviewSubmission, ReviewResponse
from ..services.llm import generate_user_response, generate_admin_summary, generate_action_items, detect_fake_review
from ..database import reviews_db, save_db
import uuid

router = APIRouter()

@router.post("/submit", response_model=ReviewResponse)
def submit_review(submission: ReviewSubmission):
    # 1. Generate AI Response
    ai_reply = generate_user_response(submission.text, submission.stars)
    
    # 2. Generate Admin Insights
    summary = generate_admin_summary(submission.text)
    actions = generate_action_items(submission.text, submission.stars)
    is_fake = detect_fake_review(submission.text)

    # 3. Save to DB
    new_review = {
        "id": str(uuid.uuid4()),
        "stars": submission.stars,
        "text": submission.text,
        "ai_response": ai_reply,
        "ai_summary": summary,
        "ai_actions": actions,
        "is_fake": is_fake,
        "is_deleted": False # Default active
    }
    
    # Prepend to DB (newest first logic, though frontend does reverse)
    # Actually DB is usually append. Let's append.
    reviews_db.append(new_review)
    save_db(reviews_db)

    return new_review

@router.get("/submissions")
def get_submissions():
    # Return everything so Admin can see trash. 
    # Frontend can filter if needed, or we can add a query param?
    # For simplicity, return all, frontend filters.
    return reviews_db

@router.delete("/submissions/{review_id}")
def delete_review(review_id: str):
    found = False
    for review in reviews_db:
        if review["id"] == review_id:
            review["is_deleted"] = True
            found = True
            break
    
    if not found:
        raise HTTPException(status_code=404, detail="Review not found")
        
    save_db(reviews_db)
    return {"message": "Moved to trash"}

@router.post("/submissions/{review_id}/restore")
def restore_review(review_id: str):
    found = False
    for review in reviews_db:
        if review["id"] == review_id:
            review["is_deleted"] = False
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Review not found")
        
    save_db(reviews_db)
    return {"message": "Restored"}

@router.delete("/submissions/{review_id}/permanent")
def permanent_delete(review_id: str):
    global reviews_db
    original_len = len(reviews_db)
    reviews_db = [r for r in reviews_db if r["id"] != review_id]
    
    if len(reviews_db) == original_len:
         raise HTTPException(status_code=404, detail="Review not found")
         
    save_db(reviews_db)
    return {"message": "Permanently deleted"}
