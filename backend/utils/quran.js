import axios from 'axios';

const BASE = 'https://api.alquran.cloud/v1';

export const getSurahMeta = async (surah) => {
  const url = `${BASE}/surah/${surah}`;
  const { data } = await axios.get(url);
  if (data.code !== 200) throw new Error('Failed to fetch surah meta');
  return { number: data.data.number, ayahs: data.data.numberOfAyahs, englishName: data.data.englishName };
};

export const getAyahWithAudio = async (surah, ayah) => {
  const url = `${BASE}/ayah/${surah}:${ayah}/ar.alafasy`;
  const { data } = await axios.get(url);
  if (data.code !== 200) throw new Error('Failed to fetch ayah');
  return {
    surah: data.data.surah.number,
    ayah: data.data.numberInSurah,
    text: data.data.text,
    audioUrl: data.data.audio,
    surahName: data.data.surah.englishName
  };
};
