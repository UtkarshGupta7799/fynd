import os
# import openai

# openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_user_response(review_text: str, stars: int) -> str:
    # prompt = f"Write a polite response to this {stars}-star review: {review_text}"
    # response = openai.ChatCompletion.create(...)
    # return response.choices[0].message.content
    return f"Thank you for your {stars}-star review! We appreciate your feedback on: {review_text[:20]}..."

def generate_admin_summary(review_text: str) -> str:
    return f"Summary: User discussed {review_text[:50]}..."

def generate_action_items(review_text: str, stars: int) -> list:
    if stars < 3:
        return ["Investigate issue", "Contact customer"]
    return ["Thank customer"]
