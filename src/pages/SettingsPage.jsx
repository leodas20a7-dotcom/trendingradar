import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import { apiCacheStore, pruneOldCache } from '../utils/storageUtils.js';
import {
  Settings,
  Radio,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Trash2,
  RefreshCw,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function SettingsPage() {
  const {
    sources,
    overallStatus,
    userSettings,
    updateSettings,
    refreshAll,
    isRefreshing,
    lastRefreshedAt
  } = useTrendRadar();

  const [cacheCleared, setCacheCleared] = useState(false);

  const sourceList = Object.values(sources);

  const handleClearCache = () => {
    apiCacheStore.clear();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return (
          <span className="badge badge-verified" style={{ gap: '0.25rem' }}>
            <CheckCircle2 size={12} />
            <span>Online</span>
          </span>
        );
      case 'cached':
        return (
          <span className="badge badge-reported" style={{ gap: '0.25rem' }}>
            <Database size={12} />
            <span>Cached Fallback</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="badge badge-reported" style={{ gap: '0.25rem' }}>
            <AlertTriangle size={12} />
            <span>Degraded</span>
          </span>
        );
      case 'unavailable':
      default:
        return (
          <span className="badge badge-unverified" style={{ gap: '0.25rem' }}>
            <XCircle size={12} />
            <span>Unavailable</span>
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Provider Connectivity & Health Monitor */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
              Data Sources Health & Real-Time Connection Monitor
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              All integrations use 100% free public APIs and verified RSS feeds with zero subscription cost.
            </p>
          </div>
          <button
            onClick={refreshAll}
            disabled={isRefreshing}
            className="btn btn-primary btn-sm"
          >
            <RefreshCw size={13} className={isRefreshing ? 'spin-anim' : ''} />
            <span>{isRefreshing ? 'Checking...' : 'Check All Endpoints'}</span>
          </button>
        </div>

        <div style={{
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>SOURCE NAME</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>TYPE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>LATENCY</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>ITEMS FOUND</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>ERROR STATUS</th>
              </tr>
            </thead>
            <tbody>
              {sourceList.map(src => (
                <tr key={src.id} style={{ borderBottom: '1px solid var(--bg-subtle)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--cm-navy)' }}>
                    {src.name}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {src.type}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {getStatusBadge(src.status)}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {src.latencyMs ? `${src.latencyMs}ms` : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                    {src.itemsDiscovered || 0}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: src.error ? 'var(--status-unverified)' : 'var(--text-muted)' }}>
                    {src.error || 'None (Operational)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Auto-Refresh Intervals Configuration */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)', marginBottom: '0.5rem' }}>
          Automatic Fetch & Polling Configuration
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Configured to honor public provider rate limits and preserve system responsiveness.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cm-navy)', display: 'block', marginBottom: '0.4rem' }}>
              News & Sports Refresh Interval:
            </label>
            <select
              value={userSettings.newsRefreshIntervalMinutes || 15}
              onChange={(e) => updateSettings({ newsRefreshIntervalMinutes: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-page)'
              }}
            >
              <option value={15}>Every 15 minutes (Recommended)</option>
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every 1 hour</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cm-navy)', display: 'block', marginBottom: '0.4rem' }}>
              Historical & Birthday Archives Cadence:
            </label>
            <input
              type="text"
              readOnly
              value="Once Daily (Strictly Asia/Kolkata Calendar)"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Cache Management */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cm-navy)' }}>
            Browser Storage & Cache Maintenance
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Responses are cached locally in your browser to minimize network usage.
          </p>
        </div>
        <button
          onClick={handleClearCache}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.4rem' }}
        >
          <Trash2 size={13} color="var(--status-unverified)" />
          <span>{cacheCleared ? 'Cache Cleared!' : 'Clear Cached Responses'}</span>
        </button>
      </section>
    </div>
  );
}

