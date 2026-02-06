import React from 'react';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
export default function LeaderboardPanel({ title = 'Leaderboard', items, loading, error, source }) {
  /** Renders a leaderboard table with basic states and source badge (backend/mock). */
  return (
    <div className="tc-panel" aria-label="Leaderboard">
      <div className="tc-panel-body">
        <div className="tc-row" style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</div>
          <span className="tc-badge" aria-label="Leaderboard source">
            {source || 'unknown'}
          </span>
        </div>

        {loading && <div className="tc-banner tc-loading">Loading leaderboard…</div>}

        {!loading && error && (
          <div className="tc-banner tc-error" role="alert">
            Could not load leaderboard. Showing fallback if available.
            <div className="tc-muted" style={{ marginTop: 6 }}>
              {error}
            </div>
          </div>
        )}

        {!loading && (!items || items.length === 0) && (
          <div className="tc-banner">No scores yet. Play a round to be the first!</div>
        )}

        {!loading && items && items.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="tc-leaderboard-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">WPM</th>
                  <th scope="col">Accuracy</th>
                  <th scope="col">When</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 20).map((row, idx) => (
                  <tr key={row.id || `${row.username}-${row.createdAt}-${idx}`}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 700 }}>{row.username || 'Anonymous'}</td>
                    <td>{Number.isFinite(row.wpm) ? Math.round(row.wpm) : row.wpm}</td>
                    <td>
                      {Number.isFinite(row.accuracy)
                        ? `${row.accuracy.toFixed(1)}%`
                        : row.accuracy}
                    </td>
                    <td className="tc-muted">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {source === 'mock' && (
          <div className="tc-muted" style={{ marginTop: 10 }}>
            TODO: Backend endpoint unavailable; displaying mock data fallback.
          </div>
        )}
      </div>
    </div>
  );
}
