import React from 'react';
import PropTypes from 'prop-types';
import './ProgressBar.css';

const ProgressBar = ({ current, total, showText = true }) => {
  const progressPercentage = (current / total) * 100;
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {showText && (
        <div className="progress-text">
          {current}/{total}
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showText: PropTypes.bool
};

export default ProgressBar; 