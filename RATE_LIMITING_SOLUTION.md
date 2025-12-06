# Rate Limiting Solution for Al-Quran Cloud API

## Problem
The application was encountering 429 "Too Many Requests" errors from the Al-Quran Cloud API, which has a rate limit of 12 requests per second.

## Solution Implemented

### 1. Request Queue System (`backend/utils/quran.js`)
- **Rate Limiting**: Implemented a queue-based system that limits requests to 10/second (safely below the 12/second limit)
- **Automatic Retries**: Handles 429 and 5xx errors with intelligent retry logic
- **Caching**: Added 1-hour in-memory cache to reduce redundant API calls
- **Queue Management**: Prevents memory issues with a maximum queue size of 100 requests
- **Error Handling**: Comprehensive error handling with configurable retry limits

### 2. Key Features

#### Request Queue Class
```javascript
class RequestQueue {
  constructor() {
    this.queue = []
    this.processing = false
    this.lastRequestTime = 0
  }
}
```

#### Configuration
- **Rate Limit**: 10 requests/second
- **Cache TTL**: 1 hour
- **Max Queue Size**: 100 requests
- **Max Retries**: 3 attempts
- **Request Interval**: 100ms between requests

#### Retry Logic
- **429 Errors**: Respects `retry-after` header, defaults to 1 second
- **5xx Errors**: 2-second delay before retry
- **Max Retries**: Prevents infinite retry loops
- **Exponential Backoff**: Built-in delay management

### 3. API Functions Enhanced

#### Core Functions
- `getSurahMeta(surah)` - Get surah metadata with caching
- `getAyahWithAudio(surah, ayah)` - Get ayah with audio URL
- `getAyahText(surah, ayah)` - Lightweight ayah text only
- `getAyahsBatch(ayahReferences)` - Efficient batch processing

#### Utility Functions
- `clearCache()` - Manual cache clearing
- `getCacheStats()` - Cache monitoring
- `makeRequest(url)` - Rate-limited HTTP client

### 4. Backend Route Improvements

#### Memorization Routes (`backend/routes/memorization.js`)
- Enhanced error handling in batch processing
- Better loop management for ayah fetching
- Added endpoint `/memorization/ayah/:surah/:ayah` for frontend

#### AI Routes (`backend/routes/ai.js`)
- Updated to use centralized API client
- Switched to lighter `getAyahText()` for non-audio requests

#### New Monitoring Routes (`backend/routes/monitoring.js`)
- `/monitoring/health` - API health and statistics
- `/monitoring/cache/clear` - Admin cache management

### 5. Error Handling Improvements

#### Before
```javascript
// Direct API calls without rate limiting
const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`);
```

#### After
```javascript
// Rate-limited with caching and retry logic
const ayahData = await getAyahText(surah, ayah);
```

### 6. Monitoring & Diagnostics

#### Health Endpoint Response
```json
{
  "status": "healthy",
  "timestamp": "2025-11-23T10:00:00.000Z",
  "api": {
    "rateLimit": "10 requests/second",
    "cacheTtl": "1 hour",
    "maxQueueSize": 100,
    "maxRetries": 3
  },
  "cache": {
    "entries": 25,
    "sampleKeys": ["https://api.alquran.cloud/v1/surah/2", ...]
  },
  "memory": {
    "used": "45 MB",
    "total": "128 MB"
  },
  "uptime": "3600 seconds"
}
```

## Benefits

1. **No More 429 Errors**: Proper rate limiting prevents API limits
2. **Better Performance**: Caching reduces redundant requests
3. **Resilience**: Automatic retry logic handles temporary failures  
4. **Scalability**: Queue system handles high-traffic scenarios
5. **Monitoring**: Built-in health checks and diagnostics
6. **Memory Efficient**: Cache TTL and queue size limits prevent memory leaks

## Usage Examples

### Get Single Ayah
```javascript
import { getAyahWithAudio } from '../utils/quran.js';

const ayah = await getAyahWithAudio(2, 255); // Al-Baqarah, Ayat al-Kursi
```

### Batch Processing
```javascript
import { getAyahsBatch } from '../utils/quran.js';

const ayahs = await getAyahsBatch([
  { surah: 1, ayah: 1 },
  { surah: 2, ayah: 255 },
  { surah: 112, ayah: 1 }
]);
```

### Check System Health
```bash
curl http://localhost:5000/monitoring/health
```

## Migration Notes

- All existing API calls now go through the rate-limited system
- Frontend should use backend proxy endpoints instead of direct API calls
- Cache automatically manages memory with TTL expiration
- No breaking changes to existing function signatures

## Testing

The system can be tested by:
1. Making multiple rapid API requests
2. Monitoring the `/monitoring/health` endpoint
3. Checking server logs for rate limiting messages
4. Verifying cache behavior with repeated requests

This implementation ensures reliable, efficient, and scalable access to the Al-Quran Cloud API while respecting their rate limits.