import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import {
  Sparkles,
  Trophy,
  Cake,
  CalendarDays,
  Flame,
  CalendarClock,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function OverviewPage() {
  const {
    metrics,
    birthdayEvents,
    festivalEvents,
    recordsEvents,
    newsEvents,
    upcomingEvents,
    setActiveTab,
    applyGlobalFilters,
    filterLocation,
    setFilterLocation
  } = useTrendRadar();

  const filterItems = (items) => applyGlobalFilters(items);

  // Curate Today's Top Highlights (combining top festival, top record, top birthday, top news)
  const topHighlights = [
    ...(festivalEvents.length > 0 ? [festivalEvents[0]] : []),
    ...(recordsEvents.length > 0 ? [recordsEvents[0]] : []),
    ...(birthdayEvents.length > 0 ? [birthdayEvents[0]] : []),
    ...(newsEvents.length > 0 ? [newsEvents[0]] : [])
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Unique Events Discovered
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cm-navy)', marginTop: '0.25rem' }}>
            {metrics.totalDiscovered}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Across news, sports, birthdays & archives
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--status-verified-border)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-verified)', textTransform: 'uppercase' }}>
            Verified Events
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-verified)', marginTop: '0.25rem' }}>
            {metrics.verifiedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Confirmed by official authorities & archives
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--status-saved-border)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cm-purple-dark)', textTransform: 'uppercase' }}>
            Upcoming Occasions
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cm-purple-dark)', marginTop: '0.25rem' }}>
            {metrics.upcomingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            In the next 7 to 30 days
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Already Posted
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {metrics.postedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Used by ConvenioMart marketing team
          </div>
        </div>
      </div>

      {/* Location Filter Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cm-navy)' }}>
          <MapPin size={15} color="var(--cm-purple)" />
          <span>Regional Focus:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'tamilnadu', label: 'Tamil Nadu' },
            { id: 'india', label: 'India' },
            { id: 'worldwide', label: 'Worldwide' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterLocation(tab.id)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: filterLocation === tab.id ? 'var(--cm-purple)' : 'var(--bg-subtle)',
                color: filterLocation === tab.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${filterLocation === tab.id ? 'var(--cm-purple)' : 'var(--border-light)'}`,
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Today's Highlights */}
      {topHighlights.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--cm-purple)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
                Today's Highlights & Top Social Media Opportunities
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hand-picked high impact opportunities
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {topHighlights.map(e => <EventCard key={`highlight_${e.id}`} event={e} />)}
          </div>
        </section>
      )}

      {/* Section 2: Today's Festivals */}
      {festivalEvents.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={18} color="var(--cm-purple)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
                Today's Festivals & Special Observances
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('festivals')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--cm-purple)', fontWeight: 600 }}
            >
              <span>View All Festivals</span>
              <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {filterItems(festivalEvents).map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* Section 3: Records & Achievements */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={18} color="var(--status-reported)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
              New Records & Notable Breakthroughs
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('records')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--cm-purple)', fontWeight: 600 }}
          >
            <span>View All Records ({recordsEvents.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filterItems(recordsEvents).slice(0, 4).map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* Section 4: Famous Personalities Celebrating Today */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cake size={18} color="var(--cm-purple)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
              Famous Personalities Celebrating Today
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('birthdays')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--cm-purple)', fontWeight: 600 }}
          >
            <span>View All Birthdays ({birthdayEvents.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filterItems(birthdayEvents).slice(0, 6).map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* Section 5: Trending Real-World News */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={18} color="#EA580C" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
              Trending News & Multi-Source Coverage
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('news')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--cm-purple)', fontWeight: 600 }}
          >
            <span>View All News ({newsEvents.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filterItems(newsEvents).slice(0, 6).map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* Section 6: Upcoming Milestones (Next 7 Days) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarClock size={18} color="var(--cm-navy)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-navy)' }}>
              Upcoming Occasions & Birthdays (Next 7 Days)
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--cm-purple)', fontWeight: 600 }}
          >
            <span>View 30-Day Calendar</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {upcomingEvents.slice(0, 4).map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </section>
    </div>
  );
}

