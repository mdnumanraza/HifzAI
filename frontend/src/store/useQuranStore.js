import { create } from 'zustand';
import axios from 'axios';

const QURAN_API = 'https://api.alquran.cloud/v1';

const useQuranStore = create((set, get) => ({
  surahs: [],
  paras: [],
  selectedSurah: null,
  selectedPara: null,
  loading: false,
  error: null,

  // Fetch all surahs
  fetchSurahs: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${QURAN_API}/surah`);
      set({ surahs: response.data.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch surahs', loading: false });
      console.error('Error fetching surahs:', error);
    }
  },

  // Fetch specific surah with all ayahs
  fetchSurah: async (id) => {
    try {
      set({ loading: true, error: null });
      // Fetch with audio from ar.alafasy edition
      const response = await axios.get(`${QURAN_API}/surah/${id}/ar.alafasy`);
      set({ selectedSurah: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch surah', loading: false });
      console.error('Error fetching surah:', error);
    }
  },

  // Fetch specific para (juz)
  fetchPara: async (id) => {
    try {
      set({ loading: true, error: null });
      // Fetch with audio from ar.alafasy edition
      const response = await axios.get(`${QURAN_API}/juz/${id}/ar.alafasy`);
      set({ selectedPara: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch para', loading: false });
      console.error('Error fetching para:', error);
    }
  },

  // Clear selected surah/para
  clearSelection: () => {
    set({ selectedSurah: null, selectedPara: null });
  }
}));

export default useQuranStore;
