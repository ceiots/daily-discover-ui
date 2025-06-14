import { CACHE_CONFIG } from '../../constants/api';

/**
 * API缓存服务
 * 用于缓存API响应，减少重复请求，提高性能
 */
class ApiCache {
  /**
   * 获取缓存键
   * @param {string} url - 请求地址
   * @param {Object} params - 请求参数
   * @returns {string} 缓存键
   */
  static getCacheKey(url, params = {}) {
    const paramString = params ? JSON.stringify(params) : '';
    return `${CACHE_CONFIG.PREFIX}${url}:${paramString}`;
  }

  /**
   * 从缓存获取数据
   * @param {string} url - 请求地址
   * @param {Object} params - 请求参数
   * @returns {Object|null} 缓存数据，如果没有缓存返回null
   */
  static get(url, params = {}) {
    const key = this.getCacheKey(url, params);
    try {
      const cacheData = localStorage.getItem(key);
      if (!cacheData) return null;
      
      const { data, expiry } = JSON.parse(cacheData);
      
      // 检查缓存是否过期
      if (expiry && expiry < Date.now()) {
        this.remove(url, params);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error retrieving data from cache:', error);
      return null;
    }
  }

  /**
   * 设置缓存
   * @param {string} url - 请求地址
   * @param {Object} params - 请求参数
   * @param {Object} data - 要缓存的数据
   * @param {number} ttl - 缓存有效期(秒)
   */
  static set(url, params = {}, data, ttl = CACHE_CONFIG.TTL.MEDIUM) {
    const key = this.getCacheKey(url, params);
    try {
      const cacheData = {
        data,
        expiry: Date.now() + (ttl * 1000) // 转换为毫秒
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting data in cache:', error);
    }
  }

  /**
   * 删除缓存
   * @param {string} url - 请求地址
   * @param {Object} params - 请求参数
   */
  static remove(url, params = {}) {
    const key = this.getCacheKey(url, params);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from cache:', error);
    }
  }

  /**
   * 清除所有缓存
   */
  static clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_CONFIG.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * 创建带缓存功能的API调用
   * @param {Function} apiCall - API调用函数
   * @param {number} ttl - 缓存有效期(秒)
   * @returns {Function} 带缓存功能的API调用函数
   */
  static withCache(apiCall, ttl = CACHE_CONFIG.TTL.MEDIUM) {
    return async function(...args) {
      // 第一个参数通常是URL，第二个是查询参数或body
      const url = args[0];
      const params = args.length > 1 ? args[1] : {};
      
      // 尝试从缓存获取
      const cachedData = ApiCache.get(url, params);
      if (cachedData !== null) {
        return cachedData;
      }
      
      // 如果没有缓存，调用API并缓存结果
      const response = await apiCall(...args);
      ApiCache.set(url, params, response, ttl);
      return response;
    };
  }
}

export default ApiCache; 