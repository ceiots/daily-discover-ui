import React from 'react';
import PropTypes from 'prop-types';
import './GameCard.css';

const GameCard = ({ game, onClick }) => {
  const { id, title, description, icon, playerCount, difficulty } = game;
  
  const getDifficultyColor = (level) => {
    switch(level) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      default: return 'medium';
    }
  };

  return (
    <div className="game-card" onClick={onClick}>
      <div className={`game-image ${game.theme || 'default'}`}>
        <i className={`fas fa-${icon} game-icon`}></i>
      </div>
      <div className="game-content">
        <h3 className="game-title">{title}</h3>
        <p className="game-description">{description}</p>
        <div className="game-footer">
          <div className="game-difficulty">
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className={`difficulty-dot ${level <= difficulty ? 'active' : ''} ${getDifficultyColor(difficulty)}`}
                title={`难度等级: ${difficulty}/3`}
              ></span>
            ))}
          </div>
          <span className="game-players">
            <i className="fas fa-user-friends mr-1"></i>
            {playerCount}
          </span>
        </div>
        <button className="play-button">
          开始游戏
        </button>
      </div>
    </div>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    playerCount: PropTypes.number.isRequired,
    difficulty: PropTypes.number.isRequired,
    theme: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default GameCard;
