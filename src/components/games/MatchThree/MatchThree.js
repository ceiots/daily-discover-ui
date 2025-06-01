import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import GameContainer from '../GameContainer';
import './MatchThree.css';

const MatchThree = ({ onExit }) => {
  // 游戏配置
  const GRID_SIZE = 8;
  const GEMS = ['💎', '🔮', '⭐', '💫', '✨', '🌟', '💠'];
  
  // 状态
  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [level, setLevel] = useState(1);
  const [target, setTarget] = useState(1000);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [processingMatches, setProcessingMatches] = useState(false);
  const [highScore, setHighScore] = useState(0); // 增加最高分状态
  const [initialized, setInitialized] = useState(false); // 新增初始化标志

  // 引用
  const gridRef = useRef(null);
  const messageRef = useRef(null);
  const gameContainerRef = useRef(null);
  const gridStateRef = useRef(grid);
  const isInitializingRef = useRef(false); // 新增初始化状态引用
  
  // 更新引用值以保持最新状态
  useEffect(() => {
    gridStateRef.current = grid;
  }, [grid]);


  // 检查是否会立即形成匹配
  const wouldCreateMatch = useCallback((row, col, gem, currentGrid) => {
    // 检查水平方向
    let horizontalCount = 1;
    let left = col - 1;
    while (left >= 0 && currentGrid[row][left].gem === gem) {
      horizontalCount++;
      left--;
    }
    let right = col + 1;
    while (right < GRID_SIZE && currentGrid[row][right].gem === gem) {
      horizontalCount++;
      right++;
    }
    
    // 检查垂直方向
    let verticalCount = 1;
    let up = row - 1;
    while (up >= 0 && currentGrid[up][col].gem === gem) {
      verticalCount++;
      up--;
    }
    let down = row + 1;
    while (down < GRID_SIZE && currentGrid[down][col].gem === gem) {
      verticalCount++;
      down++;
    }
    
    return horizontalCount >= 3 || verticalCount >= 3;
  }, [GRID_SIZE]);

  // 填充网格 - 避免在这里使用grid依赖，修复循环更新问题
  const fillGrid = useCallback((currentGrid) => {
    // 防止重复调用导致的无限循环
    if (!currentGrid && (!gridStateRef.current || gridStateRef.current.length === 0)) {
      return;
    }
    
    const newGrid = currentGrid ? [...currentGrid] : JSON.parse(JSON.stringify(gridStateRef.current));
    
    // 确保网格有正确的结构
    if (!newGrid || !Array.isArray(newGrid) || newGrid.length === 0) {
      return;
    }
    
    // 创建一个新的网格拷贝用于修改
    const updatedGrid = JSON.parse(JSON.stringify(newGrid));
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!updatedGrid[row] || !updatedGrid[row][col] || !updatedGrid[row][col].gem) {
          let gem;
          do {
            gem = GEMS[Math.floor(Math.random() * GEMS.length)];
          } while (wouldCreateMatch(row, col, gem, updatedGrid));
          
          // 确保网格结构正确
          if (!updatedGrid[row]) updatedGrid[row] = [];
          if (!updatedGrid[row][col]) updatedGrid[row][col] = {};
          
          updatedGrid[row][col].gem = gem;
          updatedGrid[row][col].falling = true;
        }
      }
    }
    
    setGrid(updatedGrid);
    
    // 使用setTimeout而不是在同一个函数中再次更新状态
    const timeoutId = setTimeout(() => {
      setGrid(prevGrid => {
        // 避免处理过时的状态
        if (!prevGrid || prevGrid.length === 0) return updatedGrid;
        
        const finalGrid = JSON.parse(JSON.stringify(prevGrid));
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            if (finalGrid[row] && finalGrid[row][col]) {
              finalGrid[row][col].falling = false;
            }
          }
        }
        return finalGrid;
      });
    }, 300);
    
    // 清理函数
    return () => clearTimeout(timeoutId);
  }, [GEMS, GRID_SIZE, wouldCreateMatch]);

  // 初始化网格 - 修复循环更新问题
  const initializeGrid = useCallback(() => {
    // 防止重复初始化
    if (isInitializingRef.current) {
      return;
    }
    
    isInitializingRef.current = true;
    
    // 创建新的空网格
    const newGrid = Array(GRID_SIZE).fill().map(() => 
      Array(GRID_SIZE).fill().map(() => ({
        gem: null,
        selected: false,
        highlighted: false,
        falling: false
      }))
    );
    
    // 设置网格并使用顺序执行而非依赖setTimeout
    setGrid(newGrid);
    
    // 使用setTimeout代替requestAnimationFrame，以避免在渲染循环中设置状态
    setTimeout(() => {
      fillGrid(newGrid);
      isInitializingRef.current = false;
    }, 0);
    
  }, [GRID_SIZE, fillGrid]);

  // 创建星空背景
  const createStars = useCallback(() => {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    // 根据屏幕大小调整星星数量
    const starCount = Math.min(window.innerWidth, window.innerHeight) / 10;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = Math.random() * 3 + 1 + 'px';
      star.style.height = star.style.width;
      star.style.animationDelay = Math.random() * 2 + 's';
      starsContainer.appendChild(star);
    }
  }, []);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      createStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createStars]);

  // 初始化游戏 - 修复循环更新问题
  useEffect(() => {
    if (!initialized) {
      createStars();
      initializeGrid();
      setInitialized(true);
    }
  }, [createStars, initialized, initializeGrid]);

  // 查找匹配
  const findMatches = useCallback((row, col, currentGrid) => {
    // 使用传入的网格或当前引用的网格
    const gridToCheck = currentGrid || gridStateRef.current;
    if (!gridToCheck[row] || !gridToCheck[row][col]) return [];
    
    const gem = gridToCheck[row][col].gem;
    const matches = [];
    
    // 水平匹配
    const horizontal = [{ row, col }];
    let left = col - 1;
    while (left >= 0 && gridToCheck[row][left]?.gem === gem) {
      horizontal.unshift({ row, col: left });
      left--;
    }
    let right = col + 1;
    while (right < GRID_SIZE && gridToCheck[row][right]?.gem === gem) {
      horizontal.push({ row, col: right });
      right++;
    }
    if (horizontal.length >= 3) {
      matches.push(...horizontal);
    }
    
    // 垂直匹配
    const vertical = [{ row, col }];
    let up = row - 1;
    while (up >= 0 && gridToCheck[up][col]?.gem === gem) {
      vertical.unshift({ row: up, col });
      up--;
    }
    let down = row + 1;
    while (down < GRID_SIZE && gridToCheck[down][col]?.gem === gem) {
      vertical.push({ row: down, col });
      down++;
    }
    if (vertical.length >= 3) {
      matches.push(...vertical);
    }
    
    // 去重
    const uniqueMatches = [];
    matches.forEach(match => {
      if (!uniqueMatches.some(m => m.row === match.row && m.col === match.col)) {
        uniqueMatches.push(match);
      }
    });
    
    return uniqueMatches;
  }, [GRID_SIZE]);

  // 查找所有匹配
  const findAllMatches = useCallback((currentGrid) => {
    const gridToCheck = currentGrid || gridStateRef.current;
    const allMatches = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const matches = findMatches(row, col, gridToCheck);
        matches.forEach(match => {
          if (!allMatches.some(m => m.row === match.row && m.col === match.col)) {
            allMatches.push(match);
          }
        });
      }
    }
    return allMatches;
  }, [GRID_SIZE, findMatches]);

  // 显示消息
  const displayMessage = useCallback((text) => {
    setMessage(text);
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }, []);

  // 宝石下落
  const dropGems = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = Array(GRID_SIZE).fill().map(() => 
        Array(GRID_SIZE).fill().map(() => ({
          gem: null,
          selected: false,
          highlighted: false,
          falling: false
        }))
      );
      
      // 下落现有元素
      for (let col = 0; col < GRID_SIZE; col++) {
        let writeIndex = GRID_SIZE - 1;
        
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (prevGrid[row][col].gem !== null) {
            if (row !== writeIndex) {
              newGrid[writeIndex][col].gem = prevGrid[row][col].gem;
              newGrid[writeIndex][col].falling = true;
            } else {
              newGrid[writeIndex][col] = { ...prevGrid[row][col] };
            }
            writeIndex--;
          }
        }
      }
      
      return newGrid;
    });
  }, [GRID_SIZE]);

  // 检查是否有可用移动
  const checkPossibleMoves = useCallback(() => {
    const currentGrid = gridStateRef.current;
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const directions = [
          { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
          { dr: 1, dc: 0 }, { dr: -1, dc: 0 }
        ];
        
        for (const dir of directions) {
          const newRow = row + dir.dr;
          const newCol = col + dir.dc;
          
          if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
            // 临时交换
            const tempGrid = JSON.parse(JSON.stringify(currentGrid));
            
            if (tempGrid[row] && tempGrid[row][col] && 
                tempGrid[newRow] && tempGrid[newRow][newCol]) {
              const gem1 = tempGrid[row][col].gem;
              const gem2 = tempGrid[newRow][newCol].gem;
              
              tempGrid[row][col].gem = gem2;
              tempGrid[newRow][newCol].gem = gem1;
              
              const matches1 = findMatches(row, col, tempGrid);
              const matches2 = findMatches(newRow, newCol, tempGrid);
              
              if (matches1.length > 0 || matches2.length > 0) {
                return true;
              }
            }
          }
        }
      }
    }
    
    return false;
  }, [GRID_SIZE, findMatches]);

  // 检查游戏结束
  const checkGameEnd = useCallback(() => {
    if (score >= target) {
      // 升级关卡
      setLevel(prevLevel => prevLevel + 1);
      setTarget(prevTarget => Math.floor(prevTarget * 1.5));
      setMoves(30);
      displayMessage(`恭喜通过关卡 ${level}！`);
      setTimeout(() => {
        initializeGrid();
      }, 2000);
    } else if (moves <= 0) {
      // 游戏结束
      setGameActive(false);
      displayMessage('游戏结束！');
    } else {
      // 检查是否有可用移动
      const hasPossibleMoves = checkPossibleMoves();
      if (!hasPossibleMoves) {
        displayMessage('没有可用的移动了！重新洗牌...');
        setTimeout(() => {
          initializeGrid();
        }, 2000);
      }
    }
  }, [score, target, moves, level, displayMessage, initializeGrid, checkPossibleMoves]);

  // 显示连击
  const showComboEffect = useCallback((comboCount) => {
    const comboText = document.createElement('div');
    comboText.className = 'combo-text';
    comboText.textContent = `连击 x${comboCount}!`;
    comboText.style.left = '50%';
    comboText.style.top = '50%';
    
    if (gameContainerRef.current) {
      gameContainerRef.current.appendChild(comboText);
      
      setTimeout(() => {
        if (gameContainerRef.current && gameContainerRef.current.contains(comboText)) {
          gameContainerRef.current.removeChild(comboText);
        }
      }, 1000);
    }
  }, []);

  // 创建粒子效果
  const createParticles = useCallback((row, col) => {
    const cells = document.querySelectorAll('.cell');
    if (!cells.length) return;
    
    const index = row * GRID_SIZE + col;
    if (index >= cells.length) return;
    
    const cellRect = cells[index].getBoundingClientRect();
    const centerX = cellRect.left + cellRect.width / 2;
    const centerY = cellRect.top + cellRect.height / 2;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      
      const angle = (i / 6) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      
      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 800);
    }
  }, [GRID_SIZE]);

  // 当处理状态变化时检查匹配 - 修复循环更新问题
  useEffect(() => {
    let timeoutId = null;
    
    // 只有当processingMatches从true变为false时才检查新匹配
    if (!processingMatches && grid.length > 0 && initialized) {
      // 使用一个标志避免重复处理
      const hasMatches = findAllMatches().length > 0;
      if (hasMatches) {
        timeoutId = setTimeout(() => {
          processMatchCycle();
        }, 300);
      }
    }
    
    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [processingMatches, grid.length, initialized]);  // 添加initialized作为依赖项

  // 处理单次匹配周期
  const processMatchCycle = useCallback(() => {
    if (!gameActive || processingMatches) return;
    
    // 使用匹配计数器避免无限循环
    const matches = findAllMatches();
    if (matches.length === 0) {
      setProcessingMatches(false);
      checkGameEnd();
      return;
    }
    
    setProcessingMatches(true);
    setCombo(prevCombo => prevCombo + 1);
    
    // 高亮匹配的宝石
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      matches.forEach(match => {
        if (newGrid[match.row] && newGrid[match.row][match.col]) {
          newGrid[match.row][match.col].highlighted = true;
        }
      });
      return newGrid;
    });
    
    // 使用单一的setTimeout减少嵌套调用
    setTimeout(() => {
      // 计算分数
      const baseScore = matches.length * 10;
      const comboBonus = combo > 1 ? combo * 5 : 0;
      const totalScore = baseScore + comboBonus;
      
      setScore(prevScore => prevScore + totalScore);
      
      // 显示连击效果
      if (combo > 1) {
        showComboEffect(combo);
      }
      
      // 创建粒子效果
      matches.forEach(match => {
        createParticles(match.row, match.col);
      });
      
      // 清除匹配的宝石
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        matches.forEach(match => {
          if (newGrid[match.row] && newGrid[match.row][match.col]) {
            newGrid[match.row][match.col].gem = null;
            newGrid[match.row][match.col].highlighted = false;
          }
        });
        return newGrid;
      });
      
      // 宝石下落
      dropGems();
      
      // 延迟填充网格
      setTimeout(() => {
        fillGrid();
        
        // 完成处理，设置状态以允许下一个周期
        setTimeout(() => {
          setProcessingMatches(false);
        }, 300);
      }, 200);
      
    }, 500);
  }, [checkGameEnd, combo, createParticles, dropGems, fillGrid, findAllMatches, gameActive, processingMatches, showComboEffect]);

  // 处理匹配 - 触发第一次匹配检查
  const processMatches = useCallback(() => {
    if (!processingMatches) {
      processMatchCycle();
    }
  }, [processMatchCycle, processingMatches]);

  // 检查是否相邻
  const isAdjacent = useCallback((row1, col1, row2, col2) => {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }, []);

  // 交换宝石
  const swapGems = useCallback((row1, col1, row2, col2) => {
    if (processingMatches) return;
    
    // 清除选中状态
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      if (newGrid[row1] && newGrid[row1][col1]) {
        newGrid[row1][col1].selected = false;
      }
      return newGrid;
    });
    setSelectedCell(null);

    const currentGrid = [...gridStateRef.current];
    if (!currentGrid[row1] || !currentGrid[row1][col1] ||
        !currentGrid[row2] || !currentGrid[row2][col2]) {
      return;
    }

    const gem1 = currentGrid[row1][col1].gem;
    const gem2 = currentGrid[row2][col2].gem;
    
    // 临时交换
    currentGrid[row1][col1].gem = gem2;
    currentGrid[row2][col2].gem = gem1;
    
    const matches1 = findMatches(row1, col1, currentGrid);
    const matches2 = findMatches(row2, col2, currentGrid);
    
    if (matches1.length > 0 || matches2.length > 0) {
      // 有效移动
      setMoves(prevMoves => prevMoves - 1);
      setCombo(0);
      setGrid(currentGrid);
      processMatches();
    } else {
      // 无效移动，恢复交换
      currentGrid[row1][col1].gem = gem1;
      currentGrid[row2][col2].gem = gem2;
      setGrid(currentGrid);
      displayMessage('无效移动！');
    }
  }, [displayMessage, findMatches, processMatches, processingMatches]);

  // 处理单元格点击
  const handleCellClick = useCallback((row, col) => {
    if (!gameActive || processingMatches) return;
    
    if (selectedCell === null) {
      // 选择第一个单元格
      setSelectedCell({ row, col });
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        if (newGrid[row] && newGrid[row][col]) {
          newGrid[row][col].selected = true;
        }
        return newGrid;
      });
    } else if (selectedCell.row === row && selectedCell.col === col) {
      // 取消选择
      setSelectedCell(null);
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        if (newGrid[row] && newGrid[row][col]) {
          newGrid[row][col].selected = false;
        }
        return newGrid;
      });
    } else if (isAdjacent(selectedCell.row, selectedCell.col, row, col)) {
      // 尝试交换
      swapGems(selectedCell.row, selectedCell.col, row, col);
    } else {
      // 选择新的单元格
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        if (newGrid[selectedCell.row] && newGrid[selectedCell.row][selectedCell.col]) {
          newGrid[selectedCell.row][selectedCell.col].selected = false;
        }
        if (newGrid[row] && newGrid[row][col]) {
          newGrid[row][col].selected = true;
        }
        return newGrid;
      });
      setSelectedCell({ row, col });
    }
  }, [gameActive, isAdjacent, processingMatches, selectedCell, swapGems]);

  // 重新开始游戏
  const resetGame = useCallback(() => {
    setScore(0);
    setMoves(30);
    setLevel(1);
    setTarget(1000);
    setCombo(0);
    setGameActive(true);
    setSelectedCell(null);
    setProcessingMatches(false);
    isInitializingRef.current = false; // 重置初始化标志
    initializeGrid();
  }, [initializeGrid]);

  // 使用提示
  const useHint = useCallback(() => {
    if (!gameActive || moves <= 0 || processingMatches) return;
    
    // 寻找可能的移动
    const currentGrid = gridStateRef.current;
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const directions = [
          { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
          { dr: 1, dc: 0 }, { dr: -1, dc: 0 }
        ];
        
        for (const dir of directions) {
          const newRow = row + dir.dr;
          const newCol = col + dir.dc;
          
          if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
            // 临时交换
            const tempGrid = JSON.parse(JSON.stringify(currentGrid));
            
            if (tempGrid[row] && tempGrid[row][col] && 
                tempGrid[newRow] && tempGrid[newRow][newCol]) {
              const gem1 = tempGrid[row][col].gem;
              const gem2 = tempGrid[newRow][newCol].gem;
              
              tempGrid[row][col].gem = gem2;
              tempGrid[newRow][newCol].gem = gem1;
              
              const matches1 = findMatches(row, col, tempGrid);
              const matches2 = findMatches(newRow, newCol, tempGrid);
              
              if (matches1.length > 0 || matches2.length > 0) {
                // 高亮提示
                setGrid(prevGrid => {
                  const newGrid = [...prevGrid];
                  if (newGrid[row] && newGrid[row][col]) {
                    newGrid[row][col].highlighted = true;
                  }
                  if (newGrid[newRow] && newGrid[newRow][newCol]) {
                    newGrid[newRow][newCol].highlighted = true;
                  }
                  return newGrid;
                });
                
                setTimeout(() => {
                  setGrid(prevGrid => {
                    const newGrid = [...prevGrid];
                    if (newGrid[row] && newGrid[row][col]) {
                      newGrid[row][col].highlighted = false;
                    }
                    if (newGrid[newRow] && newGrid[newRow][newCol]) {
                      newGrid[newRow][newCol].highlighted = false;
                    }
                    return newGrid;
                  });
                }, 1500);
                
                return;
              }
            }
          }
        }
      }
    }
    
    displayMessage('没有可用的移动！');
  }, [GRID_SIZE, displayMessage, findMatches, gameActive, moves, processingMatches]);

  // 进度条宽度
  const progressWidth = Math.min((score / target) * 100, 100);

  return (
    <GameContainer onExit={onExit} title="宝石消除" theme="dark">
      <div className="match-three-game-wrapper">
        <div className="stars" id="stars"></div>
        
        <div className="game-header">
          <div className="score-info">
            <div className="score-item">
              <div className="score-label">分数</div>
              <div className="score-value">{score}</div>
            </div>
            <div className="high-score">
              <div className="score-label">
                <span className="trophy-icon">🏆</span> 最高分
              </div>
              <div className="score-value">{highScore}</div>
            </div>
          </div>

          <div className="level-progress">
            <div className="level-text">关卡 {level}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
          </div>
          
          <div className="moves-display">
            <div className="moves-label">移动</div>
            <div className="moves-value">{moves}</div>
          </div>
        </div>
        
        <div className="game-content" ref={gameContainerRef}>  
          <div className="game-board">
            <div className="grid" ref={gridRef}>
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell 
                      ${cell.selected ? 'selected' : ''} 
                      ${cell.highlighted ? 'highlighted' : ''}
                      ${cell.falling ? 'falling' : ''}
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.gem}
                  </div>
                ))
              ))}
            </div>
          </div>

          <div className="target-info">
            <div className="target-label">当前目标</div>
            <div className="target-value">{target}</div>
          </div>
        </div>

        <div className={`message ${showMessage ? 'show' : ''}`} ref={messageRef}>
          {message}
        </div>
      </div>
    </GameContainer>
  );
};

MatchThree.propTypes = {
  onExit: PropTypes.func.isRequired
};

export default MatchThree;
