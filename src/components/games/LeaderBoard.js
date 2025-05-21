import React, { useState, useEffect } from 'react';
import './LeaderBoard.css';
import instance from '../../utils/axios';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global'); // 'global', 'weekly', 'friends'

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const fetchLeaderboard = async (type) => {
    try {
      setLoading(true);
      const response = await instance.get(`/game/leaderboard?type=${type}&limit=10`);
      
      if (response.data && response.data.code === 200) {
        setLeaderboard(response.data.data || []);
      } else {
        // 使用默认数据
        setDefaultLeaderboard();
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
      setDefaultLeaderboard();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultLeaderboard = () => {
    const defaultData = [
      { userId: 1, nickname: "用户8752", avatar: null, totalPoints: 3250, rank: 1 },
      { userId: 2, nickname: "用户3641", avatar: null, totalPoints: 2840, rank: 2 },
      { userId: 3, nickname: "用户5891", avatar: null, totalPoints: 2530, rank: 3 },
      { userId: 4, nickname: "用户7462", avatar: null, totalPoints: 2100, rank: 4 },
      { userId: 5, nickname: "用户2198", avatar: null, totalPoints: 1950, rank: 5 },
    ];
    setLeaderboard(defaultData);
  };

  return (
    <div className="leaderboard">
      {/* 排行榜切换选项卡 */}
      <div className="leaderboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          全球排行
        </button>
        <button 
          className={`tab-button ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          本周榜单
        </button>
        <button 
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          好友排名
        </button>
      </div>

      {/* 排行榜内容 */}
      {loading ? (
        <div className="loading-container">
          <div className="brand-loader">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      ) : (
        <div className="leaderboard-content">
          {leaderboard.length === 0 ? (
            <div className="empty-leaderboard">
              <p>暂无排行数据</p>
            </div>
          ) : (
            leaderboard.map((player, index) => (
              <div 
                key={player.userId} 
                className={`leaderboard-item ${index < 3 ? 'top-three' : ''} ${player.isCurrentUser ? 'current-user' : ''}`}
              >
                <div className="leaderboard-rank">
                  {index < 3 ? (
                    <div className={`medal rank-${index + 1}`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  ) : (
                    <div className="rank-number">{index + 1}</div>
                  )}
                </div>
                <div className="leaderboard-user">
                  <div className="user-avatar">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.nickname} />
                    ) : (
                      <div className="default-avatar">{player.nickname.charAt(0)}</div>
                    )}
                  </div>
                  <div className="user-name">
                    {player.nickname}
                    {player.isCurrentUser && <span className="user-badge">我</span>}
                  </div>
                </div>
                <div className="leaderboard-score">
                  {player.totalPoints} 分
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
