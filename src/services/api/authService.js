import httpClient from '../http/instance'; // 引入封装的axios实例
import { getDeviceInfo } from '../../utils/deviceInfo'; // 假设你有一个工具函数获取设备信息

/**
 * 认证服务 - 处理用户认证相关的API调用
 */
const authService = {
  /**
   * 发送验证码
   * @param {string} email - 目标邮箱
   * @param {number} type - 验证码类型 (2: 注册, 3: 重置密码)
   */
  async sendVerificationCode(email, type) {
    console.log(`[authService] Sending verification code to: ${email}, type: ${type}`);
    try {
      // 使用POST请求，符合RESTful规范（发送验证码是有副作用的操作）
      // API_BASE_URL已经包含了/daily-discover前缀，所以这里不需要重复添加
      const response = await httpClient.post('/api/v1/users/send-code', null, {
        params: { email, type },
      });
      console.log('[authService] sendVerificationCode success response:', response);
      return response;
    } catch (error) {
      console.error('[authService] sendVerificationCode error:', error.response?.data || error.message);
      throw error; // 重新抛出错误，让调用者（useRegisterPage）处理
    }
  },

  /**
   * 用户注册
   * @param {object} userData - { username, password, confirmPassword, email, code, nickname }
   */
  register(userData) {
    const deviceInfo = getDeviceInfo();
    const data = { ...userData, ...deviceInfo, codeType: 2 }; // 2 for email
    return httpClient.post('/api/v1/users/register', data);
  },

  /**
   * 用户登录
   * @param {object} credentials - { username, password }
   */
  login(credentials) {
    const deviceInfo = getDeviceInfo();
    const data = { ...credentials, ...deviceInfo };
    return httpClient.post('/api/v1/users/login', data);
  },

  /**
   * 重置密码
   * @param {object} data - { email, code, password }
   */
  resetPassword(data) {
    return httpClient.put('/api/v1/users/password/reset', null, {
      params: data,
    });
  },

  /**
   * 微信登录
   * 后端通过 code 换取 token 和用户信息
   * @param {string} code - 微信授权后返回的 code
   */
  loginWithWechat(code) {
    const deviceInfo = getDeviceInfo();
    return httpClient.post('/api/v1/users/login/third-party', null, {
      params: {
        type: 'wechat',
        code,
        deviceId: deviceInfo.deviceId,
        deviceType: deviceInfo.deviceType,
      },
    });
  },

  /**
   * 获取当前登录的用户信息
   */
  getCurrentUser() {
    // 假设你的后端有一个/me的接口来获取当前用户信息
    // 实际项目中，用户信息和token通常在登录后就保存到状态管理（如Redux/Context）
    // 这里仅为示例
    // return httpClient.get('/users/me'); 
    console.log("获取当前用户信息的功能需要后端提供相应接口，例如 /users/me");
    return Promise.resolve(null); // 暂时返回null
  },

  /**
   * 登出
   */
  logout() {
    // 通常是前端清除token和用户信息
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    // 如果后端有登出接口，也需要调用
    // return httpClient.post('/users/logout');
    return Promise.resolve();
  },
};

export { authService }; 