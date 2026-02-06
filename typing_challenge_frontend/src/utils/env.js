/**
 * Environment helpers for the Typing Speed Challenge frontend.
 *
 * CRA exposes variables prefixed with REACT_APP_ at build time.
 */

// PUBLIC_INTERFACE
export function getEnv(name, fallback = '') {
  /** Get an environment variable (CRA-style), with a fallback. */
  // eslint-disable-next-line no-undef
  const value = typeof process !== 'undefined' ? process.env[name] : undefined;
  return value ?? fallback;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Resolve the API base URL used for REST requests.
   *
   * Priority:
   * 1) REACT_APP_API_BASE
   * 2) REACT_APP_BACKEND_URL
   * 3) Same-origin "/api" (useful if frontend is served behind a proxy)
   */
  const apiBase = getEnv('REACT_APP_API_BASE', '').trim();
  if (apiBase) return stripTrailingSlash(apiBase);

  const backendUrl = getEnv('REACT_APP_BACKEND_URL', '').trim();
  if (backendUrl) return stripTrailingSlash(backendUrl);

  return '/api';
}

// PUBLIC_INTERFACE
export function getFrontendUrl() {
  /** Exposes the configured frontend URL (if any). */
  return getEnv('REACT_APP_FRONTEND_URL', '').trim();
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Exposes the configured websocket URL (if any). */
  return getEnv('REACT_APP_WS_URL', '').trim();
}

// PUBLIC_INTERFACE
export function getNodeEnv() {
  /** Exposes the configured node env (e.g., development/production). */
  return getEnv('REACT_APP_NODE_ENV', getEnv('NODE_ENV', 'development'));
}

function stripTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
