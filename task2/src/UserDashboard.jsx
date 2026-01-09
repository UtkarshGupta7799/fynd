import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [modalResponse, setModalResponse] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/submissions');
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.filter(r => !r.is_deleted).reverse());
                }
            } catch (err) {
                console.error("Failed to load reviews", err);
            }
        };
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stars: rating, text })
            });

            if (!res.ok) throw new Error("Submission failed");

            const newReview = await res.json();

            setReviews(prev => [newReview, ...prev]);
            setText('');
            setRating(5);
            setSuccessMsg("Review submitted successfully!");

            setModalResponse(newReview.ai_response);

        } catch (err) {
            console.error(err);
            setError("Failed to post review. Is the backend running?");
        }
        setLoading(false);
    };

    return (
        <div className="review-page-container">
            <header className="page-header">
                <h1>Customer Reviews</h1>
                <p>See what others are saying or leave your own feedback.</p>
            </header>

            {/* AI Response Modal */}
            {modalResponse && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="modal-icon">✨</span>
                        <h3>Thanks for your feedback!</h3>
                        <p className="modal-description">We've received your review. Here's what our support team says:</p>

                        <div className="modal-ai-reply">
                            <strong>Support Agent:</strong>
                            {modalResponse}
                        </div>

                        <button className="modal-close-btn" onClick={() => setModalResponse(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="review-content">
                <section className="write-review-section">
                    <h2>Write a Review</h2>
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="rating-input">
                            <span className="label">Your Rating:</span>
                            <div className="star-row">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <span
                                        key={s}
                                        className={s <= rating ? 'star filled' : 'star'}
                                        onClick={() => setRating(s)}
                                    >★</span>
                                ))}
                            </div>
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Share your experience..."
                            rows={4}
                            disabled={loading}
                        />

                        {error && <div className="error-msg">{error}</div>}
                        {successMsg && <div className="success-msg">{successMsg}</div>}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Review'}
                        </button>
                    </form>
                </section>

                <section className="reviews-list-section">
                    <h3>Recent Reviews ({reviews.length})</h3>
                    <div className="reviews-grid">
                        {reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev.id} className="review-card">
                                    <div className="review-header">
                                        <div className="review-stars">
                                            {'★'.repeat(rev.stars)}
                                            <span className="star-bg">{'★'.repeat(5 - rev.stars)}</span>
                                        </div>
                                        <span className="review-date">Verified Customer</span>
                                    </div>

                                    <p className="review-body">{rev.text}</p>

                                    {rev.ai_response && (
                                        <div className="owner-response">
                                            <strong>Response from Support:</strong>
                                            <p>{rev.ai_response}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
