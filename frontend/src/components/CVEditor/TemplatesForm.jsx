import React from 'react';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Sidebar oscuro con foto, contacto y habilidades. Encabezado dark con nombre y título. Acento verde teal.',
    accent: '#1abc9c',
    thumbnail: (
      <div style={{ width: '100%', height: 120, background: '#2c3e50', borderRadius: 4, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        {/* Sidebar */}
        <div style={{ width: '35%', background: '#1a252f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#34495e', border: '2px solid #1abc9c', marginBottom: 4 }} />
          <div style={{ width: '80%', height: 4, background: '#34495e', borderRadius: 2 }} />
          <div style={{ width: '60%', height: 4, background: '#34495e', borderRadius: 2 }} />
          <div style={{ width: '80%', height: 4, background: '#34495e', borderRadius: 2, marginTop: 4 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 4 }}>
            {[1,2,3,4].map(n => (
              <div key={n} style={{ width: 14, height: 6, background: '#3d566e', borderRadius: 3 }} />
            ))}
          </div>
        </div>
        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#2c3e50', padding: '8px 8px 6px', borderBottom: '2px solid #1abc9c' }}>
            <div style={{ width: '70%', height: 6, background: 'white', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: '50%', height: 4, background: '#1abc9c', borderRadius: 2 }} />
          </div>
          <div style={{ padding: '6px 8px', flex: 1 }}>
            <div style={{ width: '40%', height: 3, background: '#1abc9c', borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4].map(n => (
              <div key={n} style={{ width: `${60 + n * 8}%`, height: 3, background: '#ddd', borderRadius: 1, marginBottom: 3 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Encabezado completo con foto a la izquierda y nombre a la derecha. Cuerpo en dos columnas iguales. Acento naranja.',
    accent: '#e67e22',
    thumbnail: (
      <div style={{ width: '100%', height: 120, background: '#f8f9fa', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: '#1a252f', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#2c3e50', border: '2px solid #e67e22', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '70%', height: 5, background: 'white', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: '50%', height: 3, background: '#e67e22', borderRadius: 2 }} />
          </div>
        </div>
        {/* 2-col body */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ padding: '6px 8px', borderRight: '1px solid #e0e0e0' }}>
            <div style={{ width: '60%', height: 3, background: '#e67e22', borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: `${55 + n * 7}%`, height: 2.5, background: '#ccc', borderRadius: 1, marginBottom: 3 }} />
            ))}
          </div>
          <div style={{ padding: '6px 8px', background: '#fafbfc' }}>
            <div style={{ width: '60%', height: 3, background: '#e67e22', borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: `${50 + n * 6}%`, height: 2.5, background: '#ccc', borderRadius: 1, marginBottom: 3 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Encabezado centrado formal con nombre en mayúsculas. Sidebar lateral oscuro con foto, contacto y habilidades. Acento púrpura.',
    accent: '#8e44ad',
    thumbnail: (
      <div style={{ width: '100%', height: 120, background: '#f8f9fa', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header centered */}
        <div style={{ background: '#1a252f', padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ width: '60%', height: 5, background: 'white', borderRadius: 2, margin: '0 auto 4px' }} />
          <div style={{ width: '40%', height: 3, background: '#bdc3c7', borderRadius: 2, margin: '0 auto 6px' }} />
          <div style={{ width: 30, height: 2, background: '#8e44ad', borderRadius: 1, margin: '0 auto' }} />
        </div>
        {/* Body: sidebar + main */}
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: '30%', background: '#2c3e50', padding: '6px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#34495e', border: '2px solid #8e44ad' }} />
            <div style={{ width: '80%', height: 2.5, background: '#34495e', borderRadius: 1 }} />
            <div style={{ width: '60%', height: 2.5, background: '#34495e', borderRadius: 1 }} />
            <div style={{ width: '80%', height: 2.5, background: '#34495e', borderRadius: 1 }} />
          </div>
          <div style={{ flex: 1, padding: '6px 8px' }}>
            <div style={{ width: '50%', height: 3, background: '#8e44ad', borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: `${55 + n * 6}%`, height: 2.5, background: '#ccc', borderRadius: 1, marginBottom: 3 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Encabezado con foto y contactos inline. Contenido principal a la izquierda, sidebar de habilidades a la derecha. Acento rojo coral.',
    accent: '#e94560',
    thumbnail: (
      <div style={{ width: '100%', height: 120, background: '#f4f6f8', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: '#1a1a2e', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: '#252545', border: '2px solid #e94560', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '65%', height: 5, background: 'white', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: '45%', height: 3, background: '#bdc3c7', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: 24, height: 2, background: '#e94560', borderRadius: 1 }} />
          </div>
        </div>
        {/* Body: main 70% + sidebar 30% */}
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: '70%', padding: '6px 8px', background: 'white' }}>
            <div style={{ width: '50%', height: 2.5, background: '#e94560', borderRadius: 1, marginBottom: 4 }} />
            {[1,2,3,4].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{ width: 3, height: 10, background: '#e94560', borderRadius: 1, flexShrink: 0 }} />
                <div style={{ width: `${55 + n * 7}%`, height: 2.5, background: '#ddd', borderRadius: 1 }} />
              </div>
            ))}
          </div>
          <div style={{ width: '30%', background: '#f4f6f8', padding: '6px 5px', borderLeft: '1px solid #e0e6ed' }}>
            <div style={{ width: '80%', height: 2.5, background: '#e94560', borderRadius: 1, marginBottom: 5 }} />
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: 28, height: 10, background: '#1a1a2e', borderRadius: 5, marginBottom: 3, display: 'inline-block', marginRight: 2 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function TemplatesForm({ activeTemplate, onChange }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#2c3e50' }}>
        Seleccionar Plantilla
      </h3>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6c757d' }}>
        Elige el diseño visual para tu CV. La plantilla afecta tanto la vista previa como el PDF descargado.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TEMPLATES.map((tmpl) => {
          const isActive = activeTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onChange(tmpl.id)}
              style={{
                border: isActive ? `2px solid ${tmpl.accent}` : '2px solid #dee2e6',
                borderRadius: 12,
                padding: 16,
                cursor: 'pointer',
                background: isActive ? `${tmpl.accent}08` : 'white',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: isActive ? `0 4px 16px ${tmpl.accent}25` : '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {/* Checkmark badge */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: tmpl.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 700,
                  zIndex: 1,
                }}>
                  ✓
                </div>
              )}

              {/* Thumbnail */}
              <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                {tmpl.thumbnail}
              </div>

              {/* Info row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: tmpl.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#2c3e50' }}>{tmpl.name}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#6c757d', lineHeight: 1.5 }}>
                    {tmpl.description}
                  </p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onChange(tmpl.id); }}
                  style={{
                    background: isActive ? tmpl.accent : 'white',
                    color: isActive ? 'white' : tmpl.accent,
                    border: `2px solid ${tmpl.accent}`,
                    borderRadius: 8,
                    padding: '7px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {isActive ? 'Activo' : 'Seleccionar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
