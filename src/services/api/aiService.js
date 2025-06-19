import axios from '../../utils/axios';

/**
 * AI服务API
 */
const aiService = {
  /**
   * 获取AI生成的内容推荐
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回AI推荐内容
   */
  getRecommendations: (params) => {
    return axios.get('/api/v1/ai/recommendations', { params });
  },

  /**
   * 获取AI生成的个性化内容
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回个性化内容
   */
  getPersonalizedContent: (params) => {
    return axios.get('/api/v1/ai/personalized', { params });
  },

  /**
   * 使用AI生成内容
   * @param {Object} data - 生成参数
   * @returns {Promise} - 返回生成的内容
   */
  generateContent: (data) => {
    return axios.post('/api/v1/ai/generate', data);
  },

  /**
   * 使用AI分析用户行为
   * @param {Object} data - 用户行为数据
   * @returns {Promise} - 返回分析结果
   */
  analyzeUserBehavior: (data) => {
    return axios.post('/api/v1/ai/analyze', data);
  },

  /**
   * 获取AI助手回答
   * @param {Object} data - 问题数据
   * @returns {Promise} - 返回AI助手回答
   */
  getAssistantResponse: (data) => {
    return axios.post('/api/v1/ai/assistant', data);
  }
};

export { aiService }; 