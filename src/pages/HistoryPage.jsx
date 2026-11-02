import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { History, Calendar, Filter } from 'lucide-react';

export default function HistoryPage() {
  const { historyEvents, searchQuery } = useTrendRadar();

  const [eraFilter, setEraFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const eras = [
    { id: 'all', label: 'All Eras' },
    { id: '21st', label: '21st Century (2000–Present)' },
    { id: '20th_late', label: 'Late 20th Cent. (1950–1999)' },
    { id: '20th_early', label: 'Early 20th Cent. (1900–1949)' },
    { id: 'pre_1900', label: 'Pre-1900 Historic' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Sports', label: 'Sports & Cricket History' },
    { id: 'Space', label: 'Space & Exploration' },
    { id: 'Science', label: 'Science & Breakthroughs' },
    { id: 'Historical Events', label: 'National & Global History' }
  ];

  const filteredHistory = historyEvents.filter(item => {
    const year = parseInt(item.originalYear, 10);

    if (eraFilter === '21st' && year < 2000) return false;
    if (eraFilter === '20th_late' && (year < 1950 || year >= 2000)) return false;
    if (eraFilter === '20th_early' && (year < 1900 || year >= 1950)) return false;
    if (eraFilter === 'pre_1900' && year >= 1900) return false;

    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (item.title || '').toLowerCase().includes(q) ||
                    (item.summary || '').toLowerCase().includes(q) ||
                    String(item.originalYear).includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Historical Era & Category Toolbar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Era Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <History size={14} color="var(--cm-purple)" />
            <span>Era:</span>
          </div>
          {eras.map(era => (
            <button
              key={era.id}
              onClick={() => setEraFilter(era.id)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: eraFilter === era.id ? 'var(--cm-purple)' : 'var(--bg-subtle)',
                color: eraFilter === era.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${eraFilter === era.id ? 'var(--cm-purple)' : 'var(--border-light)'}`
              }}
            >
              {era.label}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Theme:
          </div>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.725rem',
                fontWeight: 600,
                background: categoryFilter === cat.id ? 'var(--cm-navy)' : 'transparent',
                color: categoryFilter === cat.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${categoryFilter === cat.id ? 'var(--cm-navy)' : 'var(--border-subtle)'}`
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Showing {filteredHistory.length} historical anniversaries for today</span>
        <span style={{ fontSize: '0.75rem' }}>Source: Wikipedia On This Day Archive</span>
      </div>

      {/* Grid of History Cards */}
      {filteredHistory.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
          <History size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No historical events found for current filter.</p>
          <p style={{ fontSize: '0.8125rem' }}>Select "All Eras" to view full calendar archive.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredHistory.map(item => <EventCard key={item.id} event={item} />)}
        </div>
      )}
    </div>
  );
}

