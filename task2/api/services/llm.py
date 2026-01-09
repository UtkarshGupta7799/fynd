import random

# Keyword Dictionaries
NEGATIVE_KEYWORDS = [
    "bad", "terrible", "worst", "awful", "horrible", "hate", "disappointed", 
    "poor", "slow", "rude", "useless", "broken", "defective", "mess", "dirty", 
    "unacceptable", "waste", "garbage", "fail", "scam", "avoid", "pathetic", 
    "incompetent", "rude", "arrogant", "ignored", "delay", "damaged", "wrong"
]

POSITIVE_KEYWORDS = [
    "good", "great", "excellent", "amazing", "love", "perfect", "best", 
    "awesome", "fantastic", "wonderful", "superb", "brilliant", "fabulous", 
    "outstanding", "impressed", "happy", "satisfied", "helpful", "clean", 
    "fast", "value", "recommend", "polite", "professional"
]

URGENT_KEYWORDS = [
    "refund", "money", "charged", "fraud", "illegal", "lawyer", "court", 
    "safety", "dangerous", "poison", "hurt", "injured"
]

def generate_user_response(review_text: str, stars: int) -> str:
    """
    Generates an enterprise-grade professional response based on sentiment analysis.
    Simulates Amazon/Large-Corp customer service tone.
    """
    # HANDLE EMPTY TEXT
    if not review_text or not review_text.strip():
        if stars >= 4:
             return f"Thank you for your {stars}-star rating! We are thrilled to see that you had a great experience."
        elif stars == 3:
             return "Thank you for your rating. We appreciate your feedback and hope to impress you more next time."
        else:
             return "We are sorry to see your low rating. If you would like to share more details, please contact us so we can improve."

    text_lower = review_text.lower()
    
    # 1. Critical Mismatch Detection (High Rating + Negative Text)
    if stars >= 4:
        found_negatives = [word for word in NEGATIVE_KEYWORDS if word in text_lower]
        if found_negatives:
            return (f"Thank you for the {stars}-star rating. However, we noticed you mentioned '{found_negatives[0]}' "
                    "in your review. We strive for perfection and would love to understand if there's anything "
                    "we can resolve. Please contact our escalation team at support@example.com.")

    # 2. Urgent / High Risk Scenarios
    if any(word in text_lower for word in URGENT_KEYWORDS):
        return ("vWe treat this matter with the utmost seriousness. An escalation case has been created immediately. "
                "A senior support specialist will review your case. Please expect direct communication within the hour.")

    # 3. Low Rating (1-2 Stars) - Empathetic Apology
    if stars <= 2:
        if "wait" in text_lower or "slow" in text_lower or "delay" in text_lower:
            return ("We sincerely apologize for the delay. This falls below the standard of speed and efficiency "
                    "we promise our customers. We are reviewing our operational workflows to prevent this recurrence.")
        
        if "staff" in text_lower or "service" in text_lower or "rude" in text_lower:
             return ("We are deeply sorry to hear about your interaction with our team. Professionalism is our top priority. "
                     "We will conduct an internal review of this incident. Please accept our apologies.")
        
        if "product" in text_lower or "quality" in text_lower or "broken" in text_lower:
            return ("We regret that the product quality did not meet your expectations. We stand by our quality guarantee. "
                    "Please refer to your purchase history for a hassle-free replacement or refund.")

        return ("We sincerely apologize for the dissatisfaction caused. We value you as a customer and would like "
                "the opportunity to make this right. Please contact customer care so we can assist you directly.")

    # 4. Neutral Rating (3 Stars) - Constructive Acknowledgment
    elif stars == 3:
        return ("Thank you for your feedback. We appreciate your honesty and are constantly working to improve. "
                "Your comments have been noted by our quality assurance team to help us serve you better in the future.")

    # 5. High Rating (4-5 Stars) - Professional Gratitude
    else: 
        if "staff" in text_lower or "service" in text_lower:
            return ("Thank you for recognizing our team's efforts. We are delighted to hear you received excellent service. "
                    "We will pass your kind words to the staff members involved.")
            
        if "fast" in text_lower or "delivery" in text_lower:
            return "Fantastic to hear! We pride ourselves on efficiency and are glad we could meet your expectations."

        return (f"Thank you for choosing us and for the {stars}-star review! We are thrilled to have met your expectations "
                "and look forward to serving you again soon.")

def generate_admin_summary(review_text: str) -> str:
    """
    Extracts a concise executive summary.
    """
    if not review_text or not review_text.strip():
        return "No written feedback provided."

    words = review_text.split()
    if len(words) > 12:
        return f"Key customer topic: '{' '.join(words[:6])}...' (Analysis pending)"
    return f"Customer feedback: {review_text}"

def generate_action_items(review_text: str, stars: int) -> list:
    """
    Generates actionable SOPs (Standard Operating Procedures) for the admin team.
    """
    actions = []
    
    if not review_text or not review_text.strip():
        if stars < 3:
            actions.append("SOP-200: Low Rating Investigation (No Text)")
        else:
             actions.append("Log Rating")
        return actions

    text_lower = review_text.lower()

    # Mismatch Flag
    if stars >= 4 and any(word in text_lower for word in NEGATIVE_KEYWORDS):
        actions.append("⚠️ FLAG: Sentiment Audit Required (High Rating / Negative Text)")
        actions.append("SOP-101: Manual Verification")

    # Urgent Flags
    if any(word in text_lower for word in URGENT_KEYWORDS):
        actions.append("🚨 URGENT: Legal/Safety Risk Identified")
        actions.append("SOP-900: Execute Instant Escalation Protocol")
        return actions # Return immediately for urgency

    # Low Star Actions
    if stars < 3:
        actions.append("Ticket Priority: HIGH")
        actions.append("SOP-202: Retention Outreach")
        if "refund" in text_lower:
            actions.append("Review Billing Transaction")
        if "staff" in text_lower or "rude" in text_lower:
            actions.append("Notify HR / Shift Manager")
    
    # High Star Actions
    if stars == 5 and not any(word in text_lower for word in NEGATIVE_KEYWORDS):
        actions.append("Automated Gratitude Sequence")
        if "staff" in text_lower:
             actions.append("Employee Recognition Program Nomination")
             
    if not actions:
        actions.append("Log for Weekly Sentiment Analysis")
        
    return actions
