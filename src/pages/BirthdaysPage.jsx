import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { Cake, MapPin, Sparkles, UserCheck } from 'lucide-react';

export default function BirthdaysPage() {
  const { birthdayEvents, searchQuery } = useTrendRadar();

  const [locationFilter, setLocationFilter] = useState('all'); // 'all', 'tamilnadu', 'india', 'worldwide'
  const [professionFilter, setProfessionFilter] = useState('all');

  const professions = [
    { id: 'all', label: 'All Professions' },
    { id: 'Entertainment & Cinema', label: 'Cinema & Cinema Stars' },
    { id: 'Sports', label: 'Cricket & Sports' },
    { id: 'Science & Mathematics', label: 'Science & Academia' },
    { id: 'Music & Arts', label: 'Music & Arts' },
    { id: 'Politics & Leadership', label: 'Statesmen & Leaders' }
  ];

  const filteredBirthdays = birthdayEvents.filter(b => {
    if (locationFilter !== 'all' && b.location !== locationFilter) {
      return false;
    }
    if (professionFilter !== 'all') {
      const matchProf = (b.profession || '').toLowerCase().includes(professionFilter.toLowerCase());
      if (!matchProf) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (b.title || '').toLowerCase().includes(q) ||
                    (b.summary || '').toLowerCase().includes(q) ||
                    (b.personOrTeam || '').toLowerCase().includes(q) ||
                    (b.country || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filtering Toolbar */}
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
        {/* Region Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <MapPin size={14} color="var(--cm-purple)" />
            <span>Region Filter:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Personalities' },
              { id: 'tamilnadu', label: 'Tamil Nadu Celebrities' },
              { id: 'india', label: 'India (Bollywood & Sports)' },
              { id: 'worldwide', label: 'Global Icons' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setLocationFilter(loc.id)}
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: locationFilter === loc.id ? 'var(--cm-purple)' : 'var(--bg-subtle)',
                  color: locationFilter === loc.id ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${locationFilter === loc.id ? 'var(--cm-purple)' : 'var(--border-light)'}`
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profession Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Field:
          </div>
          {professions.map(p => (
            <button
              key={p.id}
              onClick={() => setProfessionFilter(p.id)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.725rem',
                fontWeight: 600,
                background: professionFilter === p.id ? 'var(--cm-navy)' : 'transparent',
                color: professionFilter === p.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${professionFilter === p.id ? 'var(--cm-navy)' : 'var(--border-subtle)'}`
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Showing {filteredBirthdays.length} personalities born on today's date</span>
        <span style={{ fontSize: '0.75rem' }}>Source: Structured biographical archives & Wikidata</span>
      </div>

      {/* Grid of Birthday Cards */}
      {filteredBirthdays.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
          <Cake size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>No birthdays found for current filters.</p>
          <p style={{ fontSize: '0.8125rem' }}>Select "All Personalities" to view all records.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredBirthdays.map(item => <EventCard key={item.id} event={item} />)}
        </div>
      )}
    </div>
  );
}

