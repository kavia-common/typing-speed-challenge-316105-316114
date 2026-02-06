import { getApiBaseUrl } from '../utils/env';

const MOCK_SENTENCES = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'Typing is fun when you practice every day.',
    'Focus on accuracy before speed.',
  ],
  medium: [
    'Consistency beats intensity when learning a new skill.',
    'A calm mind types faster than a rushed one.',
    'Measure your progress and celebrate small wins.',
  ],
  hard: [
    'Sphinx of black quartz, judge my vow; pack my box with five dozen liquor jugs.',
    'Sympathizing would fix Quaker objectives; why vex, jack? (Punctuation makes it tricky.)',
    'The five boxing wizards jump quickly; how razorback-jumping frogs can level six piqued gymnasts!',
  ],
};

const MOCK_LEADERBOARD = [
  { id: 'm1', username: 'Avery', wpm: 78, accuracy: 97.4, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm2', username: 'Jordan', wpm: 71, accuracy: 96.2, createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 'm3', username: 'Sam', wpm: 64, accuracy: 94.9, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function fetchRandomSentence({ difficulty = 'medium' } = {}) {
  /**
   * Fetch a random sentence from the backend.
   *
   * Expected backend shape (recommended):
   *   GET /sentence?difficulty=easy|medium|hard => { sentence: string }
   *
   * Fallback: returns a locally generated sentence if the backend is unavailable.
   */
  const base = getApiBaseUrl();

  try {
    const url = `${base}/sentence?difficulty=${encodeURIComponent(difficulty)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await safeJson(res);
    const sentence = data?.sentence || data?.text || data?.data?.sentence;
    if (!sentence || typeof sentence !== 'string') throw new Error('Invalid sentence payload');

    return { sentence, source: 'backend' };
  } catch (err) {
    // TODO: Remove fallback when backend is guaranteed available.
    const pool = MOCK_SENTENCES[difficulty] ?? MOCK_SENTENCES.medium;
    const sentence = pool[Math.floor(Math.random() * pool.length)];
    return { sentence, source: 'mock', error: String(err?.message || err) };
  }
}

// PUBLIC_INTERFACE
export async function submitScore({ username, wpm, accuracy, difficulty, elapsedSeconds } = {}) {
  /**
   * Submit a score to the backend.
   *
   * Expected backend shape (recommended):
   *   POST /scores
   *   body: { username, wpm, accuracy, difficulty, elapsedSeconds }
   *
   * Fallback: no-op if backend is unavailable.
   */
  const base = getApiBaseUrl();

  try {
    const url = `${base}/scores`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, wpm, accuracy, difficulty, elapsedSeconds }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await safeJson(res);
    return { ok: true, data, source: 'backend' };
  } catch (err) {
    // TODO: Remove fallback when backend is guaranteed available.
    return { ok: false, source: 'mock', error: String(err?.message || err) };
  }
}

// PUBLIC_INTERFACE
export async function fetchLeaderboard() {
  /**
   * Fetch leaderboard entries from the backend.
   *
   * Expected backend shape (recommended):
   *   GET /leaderboard => { items: Array<{username,wpm,accuracy,createdAt}> }
   *
   * Fallback: return a mock leaderboard if backend is unavailable.
   */
  const base = getApiBaseUrl();

  try {
    const url = `${base}/leaderboard`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await safeJson(res);
    const items = data?.items || data?.leaderboard || data?.data || data;
    if (!Array.isArray(items)) throw new Error('Invalid leaderboard payload');

    return { items, source: 'backend' };
  } catch (err) {
    // TODO: Remove fallback when backend is guaranteed available.
    return { items: MOCK_LEADERBOARD, source: 'mock', error: String(err?.message || err) };
  }
}
