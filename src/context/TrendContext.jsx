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
import { TAMIL_LEGENDS_DATABASE, formatTamilLegendEvent } from '../services/tamilNaduLegendsService.js';

const TrendContext = createContext(null);

export function TrendProvider({ children }) {
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPostedStatus, setFilterPostedStatus] = useState('all');

  // Data Stores
  const [newsEvents, setNewsEvents] = useState([]);
  const [birthdayEvents, setBirthdayEvents] = useState([]);
  const [festivalEvents, setFestivalEvents] = useState([]);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [recordsEvents, setRecordsEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [tamilLegends, setTamilLegends] = useState([]);

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
      // 1. Instant sync items: Festivals & Tamil Nadu Legends
      const todayFestivals = getFestivalsForDate(new Date());
      setFestivalEvents(todayFestivals);

      const allTamilLegendsFormatted = TAMIL_LEGENDS_DATABASE.map(l => formatTamilLegendEvent(l));
      setTamilLegends(allTamilLegendsFormatted);

      // 2. Fetch upcoming occasions (festivals + curated birthdays)
      const upcomingFests = getUpcomingFestivals(30, new Date());
      const upcomingBdays = getUpcomingCuratedBirthdays(30, new Date());
      const combinedUpcoming = [...upcomingFests, ...upcomingBdays].sort((a, b) => {
        const dA = a.daysAway !== undefined ? a.daysAway : 99;
        const dB = b.daysAway !== undefined ? b.daysAway : 99;
        return dA - dB;
      });
      setUpcomingEvents(combinedUpcoming);

      // 3. Fetch asynchronous providers with guaranteed resilient fallbacks
      const [fetchedNews, fetchedBirthdays, fetchedHistory, fetchedRecords] = await Promise.all([
        fetchTrendingNews().catch(() => []),
        fetchCelebrityBirthdays(new Date()).catch(() => []),
        fetchOnThisDayHistory(new Date()).catch(() => []),
        fetchRecordsAndAchievements().catch(() => [])
      ]);

      setNewsEvents(fetchedNews);
      setBirthdayEvents(fetchedBirthdays);
      setHistoryEvents(fetchedHistory);
      setRecordsEvents(fetchedRecords);

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

  // Aggregate all unique non-dismissed events
  const allEvents = useMemo(() => {
    return [
      ...recordsEvents,
      ...birthdayEvents,
      ...festivalEvents,
      ...newsEvents,
      ...historyEvents
    ];
  }, [recordsEvents, birthdayEvents, festivalEvents, newsEvents, historyEvents]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const activeEvents = allEvents.filter(e => !dismissedMap[e.id]);
    const verifiedCount = activeEvents.filter(e => e.verificationStatus === 'verified').length;
    const postedCount = Object.keys(postedMap || {}).length;
    const savedCount = Object.keys(savedMap || {}).length;

    return {
      totalDiscovered: activeEvents.length,
      verifiedCount,
      reportedCount: activeEvents.filter(e => e.verificationStatus === 'reported').length,
      unverifiedCount: activeEvents.filter(e => e.verificationStatus === 'unverified').length,
      upcomingCount: upcomingEvents.length,
      tamilCount: tamilLegends.length,
      postedCount,
      savedCount
    };
  }, [allEvents, dismissedMap, postedMap, savedMap, upcomingEvents, tamilLegends]);

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
    tamilLegends,

    // State maps
    postedMap: postedMap || {},
    savedMap: savedMap || {},
    dismissedMap: dismissedMap || {},
    userSettings,

    // Actions
    markAsPosted: handleMarkAsPosted,
    undoPosted: handleUndoPosted,
    toggleSave: handleToggleSave,
    dismissEvent: handleDismiss,
    undoDismiss: handleUndoDismiss,
    updateSettings: handleUpdateSettings,
    refreshAll: () => loadAllData(true),

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
