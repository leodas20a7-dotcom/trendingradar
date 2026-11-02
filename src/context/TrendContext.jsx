import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getISTDateParts } from '../utils/dateUtils.js';
import {
  postedStore,
  savedStore,
  dismissedStore,
  historyStore,
  settingsStore
} from '../utils/storageUtils.js';
import { fetchTrendingNews } from '../services/newsService.js';
import { fetchCelebrityBirthdays, getUpcomingCuratedBirthdays } from '../services/birthdayService.js';
import { getFestivalsForDate, getUpcomingFestivals } from '../services/festivalService.js';
import { fetchOnThisDayHistory } from '../services/historyService.js';
import { fetchRecordsAndAchievements } from '../services/sportsService.js';
import { sourceStatusTracker } from '../services/sourceStatusTracker.js';

const TrendContext = createContext(null);

export function TrendProvider({ children }) {
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all'); // 'all', 'tamilnadu', 'india', 'worldwide'
  const [filterVerification, setFilterVerification] = useState('all'); // 'all', 'verified', 'reported', 'unverified'
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPostedStatus, setFilterPostedStatus] = useState('all'); // 'all', 'unposted', 'posted'

  // Data Stores
  const [newsEvents, setNewsEvents] = useState([]);
  const [birthdayEvents, setBirthdayEvents] = useState([]);
  const [festivalEvents, setFestivalEvents] = useState([]);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [recordsEvents, setRecordsEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Tracker State (from LocalStorage)
  const [postedMap, setPostedMap] = useState(() => postedStore.getAll());
  const [savedMap, setSavedMap] = useState(() => savedStore.getAll());
  const [dismissedMap, setDismissedMap] = useState(() => dismissedStore.getAll());
  const [userSettings, setUserSettings] = useState(() => settingsStore.get());

  // Connection & Lifecycle State
  const [sources, setSources] = useState(() => sourceStatusTracker.getAll());
  const [overallStatus, setOverallStatus] = useState('pending');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const [istTimeParts, setIstTimeParts] = useState(() => getISTDateParts());

  // Live IST Clock (updates every second)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setIstTimeParts(getISTDateParts());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  /**
   * Main Fetcher: pulls and synchronizes all providers
   */
  const loadAllData = useCallback(async (isManualRefresh = false) => {
    setIsRefreshing(true);
    const nowParts = getISTDateParts();

    try {
      // 1. Fetch synchronous calendar items first
      const todayFestivals = getFestivalsForDate(new Date());
      setFestivalEvents(todayFestivals);

      // 2. Fetch upcoming occasions (festivals + curated birthdays)
      const upcomingFests = getUpcomingFestivals(30, new Date());
      const upcomingBdays = getUpcomingCuratedBirthdays(30, new Date());
      const combinedUpcoming = [...upcomingFests, ...upcomingBdays].sort((a, b) => {
        const dA = a.daysAway !== undefined ? a.daysAway : 99;
        const dB = b.daysAway !== undefined ? b.daysAway : 99;
        return dA - dB;
      });
      setUpcomingEvents(combinedUpcoming);

      // 3. Concurrently fetch asynchronous providers
      const [fetchedNews, fetchedBirthdays, fetchedHistory] = await Promise.all([
        fetchTrendingNews().catch(() => []),
        fetchCelebrityBirthdays(new Date()).catch(() => []),
        fetchOnThisDayHistory(new Date()).catch(() => [])
      ]);

      setNewsEvents(fetchedNews);
      setBirthdayEvents(fetchedBirthdays);
      setHistoryEvents(fetchedHistory);

      // 4. Derive records & achievements
      const allEventsPool = [...fetchedNews, ...fetchedHistory];
      const records = await fetchRecordsAndAchievements(allEventsPool);
      setRecordsEvents(records);

      // 5. Update history store with discovered signatures to prevent duplicates
      const newSignatures = allEventsPool.map(e => e.id);
      historyStore.recordSeen(newSignatures);

      setLastRefreshedAt(nowParts.formattedTime);
      setSources(sourceStatusTracker.getAll());
      setOverallStatus(sourceStatusTracker.getOverallStatus());
    } catch (err) {
      console.error('[TrendContext] Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial Data Load on mount
  useEffect(() => {
    loadAllData(false);
  }, [loadAllData]);

  // Automated Background Refresh based on settings
  useEffect(() => {
    const intervalMinutes = userSettings.newsRefreshIntervalMinutes || 15;
    const intervalMs = intervalMinutes * 60 * 1000;

    const refreshTimer = setInterval(() => {
      // Background silent refresh for news & sports
      fetchTrendingNews().then(news => {
        setNewsEvents(news);
        setSources(sourceStatusTracker.getAll());
        setOverallStatus(sourceStatusTracker.getOverallStatus());
      }).catch(err => console.warn('Background news refresh error:', err));
    }, intervalMs);

    return () => clearInterval(refreshTimer);
  }, [userSettings.newsRefreshIntervalMinutes]);

  // Trackers Action Handlers
  const handleMarkAsPosted = useCallback((id, metadata) => {
    postedStore.markAsPosted(id, metadata);
    setPostedMap(postedStore.getAll());
  }, []);

  const handleUndoPosted = useCallback((id) => {
    postedStore.undoPosted(id);
    setPostedMap(postedStore.getAll());
  }, []);

  const handleToggleSave = useCallback((event) => {
    if (!event || !event.id) return;
    savedStore.toggleSave(event.id, event);
    setSavedMap(savedStore.getAll());
  }, []);

  const handleDismiss = useCallback((id) => {
    dismissedStore.markDismissed(id);
    setDismissedMap(dismissedStore.getAll());
  }, []);

  const handleUndoDismiss = useCallback((id) => {
    dismissedStore.undoDismissed(id);
    setDismissedMap(dismissedStore.getAll());
  }, []);

  const handleUpdateSettings = useCallback((newSettings) => {
    settingsStore.set(newSettings);
    setUserSettings(settingsStore.get());
  }, []);

  // Universal filter utility function
  const applyGlobalFilters = useCallback((items = []) => {
    if (!Array.isArray(items)) return [];

    return items.filter(item => {
      if (!item) return false;

      // Ignore dismissed items
      if (dismissedMap[item.id]) return false;

      // Location Filter
      if (filterLocation !== 'all' && item.location !== filterLocation) {
        return false;
      }

      // Verification Filter
      if (filterVerification !== 'all' && item.verificationStatus !== filterVerification) {
        return false;
      }

      // Category Filter
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false;
      }

      // Posted Status Filter
      if (filterPostedStatus === 'posted' && !postedMap[item.id]) {
        return false;
      }
      if (filterPostedStatus === 'unposted' && postedMap[item.id]) {
        return false;
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const searchCorpus = (
          (item.title || '') + ' ' +
          (item.summary || '') + ' ' +
          (item.personOrTeam || '') + ' ' +
          (item.country || '') + ' ' +
          (item.category || '')
        ).toLowerCase();

        if (!searchCorpus.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [filterLocation, filterVerification, filterCategory, filterPostedStatus, searchQuery, dismissedMap, postedMap]);
  const allEvents = useMemo(() => {
    return [
      ...newsEvents,
      ...birthdayEvents,
      ...festivalEvents,
      ...historyEvents
    ];
  }, [newsEvents, birthdayEvents, festivalEvents, historyEvents]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const activeEvents = allEvents.filter(e => !dismissedMap[e.id]);
    const verifiedCount = activeEvents.filter(e => e.verificationStatus === 'verified').length;
    const postedCount = Object.keys(postedMap).length;
    const savedCount = Object.keys(savedMap).length;

    return {
      totalDiscovered: activeEvents.length,
      verifiedCount,
      reportedCount: activeEvents.filter(e => e.verificationStatus === 'reported').length,
      unverifiedCount: activeEvents.filter(e => e.verificationStatus === 'unverified').length,
      upcomingCount: upcomingEvents.length,
      postedCount,
      savedCount
    };
  }, [allEvents, dismissedMap, postedMap, savedMap, upcomingEvents]);

  const value = {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterLocation,
    setFilterLocation,
    filterVerification,
    setFilterVerification,
    filterCategory,
    setFilterCategory,
    filterPostedStatus,
    setFilterPostedStatus,

    // Data collections
    allEvents,
    newsEvents,
    birthdayEvents,
    festivalEvents,
    historyEvents,
    recordsEvents,
    upcomingEvents,

    // State maps
    postedMap,
    savedMap,
    dismissedMap,
    userSettings,

    // Actions
    markAsPosted: handleMarkAsPosted,
    undoPosted: handleUndoPosted,
    toggleSave: handleToggleSave,
    dismissEvent: handleDismiss,
    undoDismiss: handleUndoDismiss,
    updateSettings: handleUpdateSettings,
    refreshAll: () => loadAllData(true),
    applyGlobalFilters,

    // Status & Indicators
    sources,
    overallStatus,
    isRefreshing,
    lastRefreshedAt,
    istTimeParts,
    metrics
  };

  return (
    <TrendContext.Provider value={value}>
      {children}
    </TrendContext.Provider>
  );
}

export function useTrendRadar() {
  const context = useContext(TrendContext);
  if (!context) {
    throw new Error('useTrendRadar must be used within a TrendProvider');
  }
  return context;
}

