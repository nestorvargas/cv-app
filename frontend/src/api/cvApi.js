import axios from 'axios';

const BASE = '/api';

export const listProfiles = () => axios.get(`${BASE}/cv`);
export const getCv = (profileName, lang) => axios.get(`${BASE}/cv/${profileName}/${lang}`);
export const updateCv = (profileName, lang, data) => axios.put(`${BASE}/cv/${profileName}/${lang}`, data);
export const createProfile = (data) => axios.post(`${BASE}/cv`, data);
export const deleteProfile = (profileName) => axios.delete(`${BASE}/cv/${profileName}`);

export const downloadPdf = (profileName, lang, template = 'classic') => {
  const a = document.createElement('a');
  a.href = `${BASE}/pdf/${profileName}/${lang}?template=${template}`;
  a.download = `CV_NestorVargas_${profileName}_${lang.toUpperCase()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return axios.post(`${BASE}/upload/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
