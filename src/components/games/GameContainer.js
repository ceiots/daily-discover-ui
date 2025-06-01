import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, Play, Pause } from 'lucide-react';
import './GameContainer.css';

const GameContainer = ({ 
  children,
  onExit,
  title,
  theme = 'default',
  showControls = true,
  safeAreaBottom = true,
  onDirectionChange = null,
  onToggleGame = null,
  isGameRunning = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // 自动进入全屏模式
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.error(`全屏错误: ${err.message}`);
      }
    };
    
    // 短暂延迟以确保DOM已完全加载
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      // 退出全屏
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error(`退出全屏错误: ${err.message}`);
        });
      }
    };
  }, []);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 处理键盘ESC键退出
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onExit]);

  // 移动端后退手势处理
  useEffect(() => {
    let touchStartX = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      
      // 从左向右滑动超过屏幕宽度的25%，触发返回
      if (diffX > window.innerWidth / 4 && touchStartX < 50) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setTimeout(() => onExit(), 100);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onExit]);

  // 检测是否为iOS设备
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return (
    <div 
      ref={containerRef}
      className={`game-container ${theme}-theme ${isFullscreen ? 'fullscreen' : ''} ${safeAreaBottom ? 'safe-area-bottom' : ''}`}
    >
      {/* 标题栏 */}
      {title && (
        <div className="game-title-bar">
          <div className="game-title-left">
            <button 
              className="game-back-btn"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => {});
                }
                setTimeout(() => onExit(), 100);
              }}
              aria-label="返回"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="game-title">{title}</h2>
          </div>
          
          {onToggleGame && (
            <div className="game-title-right">
              <button 
                className="game-toggle-btn"
                onClick={onToggleGame}
                aria-label={isGameRunning ? "暂停" : "开始"}
              >
                {isGameRunning ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 游戏内容 */}
      <div className="game-content">
        {children}
      </div>
      
      {/* 控制按钮 */}
      {showControls && onDirectionChange && (
        <div className={`game-controls-bar ${isIOS ? 'ios-device' : ''}`}>
          {/* 方向控制按钮 */}
          <div className="game-direction-controls">
            <button
              className="game-direction-btn up-btn"
              onClick={() => onDirectionChange({ x: 0, y: -1 })}
              aria-label="向上"
            >
              <ArrowUp size={20} />
            </button>
            <div className="game-direction-middle-row">
              <button
                className="game-direction-btn left-btn"
                onClick={() => onDirectionChange({ x: -1, y: 0 })}
                aria-label="向左"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="game-direction-center"></div>
              <button
                className="game-direction-btn right-btn"
                onClick={() => onDirectionChange({ x: 1, y: 0 })}
                aria-label="向右"
              >
                <ArrowRight size={20} />
              </button>
            </div>
            <button
              className="game-direction-btn down-btn"
              onClick={() => onDirectionChange({ x: 0, y: 1 })}
              aria-label="向下"
            >
              <ArrowDown size={20} />
            </button>
          </div>
        </div>
      )}
      
      {/* 底部安全区域 - 减小高度，防止过多空白 */}
      {safeAreaBottom && <div className={`bottom-safe-area ${isIOS ? 'ios-safe-area' : ''}`}></div>}
    </div>
  );
};

GameContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onExit: PropTypes.func.isRequired,
  title: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'dark', 'light', 'retro']),
  showControls: PropTypes.bool,
  safeAreaBottom: PropTypes.bool,
  onDirectionChange: PropTypes.func,
  onToggleGame: PropTypes.func,
  isGameRunning: PropTypes.bool
};

export default GameContainer; 