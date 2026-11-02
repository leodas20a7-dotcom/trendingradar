import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { CalendarDays, CalendarClock, Globe, MapPin, Flag } from 'lucide-react';

export default function FestivalsPage() {
  const { festivalEvents, upcomingEvents, searchQuery } = useTrendRadar();

  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'upcoming'
  const [regionFilter, setRegionFilter] = useState('all');

  const upcomingFestivalsOnly = upcomingEvents.filter(e => e.category === 'Festivals & Special Days');

  const currentList = activeTab === 'today' ? festivalEvents : upcomingFestivalsOnly;

  const filteredList = currentList.filter(item => {
    if (regionFilter !== 'all' && item.location !== regionFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (item.title || '').toLowerCase().includes(q) ||
                    (item.summary || '').toLowerCase().includes(q) ||
                    (item.country || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tab Switcher & Filter Toolbar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Today vs Upcoming Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('today')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: activeTab === 'today' ? 'var(--cm-purple)' : 'var(--bg-subtle)',
              color: activeTab === 'today' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'today' ? 'var(--cm-purple)' : 'var(--border-light)'}`
            }}
          >
            <CalendarDays size={15} />
            <span>Today's Observances ({festivalEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: activeTab === 'upcoming' ? 'var(--cm-purple)' : 'var(--bg-subtle)',
              color: activeTab === 'upcoming' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === 'upcoming' ? 'var(--cm-purple)' : 'var(--border-light)'}`
            }}
          >
            <CalendarClock size={15} />
            <span>Upcoming Festivals Calendar ({upcomingFestivalsOnly.length})</span>
          </button>
        </div>

        {/* Region Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Region:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'tamilnadu', label: 'Tamil Nadu' },
            { id: 'india', label: 'India' },
            { id: 'worldwide', label: 'UN & Global' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setRegionFilter(r.id)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.725rem',
                fontWeight: 600,
                background: regionFilter === r.id ? 'var(--cm-navy)' : 'var(--bg-subtle)',
                color: regionFilter === r.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Festival Cards */}
      {filteredList.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
          <CalendarDays size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No festivals found for selected filter.</p>
          <p style={{ fontSize: '0.8125rem' }}>Switch to "Upcoming Festivals Calendar" to review occasions in the coming days.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredList.map(item => <EventCard key={item.id} event={item} />)}
        </div>
      )}
    </div>
  );
}

