import React from 'react';

const PRESET_COLORS = [
  '#1abc9c', '#3498db', '#e74c3c', '#e67e22', '#9b59b6',
  '#2ecc71', '#f39c12', '#16a085', '#e94560', '#2980b9',
  '#8e44ad', '#d35400', '#27ae60', '#c0392b', '#1a1a2e',
];

const PRESET_BG_COLORS = [
  '#2c3e50', '#1a252f', '#1a1a2e', '#3d3d3d', '#263238',
  '#37474f', '#1b2631', '#0f3460', '#1e3a5f', '#1a1a2e',
  '#212121', '#2d2d2d', '#1e1e2e', '#2a0944', '#0d1b2a',
];

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Sidebar oscuro con foto y habilidades. Encabezado dark con nombre.',
    defaultAccent: '#1abc9c',
    defaultBg: '#2c3e50',
    thumbnail: (color, bg) => (
      <div style={{ width: '100%', height: 120, background: bg, borderRadius: 4, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        <div style={{ width: '35%', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: `2px solid ${color}`, marginBottom: 4 }} />
          <div style={{ width: '80%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
          <div style={{ width: '60%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 4 }}>
            {[1,2,3,4].map(n => <div key={n} style={{ width: 14, height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 3 }} />)}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: bg, padding: '8px 8px 6px', borderBottom: `2px solid ${color}` }}>
            <div style={{ width: '70%', height: 6, background: 'white', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: '50%', height: 4, background: color, borderRadius: 2 }} />
          </div>
          <div style={{ padding: '6px 8px', flex: 1, background: 'white' }}>
            <div style={{ width: '40%', height: 3, background: color, borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4].map(n => <div key={n} style={{ width: `${60 + n * 8}%`, height: 3, background: '#ddd', borderRadius: 1, marginBottom: 3 }} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Encabezado completo con foto y nombre. Cuerpo en dos columnas.',
    defaultAccent: '#e67e22',
    defaultBg: '#1a252f',
    thumbnail: (color, bg) => (
      <div style={{ width: '100%', height: 120, background: '#f8f9fa', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: bg, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: `2px solid ${color}`, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '70%', height: 5, background: 'white', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: '50%', height: 3, background: color, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ padding: '6px 8px', borderRight: '1px solid #e0e0e0' }}>
            <div style={{ width: '60%', height: 3, background: color, borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4,5].map(n => <div key={n} style={{ width: `${55 + n * 7}%`, height: 2.5, background: '#ccc', borderRadius: 1, marginBottom: 3 }} />)}
          </div>
          <div style={{ padding: '6px 8px', background: '#fafbfc' }}>
            <div style={{ width: '60%', height: 3, background: color, borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4,5].map(n => <div key={n} style={{ width: `${50 + n * 6}%`, height: 2.5, background: '#ccc', borderRadius: 1, marginBottom: 3 }} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Encabezado centrado formal. Sidebar oscuro lateral.',
    defaultAccent: '#8e44ad',
    defaultBg: '#2c3e50',
    thumbnail: (color, bg) => (
      <div style={{ width: '100%', height: 120, background: '#f8f9fa', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: bg, padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ width: '60%', height: 5, background: 'white', borderRadius: 2, margin: '0 auto 4px' }} />
          <div style={{ width: '40%', height: 3, background: '#bdc3c7', borderRadius: 2, margin: '0 auto 6px' }} />
          <div style={{ width: 30, height: 2, background: color, borderRadius: 1, margin: '0 auto' }} />
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: '30%', background: bg, padding: '6px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: `2px solid ${color}` }} />
            <div style={{ width: '80%', height: 2.5, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
            <div style={{ width: '60%', height: 2.5, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
          </div>
          <div style={{ flex: 1, padding: '6px 8px' }}>
            <div style={{ width: '50%', height: 3, background: color, borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4,5].map(n => <div key={n} style={{ width: `${55 + n * 6}%`, height: 2.5, background: '#ccc', borderRadius: 1, marginBottom: 3 }} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Encabezado con foto e inline contacts. Main izquierdo, sidebar derecho.',
    defaultAccent: '#e94560',
    defaultBg: '#1a1a2e',
    thumbnail: (color, bg) => (
      <div style={{ width: '100%', height: 120, background: '#f4f6f8', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: bg, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(255,255,255,0.12)', border: `2px solid ${color}`, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '65%', height: 5, background: 'white', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: 24, height: 2, background: color, borderRadius: 1 }} />
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: '70%', padding: '6px 8px', background: 'white' }}>
            <div style={{ width: '50%', height: 2.5, background: color, borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{ width: 3, height: 10, background: color, borderRadius: 1, flexShrink: 0 }} />
                <div style={{ width: `${55 + n * 7}%`, height: 2.5, background: '#ddd', borderRadius: 1 }} />
              </div>
            ))}
          </div>
          <div style={{ width: '30%', background: '#f4f6f8', padding: '6px 5px', borderLeft: '1px solid #e0e6ed' }}>
            <div style={{ width: '80%', height: 2.5, background: color, borderRadius: 1, marginBottom: 5 }} />
            {[1,2,3,4,5].map(n => <div key={n} style={{ width: 28, height: 10, background: bg, borderRadius: 5, marginBottom: 3, display: 'inline-block', marginRight: 2 }} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sidebar oscuro con barras de habilidades. Timeline de dos columnas para experiencia.',
    defaultAccent: '#2980b9',
    defaultBg: '#3d3d3d',
    thumbnail: (color, bg) => (
      <div style={{ width: '100%', height: 120, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: '29%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 6px', gap: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }} />
          {[90,75,85,65,80].map((w, i) => (
            <div key={i} style={{ width: '90%' }}>
              <div style={{ height: 2.5, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 2, opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: 'white', padding: '8px 10px' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ width: '65%', height: 6, background: '#2d2d2d', borderRadius: 2, marginBottom: 3 }} />
            <div style={{ width: '45%', height: 3, background: '#bbb', borderRadius: 2 }} />
          </div>
          <div style={{ width: '55%', height: 2.5, background: color, borderRadius: 1, marginBottom: 6 }} />
          {[1,2].map(n => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '40px 10px 1fr', gap: 4, marginBottom: 6 }}>
              <div style={{ height: 3, background: '#ccc', borderRadius: 1, alignSelf: 'center' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, alignSelf: 'center' }} />
              <div style={{ height: 3, background: '#ddd', borderRadius: 1, alignSelf: 'center' }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function TemplatesForm({ activeTemplate, onChange, templateColors = {}, onColorChange, templateBgColors = {}, onBgColorChange }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#2c3e50' }}>
        Seleccionar Plantilla
      </h3>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6c757d' }}>
        Elige el diseño y personaliza los colores de cada plantilla.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TEMPLATES.map((tmpl) => {
          const isActive = activeTemplate === tmpl.id;
          const currentColor = templateColors[tmpl.id] || tmpl.defaultAccent;
          const currentBg = templateBgColors[tmpl.id] || tmpl.defaultBg;

          return (
            <div
              key={tmpl.id}
              onClick={() => onChange(tmpl.id)}
              style={{
                border: isActive ? `2px solid ${currentColor}` : '2px solid #dee2e6',
                borderRadius: 12,
                padding: 16,
                cursor: 'pointer',
                background: isActive ? `${currentColor}0d` : 'white',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: isActive ? `0 4px 16px ${currentColor}30` : '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 24, height: 24, borderRadius: '50%',
                  background: currentColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 700, zIndex: 1,
                }}>
                  <i className="fa-solid fa-check" />
                </div>
              )}

              {/* Thumbnail */}
              <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                {tmpl.thumbnail(currentColor, currentBg)}
              </div>

              {/* Info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: isActive ? 14 : 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: currentColor, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#2c3e50' }}>{tmpl.name}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#6c757d', lineHeight: 1.5 }}>{tmpl.description}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onChange(tmpl.id); }}
                  style={{
                    background: isActive ? currentColor : 'white',
                    color: isActive ? 'white' : currentColor,
                    border: `2px solid ${currentColor}`,
                    borderRadius: 8, padding: '7px 16px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {isActive ? 'Activo' : 'Seleccionar'}
                </button>
              </div>

              {/* Color pickers — only when active */}
              {isActive && (
                <div onClick={e => e.stopPropagation()} style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Accent color */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                      <i className="fa-solid fa-palette" style={{ marginRight: 5 }} />
                      Color de acento
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => onColorChange?.(tmpl.id, color)}
                          title={color}
                          style={{
                            width: 22, height: 22,
                            borderRadius: '50%',
                            background: color,
                            border: currentColor === color ? '2.5px solid #2d2d2d' : '2px solid rgba(0,0,0,0.12)',
                            cursor: 'pointer',
                            padding: 0,
                            flexShrink: 0,
                            transform: currentColor === color ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.15s',
                          }}
                        />
                      ))}
                      <input
                        type="color"
                        value={currentColor}
                        onChange={e => onColorChange?.(tmpl.id, e.target.value)}
                        title="Color de acento personalizado"
                        style={{ width: 26, height: 26, border: '2px solid #dee2e6', borderRadius: 6, cursor: 'pointer', padding: 1, background: 'white' }}
                      />
                    </div>
                  </div>

                  {/* Background color */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                      <i className="fa-solid fa-fill-drip" style={{ marginRight: 5 }} />
                      Color de fondo
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {PRESET_BG_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => onBgColorChange?.(tmpl.id, color)}
                          title={color}
                          style={{
                            width: 22, height: 22,
                            borderRadius: '50%',
                            background: color,
                            border: currentBg === color ? '2.5px solid #2d2d2d' : '2px solid rgba(0,0,0,0.12)',
                            cursor: 'pointer',
                            padding: 0,
                            flexShrink: 0,
                            transform: currentBg === color ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.15s',
                          }}
                        />
                      ))}
                      <input
                        type="color"
                        value={currentBg}
                        onChange={e => onBgColorChange?.(tmpl.id, e.target.value)}
                        title="Color de fondo personalizado"
                        style={{ width: 26, height: 26, border: '2px solid #dee2e6', borderRadius: 6, cursor: 'pointer', padding: 1, background: 'white' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
