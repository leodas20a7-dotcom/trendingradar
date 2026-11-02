import React from 'react';
import { getVerificationBadge } from '../../services/verificationService.js';
import { Sparkles, Trophy, Cake, CalendarDays, Flame, History, Check, ExternalLink } from 'lucide-react';

export default function GamingCard({ event, onClick, isPosted, isSaved }) {
  if (!event) return null;

  const badgeConfig = getVerificationBadge(event.verificationStatus || 'reported');

  const getCardClass = () => {
    const cat = (event.category || '').toLowerCase();
    if (cat.includes('birthday') || cat.includes('celebrity')) return 'game-card-celebrity';
    if (cat.includes('record') || cat.includes('achievement')) return 'game-card-record';
    if (cat.includes('festival')) return 'game-card-festival';
    if (cat.includes('news')) return 'game-card-news';
    if (cat.includes('history') || cat.includes('day')) return 'game-card-history';
    return '';
  };

  const getCategoryIcon = () => {
    const cat = (event.category || '').toLowerCase();
    if (cat.includes('birthday')) return <Cake size={13} color="#EC4899" />;
    if (cat.includes('record')) return <Trophy size={13} color="#F59E0B" />;
    if (cat.includes('festival')) return <CalendarDays size={13} color="#10B981" />;
    if (cat.includes('news')) return <Flame size={13} color="#3B82F6" />;
    if (cat.includes('history')) return <History size={13} color="#8B5CF6" />;
    return <Sparkles size={13} color="var(--cm-purple)" />;
  };

  return (
    <div
      onClick={() => onClick(event)}
      className={`game-card ${getCardClass()}`}
      style={{
        opacity: isPosted ? 0.65 : 1,
        borderColor: isPosted ? '#CBD5E1' : '#E2E8F0'
      }}
      title="Click to view details & copy content"
    >
      <div>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            {getCategoryIcon()}
            <span>{event.category || 'Highlight'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {isPosted && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                POSTED
              </span>
            )}
            <span
              className={`badge badge-${event.verificationStatus || 'reported'}`}
              style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}
            >
              {badgeConfig.label}
            </span>
          </div>
        </div>

        {/* Short Punchy Title */}
        <h4 style={{
          fontSize: '0.925rem',
          fontWeight: 700,
          color: 'var(--cm-navy)',
          lineHeight: 1.35,
          marginBottom: '0.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.title}
        </h4>
      </div>

      {/* Card Footer: Metadata Tag + Tap Hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.725rem',
        color: '#64748B',
        paddingTop: '0.5rem',
        borderTop: '1px solid #F1F5F9',
        marginTop: '0.5rem'
      }}>
        <span style={{ fontWeight: 600, color: '#334155' }}>
          {event.personOrTeam || event.country || (event.sources && event.sources[0]?.publisher) || 'Verified Source'}
        </span>

        <span style={{ color: 'var(--cm-purple)', fontWeight: 600, fontSize: '0.7rem' }}>
          View Details →
        </span>
      </div>
    </div>
  );
}
