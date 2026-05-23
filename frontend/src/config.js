const DEFAULT_API_BASE_URL = 'https://student-planner-backend-zbr2.onrender.com/api/v1';

const envApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim();
const isBrowser = typeof window !== 'undefined';
const browserHostname = isBrowser ? window.location.hostname : '';
const isLoopbackHost = (value = '') => /127\.0\.0\.1|localhost/i.test(value);

const resolveLocalApiBaseUrl = () => {
  if (!envApiBaseUrl || !isBrowser || !isLoopbackHost(envApiBaseUrl)) {
    return envApiBaseUrl;
  }

  // When the frontend is opened from another device on the same network,
  // reuse that hostname so requests target the developer machine instead of the phone itself.
  if (!isLoopbackHost(browserHostname)) {
    try {
      const lanApiUrl = new URL(envApiBaseUrl);
      lanApiUrl.hostname = browserHostname;
      return lanApiUrl.toString();
    } catch (error) {
      return envApiBaseUrl;
    }
  }

  return envApiBaseUrl;
};

const resolvedApiBaseUrl = resolveLocalApiBaseUrl() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = resolvedApiBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.replace(/^\/+/, '');
  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
};