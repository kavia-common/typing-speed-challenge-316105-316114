import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LeaderboardPanel from '../components/LeaderboardPanel';
import { fetchLeaderboard } from '../services/api';

// PUBLIC_INTERFACE
export default function LeaderboardPage() {
  /** Full-page leaderboard view (useful on mobile) with manual refresh. */
  const [state, setState] = useState({ items: [], loading: true, error: null, source: 'unknown' });

  async function load() {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const result = await fetchLeaderboard();
    setState({
      items: result.items || [],
      loading: false,
      error: result.source === 'mock' ? result.error : null,
      source: result.source || 'unknown',
    });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="tc-shell">
      <Header
        timeLeftSeconds={0}
        elapsedSeconds={0}
        isRunning={false}
        difficulty="—"
        apiStatus={{ mode: state.source === 'mock' ? 'mock' : 'backend' }}
      />

      <main className="tc-main" role="main">
        <div className="tc-container" style={{ gridTemplateColumns: '1fr' }}>
          <div className="tc-panel">
            <div className="tc-panel-body">
              <div className="tc-row" style={{ marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
                    Leaderboard
                  </div>
                  <div className="tc-muted">Top scores across players.</div>
                </div>
                <button className="tc-button" onClick={load} aria-label="Refresh leaderboard">
                  Refresh
                </button>
              </div>

              <LeaderboardPanel
                title="Top scores"
                items={state.items}
                loading={state.loading}
                error={state.error}
                source={state.source}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="tc-footer">
        Tip: If you see “mock”, set REACT_APP_API_BASE or REACT_APP_BACKEND_URL to point to your backend.
      </footer>
    </div>
  );
}
