import React, { useState, useRef } from 'react';
import { uploadImage } from '../../api/cvApi.js';

export default function ImageUpload({ currentImage, profileName, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file, profileName);
      onChange(res.data.url);
    } catch (err) {
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const imgSrc = currentImage || null;

  return (
    <div>
      <h3 style={{ color: '#2c3e50', marginBottom: 16, fontSize: 16 }}>Foto de Perfil</h3>

      <div style={{ marginBottom: 20 }}>
        {imgSrc ? (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img
              src={imgSrc}
              alt="Foto de perfil"
              style={{
                width: 150, height: 150,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #3498db',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              }}
            />
            <p style={{ marginTop: 8, color: '#27ae60', fontWeight: 600, fontSize: 14 }}>Foto cargada</p>
          </div>
        ) : (
          <div style={{
            width: 150, height: 150, borderRadius: '50%',
            background: '#ecf0f1', border: '4px dashed #bdc3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 48, color: '#bdc3c7',
          }}>
            👤
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ fontSize: 14 }}
          >
            {uploading ? 'Subiendo...' : imgSrc ? '📷 Cambiar foto' : '📷 Subir foto'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </div>

        {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: 8, fontSize: 13 }}>{error}</p>}
      </div>

      <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 14, fontSize: 13, color: '#666' }}>
        <p><strong>Formatos aceptados:</strong> JPG, PNG, WebP</p>
        <p><strong>Tamaño máximo:</strong> 5MB</p>
        <p style={{ marginTop: 8, color: '#3498db' }}>La foto aparecerá en el lado izquierdo del CV y en el PDF generado.</p>
      </div>
    </div>
  );
}
