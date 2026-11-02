import React, { useState, useEffect } from 'react';
import { getVerificationBadge } from '../../services/verificationService.js';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

export default function EventDetailModal({ event, onClose, isPosted, onTogglePosted, isSaved, onToggleSave }) {
  const [copiedOneLine, setCopiedOneLine] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const badgeConfig = getVerificationBadge(event.verificationStatus || 'reported');
  const primarySource = (event.sources && event.sources[0]) || { publisher: 'Direct Archive', url: event.url };

  // Create clean 1-line punchline for marketing
  const oneLineSummary = `${event.title} — ${event.summary ? event.summary.split('.')[0] + '.' : ''}`;

  const copyOneLine = () => {
    navigator.clipboard.writeText(oneLineSummary);
    setCopiedOneLine(true);
    setTimeout(() => setCopiedOneLine(false), 2000);
  };

  const copyFullPost = () => {
    const text = `📢 ${event.title}\n\n${event.summary || ''}\n\n🔗 Source: ${primarySource.publisher || 'Verified Archive'} (${primarySource.url || ''})`;
    navigator.clipboard.writeText(text);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAFAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--cm-purple)',
              background: 'var(--cm-purple-light)',
              padding: '0.15rem 0.6rem',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              {event.category || 'General'}
            </span>

            <span className={`badge badge-${event.verificationStatus || 'reported'}`}>
              {badgeConfig.label}
            </span>

            {event.location && (
              <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <MapPin size={12} />
                <span>{event.location === 'tamilnadu' ? 'Tamil Nadu' : event.location === 'india' ? 'India' : 'Global'}</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#64748B',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease'
            }}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Main Title */}
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--cm-navy)',
            lineHeight: 1.4,
            marginBottom: '1rem'
          }}>
            {event.title}
          </h3>

          {/* 1-Line Quick Marketing Takeaway Box */}
          <div style={{
            background: 'var(--cm-purple-light)',
            borderLeft: '4px solid var(--cm-purple)',
            padding: '0.85rem 1rem',
            borderRadius: '0 8px 8px 0',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--cm-purple-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              1-Line Social Media Takeaway:
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cm-navy)', lineHeight: 1.45 }}>
              "{oneLineSummary}"
            </p>
          </div>

          {/* Detailed Content */}
          {event.summary && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Factual Context:
              </div>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                {event.summary}
              </p>
            </div>
          )}

          {/* Person / Date / Source Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '0.8rem',
            color: '#64748B',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span>Publisher: </span>
              <strong style={{ color: 'var(--cm-navy)' }}>{primarySource.publisher || 'Direct Archive'}</strong>
            </div>

            {primarySource.url && (
              <a
                href={primarySource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: 'var(--cm-purple)',
                  fontWeight: 600
                }}
              >
                <span>Original Source</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* Modal Action Buttons Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Copy 1-Line Button */}
              <button
                onClick={copyOneLine}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  background: copiedOneLine ? '#ECFDF5' : 'var(--cm-purple)',
                  color: copiedOneLine ? '#059669' : '#fff',
                  border: `1px solid ${copiedOneLine ? '#A7F3D0' : 'var(--cm-purple)'}`,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                {copiedOneLine ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedOneLine ? 'Copied 1-Line Text!' : 'Copy 1-Line Text'}</span>
              </button>

              {/* Copy Full Post */}
              <button
                onClick={copyFullPost}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8125rem',
                  fontWeight: 600
                }}
              >
                {copiedFull ? <Check size={14} /> : <Share2 size={14} />}
                <span>{copiedFull ? 'Copied Full Post!' : 'Copy Full Post'}</span>
              </button>
            </div>

            {/* Mark as Posted */}
            <button
              onClick={() => onTogglePosted(event.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                background: isPosted ? '#F1F5F9' : '#FFFFFF',
                color: isPosted ? '#475569' : 'var(--cm-navy)',
                border: '1px solid #CBD5E1'
              }}
            >
              <CheckCircle2 size={14} color={isPosted ? '#059669' : 'currentColor'} />
              <span>{isPosted ? 'Already Posted (Click to Undo)' : 'Mark as Posted'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
