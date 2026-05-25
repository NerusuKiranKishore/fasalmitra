import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' },
});

export const getDistricts    = ()                    => api.get('/api/districts');
export const getCropAdvisory = (data)                => api.post('/api/crop-advisory', data);
export const getWeather      = (district)            => api.post('/api/weather', { district });
export const getMandiPrices  = (commodity, district) => api.post('/api/mandi-prices', { commodity, district });
export const getSchemes      = (category = 'all')    => api.get(`/api/schemes?category=${category}`);