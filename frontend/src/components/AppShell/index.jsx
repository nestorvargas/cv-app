import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChangePasswordModal } from '../Auth/UserMenu.jsx';
import './appshell.css';

// Platform layout for the logged-in screens (CV list, users): fixed sidebar + full-width content
export default function AppShell({ user, active, onNavigate, onLogout, onNew, title, subtitle, actions, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Desktop: sidebar collapsed to icons (remembered per browser)
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('cv_sidebar_collapsed') === '1'; } catch (_) { return false; }
  });
  const toggleCollapsed = () => {
    setCollapsed(c => {
      try { localStorage.setItem('cv_sidebar_collapsed', c ? '0' : '1'); } catch (_) {}
      return !c;
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    document.body.classList.toggle('shell-menu-open', menuOpen);
    return () => document.body.classList.remove('shell-menu-open');
  }, [menuOpen]);

  const go = (page) => { setMenuOpen(false); onNavigate(page); };

  const NAV = [
    { id: 'index', icon: 'fa-layer-group', label: isAdmin ? 'Hojas de vida' : 'Mis hojas de vida' },
    ...(isAdmin ? [{ id: 'users', icon: 'fa-users-gear', label: 'Usuarios' }] : []),
  ];

  return (
    <div className={`shell app-bg ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className={`shell-side ${menuOpen ? 'is-open' : ''}`}>
        <div className="shell-brand">
          <span className="cv-index-logo-icon"><i className="fa-solid fa-id-card" /></span>
          <div className="shell-label shell-brand-text">
            <div className="shell-brand-name">CV Manager</div>
            <div className="shell-brand-sub">Hojas de vida con IA</div>
          </div>
        </div>

        {onNew && (
          <div className="shell-quick">
            <button className="shell-new" onClick={() => { setMenuOpen(false); onNew('blank'); }} data-tip="Nueva hoja de vida o importar PDF">
              <i className="fa-solid fa-plus" /> <span className="shell-label">Nueva hoja de vida</span>
            </button>
          </div>
        )}

        <nav className="shell-nav" aria-label="Principal">
          <p className="shell-nav-label shell-label">Menú</p>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`shell-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => go(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
              data-tip={item.label}
            >
              <i className={`fa-solid ${item.icon}`} /> <span className="shell-label">{item.label}</span>
            </button>
          ))}
          <p className="shell-nav-label shell-label">Ayuda</p>
          <a className="shell-nav-item" href="/terminos" target="_blank" rel="noreferrer" data-tip="Términos">
            <i className="fa-solid fa-file-contract" /> <span className="shell-label">Términos</span>
          </a>
          <a className="shell-nav-item" href="/privacidad" target="_blank" rel="noreferrer" data-tip="Privacidad">
            <i className="fa-solid fa-shield-halved" /> <span className="shell-label">Privacidad</span>
          </a>
        </nav>

        {/* Desktop: collapse / expand the sidebar */}
        <button
          className="shell-collapse"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          data-tip="Expandir menú"
        >
          <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`} />
          <span className="shell-label">Contraer menú</span>
        </button>

        <div className="shell-user">
          <span className="user-avatar" data-tip={`${user.username} · ${user.role === 'admin' ? 'Administrador' : 'Editor'}`}>
            {user.username.charAt(0)}
          </span>
          <div className="shell-user-info shell-label">
            <div className="shell-user-name">{user.username}</div>
            <div className="shell-user-role">
              {user.role === 'admin' ? 'Administrador' : 'Editor'}{user.google ? ' · Google' : ''}
            </div>
          </div>
          {!user.google && (
            <button className="shell-logout shell-key shell-label" onClick={() => setShowPassword(true)} data-tip="Cambiar contraseña" aria-label="Cambiar contraseña">
              <i className="fa-solid fa-key" />
            </button>
          )}
          <button className="shell-logout" onClick={onLogout} data-tip="Cerrar sesión" aria-label="Cerrar sesión">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </aside>

      {menuOpen && <div className="shell-backdrop" onClick={() => setMenuOpen(false)} />}
      {showPassword && createPortal(<ChangePasswordModal onClose={() => setShowPassword(false)} />, document.body)}

      <div className="shell-main">
        <header className="shell-top">
          {/* Mobile: open the sidebar drawer */}
          <button className="shell-burger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <i className="fa-solid fa-bars" />
          </button>
          <div className="shell-top-titles">
            {subtitle && <p className="shell-top-sub">{subtitle}</p>}
            <h1 className="shell-top-title">{title}</h1>
          </div>
          <div className="shell-top-actions">{actions}</div>
        </header>
        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}
