import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import PrintPage from './PrintPage.jsx';
import AuthGate from './components/Auth/AuthGate.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (window.location.pathname.startsWith('/print/')) {
  root.render(<PrintPage />);
} else {
  root.render(
    <React.StrictMode>
      <AuthGate>
        {({ user, onLogout }) => <App user={user} onLogout={onLogout} />}
      </AuthGate>
    </React.StrictMode>
  );
}
