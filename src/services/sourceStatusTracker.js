/**
 * Source Status Tracker
 * Tracks connection health, response latency, and error states across all public data providers
 */

const sourceRegistry = {
  wikipedia_history: {
    id: 'wikipedia_history',
    name: 'Wikipedia On This Day API',
    type: 'REST API',
    status: 'pending', // 'online' | 'degraded' | 'unavailable' | 'cached' | 'pending'
    lastChecked: null,
    latencyMs: null,
    error: null,
    itemsDiscovered: 0
  },
  wikidata_sparql: {
    id: 'wikidata_sparql',
    name: 'Wikidata SPARQL Endpoint',
    type: 'SPARQL',
    status: 'pending',
    lastChecked: null,
    latencyMs: null,
    error: null,
    itemsDiscovered: 0
  },
  rss_thehindu: {
    id: 'rss_thehindu',
    name: 'The Hindu National Feed',
    type: 'RSS Feed',
    status: 'pending',
    lastChecked: null,
    latencyMs: null,
    error: null,
    itemsDiscovered: 0
  },
  rss_espncricinfo: {
    id: 'rss_espncricinfo',
    name: 'ESPNcricinfo Sports Feed',
    type: 'RSS Feed',
    status: 'pending',
    lastChecked: null,
    latencyMs: null,
    error: null,
    itemsDiscovered: 0
  },
  rss_bbc: {
    id: 'rss_bbc',
    name: 'BBC World & Tech Feed',
    type: 'RSS Feed',
    status: 'pending',
    lastChecked: null,
    latencyMs: null,
    error: null,
    itemsDiscovered: 0
  },
  calendar_festivals: {
    id: 'calendar_festivals',
    name: 'India & UN Observances Calendar',
    type: 'Calendar Engine',
    status: 'online',
    lastChecked: new Date().toISOString(),
    latencyMs: 1,
    error: null,
    itemsDiscovered: 0
  }
};

export const sourceStatusTracker = {
  getAll() {
    return { ...sourceRegistry };
  },

  update(sourceId, updates) {
    if (sourceRegistry[sourceId]) {
      sourceRegistry[sourceId] = {
        ...sourceRegistry[sourceId],
        ...updates,
        lastChecked: updates.lastChecked || new Date().toISOString()
      };
    }
  },

  getOverallStatus() {
    const list = Object.values(sourceRegistry);
    const onlineCount = list.filter(s => s.status === 'online').length;
    const unavailableCount = list.filter(s => s.status === 'unavailable').length;

    if (unavailableCount === 0 && onlineCount > 0) return 'healthy';
    if (onlineCount > 0 && unavailableCount > 0) return 'partial';
    return 'degraded';
  }
};

