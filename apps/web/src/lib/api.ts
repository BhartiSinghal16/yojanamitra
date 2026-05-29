import axios from 'axios';
import { UserProfile } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const matchSchemes = async (profile: UserProfile): Promise<any> => {
  try {
    const { data } = await api.post('/api/smartmatch', profile);
    console.log('API Response:', JSON.stringify(data).slice(0, 500));
    return data;
  } catch (error: any) {
    console.error('API Error:', error?.response?.data || error?.message);
    throw error;
  }
};

export default api;