import axios from '../../utils/axios';

/**
 * 内容服务API
 */
const contentService = {
  /**
   * 获取内容列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回内容列表
   */
  getContents: (params) => {
    return axios.get('/api/v1/contents', { params });
  },

  /**
   * 获取内容详情
   * @param {string} contentId - 内容ID
   * @returns {Promise} - 返回内容详情
   */
  getContentDetail: (contentId) => {
    return axios.get(`/api/v1/contents/${contentId}`);
  },

  /**
   * 创建内容
   * @param {Object} contentData - 内容数据
   * @returns {Promise} - 返回创建结果
   */
  createContent: (contentData) => {
    return axios.post('/api/v1/contents', contentData);
  },

  /**
   * 更新内容
   * @param {string} contentId - 内容ID
   * @param {Object} contentData - 内容数据
   * @returns {Promise} - 返回更新结果
   */
  updateContent: (contentId, contentData) => {
    return axios.put(`/api/v1/contents/${contentId}`, contentData);
  },

  /**
   * 删除内容
   * @param {string} contentId - 内容ID
   * @returns {Promise} - 返回删除结果
   */
  deleteContent: (contentId) => {
    return axios.delete(`/api/v1/contents/${contentId}`);
  },

  /**
   * 点赞内容
   * @param {string} contentId - 内容ID
   * @returns {Promise} - 返回点赞结果
   */
  likeContent: (contentId) => {
    return axios.post(`/api/v1/contents/${contentId}/like`);
  },

  /**
   * 取消点赞内容
   * @param {string} contentId - 内容ID
   * @returns {Promise} - 返回取消点赞结果
   */
  unlikeContent: (contentId) => {
    return axios.post(`/api/v1/contents/${contentId}/unlike`);
  }
};

export { contentService }; 