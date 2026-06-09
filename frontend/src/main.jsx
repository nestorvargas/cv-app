import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import PrintPage from './PrintPage.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (window.location.pathname.startsWith('/print/')) {
  root.render(<PrintPage />);
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
