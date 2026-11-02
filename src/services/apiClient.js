/**
 * Resilient API Client with Timeout, Cache-First TTL, CORS Fallbacks, and Source Health Tracking
 */

import { apiCacheStore } from '../utils/storageUtils.js';

const DEFAULT_TIMEOUT_MS = 8000;

// Free public CORS proxies for browser environments when direct RSS/APIs are restricted
const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`
];

/**
 * Universal fetch with timeout, cache, and optional CORS proxy failover
 */
export async function safeFetch(url, options = {}) {
  const {
    cacheKey,
    ttlMs,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers = {},
    enableCorsProxyFallback = false,
    responseType = 'json' // 'json' | 'text'
  } = options;

  // 1. Check local storage cache if cacheKey provided
  if (cacheKey) {
    const cached = apiCacheStore.get(cacheKey);
    if (cached) {
      return { data: cached, fromCache: true, error: null };
    }
  }

  const defaultHeaders = {
    'Accept': responseType === 'json' ? 'application/json' : 'application/xml, text/xml, */*',
    ...headers
  };

  const attemptFetch = async (targetUrl) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(targetUrl, {
        headers: defaultHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = responseType === 'json' ? await response.json() : await response.text();
      return { data, error: null };
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

  // 3. Fallback via CORS proxy if direct failed and proxy is enabled (useful for browser RSS)
  if (result.error && enableCorsProxyFallback) {
    for (const makeProxyUrl of CORS_PROXIES) {
      try {
        const proxyUrl = makeProxyUrl(url);
        result = await attemptFetch(proxyUrl);
        if (!result.error && result.data) {
          break; // Successfully retrieved via proxy
        }
      } catch {
        // Continue to next proxy
      }
    }
  }

  // 4. If successful, cache the result
  if (cacheKey && result.data && !result.error) {
    apiCacheStore.set(cacheKey, result.data, ttlMs);
  }

  return { ...result, fromCache: false };
}

