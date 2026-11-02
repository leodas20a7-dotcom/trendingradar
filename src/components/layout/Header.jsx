import React from 'react';
import { useTrendRadar } from '../../context/TrendContext.jsx';
import {
  Search,
  RefreshCw,
  Clock,
  Calendar,
  Radio,
  Menu,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X
} from 'lucide-react';

export default function Header({ onOpenMobile }) {
  const {
    istTimeParts,
    lastRefreshedAt,
    overallStatus,
    isRefreshing,
    refreshAll,
    searchQuery,
    setSearchQuery
  } = useTrendRadar();

  const getStatusDisplay = () => {
    switch (overallStatus) {
      case 'healthy':
        return {
          label: 'All Sources Online',
          color: '#059669',
          bg: '#ECFDF5',
          border: '#A7F3D0',
          dot: '#10B981'
        };
      case 'partial':
        return {
          label: 'Partial Degradation',
          color: '#D97706',
          bg: '#FFFBEB',
          border: '#FDE68A',
          dot: '#F59E0B'
        };
      case 'degraded':
      case 'unavailable':
        return {
          label: 'Sources Offline',
          color: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
          dot: '#EF4444'
        };
      default:
        return {
          label: 'Syncing Sources...',
          color: '#475569',
          bg: '#F1F5F9',
          border: '#CBD5E1',
          dot: '#94A3B8'
        };
    }
  };

  const statusStyle = getStatusDisplay();

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left: Mobile Menu Toggle + Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 auto', maxWidth: '520px' }}>
        <button
          onClick={onOpenMobile}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            color: 'var(--cm-navy)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)'
          }}
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Field */}
        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, legends, records, keywords..."
            style={{
              width: '100%',
              padding: '0.45rem 2rem 0.45rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-page)',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--cm-purple)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '0.6rem', color: 'var(--text-muted)' }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right: IST Clock, Source Status, Refresh Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Live IST Date & Time Pill */}
        <div className="header-time-pill" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'var(--bg-subtle)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          fontSize: '0.785rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <Calendar size={14} color="var(--cm-purple)" />
            <span style={{ fontWeight: 600 }}>{istTimeParts.formattedShortDate}</span>
          </div>

          <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--cm-navy)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            <Clock size={13} color="var(--cm-purple)" />
            <span>{istTimeParts.timeString} IST</span>
          </div>
        </div>

        {/* Source Health Badge */}
        <div
          className="header-status-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            color: statusStyle.color,
            fontSize: '0.725rem',
            fontWeight: 600
          }}
          title={lastRefreshedAt ? `Last Refreshed at ${lastRefreshedAt}` : 'Initializing sources'}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: statusStyle.dot
          }} />
          <span>{statusStyle.label}</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={refreshAll}
          disabled={isRefreshing}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.4rem' }}
          title="Refresh real-world news, birthdays and records"
        >
          <RefreshCw size={13} className={isRefreshing ? 'spin-anim' : ''} />
          <span className="refresh-label">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  );
}
