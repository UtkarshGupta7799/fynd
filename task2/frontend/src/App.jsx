import React, { useState, useEffect } from 'react';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="app-container">
      <nav style={{ padding: '1rem', background: '#333', color: '#fff', marginBottom: '2rem' }}>
        <button onClick={() => { setIsAdmin(false); window.history.pushState({}, '', '/'); }} style={{ marginRight: '1rem' }}>User View</button>
        <button onClick={() => { setIsAdmin(true); window.history.pushState({}, '', '/admin'); }}>Admin View</button>
      </nav>
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default App;
