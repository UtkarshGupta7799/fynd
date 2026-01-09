from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI()

# Allow CORS for local dev and production
origins = [
    "http://localhost:5173",
    "https://your-vercel-app-url.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for now to avoid issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/status")
def get_status():
    return {"status": "ok", "message": "Backend is running!"}

from .routes import submissions

app.include_router(submissions.router, prefix="/api")
