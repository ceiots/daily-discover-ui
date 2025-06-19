import axios from '../../utils/axios';

/**
 * 购物车服务API
 */
const cartService = {
  /**
   * 获取购物车列表
   * @returns {Promise} - 返回购物车列表
   */
  getCart: () => {
    return axios.get('/api/v1/cart');
  },

  /**
   * 添加商品到购物车
   * @param {Object} item - 购物车项
   * @returns {Promise} - 返回添加结果
   */
  addToCart: (item) => {
    return axios.post('/api/v1/cart', item);
  },

  /**
   * 更新购物车项
   * @param {string} itemId - 购物车项ID
   * @param {Object} data - 更新数据
   * @returns {Promise} - 返回更新结果
   */
  updateCartItem: (itemId, data) => {
    return axios.put(`/api/v1/cart/${itemId}`, data);
  },

  /**
   * 删除购物车项
   * @param {string} itemId - 购物车项ID
   * @returns {Promise} - 返回删除结果
   */
  removeCartItem: (itemId) => {
    return axios.delete(`/api/v1/cart/${itemId}`);
  },

  /**
   * 清空购物车
   * @returns {Promise} - 返回清空结果
   */
  clearCart: () => {
    return axios.delete('/api/v1/cart');
  },

  /**
   * 结算购物车
   * @param {Array} itemIds - 购物车项ID数组
   * @returns {Promise} - 返回结算结果
   */
  checkout: (itemIds) => {
    return axios.post('/api/v1/cart/checkout', { itemIds });
  }
};

export { cartService }; 