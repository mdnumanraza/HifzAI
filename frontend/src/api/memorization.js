import client from './client.js';

export const getDaily = () => client.get('/memorization/daily').then(r=>r.data);
export const markMemorized = (surah, ayah) => client.post('/memorization/mark', { surah, ayah }).then(r=>r.data);
export const getProgress = () => client.get('/memorization/progress').then(r=>r.data);
export const updateSettings = (data) => client.patch('/user/settings', data).then(r=>r.data);
