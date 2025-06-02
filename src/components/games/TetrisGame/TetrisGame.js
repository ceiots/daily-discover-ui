import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import GameContainer from '../GameContainer';
import './TetrisGame.css';

// 方块类型定义
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00FFFF', // 青色
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000FF', // 蓝色
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#FF8C00', // 橙色
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#FFFF00', // 黄色
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00FF00', // 绿色
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#800080', // 紫色
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#FF0000', // 红色
  }
};

// 游戏常量
const STAGE_WIDTH = 10;
const STAGE_HEIGHT = 20;
const INITIAL_POSITION = { x: STAGE_WIDTH / 2 - 2, y: 0 };
const GAME_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete'
};

// 创建游戏区域二维数组
const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    Array(STAGE_WIDTH).fill([0, 'clear'])
  );

// 检查碰撞
const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y++) {
    for (let x = 0; x < player.tetromino[y].length; x++) {
      // 1. 检查是否在方块区域内
      if (player.tetromino[y][x] !== 0) {
        // 2. 检查移动是否在游戏区域边界内
        if (
          !stage[y + player.pos.y + moveY] ||
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 3. 检查移动位置是否已被占用
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// 随机生成方块
const randomTetromino = () => {
  const tetrominoes = 'IJLOSTZ';
  const randTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  return TETROMINOES[randTetromino];
};

// 加载和保存游戏数据的辅助函数
const loadGameData = (game, key, defaultValue) => {
  const savedValue = localStorage.getItem(`${game}_${key}`);
  return savedValue ? parseInt(savedValue, 10) : defaultValue;
};

const saveGameData = (game, key, value) => {
  localStorage.setItem(`${game}_${key}`, value);
};


// 主游戏组件
const TetrisGame = ({ onExit = () => {} }) => {
  // 游戏状态
  const [gameState, setGameState] = useState(GAME_STATES.LOADING);
  const [dropTime, setDropTime] = useState(null);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [stage, setStage] = useState(createStage());
  const [nextTetromino, setNextTetromino] = useState(null);
  const [heldTetromino, setHeldTetromino] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    return loadGameData('tetris', 'highScore', 0);
  });
  
  // 玩家状态
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOES.J.shape,
    collided: false,
    color: TETROMINOES.J.color,
  });

  // 游戏循环和触摸事件相关引用
  const gameAreaRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchTimeRef = useRef(0);
  const gameLoopRef = useRef(null);
  const requestRef = useRef(null);
  
  // 初始化游戏
  useEffect(() => {
    startGame();
  }, []);

  // 开始游戏
  const startGame = () => {
    // 重置游戏状态
    setStage(createStage());
    setDropTime(1000 / level);
    resetPlayer();
    setScore(0);
    setRows(0);
    setLevel(1);
    setNextTetromino(randomTetromino());
    setHeldTetromino(null);
    setCanHold(true);
    setGameState(GAME_STATES.PLAYING);
  };

  // 更新高分并保存
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      saveGameData('tetris', 'highScore', score);
    }
  }, [score, highScore]);

  // 重置玩家
  const resetPlayer = () => {
    setPlayer({
      pos: { x: INITIAL_POSITION.x, y: INITIAL_POSITION.y },
      tetromino: nextTetromino ? nextTetromino.shape : randomTetromino().shape,
      collided: false,
      color: nextTetromino ? nextTetromino.color : randomTetromino().color,
    });
    setNextTetromino(randomTetromino());
  };

  // 移动方块
  const movePlayer = (dir) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x + dir, y: prev.pos.y }
      }));
    }
  };

  // 方块下落
  const dropPlayer = () => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x, y: prev.pos.y + 1 }
      }));
    } else {
      // 如果碰撞了，着陆并检查游戏结束
      if (player.pos.y < 1) {
        setGameState(GAME_STATES.GAME_OVER);
        setDropTime(null);
      }
      setPlayer(prev => ({
        ...prev,
        collided: true
      }));
    }
  };

  // 立即降落到底部
  const dropToBottom = () => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    let newY = player.pos.y;
    while (!checkCollision(player, stage, { x: 0, y: newY - player.pos.y + 1 })) {
      newY++;
    }
    
    setPlayer(prev => ({
      ...prev,
      pos: { x: prev.pos.x, y: newY },
      collided: true
    }));
  };

  // 旋转方块
  const rotate = (matrix, dir) => {
    // 转置矩阵
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index])
    );
    // 根据方向反转每行或保持不变
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  // 旋转玩家控制的方块
  const rotatePlayer = (dir) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);
    
    // 处理旋转后的碰撞
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      // 尝试左右移动以适应旋转
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      // 如果偏移太大，放弃旋转
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    
    setPlayer(clonedPlayer);
  };
  
  // 保存/交换当前方块
  const holdTetromino = () => {
    if (!canHold || gameState !== GAME_STATES.PLAYING) return;
    
    if (!heldTetromino) {
      // 第一次保存方块
      setHeldTetromino({
        shape: player.tetromino,
        color: player.color
      });
      resetPlayer();
    } else {
      // 交换当前方块与保存的方块
      const currentTetromino = {
        shape: player.tetromino,
        color: player.color
      };
      
      setPlayer({
        pos: { x: INITIAL_POSITION.x, y: INITIAL_POSITION.y },
        tetromino: heldTetromino.shape,
        collided: false,
        color: heldTetromino.color
      });
      
      setHeldTetromino(currentTetromino);
    }
    
    setCanHold(false);
  };

  // 消除完整行
  const sweepRows = (newStage) => {
    let rowsCleared = 0;
    
    const stage = newStage.reduce((acc, row) => {
      // 如果没有空格（所有格子都被填充）
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        rowsCleared++;
        // 在顶部添加新的空行
        acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
        return acc;
      }
      acc.push(row);
      return acc;
    }, []);
    
    // 更新分数和行数
    if (rowsCleared > 0) {
      // 计算分数：随行数增加而指数增加
      const points = [40, 100, 300, 1200]; // 1、2、3、4行的分数
      setScore(prev => prev + points[rowsCleared - 1] * level);
      setRows(prev => prev + rowsCleared);
      
      // 每10行升一级
      if ((rows + rowsCleared) % 10 < rows % 10) {
        setLevel(prev => prev + 1);
        // 更新下落速度
        setDropTime(1000 / (level + 1));
      }
    }
    
    return stage;
  };

  // 更新舞台
  const updateStage = prevStage => {
    // 先清除上一帧的方块
    const newStage = prevStage.map(row =>
      row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
    );

    // 绘制当前方块
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newStage[y + player.pos.y][x + player.pos.x] = [
            value,
            `${player.collided ? 'merged' : 'clear'}`,
            player.color
          ];
        }
      });
    });

    // 检查碰撞
    if (player.collided) {
      // 生成新方块
      resetPlayer();
      // 允许再次保存方块
      setCanHold(true);
      // 消除完整行并更新
      return sweepRows(newStage);
    }

    return newStage;
  };

  // 游戏循环
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const gameLoop = setInterval(() => {
        dropPlayer();
      }, dropTime);
      
      gameLoopRef.current = gameLoop;
      
      return () => {
        clearInterval(gameLoop);
      };
    }
  }, [dropTime, gameState, player]);

  // 更新舞台
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const updateGameCanvas = () => {
        setStage(prev => updateStage(prev));
        requestRef.current = requestAnimationFrame(updateGameCanvas);
      };
      
      requestRef.current = requestAnimationFrame(updateGameCanvas);
      
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [player, gameState]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState !== GAME_STATES.PLAYING) return;
      switch (event.key) {
        case 'ArrowLeft':
          movePlayer(-1);
          break;
        case 'ArrowRight':
          movePlayer(1);
          break;
        case 'ArrowDown':
          dropPlayer();
          break;
        case 'ArrowUp':
          rotatePlayer(1);
          break;
        case ' ':
          dropToBottom();
          break;
        case 'c':
        case 'C':
          holdTetromino();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, player, stage]);

  
  // 暂停/继续游戏
  const togglePause = () => {
    if (gameState === GAME_STATES.PLAYING) {
      clearInterval(gameLoopRef.current);
      setGameState(GAME_STATES.PAUSED);
    } else if (gameState === GAME_STATES.PAUSED) {
      setGameState(GAME_STATES.PLAYING);
      setDropTime(1000 / level);
    }
  };
  
  // 绘制游戏区域
  const renderStage = () => (
    <div className="tetris-stage">
      {stage.map((row, y) => (
        <div className="tetris-row" key={y}>
          {row.map((cell, x) => (
            <div 
              className={`tetris-cell ${cell[1]}`} 
              key={x}
              style={{ backgroundColor: cell[0] !== 0 ? cell[2] : 'transparent' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
  
  // 绘制下一个方块
  const renderNextTetromino = () => {
    if (!nextTetromino) return null;
    
      return (
      <div className="next-tetromino">
        {nextTetromino.shape.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((cell, x) => (
              <div
                key={x}
                className="tetris-preview-cell"
                style={{
                  backgroundColor: cell !== 0 ? nextTetromino.color : 'transparent'
                }}
              />
            ))}
          </div>
        ))}
        </div>
      );
  };
  
  // 绘制保存的方块
  const renderHeldTetromino = () => {
    if (!heldTetromino) return null;

    return (
      <div className="held-tetromino">
        {heldTetromino.shape.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((cell, x) => (
              <div
                key={x}
                className="tetris-preview-cell"
                style={{
                  backgroundColor: cell !== 0 ? heldTetromino.color : 'transparent'
                }}
              />
            ))}
        </div>
        ))}
      </div>
    );
  };
  
  // 处理控制按钮的点击
  const handleControlClick = (action) => {
    switch(action) {
      case 'left':
        movePlayer(-1);
        break;
      case 'right':
        movePlayer(1);
        break;
      case 'down':
        dropPlayer();
        break;
      case 'rotate':
        rotatePlayer(1);
        break;
      case 'drop':
        dropToBottom();
        break;
      case 'hold':
        holdTetromino();
        break;
      default:
        break;
    }
  };

  // 游戏控制按钮
  const handleToggleGame = () => {
    if (gameState === GAME_STATES.GAME_OVER) {
      startGame();
    } else if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) {
      togglePause();
    }
  };

  const handleReset = () => {
    startGame();
  };
  
  // 处理方向变化
  const handleDirectionChange = (dir) => {
    // 如果游戏不在运行状态，不处理方向输入
    if (gameState !== GAME_STATES.PLAYING) return;
    let newDir = dir;
    // 兼容字符串类型的方向输入
    if (typeof dir === 'string') {
      switch (dir) {
        case 'left':
          movePlayer(-1);
          return;
        case 'right':
          movePlayer(1);
          return;
        case 'down':
          dropPlayer();
          return;
        case 'up':
          rotatePlayer(1);
          return;
        default:
          return;
      }
    }
    // 对象类型兼容原有逻辑
    if (newDir.x < 0) {
      movePlayer(-1); // 左移
    } else if (newDir.x > 0) {
      movePlayer(1);  // 右移
    } else if (newDir.y > 0) {
      dropPlayer();   // 下落
    } else if (newDir.y < 0) {
      rotatePlayer(1); // 上键旋转
    }
  };
  
  // 渲染游戏界面
  return (
    <GameContainer 
      onExit={onExit} 
      title="俄罗斯方块" 
      theme="dark"
      safeAreaBottom={true}
      showControls={true}
      onDirectionChange={handleDirectionChange}
      onToggleGame={handleToggleGame}
      isGameRunning={gameState === GAME_STATES.PLAYING}
    >
      <div className="tetris-game-wrapper">
        {gameState === GAME_STATES.LOADING && (
          <div className="tetris-loading-screen">
            <h2>加载中...</h2>
          </div>
        )}
        
        <div className="tetris-game-header">
          <div className="tetris-score-info">
            <div className="tetris-score-display">分数: {score}</div>
            <div className="tetris-level-display">等级: {level}</div>
            <div className="tetris-rows-display">行数: {rows}</div>
            <div className="tetris-high-score-display">最高分: {highScore}</div>
          </div>
        </div>
        
        <div className="tetris-game-area" ref={gameAreaRef}>
          <div className="tetris-side-panel left">
            <div className="tetris-hold-area">
              <div className="tetris-panel-title">保持</div>
              {renderHeldTetromino()}
            </div>
          </div>
          
          <div className="tetris-main-area">
            {renderStage()}
          </div>
          
          <div className="tetris-side-panel right">
            <div className="tetris-next-area">
              <div className="tetris-panel-title">下一个</div>
              {renderNextTetromino()}
            </div>
          </div>
        </div>
        
        <div className="tetris-game-controls">
        </div>
      </div>
    </GameContainer>
  );
};

TetrisGame.propTypes = {
  onExit: PropTypes.func
};

export default TetrisGame;