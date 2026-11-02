import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { Flame, Filter, Radio } from 'lucide-react';

export default function NewsPage() {
  const { newsEvents, searchQuery } = useTrendRadar();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [publisherFilter, setPublisherFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'National', label: 'National (India)' },
    { id: 'Sports', label: 'Sports & Cricket' },
    { id: 'Technology', label: 'Technology & AI' },
    { id: 'Space', label: 'Space & ISRO/NASA' },
    { id: 'Business', label: 'Business & Economy' },
    { id: 'Entertainment', label: 'Cinema & Arts' },
    { id: 'International', label: 'World News' }
  ];

  const publishers = ['all', 'The Hindu', 'ESPNcricinfo', 'BBC News'];

  const filteredNews = newsEvents.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (publisherFilter !== 'all') {
      const matchPub = (item.sources || []).some(s => s.publisher === publisherFilter);
      if (!matchPub) return false;
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
      {/* Category Toolbar */}
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
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <Flame size={14} color="#EA580C" />
            <span>Category:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: categoryFilter === cat.id ? 'var(--cm-purple)' : 'var(--bg-subtle)',
                color: categoryFilter === cat.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${categoryFilter === cat.id ? 'var(--cm-purple)' : 'var(--border-light)'}`
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Publisher Filter Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Verified Publisher:
          </div>
          {publishers.map(pub => (
            <button
              key={pub}
              onClick={() => setPublisherFilter(pub)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.725rem',
                fontWeight: 600,
                background: publisherFilter === pub ? 'var(--cm-navy)' : 'transparent',
                color: publisherFilter === pub ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${publisherFilter === pub ? 'var(--cm-navy)' : 'var(--border-subtle)'}`
              }}
            >
              {pub === 'all' ? 'All Trusted Publishers' : pub}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Showing {filteredNews.length} verified news articles (Deduplicated with cross-source clustering)</span>
      </div>

      {/* Grid of News Cards */}
      {filteredNews.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
          <Flame size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No articles found for selected category.</p>
          <p style={{ fontSize: '0.8125rem' }}>Select "All News" to view latest developments.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredNews.map(item => <EventCard key={item.id} event={item} />)}
        </div>
      )}
    </div>
  );
}

