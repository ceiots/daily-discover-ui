import axios from '../http/instance';

/**
 * 订单服务API
 */
const orderService = {
  /**
   * 创建订单
   * @param {Object} orderData - 订单数据
   * @returns {Promise} - 返回订单创建结果
   */
  createOrder: (orderData) => {
    return axios.post('/api/v1/orders', orderData);
  },

  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回订单列表
   */
  getOrders: (params) => {
    return axios.get('/api/v1/orders', { params });
  },

  /**
   * 获取订单详情
   * @param {string} orderId - 订单ID
   * @returns {Promise} - 返回订单详情
   */
  getOrderDetail: (orderId) => {
    return axios.get(`/api/v1/orders/${orderId}`);
  },

  /**
   * 取消订单
   * @param {string} orderId - 订单ID
   * @returns {Promise} - 返回取消结果
   */
  cancelOrder: (orderId) => {
    return axios.put(`/api/v1/orders/${orderId}/cancel`);
  },

  /**
   * 支付订单
   * @param {string} orderId - 订单ID
   * @param {Object} paymentData - 支付数据
   * @returns {Promise} - 返回支付结果
   */
  payOrder: (orderId, paymentData) => {
    return axios.post(`/api/v1/orders/${orderId}/pay`, paymentData);
  }
};

export { orderService };