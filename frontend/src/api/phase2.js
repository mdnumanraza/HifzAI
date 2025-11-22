import client from './client.js';

export const updateStreak = async () => {
  const response = await client.post('/streak/update');
  return response.data;
};

export const getStreak = async () => {
  const response = await client.get('/streak');
  return response.data;
};

export const updateRewards = async (action, metadata = {}) => {
  const response = await client.post('/rewards/update', { action, metadata });
  return response.data;
};

export const getRewards = async () => {
  const response = await client.get('/rewards');
  return response.data;
};

export const addToRevision = async (surah, ayah) => {
  const response = await client.post('/revision/add', { surah, ayah });
  return response.data;
};

export const getRevisionList = async () => {
  const response = await client.get('/revision/list');
  return response.data;
};

export const removeFromRevision = async (surah, ayah) => {
  const response = await client.post('/revision/remove', { surah, ayah });
  return response.data;
};

export const markReviewed = async (surah, ayah) => {
  const response = await client.post('/revision/mark-reviewed', { surah, ayah });
  return response.data;
};

export const sendBackToMemorization = async (surah, ayah) => {
  const response = await client.post('/revision/send-back', { surah, ayah });
  return response.data;
};

export const getRevisionStats = async () => {
  const response = await client.get('/revision/stats');
  return response.data;
};

export const addHistory = async (surah, ayah, action) => {
  const response = await client.post('/history/add', { surah, ayah, action });
  return response.data;
};

export const getHistory = async (limit = 50, skip = 0) => {
  const response = await client.get(`/history?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const getHistoryStats = async () => {
  const response = await client.get('/history/stats');
  return response.data;
};
