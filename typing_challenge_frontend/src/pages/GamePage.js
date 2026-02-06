import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import SentenceDisplay from '../components/SentenceDisplay';
import TypingInput from '../components/TypingInput';
import StatsPanel from '../components/StatsPanel';
import LeaderboardPanel from '../components/LeaderboardPanel';
import { computeAccuracy, computeWpm } from '../utils/stats';
import { fetchLeaderboard, fetchRandomSentence, submitScore } from '../services/api';

const DEFAULT_DURATION = 60;

function countCorrectChars(sentence, typed) {
  let correct = 0;
  const n = Math.min(sentence.length, typed.length);
  for (let i = 0; i < n; i += 1) {
    if (sentence[i] === typed[i]) correct += 1;
  }
  return correct;
}

// PUBLIC_INTERFACE
export default function GamePage() {
  /** Main typing game page: loads sentences, runs a timer, shows live stats, and submits score. */
  const [difficulty, setDifficulty] = useState('medium');
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_DURATION);

  const [sentence, setSentence] = useState('');
  const [sentenceSource, setSentenceSource] = useState('unknown');
  const [typed, setTyped] = useState('');

  const [status, setStatus] = useState('idle'); // idle | ready | running | finished
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [banner, setBanner] = useState(null); // { type: 'info'|'error', message: string }
  const [loadingSentence, setLoadingSentence] = useState(false);

  const [leaderboard, setLeaderboard] = useState({ items: [], loading: false, error: null, source: 'unknown' });

  const timerRef = useRef(null);

  const correctChars = useMemo(() => countCorrectChars(sentence, typed), [sentence, typed]);
  const totalTyped = typed.length;

  const accuracy = useMemo(
    () => computeAccuracy({ correctChars, totalTyped }),
    [correctChars, totalTyped]
  );

  const wpm = useMemo(
    () => computeWpm({ correctChars, elapsedSeconds: Math.max(1, elapsedSeconds) }),
    [correctChars, elapsedSeconds]
  );

  const apiStatus = useMemo(() => {
    // Lightweight "status": if sentence/leaderboard are mock, show mock, else backend.
    const mode = sentenceSource === 'mock' || leaderboard.source === 'mock' ? 'mock' : 'backend';
    return { mode };
  }, [sentenceSource, leaderboard.source]);

  async function loadSentence(nextDifficulty = difficulty) {
    setLoadingSentence(true);
    setBanner(null);
    const result = await fetchRandomSentence({ difficulty: nextDifficulty });
    setSentence(result.sentence);
    setSentenceSource(result.source);
    if (result.source === 'mock') {
      setBanner({
        type: 'error',
        message: `Backend unavailable for /sentence; using mock sentence fallback. (${result.error || 'unknown error'})`,
      });
    }
    setLoadingSentence(false);
    setStatus('ready');
  }

  async function loadLeaderboard() {
    setLeaderboard((prev) => ({ ...prev, loading: true, error: null }));
    const result = await fetchLeaderboard();
    setLeaderboard({
      items: result.items || [],
      loading: false,
      error: result.source === 'mock' ? result.error : null,
      source: result.source || 'unknown',
    });
  }

  useEffect(() => {
    // Initial content load
    loadSentence('medium');
    loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Keep timeLeft in sync if duration changes while not running.
    if (status !== 'running') {
      setTimeLeftSeconds(durationSeconds);
      setElapsedSeconds(0);
    }
  }, [durationSeconds, status]);

  function clearTimer() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function start() {
    if (!sentence || loadingSentence) return;
    setBanner(null);
    setStatus('running');

    // Reset typing if starting from idle/ready/finished.
    setTyped('');

    setTimeLeftSeconds(durationSeconds);
    setElapsedSeconds(0);

    clearTimer();
    const startedAt = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, durationSeconds - elapsed);
      setElapsedSeconds(elapsed);
      setTimeLeftSeconds(left);

      if (left <= 0) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
        setStatus('finished');
      }
    }, 200);
  }

  function restart() {
    clearTimer();
    setTyped('');
    setElapsedSeconds(0);
    setTimeLeftSeconds(durationSeconds);
    setStatus('ready');
  }

  async function finishAndSubmit() {
    // Called when user completes sentence early.
    clearTimer();
    setStatus('finished');

    // Minimal username prompt for now (no auth in scope)
    const username = window.prompt('Submit score as (username):', 'Anonymous') || 'Anonymous';

    const payload = {
      username,
      wpm,
      accuracy,
      difficulty,
      elapsedSeconds: elapsedSeconds || (durationSeconds - timeLeftSeconds),
    };

    const result = await submitScore(payload);
    if (!result.ok) {
      setBanner({
        type: 'error',
        message: `Score not submitted (backend unavailable). You can still view mock leaderboard. (${result.error || 'unknown error'})`,
      });
    } else {
      setBanner({ type: 'info', message: 'Score submitted successfully.' });
      // Refresh leaderboard after submission
      await loadLeaderboard();
    }
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => clearTimer();
  }, []);

  const isRunning = status === 'running';
  const isFinished = status === 'finished';

  useEffect(() => {
    // If the user typed the whole sentence correctly, finish early (only while running).
    if (!isRunning) return;
    if (!sentence) return;

    if (typed.length >= sentence.length) {
      // Only finish early if the entire typed string matches exactly.
      if (typed === sentence) {
        finishAndSubmit();
      } else {
        // Typed length reached, but with errors; let them correct.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, isRunning, sentence]);

  const inputDisabled = !isRunning || loadingSentence;

  return (
    <div className="tc-shell">
      <Header
        timeLeftSeconds={timeLeftSeconds}
        elapsedSeconds={elapsedSeconds}
        isRunning={isRunning}
        difficulty={difficulty}
        apiStatus={apiStatus}
      />

      <main className="tc-main" role="main">
        <div className="tc-container">
          <div className="tc-panel">
            <div className="tc-panel-body">
              <div className="tc-row" style={{ marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Game</div>
                  <div className="tc-muted">Type the sentence as fast and accurately as you can.</div>
                </div>

                <div className="tc-controls" aria-label="Game controls">
                  <div style={{ minWidth: 160 }}>
                    <span className="tc-label">Difficulty</span>
                    <select
                      className="tc-select"
                      value={difficulty}
                      onChange={async (e) => {
                        const next = e.target.value;
                        setDifficulty(next);
                        await loadSentence(next);
                        restart();
                      }}
                      disabled={isRunning}
                      aria-label="Select difficulty"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div style={{ minWidth: 140 }}>
                    <span className="tc-label">Timer</span>
                    <select
                      className="tc-select"
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value))}
                      disabled={isRunning}
                      aria-label="Select timer duration"
                    >
                      <option value={30}>30s</option>
                      <option value={60}>60s</option>
                      <option value={90}>90s</option>
                    </select>
                  </div>

                  <button
                    className="tc-button tc-button-success"
                    onClick={start}
                    disabled={loadingSentence || isRunning || status === 'idle'}
                    aria-label="Start game"
                  >
                    Start
                  </button>

                  <button
                    className="tc-button tc-button-secondary"
                    onClick={restart}
                    disabled={loadingSentence}
                    aria-label="Restart"
                  >
                    Restart
                  </button>

                  <button
                    className="tc-button"
                    onClick={async () => {
                      await loadSentence(difficulty);
                      restart();
                    }}
                    disabled={loadingSentence || isRunning}
                    aria-label="Get a new sentence"
                  >
                    New sentence
                  </button>
                </div>
              </div>

              {banner && (
                <div
                  className={`tc-banner ${banner.type === 'error' ? 'tc-error' : ''}`}
                  role={banner.type === 'error' ? 'alert' : 'status'}
                  style={{ marginBottom: 12 }}
                >
                  {banner.message}
                </div>
              )}

              {loadingSentence ? (
                <div className="tc-banner tc-loading">Loading sentence…</div>
              ) : (
                <SentenceDisplay sentence={sentence} typed={typed} />
              )}

              <div style={{ marginTop: 14 }}>
                <TypingInput
                  value={typed}
                  onChange={(val) => {
                    if (!isRunning) return;
                    setTyped(val);
                  }}
                  disabled={inputDisabled}
                  autoFocus
                  placeholder={isRunning ? 'Type here…' : 'Press Start to begin…'}
                  onEnter={() => {
                    if (isFinished) restart();
                  }}
                />
              </div>

              <StatsPanel wpm={wpm} accuracy={accuracy} totalTyped={totalTyped} />

              <div style={{ marginTop: 14 }} className="tc-row">
                <div className="tc-muted">
                  Sentence source: <strong>{sentenceSource}</strong>
                </div>

                <div className="tc-controls">
                  <button
                    className="tc-button"
                    onClick={finishAndSubmit}
                    disabled={!isRunning}
                    aria-label="Submit score now"
                    title="Submits score immediately (useful if you want to end early)."
                  >
                    Submit score
                  </button>

                  <button
                    className="tc-button tc-button-secondary"
                    onClick={() => {
                      // Keyboard accessibility: focus the input quickly.
                      const el = document.getElementById('typing-input');
                      if (el) el.focus();
                    }}
                    aria-label="Focus typing input"
                  >
                    Focus input
                  </button>
                </div>
              </div>

              {isFinished && (
                <div className="tc-banner" style={{ marginTop: 12 }}>
                  Time’s up! You can restart or submit your score.
                </div>
              )}
            </div>
          </div>

          <LeaderboardPanel
            title="Top scores"
            items={leaderboard.items}
            loading={leaderboard.loading}
            error={leaderboard.error}
            source={leaderboard.source}
          />
        </div>
      </main>

      <footer className="tc-footer">
        Keyboard: Tab to controls · Enter to activate buttons · Type in the input when running.
      </footer>
    </div>
  );
}
