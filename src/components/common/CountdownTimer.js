import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CountdownTimer.css';

const CountdownTimer = ({ duration, onTimeUpdate, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout && onTimeout();
      return;
    }
    
    // 更新父组件中的时间
    onTimeUpdate && onTimeUpdate(timeLeft);
    
    // 倒计时定时器
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        // 更新父组件中的时间
        onTimeUpdate && onTimeUpdate(newTime);
        
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeout && onTimeout();
        }
        return newTime;
      });
    }, 1000);
    
    // 清除定时器
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUpdate, onTimeout]);
  
  // 重置计时器
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  // 计算剩余时间百分比
  const progressPercentage = (timeLeft / duration) * 100;
  
  // 确定颜色
  const getTimerColor = () => {
    if (timeLeft <= duration * 0.25) return 'danger';
    if (timeLeft <= duration * 0.5) return 'warning';
    return 'normal';
  };
  
  return (
    <div className="countdown-timer-container">
      <div 
        className={`countdown-timer ${getTimerColor()}`}
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <div className="countdown-timer-text">
        {timeLeft}秒
      </div>
    </div>
  );
};

CountdownTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  onTimeUpdate: PropTypes.func,
  onTimeout: PropTypes.func
};

export default CountdownTimer; 