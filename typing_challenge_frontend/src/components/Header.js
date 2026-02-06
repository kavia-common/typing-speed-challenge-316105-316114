import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Header({
  timeLeftSeconds,
  elapsedSeconds,
  isRunning,
  difficulty,
  apiStatus,
}) {
  /** Top header bar with brand, timer, navigation, and small status chips. */
  const location = useLocation();
  const onLeaderboard = location.pathname.startsWith('/leaderboard');

  return (
    <div className="tc-topbar" role="banner">
      <div className="tc-topbar-inner">
        <div className="tc-brand">
          <div className="tc-brand-title">Typing Speed Challenge</div>
          <div className="tc-brand-subtitle">Traditional Gray · speed + accuracy</div>
        </div>

        <div className="tc-topbar-actions" aria-label="Top bar controls">
          <span className="tc-chip" aria-label="Timer">
            <span>⏱</span>
            <strong>{isRunning ? `${timeLeftSeconds}s left` : `${elapsedSeconds}s`}</strong>
            <span className="tc-muted">{isRunning ? 'running' : 'elapsed'}</span>
          </span>

          <span className="tc-chip" aria-label="Difficulty">
            <span>🎯</span>
            <strong>{difficulty}</strong>
          </span>

          <span className="tc-chip" aria-label="API status">
            <span>API</span>
            <strong>{apiStatus?.mode || 'unknown'}</strong>
          </span>

          {onLeaderboard ? (
            <Link className="tc-button tc-button-secondary" to="/" aria-label="Go to game">
              Back to Game
            </Link>
          ) : (
            <Link className="tc-button tc-button-secondary" to="/leaderboard" aria-label="Open leaderboard">
              Leaderboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
