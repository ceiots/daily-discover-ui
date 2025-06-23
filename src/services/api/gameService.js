import axios from '../http/instance';

/**
 * 游戏服务API
 */
const gameService = {
  /**
   * 获取游戏列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回游戏列表
   */
  getGames: (params) => {
    return axios.get('/api/v1/games', { params });
  },

  /**
   * 获取游戏详情
   * @param {string} gameId - 游戏ID
   * @returns {Promise} - 返回游戏详情
   */
  getGameDetail: (gameId) => {
    return axios.get(`/api/v1/games/${gameId}`);
  },

  /**
   * 提交游戏分数
   * @param {string} gameId - 游戏ID
   * @param {Object} scoreData - 分数数据
   * @returns {Promise} - 返回提交结果
   */
  submitScore: (gameId, scoreData) => {
    return axios.post(`/api/v1/games/${gameId}/scores`, scoreData);
  },

  /**
   * 获取游戏排行榜
   * @param {string} gameId - 游戏ID
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回排行榜数据
   */
  getLeaderboard: (gameId, params) => {
    return axios.get(`/api/v1/games/${gameId}/leaderboard`, { params });
  },

  /**
   * 获取用户游戏记录
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回用户游戏记录
   */
  getUserGameRecords: (params) => {
    return axios.get('/api/v1/games/user-records', { params });
  },

  /**
   * 获取游戏奖励
   * @param {string} gameId - 游戏ID
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回游戏奖励
   */
  getGameRewards: (gameId, params) => {
    return axios.get(`/api/v1/games/${gameId}/rewards`, { params });
  }
};

export { gameService };