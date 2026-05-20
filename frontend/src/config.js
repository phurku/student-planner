const DEFAULT_API_BASE_URL = 'https://student-planner-backend-zbr2.onrender.com/api/v1';

const envApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim();
const isLocalApi = /127\.0\.0\.1|localhost/i.test(envApiBaseUrl);
const isBrowser = typeof window !== 'undefined';
const isLocalFrontend = isBrowser && /localhost|127\.0\.0\.1/i.test(window.location.hostname);

// Safety guard: never use localhost API when the frontend is deployed.
const resolvedApiBaseUrl = (!isLocalFrontend && isLocalApi)
  ? DEFAULT_API_BASE_URL
  : (envApiBaseUrl || DEFAULT_API_BASE_URL);

export const API_BASE_URL = resolvedApiBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.replace(/^\/+/, '');
  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
};