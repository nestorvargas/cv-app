import axios from 'axios';

const BASE = '/api';

export const listProfiles = () => axios.get(`${BASE}/cv`);
export const getCv = (profileName, lang) => axios.get(`${BASE}/cv/${profileName}/${lang}`);
export const updateCv = (profileName, lang, data) => axios.put(`${BASE}/cv/${profileName}/${lang}`, data);
export const createProfile = (data) => axios.post(`${BASE}/cv`, data);
export const deleteProfile = (profileName) => axios.delete(`${BASE}/cv/${profileName}`);

export const downloadPdf = async (profileName, lang, template = 'classic', accentColor, bgColor) => {
  const params = new URLSearchParams({ template });
  if (accentColor) params.set('accentColor', accentColor);
  if (bgColor) params.set('bgColor', bgColor);
  const url = `${BASE}/pdf/${profileName}/${lang}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PDF error ${res.status}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `CV_NestorVargas_${profileName}_${lang.toUpperCase()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
};

export const uploadImage = (file, profileName) => {
  const form = new FormData();
  form.append('image', file);
  return axios.post(`${BASE}/upload/image?profileName=${encodeURIComponent(profileName)}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
