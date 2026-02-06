# Typing Speed Challenge (Frontend)

React SPA for a typing speed game with timer, real-time WPM + accuracy, and a leaderboard.

## Run

```bash
npm install
npm start
```

Preview defaults to port **3000** (Create React App).

## Environment variables (CRA)

This app uses Create React App env vars (must be prefixed with `REACT_APP_`):

- `REACT_APP_API_BASE` (preferred): Base URL for API requests (e.g. `https://api.example.com` or `http://localhost:8080/api`)
- `REACT_APP_BACKEND_URL` (fallback): Alternate base URL if `REACT_APP_API_BASE` is not set
- `REACT_APP_FRONTEND_URL`: Optional informational frontend URL (not required)
- `REACT_APP_WS_URL`: Optional websocket URL (not used yet; reserved for future real-time features)
- `REACT_APP_NODE_ENV`: Optional; falls back to `NODE_ENV`

If neither `REACT_APP_API_BASE` nor `REACT_APP_BACKEND_URL` are set, the app uses same-origin `/api`.

### Backend endpoints expected

The frontend will try these endpoints:

- `GET  {API_BASE}/sentence?difficulty=easy|medium|hard` → `{ "sentence": "..." }`
- `POST {API_BASE}/scores` → accepts `{ username, wpm, accuracy, difficulty, elapsedSeconds }`
- `GET  {API_BASE}/leaderboard` → `{ "items": [...] }` (or a compatible array)

### Offline / backend unavailable behavior

If the backend endpoints are not reachable, the UI falls back to:
- mock sentences (per difficulty)
- mock leaderboard entries

This fallback is labeled as `mock` in the UI and includes a TODO to remove when backend is stable.
