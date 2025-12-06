import express from 'express';
import { getCacheStats } from '../utils/quran.js';

const router = express.Router();

// Health check endpoint for API monitoring
router.get('/health', async (req, res) => {
  try {
    const cacheStats = getCacheStats();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      api: {
        rateLimit: '10 requests/second',
        cacheTtl: '1 hour',
        maxQueueSize: 100,
        maxRetries: 3
      },
      cache: {
        entries: cacheStats.size,
        sampleKeys: cacheStats.keys.slice(0, 5) // Show first 5 cache keys
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      uptime: Math.round(process.uptime()) + ' seconds'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Clear API cache (for admin use)
router.post('/cache/clear', async (req, res) => {
  try {
    const { clearCache } = await import('../utils/quran.js');
    clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;