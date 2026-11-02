/**
 * Resilient API Client with Timeout, Cache-First TTL, Vercel Serverless Proxy, and CORS Fallbacks
 */

import { apiCacheStore } from '../utils/storageUtils.js';

const DEFAULT_TIMEOUT_MS = 9000;

// Free public CORS proxies for browser environments as backup
const CORS_PROXIES = [
  (url) => `/api/proxy?url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`
];

/**
 * Universal safe fetch
 */
export async function safeFetch(url, options = {}) {
  const {
    cacheKey,
    ttlMs,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers = {},
    enableCorsProxyFallback = true,
    responseType = 'json' // 'json' | 'text'
  } = options;

  // 1. Check local storage cache
  if (cacheKey) {
    const cached = apiCacheStore.get(cacheKey);
    if (cached) {
      return { data: cached, fromCache: true, error: null };
    }
  }

  // Filter out forbidden browser headers like 'User-Agent' in browser context
  const safeHeaders = {
    'Accept': responseType === 'json' ? 'application/json' : 'application/xml, text/xml, */*'
  };

  if (typeof window === 'undefined') {
    // In Node.js environment only
    if (headers['User-Agent']) {
      safeHeaders['User-Agent'] = headers['User-Agent'];
    }
  }

  const attemptFetch = async (targetUrl) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(targetUrl, {
        headers: safeHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      let parsedData;
      if (responseType === 'json') {
        try {
          parsedData = JSON.parse(text);
        } catch {
          throw new Error('Invalid JSON response');
        }
      } else {
        parsedData = text;
      }

      return { data: parsedData, error: null };
    } catch (err) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      return {
        data: null,
        error: isTimeout ? `Request timed out after ${timeoutMs}ms` : err.message
      };
    }
  };

  // 2. Direct fetch attempt
  let result = await attemptFetch(url);

  // 3. If direct fetch fails (e.g. CORS block in browser), try proxy fallbacks
  if (result.error && enableCorsProxyFallback) {
    for (const makeProxyUrl of CORS_PROXIES) {
      try {
        const proxyUrl = makeProxyUrl(url);
        result = await attemptFetch(proxyUrl);
        if (!result.error && result.data) {
          break;
        }
      } catch {
        // try next
      }
    }
  }

  // 4. Cache if successful
  if (cacheKey && result.data && !result.error) {
    apiCacheStore.set(cacheKey, result.data, ttlMs);
  }

  return { ...result, fromCache: false };
}
