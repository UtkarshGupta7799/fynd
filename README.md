# Fynd AI Intern Assessment 2.0

**Author**: Utkarsh Gupta  
**Deployed App**: [https://fynd-five.vercel.app](https://fynd-five.vercel.app)

---

## 📂 Project Structure

This repository contains the solution for the Fynd AI Intern Assessment, divided into two main tasks:

### 1. **Task 1: Rating Prediction (NLP)**
*   **Location**: `task1/rating_prediction.ipynb`
*   **Objective**: Predict star ratings (1-5) from Yelp reviews using 6 distinct Prompting Strategies.
*   **Features**:
    *   **Strategies**: Zero-shot, Few-shot, Chain-of-Thought, Strict JSON, Self-Correction, Self-Consistency.
    *   **Robustness**: Handles API Rate Limits (429) failures with exponential backoff.
    *   **Security**: Uses `getpass` for secure API key input.

### 2. **Task 2: AI Feedback System (Web App)**
*   **Location**: `task2/`
*   **Objective**: A production-grade feedback system with separate User and Admin dashboards.
*   **Tech Stack**: React (Vite) + FastAPI (Python) + Vercel Serverless.
*   **Key Features**:
    *   **User Dashboard**: Submit reviews, instant AI feedback modal.
    *   **Admin Dashboard**: Live feed, Amazon-style analytics (charts), Fake Review Detection (AI), and a fully functional Recycle Bin (Delete/Restore).
    *   **Persistence**: Reviews are saved to a JSON file (`reviews.json`), ensuring data survives refreshes.

---

## 🚀 How to Run

### Task 1 (Notebook)
1.  Navigate to `task1/`.
2.  Open `rating_prediction.ipynb` in Jupyter or VS Code.
3.  Install dependencies: `pip install google-genai pandas tqdm`.
4.  Run the cells (You will be prompted to enter your Google Gemini API Key securely).

### Task 2 (Web Application)
**Prerequisites**: Node.js & Python 3.9+

1.  **Frontend Setup**:
    ```bash
    cd task2
    npm install
    npm run dev
    ```
2.  **Backend Setup**:
    ```bash
    cd task2
    pip install fastapi uvicorn
    # The API runs automatically via Vercel dev or can be started manually:
    # python -m uvicorn api.index:app --reload
    ```
3.  **Access**:
    *   User View: `http://localhost:5173`
    *   Admin View: `http://localhost:5173/admin`

---

## 📝 Documentation
*   **Project Report**: detailed implementation notes, architecture decisions, and experimental results can be found in `project_report.md`.
