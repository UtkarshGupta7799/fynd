import React, { useState } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
    const [messages, setMessages] = useState([
        { id: 0, sender: 'ai', text: 'Hi! How was your experience with us today?' }
    ]);
    const [input, setInput] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input, rating: rating };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stars: rating, text: userMsg.text })
            });
            const data = await res.json();

            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.ai_response
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Sorry, I couldn't process that. Please try again." }]);
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
