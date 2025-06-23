import axios from '../http/instance';

/**
 * 视频服务API
 */
const videoService = {
  /**
   * 获取视频列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回视频列表
   */
  getVideos: (params) => {
    return axios.get('/api/v1/videos', { params });
  },

  /**
   * 获取视频详情
   * @param {string} videoId - 视频ID
   * @returns {Promise} - 返回视频详情
   */
  getVideoDetail: (videoId) => {
    return axios.get(`/api/v1/videos/${videoId}`);
  },

  /**
   * 上传视频
   * @param {FormData} formData - 包含视频文件的表单数据
   * @returns {Promise} - 返回上传结果
   */
  uploadVideo: (formData) => {
    return axios.post('/api/v1/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * 更新视频信息
   * @param {string} videoId - 视频ID
   * @param {Object} videoData - 视频数据
   * @returns {Promise} - 返回更新结果
   */
  updateVideo: (videoId, videoData) => {
    return axios.put(`/api/v1/videos/${videoId}`, videoData);
  },

  /**
   * 删除视频
   * @param {string} videoId - 视频ID
   * @returns {Promise} - 返回删除结果
   */
  deleteVideo: (videoId) => {
    return axios.delete(`/api/v1/videos/${videoId}`);
  },

  /**
   * 获取推荐视频
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回推荐视频列表
   */
  getRecommendedVideos: (params) => {
    return axios.get('/api/v1/videos/recommended', { params });
  },

  /**
   * 视频点赞
   * @param {string} videoId - 视频ID
   * @returns {Promise} - 返回点赞结果
   */
  likeVideo: (videoId) => {
    return axios.post(`/api/v1/videos/${videoId}/like`);
  }
};

export { videoService };