import React, { useEffect, useState, useMemo } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [filterRating, setFilterRating] = useState('all');
    const [viewMode, setViewMode] = useState('inbox');

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.reverse());
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

    const analytics = useMemo(() => {
        const activeSubs = submissions.filter(s => !s.is_deleted);
        const total = activeSubs.length;
        if (total === 0) return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

        const sum = activeSubs.reduce((acc, curr) => acc + curr.stars, 0);
        const avg = (sum / total).toFixed(1);

        const distribution = [0, 0, 0, 0, 0];
        activeSubs.forEach(s => {
            if (s.stars >= 1 && s.stars <= 5) distribution[5 - s.stars]++;
        });

        return { avg, total, distribution };
    }, [submissions]);

    const displayedSubmissions = submissions.filter(s => {
        if (viewMode === 'inbox') {
            if (s.is_deleted) return false;
        } else {
            if (!s.is_deleted) return false;
        }

        if (filterRating !== 'all') {
            return s.stars === parseInt(filterRating);
        }
        return true;
    });

    useEffect(() => {
        if (!selectedId && displayedSubmissions.length > 0) {
            setSelectedId(displayedSubmissions[0].id);
        } else if (selectedId) {
            const stillVisible = displayedSubmissions.find(s => s.id === selectedId);
            if (!stillVisible && displayedSubmissions.length > 0) {
                setSelectedId(displayedSubmissions[0].id);
            }
        }
    }, [displayedSubmissions, selectedId]);


    const handleAction = async (action, id) => {
        try {
            let url = `/api/submissions/${id}`;
            let method = 'DELETE';

            if (action === 'restore') {
                url = `/api/submissions/${id}/restore`;
                method = 'POST';
            } else if (action === 'permanent') {
                url = `/api/submissions/${id}/permanent`;
                method = 'DELETE';
            }

            await fetch(url, { method });
            fetchSubmissions();
        } catch (err) {
            console.error("Action failed", err);
        }
    };

    const selectedSub = submissions.find(s => s.id === selectedId);

    return (
        <div className="admin-layout">
            <div className="analytics-bar">
                <div className="metric-card">
                    <h4>Average Rating</h4>
                    <div className="big-number">{analytics.avg} <span className="star-icon">★</span></div>
                </div>
                <div className="metric-card">
                    <h4>Active Reviews</h4>
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
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div className="view-toggle">
                            <button
                                className={viewMode === 'inbox' ? 'active' : ''}
                                onClick={() => setViewMode('inbox')}
                            >Inbox</button>
                            <button
                                className={viewMode === 'trash' ? 'active' : ''}
                                onClick={() => setViewMode('trash')}
                            >Trash 🗑️</button>
                        </div>

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
                        {displayedSubmissions.length === 0 && <p className="empty-filter">No items found</p>}
                        {displayedSubmissions.map(sub => (
                            <div
                                key={sub.id}
                                className={`inbox-item ${selectedId === sub.id ? 'active' : ''} ${sub.is_fake ? 'suspicious' : ''}`}
                                onClick={() => setSelectedId(sub.id)}
                            >
                                <div className="item-row">
                                    <span className="customer-name">
                                        {sub.is_fake && "⚠️ "}
                                        Visitor {sub.id.slice(0, 4)}
                                    </span>
                                    <span className="time-ago">{sub.stars} ★</span>
                                </div>
                                <div className="item-snippet">{sub.text.slice(0, 30)}...</div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="chat-view">
                    {selectedSub ? (
                        <>
                            <header className="chat-view-header">
                                <div>
                                    <h2>
                                        Visitor {selectedSub.id.slice(0, 4)}
                                        {selectedSub.is_fake && <span className="fake-badge">SUSPICIOUS</span>}
                                        {selectedSub.is_deleted && <span className="deleted-badge">DELETED</span>}
                                    </h2>
                                    <span className="subprocess-status">Ticket #{selectedSub.id.slice(0, 8)}</span>
                                </div>
                                <div className="header-actions">
                                    {selectedSub.is_deleted ? (
                                        <>
                                            <button className="restore-btn" onClick={() => handleAction('restore', selectedSub.id)}>Restore ♻️</button>
                                            <button className="purge-btn" onClick={() => handleAction('permanent', selectedSub.id)}>Delete Forever ❌</button>
                                        </>
                                    ) : (
                                        <button className="delete-btn" onClick={() => handleAction('delete', selectedSub.id)}>Move to Trash 🗑️</button>
                                    )}
                                </div>
                            </header>

                            <div className="chat-stream">
                                <div className="message-row user">
                                    <div className="bubble">
                                        {selectedSub.text}
                                        <div className="rating-tag">★ {selectedSub.stars}</div>
                                    </div>
                                </div>

                                <div className="message-row ai">
                                    <div className="bubble">
                                        {selectedSub.ai_response}
                                        <div className="bot-tag">AI Auto-Reply</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">Select a review</div>
                    )}
                </main>

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
