import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState([]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.reverse()); // Show newest first
            }
        } catch (err) {
            console.error("Failed to fetch submissions", err);
        }
    };

    // Poll for updates every 5 seconds
    useEffect(() => {
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <p>Live Incoming Reviews</p>

            <div className="submission-list">
                {submissions.length === 0 ? <p>No submissions yet.</p> : null}

                {submissions.map((sub) => (
                    <div key={sub.id} className="submission-card">
                        <div className="card-header">
                            <span className="stars">{'★'.repeat(sub.stars)}</span>
                        </div>
                        <p className="review-text">"{sub.text}"</p>

                        <div className="ai-insights">
                            <div className="summary">
                                <strong>AI Summary:</strong> {sub.ai_summary}
                            </div>
                            <div className="actions">
                                <strong>Recommended Actions:</strong>
                                <ul>
                                    {sub.ai_actions && sub.ai_actions.map((action, i) => (
                                        <li key={i}>{action}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
