const DEFAULT_API_BASE_URL = 'https://student-planner-backend-zbr2.onrender.com/api/v1';

export const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.replace(/^\/+/, '');
  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
};