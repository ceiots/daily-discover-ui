import axios from '../http/axios';

const API_BASE_URL = '/api/auth';

/**
 * authService 提供所有与认证相关的API调用功能。
 * 它抽象了HTTP请求细节，使用集中配置的axios实例。
 * 遵循"04_FRONTEND.md"中的"Service-Layer-First"原则。
 */

/**
 * 用户注册
 * @param {object} userData - 包含 username, email, password, code 的对象
 * @returns {Promise<object>} 返回注册结果
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登录
 * @param {object} credentials - 包含 email, password 的对象
 * @returns {Promise<object>} 返回登录结果，包含用户信息和令牌
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 发送验证码
 * @param {string} email - 接收验证码的邮箱
 * @param {string} [type='register'] - 验证码类型: 'register' 或 'reset'
 * @returns {Promise<object>} 返回发送结果
 */
export const sendVerificationCode = async (email, type = 'register') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-verification-code`, { 
      email, 
      type 
    });
    return response;
  } catch (error) {
    console.error('验证码发送失败:', error);
    throw error;
  }
};

/**
 * 验证邮箱验证码
 * @param {string} email - 邮箱
 * @param {string} code - 验证码
 * @returns {Promise<object>} 返回验证结果
 */
export const verifyCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-code`, { 
      email, 
      code 
    });
    return response;
  } catch (error) {
    console.error('验证码验证失败:', error);
    throw error;
  }
};

/**
 * 退出登录
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`);
    // 清除本地存储的令牌
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('退出登录失败:', error);
    // 即使API调用失败，也清除本地状态
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
}; 