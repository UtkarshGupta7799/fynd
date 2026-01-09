import React, { useEffect, useState, useMemo } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [filterRating, setFilterRating] = useState('all'); // 'all', 1, 2, 3, 4, 5

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

    // Analytics Calculations
    const analytics = useMemo(() => {
        const total = submissions.length;
        if (total === 0) return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

        const sum = submissions.reduce((acc, curr) => acc + curr.stars, 0);
        const avg = (sum / total).toFixed(1);

        const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
        submissions.forEach(s => {
            if (s.stars >= 1 && s.stars <= 5) distribution[5 - s.stars]++;
        });

        return { avg, total, distribution };
    }, [submissions]);

    // Filtered List
    const filteredSubmissions = submissions.filter(s => {
        if (filterRating === 'all') return true;
        return s.stars === parseInt(filterRating);
    });

    const selectedSub = submissions.find(s => s.id === selectedId);

    return (
        <div className="admin-layout">
            <div className="analytics-bar">
                <div className="metric-card">
                    <h4>Average Rating</h4>
                    <div className="big-number">{analytics.avg} <span className="star-icon">★</span></div>
                </div>
                <div className="metric-card">
                    <h4>Total Reviews</h4>
                    <div className="big-number">{analytics.total}</div>
                </div>
                <div className="distribution-chart">
                    {analytics.distribution.map((count, i) => {
                        const starLabel = 5 - i;
                        const percentage = analytics.total ? (count / analytics.total) * 100 : 0;
                        return (
                            <div key={starLabel} className="chart-row">
                                <span className="label">{starLabel} star</span>
                                <div className="bar-bg">
                                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="main-content-area">
                {/* Left Sidebar: Inbox */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h3>Inbox</h3>
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Stars</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div className="submission-list">
                        {filteredSubmissions.length === 0 && <p className="empty-filter">No matches found</p>}
                        {filteredSubmissions.map(sub => (
                            <div
                                key={sub.id}
                                className={`inbox-item ${selectedId === sub.id ? 'active' : ''}`}
                                onClick={() => setSelectedId(sub.id)}
                            >
                                <div className="item-row">
                                    <span className="customer-name">Visitor {sub.id.slice(0, 4)}</span>
                                    <span className="time-ago">{sub.stars} ★</span>
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
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
}
