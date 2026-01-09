import React, { useState, useEffect } from 'react';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import './App.css';

function App() {
  const [role, setRole] = useState(null); // 'user', 'admin', or null

  useEffect(() => {
    // Basic routing check
    if (window.location.pathname === '/admin') {
      setRole('admin');
    }
  }, []);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  if (!role) {
    return (
      <div className="landing-container">
        <div className="login-card">
          <h1>Welcome to Fynd Support</h1>
          <p>Please select your role to continue</p>

          <div className="role-buttons">
            <button
              className="role-btn user-role"
              onClick={() => handleRoleSelect('user')}
            >
              <div className="icon">👤</div>
              <div className="text">
                <h3>Customer</h3>
                <span>I want to submit feedback</span>
              </div>
            </button>

            <button
              className="role-btn admin-role"
              onClick={() => handleRoleSelect('admin')}
            >
              <div className="icon">🛡️</div>
              <div className="text">
                <h3>Support Agent</h3>
                <span>I want to manage tickets</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Floating Home Button to switch roles */}
      <button className="home-btn" onClick={() => setRole(null)} title="Switch Role">
        🏠
      </button>

      {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default App;
