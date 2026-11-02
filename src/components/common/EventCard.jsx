import React, { useState } from 'react';
import { useTrendRadar } from '../../context/TrendContext.jsx';
import { getVerificationBadge } from '../../services/verificationService.js';
import { formatRelativeTime } from '../../utils/dateUtils.js';
import {
  Bookmark,
  Check,
  Undo2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function EventCard({ event }) {
  const {
    postedMap,
    savedMap,
    markAsPosted,
    undoPosted,
    toggleSave,
    dismissEvent
  } = useTrendRadar();

  const [sourcesOpen, setSourcesOpen] = useState(false);

  if (!event) return null;

  const isPosted = Boolean(postedMap[event.id]);
  const isSaved = Boolean(savedMap[event.id]);
  const sources = event.sources || [];
  const primarySource = sources[0] || { publisher: 'Direct Source', url: event.url };
  const hasMultipleSources = sources.length > 1;

  const badgeConfig = getVerificationBadge(event.verificationStatus || 'reported');

  const getLocationLabel = (loc) => {
    if (loc === 'tamilnadu') return 'Tamil Nadu';
    if (loc === 'india') return 'India';
    return 'Worldwide';
  };

  return (
    <article
      style={{
        background: isPosted ? 'var(--status-posted-bg)' : 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${isPosted ? 'var(--status-posted-border)' : 'var(--border-light)'}`,
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      {/* Top Meta Bar */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Category */}
            <span className="badge badge-category">
              {event.category || 'General'}
            </span>

            {/* Location Tag */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.725rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-subtle)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)'
            }}>
              <MapPin size={11} color="var(--cm-purple)" />
              {getLocationLabel(event.location)}
            </span>

            {/* Achievement Subtype Tag if available */}
            {event.achievementSubCategory && (
              <span style={{
                fontSize: '0.725rem',
                color: 'var(--cm-purple-dark)',
                background: 'var(--cm-purple-light)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}>
                {event.achievementSubCategory}
              </span>
            )}
          </div>

          {/* Verification Badge */}
          <div
            title={badgeConfig.tooltip}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.725rem',
              fontWeight: 600,
              color: badgeConfig.color,
              background: badgeConfig.bgColor,
              border: `1px solid ${badgeConfig.borderColor}`,
              cursor: 'help'
            }}
          >
            {event.verificationStatus === 'verified' && <CheckCircle2 size={13} />}
            {event.verificationStatus === 'reported' && <AlertCircle size={13} />}
            {event.verificationStatus === 'unverified' && <HelpCircle size={13} />}
            <span>{badgeConfig.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--cm-navy)',
          lineHeight: 1.4,
          marginBottom: '0.5rem'
        }}>
          {event.title}
        </h3>

        {/* Short Factual Summary */}
        {event.summary && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '0.875rem'
          }}>
            {event.summary}
          </p>
        )}

        {/* Person / Team & Dates Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          {event.personOrTeam && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--cm-navy)' }}>
              <span>{event.personOrTeam}</span>
            </div>
          )}

          {event.eventDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Calendar Event Date">
              <Calendar size={13} />
              <span>Event Date: {event.eventDate}</span>
            </div>
          )}

          {event.publishedAt && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Publication Timestamp">
              <Clock size={13} />
              <span>Reported: {formatRelativeTime(event.publishedAt)}</span>
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {primarySource.publisher}
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Source Disclosure Drawer */}
      <div>
        {hasMultipleSources && (
          <div style={{ marginBottom: '0.75rem' }}>
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--cm-purple)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--cm-purple-light)',
                border: '1px solid var(--status-saved-border)'
              }}
            >
              <Layers size={13} />
              <span>{sources.length} related articles</span>
              {sourcesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {sourcesOpen && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Independent Original Sources:
                </div>
                {sources.map((src, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.785rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {src.publisher}
                    </span>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--cm-purple)',
                          textDecoration: 'none'
                        }}
                      >
                        <span>View Article</span>
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Archive record</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Save Button */}
            <button
              onClick={() => toggleSave(event)}
              className="btn btn-secondary btn-sm"
              style={{
                color: isSaved ? 'var(--cm-purple)' : 'var(--text-secondary)',
                borderColor: isSaved ? 'var(--cm-purple)' : 'var(--border-light)',
                background: isSaved ? 'var(--cm-purple-light)' : 'transparent'
              }}
              title={isSaved ? 'Remove from Saved' : 'Save for later'}
            >
              <Bookmark size={13} fill={isSaved ? 'var(--cm-purple)' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Posted Toggle */}
            {isPosted ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="badge badge-posted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Check size={12} />
                  <span>Already Posted</span>
                </span>
                <button
                  onClick={() => undoPosted(event.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  title="Undo posted status"
                >
                  <Undo2 size={12} />
                  <span>Undo</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => markAsPosted(event.id, { title: event.title })}
                className="btn btn-secondary btn-sm"
                title="Mark this event as used in marketing"
              >
                <Check size={13} />
                <span>Mark as Posted</span>
              </button>
            )}

            {/* Dismiss Button */}
            <button
              onClick={() => dismissEvent(event.id)}
              style={{
                color: 'var(--text-muted)',
                padding: '0.3rem',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              title="Not relevant / hide"
            >
              <XCircle size={15} />
            </button>
          </div>

          {/* Primary External Source Link */}
          {primarySource.url && (
            <a
              href={primarySource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--cm-navy)',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>Source</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
