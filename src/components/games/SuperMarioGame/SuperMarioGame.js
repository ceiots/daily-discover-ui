import React, { useState, useEffect, useCallback } from 'react';
import GameContainer from '../GameContainer';
import './SuperMarioGame.css';

const TILE_SIZE = 32;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const MOVE_SPEED = 3;

// Level data (B: Brick, G: Ground, C: Coin, P: Pipe)
const level = [
  '....................',
  '....................',
  '....................',
  '....................',
  '..C.B.B.C...........',
  '....................',
  '......P.............',
  '....................',
  '..B.B.B.B.B.........',
  '....................',
  'GGG..GGG..GGG..GGGGGGG',
  'GGGG.GGGG.GGGG.GGGGGGG',
];

const SuperMarioGame = ({ onExit }) => {
  const [mario, setMario] = useState({ x: 50, y: 300, vx: 0, vy: 0, onGround: false });
  
  const handleDirectionChange = useCallback((direction) => {
    setMario(prev => {
      let newVx = prev.vx;
      if (direction === 'left') {
        newVx = -MOVE_SPEED;
      } else if (direction === 'right') {
        newVx = MOVE_SPEED;
      }
      return { ...prev, vx: newVx };
    });
  }, []);

  const handleJump = useCallback(() => {
    if (mario.onGround) {
      setMario(prev => ({ ...prev, vy: JUMP_FORCE, onGround: false }));
    }
  }, [mario.onGround]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setMario(prev => {
        // Apply gravity
        let newVy = prev.vy + GRAVITY;
        
        // Update position
        let newX = prev.x + prev.vx;
        let newY = prev.y + newVy;

        // Simple collision detection with ground
        // A more complex implementation would check against all tiles
        if (newY > (level.length - 2) * TILE_SIZE - TILE_SIZE) {
          newY = (level.length - 2) * TILE_SIZE - TILE_SIZE;
          newVy = 0;
          return { ...prev, x: newX, y: newY, vy: newVy, onGround: true };
        }

        return { ...prev, x: newX, y: newY, vy: newVy, onGround: false };
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, []);
  
  // Stop movement when direction is 'stop' or not provided
  const handleStop = useCallback(() => {
    setMario(prev => ({ ...prev, vx: 0 }));
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleDirectionChange('left');
      if (e.key === 'ArrowRight') handleDirectionChange('right');
      if (e.key === ' ') handleJump(); // Space to jump
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleDirectionChange, handleJump, handleStop]);


  return (
    <GameContainer
      title="Super Mario"
      onExit={onExit}
      onDirectionChange={handleDirectionChange}
      theme="dark"
    >
      <div className="super-mario-game-world">
        {/* Render Level */}
        <div className="level">
          {level.map((row, y) => (
            <div key={y} className="level-row" style={{ top: y * TILE_SIZE }}>
              {row.split('').map((tile, x) => {
                if (tile === '.') return null;
                const tileClass = `tile ${tile === 'B' ? 'brick' : tile === 'G' ? 'ground' : tile === 'C' ? 'coin' : tile === 'P' ? 'pipe' : ''}`;
                return <div key={x} className={tileClass} style={{ left: x * TILE_SIZE }} />;
              })}
            </div>
          ))}
        </div>

        {/* Render Mario */}
        <div
          className="mario"
          style={{ left: mario.x, top: mario.y }}
        />
        
        {/* On-screen controls */}
        <div className="on-screen-controls">
           <button onMouseDown={() => handleDirectionChange('left')} onMouseUp={handleStop} onTouchStart={() => handleDirectionChange('left')} onTouchEnd={handleStop}>Left</button>
           <button onMouseDown={() => handleDirectionChange('right')} onMouseUp={handleStop} onTouchStart={() => handleDirectionChange('right')} onTouchEnd={handleStop}>Right</button>
           <button onClick={handleJump}>Jump</button>
        </div>
      </div>
    </GameContainer>
  );
};

export default SuperMarioGame; 