import httpClient from '../http/instance';
import ApiCache from '../http/cache';
import { API_PATHS, CACHE_CONFIG } from '../../constants/api';

/**
 * 用户服务 - 处理用户相关的API调用
 */
const userService = {
  /**
   * 获取用户个人信息
   * @returns {Promise<Object>} 用户信息
   */
  getProfile: ApiCache.withCache(
    async () => {
      return httpClient.get(API_PATHS.USER.PROFILE);
    },
    CACHE_CONFIG.TTL.MEDIUM
  ),

  /**
   * 更新用户个人信息
   * @param {Object} profileData - 更新的个人信息数据
   * @returns {Promise<Object>} 更新结果
   */
  updateProfile: async (profileData) => {
    // 更新用户信息后，清除缓存
    ApiCache.remove(API_PATHS.USER.PROFILE);
    return httpClient.put(API_PATHS.USER.UPDATE_PROFILE, profileData);
  },

  /**
   * 获取用户地址列表
   * @returns {Promise<Array>} 地址列表
   */
  getAddresses: ApiCache.withCache(
    async () => {
      return httpClient.get(API_PATHS.USER.ADDRESSES);
    },
    CACHE_CONFIG.TTL.MEDIUM
  ),

  /**
   * 添加新地址
   * @param {Object} addressData - 地址数据
   * @returns {Promise<Object>} 添加结果
   */
  addAddress: async (addressData) => {
    // 添加地址后，清除地址列表缓存
    ApiCache.remove(API_PATHS.USER.ADDRESSES);
    return httpClient.post(API_PATHS.USER.ADDRESSES, addressData);
  },

  /**
   * 更新地址
   * @param {string} addressId - 地址ID
   * @param {Object} addressData - 更新的地址数据
   * @returns {Promise<Object>} 更新结果
   */
  updateAddress: async (addressId, addressData) => {
    // 更新地址后，清除地址列表缓存
    ApiCache.remove(API_PATHS.USER.ADDRESSES);
    return httpClient.put(`${API_PATHS.USER.ADDRESSES}/${addressId}`, addressData);
  },

  /**
   * 删除地址
   * @param {string} addressId - 地址ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteAddress: async (addressId) => {
    // 删除地址后，清除地址列表缓存
    ApiCache.remove(API_PATHS.USER.ADDRESSES);
    return httpClient.delete(`${API_PATHS.USER.ADDRESSES}/${addressId}`);
  },

  /**
   * 设置支付密码
   * @param {string} password - 支付密码
   * @returns {Promise<Object>} 设置结果
   */
  setPaymentPassword: async (password) => {
    return httpClient.post(API_PATHS.USER.PAYMENT_PASSWORD, { password });
  },

  /**
   * 验证支付密码
   * @param {string} password - 支付密码
   * @returns {Promise<Object>} 验证结果
   */
  verifyPaymentPassword: async (password) => {
    return httpClient.post(`${API_PATHS.USER.PAYMENT_PASSWORD}/verify`, { password });
  },

  /**
   * 重置支付密码
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>} 重置结果
   */
  resetPaymentPassword: async (oldPassword, newPassword) => {
    return httpClient.put(API_PATHS.USER.PAYMENT_PASSWORD, { 
      oldPassword, 
      newPassword 
    });
  }
};

export default userService; 