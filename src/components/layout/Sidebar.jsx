import React from 'react';
import { useTrendRadar } from '../../context/TrendContext.jsx';
import {
  LayoutDashboard,
  Trophy,
  Cake,
  CalendarDays,
  Flame,
  History,
  CalendarClock,
  Bookmark,
  Settings,
  ShieldCheck,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const {
    activeTab,
    setActiveTab,
    metrics,
    savedMap,
    postedMap
  } = useTrendRadar();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'records', label: 'Records & Achievements', icon: Trophy, badge: metrics.recordsCount },
    { id: 'birthdays', label: 'Celebrity Birthdays', icon: Cake },
    { id: 'festivals', label: 'Festivals & Special Days', icon: CalendarDays },
    { id: 'news', label: 'Trending News', icon: Flame },
    { id: 'history', label: 'On This Day', icon: History },
    { id: 'upcoming', label: 'Upcoming Events', icon: CalendarClock, badge: metrics.upcomingCount },
    { id: 'saved', label: 'Saved Content', icon: Bookmark, badge: metrics.savedCount },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 44, 0.4)',
            zIndex: 40,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--cm-navy)',
          color: '#fff',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--cm-navy-border)',
          zIndex: 50,
          transition: 'transform 0.25s ease-in-out',
          flexShrink: 0
        }}
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div>
          <div style={{
            padding: '1.25rem 1.25rem 1rem',
            borderBottom: '1px solid var(--cm-navy-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--cm-purple) 0%, var(--cm-purple-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: '#fff',
                letterSpacing: '-0.02em',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                TR
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  TrendRadar
                </div>
                <div style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ConvenioMart
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="mobile-close-btn"
              style={{
                display: 'none',
                color: '#94A3B8',
                padding: '0.25rem'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '0.875rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? '#fff' : '#94A3B8',
                    background: isActive ? 'var(--cm-navy-surface)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--cm-purple)' : '3px solid transparent',
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#94A3B8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color={isActive ? 'var(--cm-purple)' : 'currentColor'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'var(--cm-purple)' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.675rem',
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Metrics Mini-Widget in Sidebar Footer */}
        <div style={{
          padding: '1rem',
          margin: '0.75rem',
          background: 'var(--cm-navy-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--cm-navy-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>
            <Radio size={12} color="#10B981" />
            <span>Radar Activity</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
            <span>Discovered Today:</span>
            <strong style={{ color: '#fff' }}>{metrics.totalDiscovered}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
            <span>Verified Events:</span>
            <strong style={{ color: '#10B981' }}>{metrics.verifiedCount}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
            <span>Posted Content:</span>
            <strong style={{ color: '#CBD5E1' }}>{metrics.postedCount}</strong>
          </div>
        </div>
      </aside>
    </>
  );
}
