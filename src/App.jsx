import React, { useState } from 'react';
import { TrendProvider, useTrendRadar } from './context/TrendContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import GlobalFilterBar from './components/common/GlobalFilterBar.jsx';

// Dedicated View Pages
import OverviewPage from './pages/OverviewPage.jsx';
import RecordsPage from './pages/RecordsPage.jsx';
import BirthdaysPage from './pages/BirthdaysPage.jsx';
import FestivalsPage from './pages/FestivalsPage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import UpcomingPage from './pages/UpcomingPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function DashboardShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeTab, metrics } = useTrendRadar();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return "Today's Content Radar & Highlights";
      case 'records':
        return 'Records Broken & Sporting Achievements';
      case 'birthdays':
        return 'Celebrity & Legendary Birthdays';
      case 'festivals':
        return 'Festivals & Special Observances';
      case 'news':
        return 'Trending News & Cultural Breakthroughs';
      case 'history':
        return 'On This Day in History';
      case 'upcoming':
        return 'Upcoming Occasions & Milestones';
      case 'saved':
        return 'Saved Content & Marketing Tracker';
      case 'settings':
        return 'TrendRadar Settings & Source Health';
      default:
        return 'ConvenioMart TrendRadar';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="app-main">
        <Header onOpenMobile={() => setMobileOpen(true)} />

        <main className="content-wrapper">
          {/* Welcome / Section Header Banner */}
          <section style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--cm-purple)',
                  background: 'var(--cm-purple-light)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  ConvenioMart Marketing Desk
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Real-Time Factual Discovery</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
                {getPageTitle()}
              </h2>
            </div>

            {/* Quick KPI Pill stats */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                background: 'var(--bg-subtle)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600 }}>DISCOVERED</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>{metrics.totalDiscovered}</div>
              </div>
              <div style={{
                background: 'var(--status-verified-bg)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--status-verified-border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--status-verified)', fontWeight: 600 }}>VERIFIED</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-verified)' }}>{metrics.verifiedCount}</div>
              </div>
              <div style={{
                background: 'var(--cm-purple-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--status-saved-border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--cm-purple-dark)', fontWeight: 600 }}>UPCOMING</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--cm-purple-dark)' }}>{metrics.upcomingCount}</div>
              </div>
            </div>
          </section>

          {/* Universal Filter Control Bar */}
          <GlobalFilterBar />

          {/* Active Dedicated Page View */}
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'records' && <RecordsPage />}
          {activeTab === 'birthdays' && <BirthdaysPage />}
          {activeTab === 'festivals' && <FestivalsPage />}
          {activeTab === 'news' && <NewsPage />}
          {activeTab === 'history' && <HistoryPage />}
          {activeTab === 'upcoming' && <UpcomingPage />}
          {activeTab === 'saved' && <SavedPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TrendProvider>
      <DashboardShell />
    </TrendProvider>
  );
}
