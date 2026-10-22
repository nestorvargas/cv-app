import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import PrintPage from './PrintPage.jsx';
import AuthGate from './components/Auth/AuthGate.jsx';
import LegalPage from './components/Auth/LegalPage.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const path = window.location.pathname;
if (path.startsWith('/print/')) {
  root.render(<PrintPage />);
} else if (path === '/terminos' || path === '/privacidad') {
  root.render(<LegalPage doc={path === '/terminos' ? 'terms' : 'privacy'} />);
} else {
  root.render(
    <React.StrictMode>
      <AuthGate>
        {({ user, onLogout }) => <App user={user} onLogout={onLogout} />}
      </AuthGate>
    </React.StrictMode>
  );
}
