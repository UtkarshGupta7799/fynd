import random

def generate_user_response(review_text: str, stars: int) -> str:
    """
    Simulates a smart AI response by detecting sentiment keywords.
    Prioritizes text content over star rating if a negative keyword is found.
    """
    text_lower = review_text.lower()
    
    # Negative keywords that contradict a high rating
    negative_keywords = ["bad", "terrible", "worst", "awful", "horrible", "hate", "disappointed", "poor", "slow", "rude"]
    
    # 1. Critical Mismatch Detection (High Rating + Negative Text)
    if stars >= 4:
        found_negatives = [word for word in negative_keywords if word in text_lower]
        if found_negatives:
            return f"We noticed you rated us {stars} stars but mentioned '{found_negatives[0]}'. We want to ensure everything is perfect. Did something go wrong with our service? Please let us know so we can help."

    # 2. General Sentiment Logic
    if stars <= 2:
        if "wait" in text_lower or "slow" in text_lower:
            return "We apologize for the delay you experienced. We're working on improving our service speed."
        if "rude" in text_lower or "staff" in text_lower:
            return "We're very sorry to hear about the service. We take this seriously and will look into it."
        if "food" in text_lower or "taste" in text_lower:
            return "We're sorry the food didn't meet your expectations. We'd love a chance to make it right."
        return "We're sorry for the inconvenience caused. Please reach out to us at support@fynd.com so we can fix this."

    elif stars == 3:
        return "Thank you for your feedback. We aim for 5 stars, so we'll use your suggestions to improve!"

    else: # 4 or 5 stars (Clean)
        if "food" in text_lower or "delicious" in text_lower:
            return "So glad you enjoyed the meal! We hope to see you again soon for more delicious food."
        if "staff" in text_lower or "service" in text_lower:
            return "Thanks for the kind words about our team! We'll pass your compliments along."
        return f"Thanks for the positive feedback! We're thrilled you had a great {stars}-star experience."

def generate_admin_summary(review_text: str) -> str:
    """
    Extracts a quick summary.
    """
    words = review_text.split()
    if len(words) > 10:
        return f"Customer mentioned: {' '.join(words[:5])}..."
    return f"Customer feedback: {review_text}"

def generate_action_items(review_text: str, stars: int) -> list:
    """
    Suggests actions based on keywords.
    """
    actions = []
    text_lower = review_text.lower()
    negative_keywords = ["bad", "terrible", "worst", "awful", "horrible", "hate", "disappointed", "poor", "slow", "rude"]

    # Mismatch Flag
    if stars >= 4 and any(word in text_lower for word in negative_keywords):
        actions.append("⚠️ INVESTIGATE: Rating/Text Mismatch")
        actions.append("Contact customer to clarify")

    if stars < 3:
        actions.append("Reach out to customer immediately")
        if "refund" in text_lower:
            actions.append("Check refund eligibility")
        if "rude" in text_lower:
            actions.append("Review staff shift logs")
    
    if stars == 5 and not any(word in text_lower for word in negative_keywords):
        actions.append("Send 'Thank You' email")
        if "staff" in text_lower:
             actions.append("Reward staff member")
             
    if not actions:
        actions.append("Monitor sentiment")
        
    return actions
