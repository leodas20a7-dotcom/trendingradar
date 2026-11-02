import React, { useState } from 'react';
import { useTrendRadar } from '../context/TrendContext.jsx';
import EventCard from '../components/common/EventCard.jsx';
import { Bookmark, Check, Undo2, Copy, CheckCheck, Trash2 } from 'lucide-react';

export default function SavedPage() {
  const {
    savedMap,
    postedMap,
    allEvents,
    undoPosted,
    searchQuery
  } = useTrendRadar();

  const [activeSubTab, setActiveSubTab] = useState('saved'); // 'saved' | 'posted'
  const [copied, setCopied] = useState(false);

  const savedList = Object.values(savedMap).map(s => s.event);

  // Cross-reference postedMap with allEvents
  const postedList = allEvents.filter(e => postedMap[e.id]);

  const currentList = activeSubTab === 'saved' ? savedList : postedList;

  const filteredList = currentList.filter(item => {
    if (!item) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (item.title || '').toLowerCase().includes(q) ||
                    (item.summary || '').toLowerCase().includes(q) ||
                    (item.category || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCopySummary = () => {
    if (savedList.length === 0) return;
    const text = savedList.map((item, idx) => {
      return `${idx + 1}. [${item.category}] ${item.title}\n   - Summary: ${item.summary || 'N/A'}\n   - Link: ${item.sources?.[0]?.url || item.url || 'N/A'}\n`;
    }).join('\n');

    navigator.clipboard.writeText(`ConvenioMart TrendRadar - Saved Marketing Digest:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sub-Tab Navigation Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('saved')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: activeSubTab === 'saved' ? 'var(--cm-purple)' : 'var(--bg-subtle)',
              color: activeSubTab === 'saved' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeSubTab === 'saved' ? 'var(--cm-purple)' : 'var(--border-light)'}`
            }}
          >
            <Bookmark size={15} />
            <span>Saved for Later ({savedList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('posted')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: activeSubTab === 'posted' ? 'var(--cm-navy)' : 'var(--bg-subtle)',
              color: activeSubTab === 'posted' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeSubTab === 'posted' ? 'var(--cm-navy)' : 'var(--border-light)'}`
            }}
          >
            <Check size={15} />
            <span>Previously Posted Content ({postedList.length})</span>
          </button>
        </div>

        {activeSubTab === 'saved' && savedList.length > 0 && (
          <button
            onClick={handleCopySummary}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
            title="Copy saved items list to clipboard for marketing draft"
          >
            {copied ? <CheckCheck size={14} color="var(--status-verified)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Export Content Digest'}</span>
          </button>
        )}
      </div>

      {/* Grid of Saved or Posted Items */}
      {filteredList.length === 0 ? (
        <div style={{
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          color: 'var(--text-muted)'
        }}>
          {activeSubTab === 'saved' ? (
            <>
              <Bookmark size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--cm-navy)' }}>No items currently saved.</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>Click "Save" on any event across the dashboard to store it here.</p>
            </>
          ) : (
            <>
              <Check size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--cm-navy)' }}>No events marked as posted yet.</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>Marking an item as posted prevents duplicate campaigns and helps track content usage.</p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredList.map(item => (
            <EventCard key={item.id} event={item} />
          ))}
        </div>
      )}
    </div>
  );
}

