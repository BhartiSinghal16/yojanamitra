import axios from 'axios';
import { MatchResponse, UserProfile } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const matchSchemes = async (profile: UserProfile): Promise<MatchResponse> => {
  const { data } = await api.post<MatchResponse>('/api/match', profile);
  return data;
};

export default api;