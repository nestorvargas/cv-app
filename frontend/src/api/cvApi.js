import axios from 'axios';

const BASE = '/api';

export const getCv = (lang) => axios.get(`${BASE}/cv/${lang}`);
export const updateCv = (lang, data) => axios.put(`${BASE}/cv/${lang}`, data);
export const downloadPdf = (lang) => {
  const a = document.createElement('a');
  a.href = `${BASE}/pdf/${lang}`;
  a.download = `CV_NestorVargas_${lang.toUpperCase()}.pdf`;
  a.click();
};
export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return axios.post(`${BASE}/upload/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
