import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
    const [messages, setMessages] = useState([
        { id: 'init', sender: 'ai', text: 'Hi! How was your experience with us today?' }
    ]);
    const [input, setInput] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch history on load
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/submissions');
                if (res.ok) {
                    const data = await res.json();
                    // Convert submitted reviews into chat format
                    const history = [];
                    data.forEach(sub => {
                        // User message
                        history.push({
                            id: sub.id + '_user',
                            sender: 'user',
                            text: sub.text,
                            rating: sub.stars
                        });
                        // AI Response
                        history.push({
                            id: sub.id + '_ai',
                            sender: 'ai',
                            text: sub.ai_response
                        });
                    });

                    if (history.length > 0) {
                        setMessages(prev => {
                            // Avoid duplicates if re-fetching
                            // Ideally, we'd replace or merge carefully. 
                            // For this demo, just appending history after init msg is fine.
                            // We filter out the init message if history exists to avoid clutter?
                            // Let's just keep init as a welcome unless history is super long.
                            return [prev[0], ...history];
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load history", err);
            }
        };
        fetchHistory();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input, rating: rating };

        // Optimistic UI Update
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stars: rating, text: userMsg.text })
            });

            if (!res.ok) throw new Error("Server Error");

            const data = await res.json();

            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.ai_response
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            setError("Failed to send review. Please try again.");
            setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: "❌ Failed to submit review. Please check your connection." }]);
        }
        setLoading(false);
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="agent-avatar">AI</div>
                <div className="header-info">
                    <h2>Support Agent</h2>
                    <span className="status">Online</span>
                </div>
            </header>

            <div className="messages-area">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                        <div className="bubble">
                            {msg.text}
                            {msg.rating && <div className="rating-badge">★ {msg.rating}</div>}
                        </div>
                    </div>
                ))}
                {loading && <div className="message-row ai"><div className="bubble typing">...</div></div>}
                {error && <div className="error-toast">{error}</div>}
            </div>

            <form onSubmit={handleSend} className="input-area">
                <div className="star-selector">
                    {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={s <= rating ? 'star active' : 'star'} onClick={() => setRating(s)}>★</span>
                    ))}
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your review..."
                    disabled={loading}
                />
                <button type="submit" className="send-btn" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
}
