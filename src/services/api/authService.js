import httpClient from '../http/instance';
import ApiCache from '../http/cache';
import { API_PATHS } from '../../constants/api';

/**
 * 认证服务 - 处理用户认证相关的API调用
 */
const authService = {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  login: async (username, password) => {
    return httpClient.post(API_PATHS.AUTH.LOGIN, { username, password });
  },

  /**
   * 用户注册
   * @param {Object} userData - 用户注册数据
   * @returns {Promise<Object>} 注册结果
   */
  register: async (userData) => {
    return httpClient.post(API_PATHS.AUTH.REGISTER, userData);
  },

  /**
   * 用户退出登录
   * @returns {Promise<Object>} 退出结果
   */
  logout: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await httpClient.post(API_PATHS.AUTH.LOGOUT);
      } finally {
        // 无论服务器响应如何，都清除本地存储
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
      }
    }
    return { success: true };
  },

  /**
   * 刷新Token
   * @returns {Promise<Object>} 刷新结果
   */
  refreshToken: async () => {
    return httpClient.post(API_PATHS.AUTH.REFRESH_TOKEN);
  },

  /**
   * 请求重置密码
   * @param {string} email - 用户邮箱
   * @returns {Promise<Object>} 请求结果
   */
  forgotPassword: async (email) => {
    return httpClient.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * 重置密码
   * @param {string} token - 重置密码令牌
   * @param {string} password - 新密码
   * @returns {Promise<Object>} 重置结果
   */
  resetPassword: async (token, password) => {
    return httpClient.post(API_PATHS.AUTH.RESET_PASSWORD, { token, password });
  },

  /**
   * 验证验证码
   * @param {string} code - 验证码
   * @param {string} type - 验证码类型
   * @returns {Promise<Object>} 验证结果
   */
  verifyCode: async (code, type) => {
    return httpClient.post(API_PATHS.AUTH.VERIFY_CODE, { code, type });
  }
};

export default authService; 