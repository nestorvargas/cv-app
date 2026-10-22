import axios from 'axios';

const BASE = '/api/catalog';

export const searchTitles = (q, lang, area) => axios.get(`${BASE}/titles`, { params: { q, lang, area } });
export const addTitle = (data) => axios.post(`${BASE}/titles`, data);
