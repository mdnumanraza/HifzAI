import axios from 'axios';

const BASE = 'https://api.alquran.cloud/v1';

// Rate limiting configuration
const RATE_LIMIT = 10; // Requests per second (slightly below API limit of 12)
const REQUEST_INTERVAL = 1000 / RATE_LIMIT; // Milliseconds between requests
const MAX_QUEUE_SIZE = 100; // Prevent memory issues with too many queued requests
const MAX_RETRIES = 3; // Maximum number of retries for failed requests

class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      // Prevent queue overflow
      if (this.queue.length >= MAX_QUEUE_SIZE) {
        reject(new Error('Request queue is full. Please try again later.'));
        return;
      }
      
      this.queue.push({ requestFn, resolve, reject, retryCount: 0 });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const { requestFn, resolve, reject, retryCount = 0 } = this.queue.shift();

      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const waitTime = Math.max(0, REQUEST_INTERVAL - timeSinceLastRequest);

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        const shouldRetry = retryCount < MAX_RETRIES;
        
        if (error.response?.status === 429 && shouldRetry) {
          // Rate limit exceeded, retry after delay
          const retryAfter = error.response.headers['retry-after'] || 1;
          console.log(`Al-Quran API rate limit hit (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying after ${retryAfter} seconds`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          // Re-add to queue for retry
          this.queue.unshift({ requestFn, resolve, reject, retryCount: retryCount + 1 });
          continue;
        } else if (error.response?.status >= 500 && shouldRetry) {
          // Server error, retry after delay
          console.log(`Al-Quran API server error (${error.response.status}, attempt ${retryCount + 1}/${MAX_RETRIES}), retrying in 2 seconds`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Re-add to queue for retry
          this.queue.unshift({ requestFn, resolve, reject, retryCount: retryCount + 1 });
          continue;
        }
        
        // Max retries reached or non-retryable error
        if (retryCount >= MAX_RETRIES) {
          console.error(`Al-Quran API request failed after ${MAX_RETRIES} retries:`, error.message);
        }
        reject(error);
      }

      this.lastRequestTime = Date.now();
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

// Helper function to make rate-limited requests with caching
const makeRequest = async (url) => {
  // Check cache first
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await requestQueue.add(async () => {
    const { data } = await axios.get(url);
    return data;
  });

  // Cache the result
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
};

export const getSurahMeta = async (surah) => {
  const url = `${BASE}/surah/${surah}`;
  const data = await makeRequest(url);
  if (data.code !== 200) throw new Error('Failed to fetch surah meta');
  return { number: data.data.number, ayahs: data.data.numberOfAyahs, englishName: data.data.englishName };
};

export const getAyahWithAudio = async (surah, ayah) => {
  const url = `${BASE}/ayah/${surah}:${ayah}/ar.alafasy`;
  const data = await makeRequest(url);
  if (data.code !== 200) throw new Error('Failed to fetch ayah');
  return {
    surah: data.data.surah.number,
    ayah: data.data.numberInSurah,
    text: data.data.text,
    audioUrl: data.data.audio,
    surahName: data.data.surah.englishName
  };
};

// Get ayah without audio (lighter request)
export const getAyahText = async (surah, ayah) => {
  const url = `${BASE}/ayah/${surah}:${ayah}`;
  const data = await makeRequest(url);
  if (data.code !== 200) throw new Error('Failed to fetch ayah');
  return {
    surah: data.data.surah.number,
    ayah: data.data.numberInSurah,
    text: data.data.text,
    surahName: data.data.surah.englishName
  };
};

// Batch fetch multiple ayahs efficiently
export const getAyahsBatch = async (ayahReferences) => {
  const results = [];
  
  for (const { surah, ayah } of ayahReferences) {
    try {
      const ayahData = await getAyahWithAudio(surah, ayah);
      results.push(ayahData);
    } catch (error) {
      console.error(`Failed to fetch ayah ${surah}:${ayah}:`, error.message);
      // Continue with next ayah instead of failing entire batch
    }
  }
  
  return results;
};

// Clear cache (useful for testing or manual refresh)
export const clearCache = () => {
  cache.clear();
};

// Get cache statistics
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};
