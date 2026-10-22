import React, { useState, useEffect } from 'react';
import { getMe, logout, onUnauthorized } from '../../api/authApi.js';
import LoginPage from './LoginPage.jsx';

// Renders the login screen until there is a valid session, then the app.
export default function AuthGate({ children }) {
  const [user, setUser] = useState(undefined); // undefined = checking session

  useEffect(() => {
    getMe()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
    return onUnauthorized(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  };

  if (user === undefined) {
    return (
      <div className="cv-index app-bg">
        <div className="cv-index-loading">
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }} />
          Cargando...
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={setUser} />;

  return children({ user, onLogout: handleLogout });
}
