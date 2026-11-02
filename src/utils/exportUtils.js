/**
 * Export Utilities for ConvenioMart TrendRadar
 * Provides one-click Excel (CSV) and Print/PDF downloads
 */

import { getISTDateParts } from './dateUtils.js';

/**
 * Exports events as an Excel-compatible CSV file
 */
export function exportToCSV(events = [], filenamePrefix = 'ConvenioMart_TrendRadar') {
  if (!events || events.length === 0) return;

  const { isoDate } = getISTDateParts();
  const filename = `${filenamePrefix}_${isoDate}.csv`;

  const headers = [
    'Category',
    'Title',
    'Person or Team',
    'Event Date',
    'Location',
    'Verification Status',
    'Primary Publisher',
    'Source URL',
    'Summary'
  ];

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = events.map(e => [
    escapeCSV(e.category || 'General'),
    escapeCSV(e.title || ''),
    escapeCSV(e.personOrTeam || ''),
    escapeCSV(e.eventDate || isoDate),
    escapeCSV(e.location || 'worldwide'),
    escapeCSV(e.verificationStatus || 'reported'),
    escapeCSV(e.sources?.[0]?.publisher || e.publisher || 'Direct Archive'),
    escapeCSV(e.sources?.[0]?.url || e.url || ''),
    escapeCSV(e.summary || '')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean PDF generation using browser print styles
 */
export function exportToPDF() {
  window.print();
}
