import httpClient from '../http/instance';
import ApiCache from '../http/cache';
import { API_PATHS, CACHE_CONFIG } from '../../constants/api';

/**
 * 商品服务 - 处理商品相关的API调用
 */
const productService = {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.category - 分类ID
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.sortBy - 排序字段
   * @param {string} params.order - 排序方式(asc/desc)
   * @returns {Promise<Object>} 商品列表结果
   */
  getProducts: ApiCache.withCache(
    async (params = {}) => {
      return httpClient.get(API_PATHS.PRODUCT.LIST, { params });
    },
    CACHE_CONFIG.TTL.SHORT
  ),

  /**
   * 获取商品详情
   * @param {string} id - 商品ID
   * @returns {Promise<Object>} 商品详情
   */
  getProductDetail: ApiCache.withCache(
    async (id) => {
      return httpClient.get(API_PATHS.PRODUCT.DETAIL(id));
    },
    CACHE_CONFIG.TTL.MEDIUM
  ),

  /**
   * 获取推荐商品列表
   * @param {Object} params - 查询参数
   * @param {number} params.limit - 推荐商品数量
   * @param {string} params.userId - 用户ID
   * @param {string} params.categoryId - 分类ID
   * @returns {Promise<Array>} 推荐商品列表
   */
  getRecommendedProducts: ApiCache.withCache(
    async (params = {}) => {
      return httpClient.get(API_PATHS.PRODUCT.RECOMMEND, { params });
    },
    CACHE_CONFIG.TTL.SHORT
  ),

  /**
   * 获取商品分类列表
   * @returns {Promise<Array>} 分类列表
   */
  getCategories: ApiCache.withCache(
    async () => {
      return httpClient.get(API_PATHS.PRODUCT.CATEGORIES);
    },
    CACHE_CONFIG.TTL.LONG
  ),

  /**
   * 搜索商品
   * @param {string} keyword - 搜索关键词
   * @param {Object} params - 其他查询参数
   * @returns {Promise<Object>} 搜索结果
   */
  searchProducts: async (keyword, params = {}) => {
    return httpClient.get(API_PATHS.PRODUCT.LIST, { 
      params: { 
        ...params,
        keyword 
      } 
    });
  },

  /**
   * 获取商品评价列表
   * @param {string} productId - 商品ID
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 评价列表结果
   */
  getProductReviews: ApiCache.withCache(
    async (productId, params = {}) => {
      return httpClient.get(`${API_PATHS.PRODUCT.DETAIL(productId)}/reviews`, { params });
    },
    CACHE_CONFIG.TTL.MEDIUM
  ),

  /**
   * 提交商品评价
   * @param {string} productId - 商品ID
   * @param {Object} reviewData - 评价数据
   * @returns {Promise<Object>} 提交结果
   */
  submitProductReview: async (productId, reviewData) => {
    // 清除相关缓存
    ApiCache.remove(`${API_PATHS.PRODUCT.DETAIL(productId)}/reviews`);
    ApiCache.remove(API_PATHS.PRODUCT.DETAIL(productId));
    
    return httpClient.post(`${API_PATHS.PRODUCT.DETAIL(productId)}/reviews`, reviewData);
  }
};

export default productService; 