import axios from 'axios';
import useStore from '../store/useStore.js';

// API endpoints configuration
const API_ENDPOINTS = {
  hosted: 'https://hifz-ai-api.vercel.app',
  local: 'http://localhost:5001'
};

let currentBaseURL = API_ENDPOINTS.hosted;

const client = axios.create({
  baseURL: currentBaseURL,
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for auth
client.interceptors.request.use(config => {
  const token = useStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor for API fallback
client.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If hosted API fails and we haven't tried local yet
    if (
      currentBaseURL === API_ENDPOINTS.hosted &&
      !originalRequest._retry &&
      (error.code === 'ECONNABORTED' || 
       error.response?.status >= 500 || 
       !error.response)
    ) {
      console.warn('Hosted API failed, switching to local API:', error.message);
      
      // Switch to local API
      currentBaseURL = API_ENDPOINTS.local;
      client.defaults.baseURL = currentBaseURL;
      
      // Mark request as retried and retry with local API
      originalRequest._retry = true;
      originalRequest.baseURL = currentBaseURL;
      
      try {
        return await client.request(originalRequest);
      } catch (localError) {
        console.error('Both hosted and local APIs failed:', localError.message);
        // Switch back to hosted for next requests
        currentBaseURL = API_ENDPOINTS.hosted;
        client.defaults.baseURL = currentBaseURL;
        throw localError;
      }
    }
    
    return Promise.reject(error);
  }
);

// Function to manually switch API endpoint
export const switchToHostedAPI = () => {
  currentBaseURL = API_ENDPOINTS.hosted;
  client.defaults.baseURL = currentBaseURL;
  console.log('Switched to hosted API');
};

export const switchToLocalAPI = () => {
  currentBaseURL = API_ENDPOINTS.local;
  client.defaults.baseURL = currentBaseURL;
  console.log('Switched to local API');
};

export const getCurrentEndpoint = () => currentBaseURL;

export default client;
