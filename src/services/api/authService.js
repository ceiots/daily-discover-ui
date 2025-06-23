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
      // 根据后端接口定义，使用查询参数而不是请求体
      // 注意：UserController.java中的sendCode方法使用@RequestParam接收参数
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
    
    // 确保明确指定所有必要字段，特别是密码
    const data = {
      username: credentials.username,
      password: credentials.password,
      deviceId: deviceInfo.deviceId,
      deviceType: deviceInfo.deviceType,
      deviceModel: deviceInfo.deviceModel,
      osVersion: deviceInfo.osVersion,
      appVersion: deviceInfo.appVersion
    };
    
    // 添加详细日志
    console.log('[authService] Attempting login with:', {
      username: credentials.username,
      passwordProvided: !!credentials.password,
      passwordLength: credentials.password ? credentials.password.length : 0,
      deviceInfo: {
        deviceId: deviceInfo.deviceId,
        deviceType: deviceInfo.deviceType
      }
    });
    
    return httpClient.post('/api/v1/users/login', data)
      .then(response => {
        console.log('[authService] Login success response:', response);
        return response;
      })
      .catch(error => {
        console.error('[authService] Login error:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * 重置密码
   * @param {object} data - { email, code, password }
   */
  resetPassword(data) {
    // 确保明确指定所有必要字段
    const resetData = {
      email: data.email,
      code: data.code,
      password: data.password
    };
    
    console.log('[authService] Resetting password for email:', data.email);
    
    // 使用请求体而不是URL参数，确保密码安全传输
    return httpClient.put('/api/v1/users/password/reset', resetData);
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