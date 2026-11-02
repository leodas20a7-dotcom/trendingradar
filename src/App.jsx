import React, { useState } from 'react';
import { TrendProvider, useTrendRadar } from './context/TrendContext.jsx';
import GamingCard from './components/common/GamingCard.jsx';
import EventDetailModal from './components/common/EventDetailModal.jsx';
import { exportToCSV, exportToPDF } from './utils/exportUtils.js';
import {
  Sparkles,
  Search,
  FileSpreadsheet,
  Printer,
  Calendar,
  Clock,
  Cake,
  Trophy,
  CalendarDays,
  Flame,
  History,
  CalendarClock,
  ArrowDownCircle,
  RefreshCw,
  Star,
  Music,
  Film,
  BookOpen,
  Award,
  Atom
} from 'lucide-react';

function SimpleCleanTrendRadar() {
  const {
    allEvents,
    newsEvents,
    birthdayEvents,
    festivalEvents,
    recordsEvents,
    historyEvents,
    upcomingEvents,
    tamilLegends,
    postedMap,
    markAsPosted,
    undoPosted,
    savedMap,
    toggleSave,
    istTimeParts,
    isRefreshing,
    refreshAll
  } = useTrendRadar();

  const [hasStarted, setHasStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTamilRole, setSelectedTamilRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  // Main Category Configurations
  const categories = [
    { id: 'all', label: 'All Highlights', icon: Sparkles, count: allEvents.length },
    { id: 'tamil', label: '🌟 Tamil Nadu Legends', icon: Star, count: tamilLegends.length, highlight: true },
    { id: 'celebrities', label: 'Celebrities', icon: Cake, count: birthdayEvents.length },
    { id: 'records', label: 'Records', icon: Trophy, count: recordsEvents.length },
    { id: 'festivals', label: 'Festivals', icon: CalendarDays, count: festivalEvents.length },
    { id: 'news', label: 'Trending News', icon: Flame, count: newsEvents.length },
    { id: 'history', label: 'On This Day', icon: History, count: historyEvents.length },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarClock, count: upcomingEvents.length }
  ];

  // Tamil Nadu Role Filters
  const tamilRoles = [
    { id: 'all', label: 'All Tamil Legends' },
    { id: 'Poets & Writers', label: 'Poets & Writers (புலவர்கள்)' },
    { id: 'Singers & Musicians', label: 'Singers & Music (பாடகர்/இசை)' },
    { id: 'Actors & Filmmakers', label: 'Actors & Cinema (நடிகர்கள்)' },
    { id: 'Statesmen & Reformers', label: 'Leaders & Reformers (தலைவர்கள்)' },
    { id: 'Scientists & Visionaries', label: 'Scientists (விஞ்ஞானிகள்)' }
  ];

  // Resolve events list based on category
  const getCategoryEvents = () => {
    switch (selectedCategory) {
      case 'tamil':
        if (selectedTamilRole === 'all') return tamilLegends;
        return tamilLegends.filter(l => l.subRole === selectedTamilRole);
      case 'celebrities':
        return birthdayEvents;
      case 'records':
        return recordsEvents;
      case 'festivals':
        return festivalEvents;
      case 'news':
        return newsEvents;
      case 'history':
        return historyEvents;
      case 'upcoming':
        return upcomingEvents;
      case 'all':
      default:
        return [
          ...festivalEvents,
          ...recordsEvents,
          ...birthdayEvents.slice(0, 10),
          ...newsEvents.slice(0, 8),
          ...tamilLegends.slice(0, 8)
        ];
    }
  };

  const rawList = getCategoryEvents();

  // Filter with search
  const filteredEvents = rawList.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    const searchCorpus = (
      (item.title || '') + ' ' +
      (item.summary || '') + ' ' +
      (item.personOrTeam || '') + ' ' +
      (item.country || '') + ' ' +
      (item.tamilTitle || '')
    ).toLowerCase();
    return searchCorpus.includes(q);
  });

  const handleTogglePosted = (id) => {
    if (postedMap[id]) {
      undoPosted(id);
    } else {
      markAsPosted(id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      {/* Top Header */}
      <header className="no-print" style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--cm-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            TR
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--cm-navy)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              ConvenioMart TrendRadar
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
              Marketing Content Discovery Desk
            </p>
          </div>
        </div>

        {/* Center: Live IST Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: '#F1F5F9',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.785rem',
          color: '#334155'
        }}>
          <Calendar size={13} color="var(--cm-purple)" />
          <span style={{ fontWeight: 600 }}>{istTimeParts.formattedShortDate}</span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Clock size={13} color="var(--cm-purple)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{istTimeParts.timeString} IST</span>
        </div>

        {/* Right: Export Excel & PDF Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => exportToCSV(allEvents)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0',
              transition: 'all 0.15s ease'
            }}
            title="Download all events as Excel CSV spreadsheet"
          >
            <FileSpreadsheet size={14} />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={exportToPDF}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#F1F5F9',
              color: '#334155',
              border: '1px solid #E2E8F0',
              transition: 'all 0.15s ease'
            }}
            title="Print or save as PDF"
          >
            <Printer size={14} />
            <span>PDF Print</span>
          </button>

          <button
            onClick={refreshAll}
            disabled={isRefreshing}
            style={{
              padding: '0.4rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: 'var(--cm-navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Refresh latest news and archives"
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-anim' : ''} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: '1 1 0%', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Step 1: Initial State (Single Button Prompt) */}
        {!hasStarted ? (
          <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--cm-purple) 0%, var(--cm-navy) 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -5px rgba(108, 34, 166, 0.4)',
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={32} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cm-navy)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              ConvenioMart TrendRadar
            </h2>

            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '520px', marginBottom: '2rem', lineHeight: 1.5 }}>
              Track Tamil Nadu legends (poets, singers, actors), world celebrity birthdays, records broken, and festivals.
            </p>

            {/* The Big Clean Button */}
            <button
              onClick={() => setHasStarted(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--cm-purple)',
                color: '#FFFFFF',
                padding: '0.9rem 2.2rem',
                borderRadius: '9999px',
                fontSize: '1.05rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(108, 34, 166, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 34, 166, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(108, 34, 166, 0.35)';
              }}
            >
              <Sparkles size={20} />
              <span>Check Today's Events</span>
              <ArrowDownCircle size={20} />
            </button>
          </div>
        ) : (
          /* Step 2: Clean Category Selection & Gaming Cards Display */
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            {/* Category Option Pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {/* Category Options Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map(c => {
                  const Icon = c.icon;
                  const isActive = selectedCategory === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        if (c.id !== 'tamil') setSelectedTamilRole('all');
                      }}
                      className={`category-pill ${isActive ? 'active' : ''}`}
                      style={{
                        borderColor: c.highlight && !isActive ? '#DDD6FE' : undefined,
                        background: c.highlight && !isActive ? '#F5F3FF' : undefined,
                        color: c.highlight && !isActive ? 'var(--cm-purple)' : undefined
                      }}
                    >
                      <Icon size={15} color={isActive ? '#FFFFFF' : 'var(--cm-purple)'} />
                      <span>{c.label}</span>
                      {c.count > 0 && (
                        <span style={{
                          fontSize: '0.7rem',
                          background: isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                          color: isActive ? '#fff' : '#64748B',
                          padding: '0.05rem 0.4rem',
                          borderRadius: '9999px',
                          fontWeight: 700
                        }}>
                          {c.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Search Field */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tamil poet, actor, record..."
                  style={{
                    width: '100%',
                    padding: '0.45rem 1rem 0.45rem 2.2rem',
                    borderRadius: '9999px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    outline: 'none',
                    fontSize: '0.8125rem'
                  }}
                />
              </div>
            </div>

            {/* Sub-heading for Tamil Nadu Legends */}
            {selectedCategory === 'tamil' && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Star size={17} color="#F59E0B" fill="#F59E0B" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
                      Tamil Nadu Legends Directory (தமிழ்நாடு சாதனையாளர்கள்)
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Curated authentic registry: Poets, Singers, Cinema Icons, Leaders & Scientists
                  </span>
                </div>

                {/* Role Filter Chips */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {tamilRoles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedTamilRole(r.id)}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: selectedTamilRole === r.id ? 'var(--cm-purple)' : '#F1F5F9',
                        color: selectedTamilRole === r.id ? '#FFFFFF' : '#475569',
                        border: `1px solid ${selectedTamilRole === r.id ? 'var(--cm-purple)' : '#E2E8F0'}`,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Counter Sub-header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              fontSize: '0.8125rem',
              color: '#64748B'
            }}>
              <span>
                Showing <strong>{filteredEvents.length}</strong> events — Tap any card to open 1-line details & copy options
              </span>
            </div>

            {/* Gaming Card Style Grid */}
            {filteredEvents.length === 0 ? (
              <div style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px dashed #CBD5E1',
                color: '#64748B'
              }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--cm-navy)' }}>No events found</p>
                <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>Try clearing the search or switching categories.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1rem'
              }}>
                {filteredEvents.map(event => (
                  <GamingCard
                    key={event.id}
                    event={event}
                    isPosted={Boolean(postedMap[event.id])}
                    isSaved={Boolean(savedMap[event.id])}
                    onClick={() => setActiveModalEvent(event)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Detailing Content Overlay Popup Window */}
      {activeModalEvent && (
        <EventDetailModal
          event={activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
          isPosted={Boolean(postedMap[activeModalEvent.id])}
          onTogglePosted={handleTogglePosted}
          isSaved={Boolean(savedMap[activeModalEvent.id])}
          onToggleSave={() => toggleSave(activeModalEvent)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TrendProvider>
      <SimpleCleanTrendRadar />
    </TrendProvider>
  );
}
