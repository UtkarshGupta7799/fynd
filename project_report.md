# Fynd AI Intern Assessment 2.0 - Final Report

**Author**: Utkarsh Gupta
**Repository**: [github.com/UtkarshGupta7799/fynd](https://github.com/UtkarshGupta7799/fynd)
**Deployed App**: [https://fynd-five.vercel.app](https://fynd-five.vercel.app)

---

## 1. Overview
This report documents the solution for the Fynd AI Intern Assessment. The project consists of two main components:
1.  **Task 1**: An NLP rating prediction system using varying prompting strategies.
2.  **Task 2**: A dual-dashboard web application (User & Admin) powered by AI for automated feedback and summarization.

---

## 2. Task 1: Rating Prediction via Prompting
### Approach
The objective was to predict star ratings (1-5) from Yelp reviews. I implemented three distinct prompting strategies in the Jupyter Notebook (`task1/rating_prediction.ipynb`):

1.  **Zero-shot Prompting**:
    - *Method*: Directly asking the LLM to classify the review without examples.
    - *Rationale*: Establishes a baseline for model performance.
2.  **Few-shot Prompting**:
    - *Method*: Providing 3 static examples of reviews and their corresponding ratings (Positive, Negative, Neutral) before the target query.
    - *Rationale*: Guides the model on the expected output format and sentiment nuances.
3.  **Chain-of-Thought (CoT)**:
    - *Method*: Instructing the model to "think step-by-step" and analyze the sentiment *before* assigning a score.
    - *Rationale*: Improves reasoning capabilities for complex or ambiguous reviews.

### Evaluation Methodology
- **Metrics**: Accuracy (Exact Match), JSON Validity Rate (Parsing success), and Reliability.
- **Dataset**: A sample dataset was utilized to validate the pipeline.

---

## 3. Task 2: AI Feedback System (Web Application)
### Architecture decisions
I chose a **Modern Serverless Architecture** to ensure scalability, ease of deployment, and cost-efficiency.

- **Frontend**: **React (Vite)**
    - *Why?* Fast, component-based, and provides a polished, responsive UI. Client-side routing handles the User vs. Admin views seamlessly.
- **Backend**: **FastAPI (Python)** on **Vercel Serverless Functions**
    - *Why?* FastAPI provides native support for Python (essential for LLM libraries) and async capabilities. Vercel Serverless allows the backend to scale to zero when not in use.
- **AI Integration**: Server-side processing to keep prompts and logic secure (API keys are not exposed to the client).

### System Behavior
1.  **User Dashboard**:
    - Users submit a rating and review.
    - The backend processes the text and generates an **instant AI response** (e.g., apologizing for bad ratings or thanking for good ones).
2.  **Admin Dashboard**:
    - Admins view a live stream of submissions.
    - Each submission includes an **AI-generated summary** and **Actionable Items** (e.g., "Investigate kitchen delays").

### Limitations & Trade-offs
- **Persistence**: Due to the ephemeral nature of Vercel Serverless functions, the current deployment uses an In-Memory store. In a production environment, this would be replaced with a cloud database like **Supabase (PostgreSQL)** or **MongoDB Atlas**.
- **Latency**: AI generation happens synchronously for the user response. For heavy loads, this should be moved to a background job queue.

---

## 4. Conclusion
The solution successfully meets all requirements:
1.  Quantifiable experiments with Prompt Engineering.
2.  A fully functional, deployed web application with distinct User and Admin personas.
3.  Clean code structure ready for future scalability.
