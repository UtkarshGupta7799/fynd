import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.reverse());
                // Auto-select first if none selected
                if (!selectedId && data.length > 0) {
                    setSelectedId(data[0].id);
                }
            }
        } catch (err) {
            console.error("Failed to fetch", err);
        }
    };

    useEffect(() => {
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 5000);
        return () => clearInterval(interval);
    }, []);

    const selectedSub = submissions.find(s => s.id === selectedId);

    return (
        <div className="admin-layout">
            {/* Left Sidebar: Inbox */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>Inbox</h3>
                    <span className="badge-count">{submissions.length}</span>
                </div>
                <div className="submission-list">
                    {submissions.map(sub => (
                        <div
                            key={sub.id}
                            className={`inbox-item ${selectedId === sub.id ? 'active' : ''}`}
                            onClick={() => setSelectedId(sub.id)}
                        >
                            <div className="item-row">
                                <span className="customer-name">Visitor {sub.id.slice(0, 4)}</span>
                                <span className="time-ago">Now</span>
                            </div>
                            <div className="item-snippet">{sub.text.slice(0, 30)}...</div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Center: Chat View */}
            <main className="chat-view">
                {selectedSub ? (
                    <>
                        <header className="chat-view-header">
                            <div>
                                <h2>Visitor {selectedSub.id.slice(0, 4)}</h2>
                                <span className="subprocess-status">Ticket #{selectedSub.id.slice(0, 8)}</span>
                            </div>
                            <div className="header-actions">
                                <button className="resolve-btn">Resolve</button>
                            </div>
                        </header>

                        <div className="chat-stream">
                            {/* User Message */}
                            <div className="message-row user">
                                <div className="bubble">
                                    {selectedSub.text}
                                    <div className="rating-tag">★ {selectedSub.stars}</div>
                                </div>
                            </div>

                            {/* AI Auto-Response */}
                            <div className="message-row ai">
                                <div className="bubble">
                                    {selectedSub.ai_response}
                                    <div className="bot-tag">AI Auto-Reply</div>
                                </div>
                            </div>
                        </div>

                        <div className="chat-input-disabled">
                            <input type="text" placeholder="Reply manually..." disabled />
                            <button disabled>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">Select a conversation</div>
                )}
            </main>

            {/* Right: Details Panel */}
            <aside className="details-panel">
                {selectedSub && (
                    <>
                        <div className="panel-section">
                            <h4>AI Analysis</h4>
                            <p className="summary-text">{selectedSub.ai_summary}</p>
                        </div>

                        <div className="panel-section">
                            <h4>Action Items</h4>
                            <ul className="action-list">
                                {selectedSub.ai_actions && selectedSub.ai_actions.map((act, i) => (
                                    <li key={i}>{act}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="panel-section">
                            <h4>Customer Details</h4>
                            <div className="detail-row">
                                <span>Sentiment</span>
                                <span className={`badge ${selectedSub.stars > 3 ? 'positive' : 'negative'}`}>
                                    {selectedSub.stars > 3 ? 'Positive' : 'Negative'}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}
