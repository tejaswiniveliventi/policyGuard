/**
 * services/auth.js
 * 
 * JWT token management and authentication utilities.
 * 
 * Handles:
 * - Storing/retrieving JWT tokens from localStorage
 * - Decoding JWT to extract user info
 * - Token expiration checking
 * - Session management
 */

const TOKEN_KEY = 'policyguard_token';
const REFRESH_TOKEN_KEY = 'policyguard_refresh_token';

/**
 * Store JWT token in localStorage
 */
export const setStoredToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve JWT token from localStorage
 */
export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 */
export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Store refresh token
 */
export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Get refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Decode JWT payload (base64 decode)
 * Note: This does NOT verify signature - only for reading claims
 * Real verification happens on backend
 */
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
};

/**
 * Get user info from token
 */
export const getUserFromToken = (token) => {
  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    id: payload.sub || payload.id,
    email: payload.email,
    name: payload.name,
    org_id: payload.org_id,
    roles: payload.roles || [],
  };
};

/**
 * Check if user has a specific role
 */
export const hasRole = (token, role) => {
  const user = getUserFromToken(token);
  if (!user) return false;
  return user.roles.includes(role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (token) => {
  return hasRole(token, 'admin');
};

/**
 * Get time until token expires (in seconds)
 */
export const getTokenTimeRemaining = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return 0;

  return Math.floor(payload.exp - Date.now() / 1000);
};

/**
 * Check if token should be refreshed (less than 5 minutes remaining)
 */
export const shouldRefreshToken = (token) => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining < 300; // 5 minutes
};

/**
 * Validate stored token
 * Returns user info if valid, null if invalid or expired
 */
export const validateStoredToken = () => {
  const token = getStoredToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    removeStoredToken();
    return null;
  }

  return getUserFromToken(token);
};
