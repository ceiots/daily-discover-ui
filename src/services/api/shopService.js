import axios from '../http/instance';

/**
 * 店铺服务API
 */
const shopService = {
  /**
   * 获取店铺信息
   * @param {string} shopId - 店铺ID
   * @returns {Promise} - 返回店铺信息
   */
  getShopInfo: (shopId) => {
    return axios.get(`/api/v1/shops/${shopId}`);
  },

  /**
   * 获取当前用户的店铺信息
   * @returns {Promise} - 返回当前用户的店铺信息
   */
  getMyShop: () => {
    return axios.get('/api/v1/shops/my-shop');
  },

  /**
   * 创建店铺
   * @param {Object} shopData - 店铺数据
   * @returns {Promise} - 返回创建结果
   */
  createShop: (shopData) => {
    return axios.post('/api/v1/shops', shopData);
  },

  /**
   * 更新店铺信息
   * @param {string} shopId - 店铺ID
   * @param {Object} shopData - 店铺数据
   * @returns {Promise} - 返回更新结果
   */
  updateShop: (shopId, shopData) => {
    return axios.put(`/api/v1/shops/${shopId}`, shopData);
  },

  /**
   * 获取店铺商品列表
   * @param {string} shopId - 店铺ID
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回店铺商品列表
   */
  getShopProducts: (shopId, params) => {
    return axios.get(`/api/v1/shops/${shopId}/products`, { params });
  },

  /**
   * 获取店铺订单列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回店铺订单列表
   */
  getShopOrders: (params) => {
    return axios.get('/api/v1/shops/orders', { params });
  },

  /**
   * 获取店铺结算信息
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回店铺结算信息
   */
  getSettlements: (params) => {
    return axios.get('/api/v1/shops/settlements', { params });
  }
};

export { shopService };