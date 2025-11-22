import axios from 'axios';
import useStore from '../store/useStore.js';

const client = axios.create({
  baseURL: 'http://localhost:5001'
});

client.interceptors.request.use(config => {
  const token = useStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
