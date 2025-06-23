import api from '../http/axios';

/**
 * The 'authService' provides functions for all authentication-related API calls.
 * It abstracts away the HTTP requests and uses the centralized 'api' (axios) instance.
 * Following the "Service-Layer-First" principle from docs/04_FRONTEND.md.
 */
export const register = (userData) => {
  // The backend API for registration as per docs/09_USER_SERVICE.md
  // The correct endpoint is /api/v1/auth/register as per the latest docs.
  return api.post('/v1/auth/register', userData);
};

export const login = (credentials) => {
  // The backend API for login
  return api.post('/v1/auth/login', credentials);
};

export const sendVerificationCode = (email) => {
  return api.post('/v1/auth/send-verification-code', { email });
};

export const verifyCode = (email, code) => {
  return api.post('/v1/auth/verify-code', { email, code });
}; 