import httpClient from '../http/instance';

const BASE_URL = '/api/auth';

/**
 * authService 提供所有与认证相关的API调用功能。
 * 它抽象了HTTP请求细节，使用集中配置的axios实例。
 * 遵循"04_FRONTEND.md"中的"Service-Layer-First"原则。
 */

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.email - 用户邮箱
 * @param {string} credentials.password - 用户密码
 * @returns {Promise<Object>} 登录结果，包含用户信息和token
 */
export const login = async (credentials) => {
  const response = await httpClient.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object>} 注册结果
 */
export const register = async (userData) => {
  const response = await httpClient.post(`${BASE_URL}/register`, userData);
  return response.data;
};

/**
 * 发送验证码
 * @param {Object} data - 请求数据
 * @param {string} data.email - 用户邮箱
 * @param {string} data.type - 验证码类型（'register'|'reset'）
 * @returns {Promise<Object>} 发送结果
 */
export const sendVerificationCode = async (data) => {
  const response = await httpClient.post(`${BASE_URL}/send-code`, data);
  return response.data;
};

/**
 * 验证验证码
 * @param {Object} data - 验证数据
 * @param {string} data.email - 用户邮箱
 * @param {string} data.code - 验证码
 * @returns {Promise<Object>} 验证结果
 */
export const verifyCode = async (data) => {
  const response = await httpClient.post(`${BASE_URL}/verify-code`, data);
  return response.data;
};

/**
 * 重置密码
 * @param {Object} data - 重置密码数据
 * @returns {Promise<Object>} 重置结果
 */
export const resetPassword = async (data) => {
  const response = await httpClient.post(`${BASE_URL}/reset-password`, data);
  return response.data;
};

/**
 * 退出登录
 * @returns {Promise<Object>} 退出登录结果
 */
export const logout = async () => {
  const response = await httpClient.post(`${BASE_URL}/logout`);
  // 清除本地存储的令牌
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return response.data;
}; 