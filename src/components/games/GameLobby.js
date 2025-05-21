import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from './GameCard';
import DailyTask from './DailyTask';
import LeaderBoard from './LeaderBoard';
import './GameLobby.css';
import instance from '../../utils/axios';

const GameLobby = () => {
  const [games, setGames] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 从API获取游戏数据和用户信息
    fetchGamesData();
    fetchUserGameStats();
    fetchDailyTasks();
  }, []);

  // 获取游戏数据
  const fetchGamesData = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/game/list');
      
      if (response.data && response.data.code === 200) {
        setGames(response.data.data || []);
      } else {
        // 使用默认数据
        setDefaultGames();
      }
    } catch (error) {
      console.error('获取游戏数据失败:', error);
      setDefaultGames();
    } finally {
      setLoading(false);
    }
  };

  // 获取用户游戏统计数据
  const fetchUserGameStats = async () => {
    try {
      const response = await instance.get('/game/user-stats');
      
      if (response.data && response.data.code === 200) {
        const stats = response.data.data;
        setUserScore(stats.totalPoints || 0);
        setUserRank(stats.rank || null);
      } else {
        // 设置默认值
        setUserScore(0);
        setUserRank(null);
      }
    } catch (error) {
      console.error('获取用户游戏统计失败:', error);
      // 设置默认值
      setUserScore(0);
      setUserRank(null);
    }
  };

  // 获取每日任务
  const fetchDailyTasks = async () => {
    try {
      const response = await instance.get('/game/daily-tasks');
      
      if (response.data && response.data.code === 200) {
        setDailyTasks(response.data.data || []);
      } else {
        // 使用默认数据
        setDefaultTasks();
      }
    } catch (error) {
      console.error('获取每日任务失败:', error);
      setDefaultTasks();
    }
  };

  // 设置默认游戏数据
  const setDefaultGames = () => {
    setGames([
      {
        id: "productQuiz",
        title: "商品知识问答",
        description: "测试您对商品的了解程度",
        icon: "question-circle",
        playerCount: 1243,
        difficulty: 2,
        theme: "purple"
      },
      {
        id: "priceGuess",
        title: "价格竞猜",
        description: "猜测商品的实际价格",
        icon: "money-bill",
        playerCount: 1576,
        difficulty: 3,
        theme: "green"
      },
      {
        id: "styleMatch",
        title: "风格配对挑战",
        description: "匹配不同的时尚风格",
        icon: "palette",
        playerCount: 987,
        difficulty: 1,
        theme: "blue"
      },
      {
        id: "brandChallenge",
        title: "品牌高手挑战",
        description: "测试您对品牌的了解",
        icon: "trademark",
        playerCount: 1123,
        difficulty: 2,
        theme: "red"
      }
    ]);
  };

  // 设置默认任务数据
  const setDefaultTasks = () => {
    setDailyTasks([
      {
        id: 1,
        title: "完成3场问答游戏",
        description: "参与并完成3场商品知识问答游戏",
        reward: 50,
        progress: 0,
        target: 3,
        completed: false
      },
      {
        id: 2,
        title: "累计获得300分",
        description: "在任意游戏中累计获得300分",
        reward: 80,
        progress: 0,
        target: 300,
        completed: false
      },
      {
        id: 3,
        title: "连续答对5题",
        description: "在一场游戏中连续答对5道题目",
        reward: 100,
        progress: 0,
        target: 5,
        completed: false
      }
    ]);
  };

  const handleGameSelect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="game-lobby">
      <div className="user-game-stats">
        <div className="user-score">
          <span className="score-icon">🏆</span>
          <span className="score-value">{userScore}</span>
          <span className="score-label">积分</span>
        </div>
        <div className="user-rank">
          <span className="rank-icon">🥇</span>
          <span className="rank-value">{userRank || '-'}</span>
          <span className="rank-label">排名</span>
        </div>
      </div>

      <h2 className="section-title">趣味挑战</h2>
      {loading ? (
        <div className="loading-container">
          <div className="brand-loader">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      ) : (
        <div className="games-grid">
          {games.map(game => (
            <GameCard 
              key={game.id}
              game={game}
              onClick={() => handleGameSelect(game.id)}
            />
          ))}
        </div>
      )}

      <h2 className="section-title">每日任务</h2>
      <DailyTask tasks={dailyTasks} />

      <h2 className="section-title">排行榜</h2>
      <LeaderBoard />
    </div>
  );
};

export default GameLobby;
