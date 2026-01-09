import React, { useState } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
    const [stars, setStars] = useState(5);
    const [text, setText] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            // Use relative path for Vercel (rewrites handle /api)
            // Locally, ensure Vite proxy is set or CORS is open
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stars, text })
            });
            const data = await res.json();
            setResponse(data.ai_response);
        } catch (err) {
            console.error(err);
            setResponse("Error submitting review. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-container">
            <h1>Submit Your Review</h1>
            <form onSubmit={handleSubmit} className="review-form">
                <label>
                    Rating:
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= stars ? 'star filled' : 'star'}
                                onClick={() => setStars(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </label>
                <label>
                    Review:
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your experience here..."
                        required
                        rows={5}
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>

            {response && (
                <div className="ai-response">
                    <h3>AI Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
