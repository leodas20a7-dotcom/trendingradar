import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { Trophy, Filter, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function RecordsPage() {
  const { recordsEvents, searchQuery } = useTrendRadar();

  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Records' },
    { id: 'Cricket Record', label: 'Cricket Records' },
    { id: 'Olympic Achievement', label: 'Olympic & Athletics' },
    { id: 'Football Record', label: 'Football Records' },
    { id: 'Space Achievement', label: 'Space Breakthroughs' },
    { id: 'Scientific Breakthrough', label: 'Science Milestones' },
    { id: 'Technology Milestone', label: 'Technology Breakthroughs' }
  ];

  const filteredRecords = recordsEvents.filter(r => {
    if (subCategoryFilter !== 'all' && r.achievementSubCategory !== subCategoryFilter) {
      return false;
    }
    if (verificationFilter !== 'all' && r.verificationStatus !== verificationFilter) {
      return false;
    }
    if (locationFilter !== 'all' && r.location !== locationFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (r.title || '').toLowerCase().includes(q) ||
                    (r.summary || '').toLowerCase().includes(q) ||
                    (r.personOrTeam || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category and Status Filter Toolbar */}
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
        {/* Sub-Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <Trophy size={14} color="var(--cm-purple)" />
            <span>Domain:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSubCategoryFilter(cat.id)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: subCategoryFilter === cat.id ? 'var(--cm-purple)' : 'var(--bg-subtle)',
                color: subCategoryFilter === cat.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${subCategoryFilter === cat.id ? 'var(--cm-purple)' : 'var(--border-light)'}`
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Second Row: Verification Status & Location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Verification:
            </span>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'verified', label: 'Officially Confirmed', color: 'var(--status-verified)' },
              { id: 'reported', label: 'Reported Achievement', color: 'var(--status-reported)' },
              { id: 'unverified', label: 'Unverified Claim', color: 'var(--status-unverified)' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setVerificationFilter(st.id)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: verificationFilter === st.id ? 'var(--bg-active)' : 'transparent',
                  color: st.color || 'var(--text-secondary)',
                  border: `1px solid ${verificationFilter === st.id ? 'var(--border-subtle)' : 'transparent'}`
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Location Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Region:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'india', label: 'India' },
              { id: 'worldwide', label: 'Worldwide' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setLocationFilter(loc.id)}
                style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: locationFilter === loc.id ? 'var(--cm-navy)' : 'var(--bg-subtle)',
                  color: locationFilter === loc.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Showing {filteredRecords.length} records and notable milestones</span>
      </div>

      {/* Grid of Record Cards */}
      {filteredRecords.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
          <Trophy size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No matching records found.</p>
          <p style={{ fontSize: '0.8125rem' }}>Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredRecords.map(item => <EventCard key={item.id} event={item} />)}
        </div>
      )}
    </div>
  );
}

