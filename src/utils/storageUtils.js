/**
 * LocalStorage Management Utility with Typed Stores, TTL Caching, and Capacity Safeguards
 */

const STORAGE_PREFIX = 'cm_trendradar_';

export const STORAGE_KEYS = {
  POSTED_EVENTS: `${STORAGE_PREFIX}posted_events`,
  SAVED_EVENTS: `${STORAGE_PREFIX}saved_events`,
  DISMISSED_EVENTS: `${STORAGE_PREFIX}dismissed_events`,
  API_CACHE: `${STORAGE_PREFIX}api_cache`,
  SEEN_HISTORY: `${STORAGE_PREFIX}seen_history`,
  USER_SETTINGS: `${STORAGE_PREFIX}user_settings`
};

const MAX_HISTORY_ITEMS = 500;
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours default TTL

/**
 * Safely parses JSON from localStorage
 */
function safeGet(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storageUtils] Error reading key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Safely writes JSON to localStorage with quota-exceeded recovery
 */
function safeSet(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storageUtils] Quota exceeded or write error for "${key}". Pruning cache...`, err);
    pruneOldCache();
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (retryErr) {
      console.error(`[storageUtils] Failed to write even after pruning:`, retryErr);
      return false;
    }
  }
}

/**
 * Posted Content Tracker
 */
export const postedStore = {
  getAll() {
    return safeGet(STORAGE_KEYS.POSTED_EVENTS, {});
  },
  isPosted(id) {
    if (!id) return false;
    const store = this.getAll();
    return Boolean(store[id]);
  },
  markAsPosted(id, metadata = {}) {
    if (!id) return;
    const store = this.getAll();
    store[id] = {
      postedAt: new Date().toISOString(),
      ...metadata
    };
    safeSet(STORAGE_KEYS.POSTED_EVENTS, store);
  },
  undoPosted(id) {
    if (!id) return;
    const store = this.getAll();
    delete store[id];
    safeSet(STORAGE_KEYS.POSTED_EVENTS, store);
  }
};

/**
 * Saved Content Tracker
 */
export const savedStore = {
  getAll() {
    return safeGet(STORAGE_KEYS.SAVED_EVENTS, {});
  },
  isSaved(id) {
    if (!id) return false;
    const store = this.getAll();
    return Boolean(store[id]);
  },
  toggleSave(id, eventData = {}) {
    if (!id) return false;
    const store = this.getAll();
    let isNowSaved = false;
    if (store[id]) {
      delete store[id];
      isNowSaved = false;
    } else {
      store[id] = {
        savedAt: new Date().toISOString(),
        event: eventData
      };
      isNowSaved = true;
    }
    safeSet(STORAGE_KEYS.SAVED_EVENTS, store);
    return isNowSaved;
  },
  remove(id) {
    if (!id) return;
    const store = this.getAll();
    delete store[id];
    safeSet(STORAGE_KEYS.SAVED_EVENTS, store);
  }
};

/**
 * Dismissed / Not Relevant Store
 */
export const dismissedStore = {
  getAll() {
    return safeGet(STORAGE_KEYS.DISMISSED_EVENTS, {});
  },
  isDismissed(id) {
    if (!id) return false;
    const store = this.getAll();
    return Boolean(store[id]);
  },
  markDismissed(id) {
    if (!id) return;
    const store = this.getAll();
    store[id] = { dismissedAt: new Date().toISOString() };
    safeSet(STORAGE_KEYS.DISMISSED_EVENTS, store);
  },
  undoDismissed(id) {
    if (!id) return;
    const store = this.getAll();
    delete store[id];
    safeSet(STORAGE_KEYS.DISMISSED_EVENTS, store);
  }
};

/**
 * API Cache Store with TTL
 */
export const apiCacheStore = {
  get(endpointKey) {
    const cache = safeGet(STORAGE_KEYS.API_CACHE, {});
    const item = cache[endpointKey];
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > (item.ttlMs || MAX_CACHE_AGE_MS)) {
      // Expired
      delete cache[endpointKey];
      safeSet(STORAGE_KEYS.API_CACHE, cache);
      return null;
    }
    return item.data;
  },
  set(endpointKey, data, ttlMs = MAX_CACHE_AGE_MS) {
    const cache = safeGet(STORAGE_KEYS.API_CACHE, {});
    cache[endpointKey] = {
      timestamp: Date.now(),
      ttlMs,
      data
    };
    safeSet(STORAGE_KEYS.API_CACHE, cache);
  },
  clear() {
    safeSet(STORAGE_KEYS.API_CACHE, {});
  }
};

/**
 * Prunes expired or oldest cache entries
 */
export function pruneOldCache() {
  const cache = safeGet(STORAGE_KEYS.API_CACHE, {});
  const now = Date.now();
  let keys = Object.keys(cache);

  // Remove already expired
  for (const k of keys) {
    if (now - cache[k].timestamp > (cache[k].ttlMs || MAX_CACHE_AGE_MS)) {
      delete cache[k];
    }
  }

  // If still more than 20 entries, keep only the newest 10
  keys = Object.keys(cache);
  if (keys.length > 20) {
    keys.sort((a, b) => cache[b].timestamp - cache[a].timestamp);
    const trimmed = {};
    keys.slice(0, 10).forEach(k => {
      trimmed[k] = cache[k];
    });
    safeSet(STORAGE_KEYS.API_CACHE, trimmed);
    return;
  }

  safeSet(STORAGE_KEYS.API_CACHE, cache);
}

/**
 * Previously Discovered Events History Store (bounded LRU to prevent duplicates across refreshes)
 */
export const historyStore = {
  getAll() {
    return safeGet(STORAGE_KEYS.SEEN_HISTORY, []);
  },
  hasSeen(signature) {
    if (!signature) return false;
    const list = this.getAll();
    return list.includes(signature);
  },
  recordSeen(signatures) {
    if (!signatures || !signatures.length) return;
    let list = this.getAll();
    const set = new Set(list);
    for (const sig of signatures) {
      if (sig) set.add(sig);
    }
    list = Array.from(set);
    // Keep within capacity limits
    if (list.length > MAX_HISTORY_ITEMS) {
      list = list.slice(list.length - MAX_HISTORY_ITEMS);
    }
    safeSet(STORAGE_KEYS.SEEN_HISTORY, list);
  }
};

/**
 * User Settings Store
 */
export const settingsStore = {
  get() {
    return safeGet(STORAGE_KEYS.USER_SETTINGS, {
      newsRefreshIntervalMinutes: 15,
      sportsRefreshIntervalMinutes: 15,
      defaultLocation: 'all', // 'all', 'tamilnadu', 'india', 'worldwide'
      theme: 'light'
    });
  },
  set(settings) {
    const current = this.get();
    safeSet(STORAGE_KEYS.USER_SETTINGS, { ...current, ...settings });
  }
};

