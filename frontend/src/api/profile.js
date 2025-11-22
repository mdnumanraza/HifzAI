import client from './client.js';

export const getProfile = async () => {
  const { data } = await client.get('/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await client.put('/profile/update', profileData);
  return data;
};

export const awardBadge = async (badgeId) => {
  const { data } = await client.post('/profile/award-badge', { badgeId });
  return data;
};

export const completeSurah = async (surahNumber) => {
  const { data } = await client.post('/profile/complete-surah', { surahNumber });
  return data;
};

export const getProfileStats = async () => {
  const { data } = await client.get('/profile/stats');
  return data;
};
