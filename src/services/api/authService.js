import axios from '../http/axios';

const API_BASE_URL = '/api/auth';

/**
 * The 'authService' provides functions for all authentication-related API calls.
 * It abstracts away the HTTP requests and uses the centralized 'axios' instance.
 * Following the "Service-Layer-First" principle from docs/04_FRONTEND.md.
 */

/**
 * 用户注册
 * @param {object} userData - 包含 username, email, password 的对象
 * @returns {Promise<any>}
 */
export const register = (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};

/**
 * 用户登录
 * @param {object} credentials - 包含 email, password 的对象
 * @returns {Promise<any>}
 */
export const login = (credentials) => {
  return axios.post(`${API_BASE_URL}/login`, credentials);
};

/**
 * 发送验证码
 * @param {string} email - 接收验证码的邮箱
 * @returns {Promise<any>}
 */
export const sendVerificationCode = (email) => {
  return axios.post(`${API_BASE_URL}/send-verification-code`, { email });
};

export const verifyCode = (email, code) => {
  return axios.post('/v1/auth/verify-code', { email, code });
}; 