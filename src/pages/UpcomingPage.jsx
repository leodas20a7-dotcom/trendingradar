import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { CalendarClock, Filter, Calendar, Cake, Sparkles } from 'lucide-react';

export default function UpcomingPage() {
  const { upcomingEvents, searchQuery } = useTrendRadar();

  const [windowFilter, setWindowFilter] = useState(7); // 7, 15, 30 days
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'festivals', 'birthdays'

  const filteredUpcoming = upcomingEvents.filter(item => {
    const daysAway = item.daysAway !== undefined ? item.daysAway : 99;
    if (daysAway > windowFilter) return false;

    if (typeFilter === 'festivals' && item.category !== 'Festivals & Special Days') return false;
    if (typeFilter === 'birthdays' && item.category !== 'Celebrity Birthdays') return false;

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
      {/* Projection Time Horizon Selector */}
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
        {/* Days Window Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <CalendarClock size={15} color="var(--cm-purple)" />
            <span>Horizon:</span>
          </div>
          {[
            { days: 7, label: 'Next 7 Days (Immediate)' },
            { days: 15, label: 'Next 15 Days (Mid-Range)' },
            { days: 30, label: 'Next 30 Days (Full Month)' }
          ].map(w => (
            <button
              key={w.days}
              onClick={() => setWindowFilter(w.days)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.785rem',
                fontWeight: 600,
                background: windowFilter === w.days ? 'var(--cm-purple)' : 'var(--bg-subtle)',
                color: windowFilter === w.days ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${windowFilter === w.days ? 'var(--cm-purple)' : 'var(--border-light)'}`
              }}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Occasions' },
            { id: 'festivals', label: 'Festivals & Observances' },
            { id: 'birthdays', label: 'Celebrity Birthdays' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.725rem',
                fontWeight: 600,
                background: typeFilter === t.id ? 'var(--cm-navy)' : 'transparent',
                color: typeFilter === t.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${typeFilter === t.id ? 'var(--cm-navy)' : 'var(--border-subtle)'}`
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Showing {filteredUpcoming.length} upcoming occasions in the next {windowFilter} days</span>
        <span style={{ fontSize: '0.75rem' }}>Organized for social media marketing advance planning</span>
      </div>

      {/* Grid of Upcoming Event Cards */}
      {filteredUpcoming.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
          <CalendarClock size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No occasions found within selected horizon.</p>
          <p style={{ fontSize: '0.8125rem' }}>Select "Next 30 Days" to expand the planning horizon.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredUpcoming.map(item => <EventCard key={item.id} event={item} />)}
        </div>
      )}
    </div>
  );
}

