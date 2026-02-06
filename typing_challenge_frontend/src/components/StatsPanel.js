import React from 'react';
import { formatNumber } from '../utils/stats';

// PUBLIC_INTERFACE
export default function StatsPanel({ wpm, accuracy, totalTyped }) {
  /** Displays live typing statistics. */
  return (
    <div className="tc-stats-grid" aria-label="Live statistics">
      <div className="tc-stat">
        <div className="tc-stat-title">WPM</div>
        <div className="tc-stat-value">{formatNumber(wpm, 0)}</div>
      </div>
      <div className="tc-stat">
        <div className="tc-stat-title">Accuracy</div>
        <div className="tc-stat-value">{formatNumber(accuracy, 1)}%</div>
      </div>
      <div className="tc-stat">
        <div className="tc-stat-title">Characters typed</div>
        <div className="tc-stat-value">{formatNumber(totalTyped, 0)}</div>
      </div>
    </div>
  );
}
