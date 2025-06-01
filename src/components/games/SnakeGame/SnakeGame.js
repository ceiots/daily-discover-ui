import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Trophy, Settings } from 'lucide-react';
import GameContainer from '../GameContainer';
import './SnakeGame.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 15, y: 15 };
const SWIPE_THRESHOLD = 20; // 降低滑动阈值，提高灵敏度


const SnakeGame = ({ onExit = () => {} }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameRunning, setGameRunning] = useState(true); // 默认游戏直接开始
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const [speed, setSpeed] = useState(150);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [highScore, setHighScore] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const gameLoopRef = useRef();
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastDirectionChangeRef = useRef(Date.now()); // 用于防止方向变化过快
  const directionChangeThreshold = 100; // 毫秒
  const gameBoardRef = useRef(null);
  
  // 游戏控制按钮
  const toggleGame = useCallback(() => {
    if (gameOver) {
      // 重置游戏
      setSnake(INITIAL_SNAKE);
      setDirection(INITIAL_DIRECTION);
      setFood(INITIAL_FOOD);
      setGameOver(false);
      setScore(0);
      setSpeed(difficulty === 'easy' ? 200 : difficulty === 'hard' ? 100 : 150);
      setGameRunning(true);
    } else {
      // 暂停/继续游戏
      setGameRunning(prev => !prev);
    }
  }, [gameOver, difficulty]);

  // 加载保存的游戏数据
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake_highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // 保存游戏数据
  const saveGameData = useCallback((game, key, value) => {
    localStorage.setItem(`${game}_${key}`, value);
  }, []);

  // 生成随机食物位置
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // 游戏主循环
  const gameLoop = useCallback(() => {
    setSnake(currentSnake => {
      if (currentSnake.length === 0) return currentSnake;
      
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;
      
      // 边界检测
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }
      
      // 自身碰撞检测
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }
      
      newSnake.unshift(head);
      
      // 食物检测
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            const newHighScore = newScore;
            setHighScore(newHighScore);
            saveGameData('snake', 'highScore', newHighScore);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        
        // 增加速度
        setSpeed(prev => Math.max(80, prev - 2));
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food, generateFood, highScore, saveGameData]);

  // 游戏循环定时器
  useEffect(() => {
    if (gameRunning && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, speed);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameRunning, gameOver, gameLoop, speed]);

  // 处理方向变化
  const handleDirectionChange = useCallback((dir) => {
    // 如果游戏未运行或已结束，不处理方向输入
    if (!gameRunning || gameOver) return;
    
    const now = Date.now();
    
    // 防止方向变化过快
    if (now - lastDirectionChangeRef.current < directionChangeThreshold) {
      return;
    }
    
    // 简化方向控制逻辑，直接使用GameContainer传来的方向对象
    // 防止180度转向
    if (
      (direction.x === 1 && dir.x === -1) ||
      (direction.x === -1 && dir.x === 1) ||
      (direction.y === 1 && dir.y === -1) ||
      (direction.y === -1 && dir.y === 1)
    ) {
      // 如果是180度转向，忽略这次输入
      return;
    }
    
    // 设置新方向
    setDirection(dir);
    lastDirectionChangeRef.current = now;
  }, [direction, gameRunning, gameOver]);

  // 添加键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameRunning || gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          handleDirectionChange({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          handleDirectionChange({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          handleDirectionChange({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          handleDirectionChange({ x: 1, y: 0 });
          break;
        case ' ':
          toggleGame();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDirectionChange, gameRunning, gameOver, toggleGame]);

  // 更改难度
  const changeDifficulty = useCallback((level) => {
    setDifficulty(level);
    
    // 根据难度调整速度
    if (level === 'easy') {
      setSpeed(200);
    } else if (level === 'normal') {
      setSpeed(150);
    } else {
      setSpeed(100);
    }
  }, []);

  return (
    <GameContainer 
      onExit={onExit} 
      title="贪吃蛇" 
      theme="default" 
      safeAreaBottom={true}
      showControls={true} 
      onDirectionChange={handleDirectionChange}
      onToggleGame={toggleGame}
      isGameRunning={gameRunning}
    >
      <div className="snake-game-wrapper">
        {/* 装饰性背景 */}
        <div className="decorative-bg">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
          <div className="bg-circle bg-circle-4"></div>
        </div>

        <div className="game-wrapper">
          {/* 头部信息 */}
          <div className="info-panel">
            <div className="panel-header">
              <div className="difficulty-display">
                <span className={`difficulty-badge ${
                  difficulty === 'easy' ? 'difficulty-easy' : 
                  difficulty === 'hard' ? 'difficulty-hard' : 
                  'difficulty-normal'
                }`}>
                  {difficulty === 'easy' ? '简单' : difficulty === 'hard' ? '困难' : '普通'}
                </span>
              </div>
              <div className="score-container">
                <div className="score-label">分数</div>
                <div className="score-value">{score}</div>
              </div>
              <div className="score-container">
                <div className="score-label">
                  <Trophy size={16} />
                  最高分
                </div>
                <div className="high-score-value">{highScore}</div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="settings-btn"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* 设置面板 */}
          {showSettings && (
            <div className="settings-panel">
              <h3 className="settings-title">游戏设置</h3>
              <div className="settings-group">
                <label className="settings-label">难度选择</label>
                <div className="difficulty-options">
                  {['easy', 'normal', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => changeDifficulty(level)}
                      className={`difficulty-btn ${
                        difficulty === level
                          ? 'difficulty-btn-active'
                          : 'difficulty-btn-inactive'
                      }`}
                    >
                      {level === 'easy' ? '简单' : level === 'hard' ? '困难' : '普通'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="settings-tip">
                <p>提示: 使用键盘方向键或屏幕下方的方向按钮控制蛇的移动</p>
              </div>
            </div>
          )}

          {/* 游戏区域 */}
          <div className="game-area">
            <div 
              className="game-board"
              ref={gameBoardRef}
              style={{ touchAction: 'none' }}
            >
              {/* 网格背景 */}
              <div className="grid-background">
                {Array.from({ length: GRID_SIZE }).map((_, row) =>
                  Array.from({ length: GRID_SIZE }).map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className="grid-cell"
                      style={{
                        left: `${(col / GRID_SIZE) * 100}%`,
                        top: `${(row / GRID_SIZE) * 100}%`,
                        width: `${100 / GRID_SIZE}%`,
                        height: `${100 / GRID_SIZE}%`,
                      }}
                    />
                  ))
                )}
              </div>

              {/* 贪吃蛇 */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`snake-segment ${index === 0 ? 'snake-head' : 'snake-body'}`}
                  style={{
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                  }}
                />
              ))}

              {/* 食物 */}
              <div
                className="food"
                style={{
                  left: `${(food.x / GRID_SIZE) * 100}%`,
                  top: `${(food.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                }}
              />

              {/* 游戏结束遮罩 */}
              {gameOver && (
                <div className="game-over-overlay">
                  <div className="game-over-content">
                    <div className="game-over-title">游戏结束</div>
                    <div className="final-score">最终得分: {score}</div>
                    {score === highScore && score > 0 && (
                      <div className="new-record">
                        <Trophy size={16} />
                        新纪录！
                      </div>
                    )}
                    <button 
                      className="restart-button"
                      onClick={toggleGame}
                    >
                      重新开始
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameContainer>
  );
};

SnakeGame.propTypes = {
  onExit: PropTypes.func
};

export default SnakeGame;