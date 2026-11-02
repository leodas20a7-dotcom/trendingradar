import React, { useState } from 'react';
import { useTrendRadar } from '../../context/TrendContext.jsx';
import {
  Filter,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export default function GlobalFilterBar() {
  const {
    filterLocation,
    setFilterLocation,
    filterVerification,
    setFilterVerification,
    filterCategory,
    setFilterCategory,
    filterPostedStatus,
    setFilterPostedStatus
  } = useTrendRadar();

  const [expanded, setExpanded] = useState(false);

  // Check if any filter is active
  const hasActiveFilters =
    filterLocation !== 'all' ||
    filterVerification !== 'all' ||
    filterCategory !== 'all' ||
    filterPostedStatus !== 'all';

  const resetAllFilters = () => {
    setFilterLocation('all');
    setFilterVerification('all');
    setFilterCategory('all');
    setFilterPostedStatus('all');
  };

  const categories = [
    'all',
    'Sports',
    'Technology',
    'Space',
    'Business',
    'Science',
    'Entertainment',
    'Celebrity Birthdays',
    'Festivals & Special Days',
    'Historical Events'
  ];

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      padding: '0.875rem 1.25rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top summary row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--cm-navy)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)'
            }}
          >
            <Filter size={14} color="var(--cm-purple)" />
            <span>Universal Filters</span>
            {hasActiveFilters && (
              <span style={{
                background: 'var(--cm-purple)',
                color: '#fff',
                fontSize: '0.65rem',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800
              }}>
                Active
              </span>
            )}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Location quick pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} color="var(--text-muted)" />
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'tamilnadu', label: 'Tamil Nadu' },
              { id: 'india', label: 'India' },
              { id: 'worldwide', label: 'Global' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setFilterLocation(loc.id)}
                style={{
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: filterLocation === loc.id ? 'var(--cm-purple)' : 'transparent',
                  color: filterLocation === loc.id ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${filterLocation === loc.id ? 'var(--cm-purple)' : 'var(--border-light)'}`
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              color: 'var(--status-unverified)',
              fontWeight: 600,
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Reset all active filters"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Expandable Advanced Filter Panel */}
      {expanded && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Category Dropdown */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Category:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-page)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">All Content Categories</option>
              {categories.slice(1).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Verification Status:
            </label>
            <select
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-page)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">All Verification Levels</option>
              <option value="verified">Verified (Official Governing Body / Archive)</option>
              <option value="reported">Reported (Mainstream Tier-1 News)</option>
              <option value="unverified">Unverified (Breaking / Single Source)</option>
            </select>
          </div>

          {/* Marketing Usage Status */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Posting State:
            </label>
            <select
              value={filterPostedStatus}
              onChange={(e) => setFilterPostedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-page)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">All Events (Posted & Unposted)</option>
              <option value="unposted">Fresh / Not Yet Posted</option>
              <option value="posted">Already Posted by Team</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

