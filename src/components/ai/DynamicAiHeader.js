import React, { useState, useEffect } from 'react';
import './DynamicAiHeader.css';
import { getImage } from '../DailyAiApp';
import PropTypes from 'prop-types';

/**
 * 动态AI发现头条组件
 * 按照requirement-for-discover.md的需求实现
 */
const DynamicAiHeader = ({ 
  dailyNews, 
  dailyTheme, 
  formattedDate, 
  weekday, 
  onRefresh, 
  onNewsItemClick,
  isDarkMode 
}) => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 自动轮播新闻
  useEffect(() => {
    if (!dailyNews || dailyNews.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentNewsIndex(prev => (prev + 1) % dailyNews.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [dailyNews]);

  // 格式化时间
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '刚刚更新';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return '刚刚更新';
    if (diffMinutes < 60) return `${diffMinutes}分钟前更新`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}小时前更新`;
    
    return `${Math.floor(diffHours / 24)}天前更新`;
  };

  // 创建动态背景样式
  const headerStyle = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #111827, #1e3a8a, #312e81)'
      : 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
    backgroundSize: '300% 300%',
    animation: 'gradient-shift 15s ease infinite'
  };

  const currentNews = dailyNews && dailyNews.length > 0 
    ? dailyNews[currentNewsIndex] 
    : { title: 'AI今日焦点', summary: '正在加载最新AI发现...', timestamp: new Date().toISOString(), id: 'loading' };

  return (
    <div className="ai-header" style={headerStyle}>
      <div className="date-display">
        <span className="date">{formattedDate}</span>
        <span className="weekday">{weekday}</span>
      </div>
      
      <div className="dynamic-headline-container">
        <h1>{dailyTheme || 'AI今日焦点'}</h1>
        
        <div 
          className={`dynamic-headline ${isAnimating ? 'fading' : ''}`}
          onClick={() => onNewsItemClick && onNewsItemClick(currentNews)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onNewsItemClick && onNewsItemClick(currentNews)}
        >
          <h2>{currentNews.title}</h2>
          <p>{currentNews.summary}</p>
        </div>
        
        <div className="headline-actions">
          <span className="timestamp">
            {formatTimestamp(currentNews.timestamp)} · 今日已更新 {dailyNews ? dailyNews.length : 0} 条新发现
          </span>
          <button 
            className="refresh-btn" 
            onClick={onRefresh}
            aria-label="刷新头条"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
          </div>
        </div>
        
      <div className="headline-indicators">
        {dailyNews && dailyNews.map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === currentNewsIndex ? 'active' : ''}`}
            onClick={() => setCurrentNewsIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// 添加 PropTypes 校验
DynamicAiHeader.propTypes = {
  dailyNews: PropTypes.array.isRequired,
  dailyTheme: PropTypes.string.isRequired,
  formattedDate: PropTypes.string.isRequired,
  weekday: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onNewsItemClick: PropTypes.func,
  isDarkMode: PropTypes.bool.isRequired,
};

export default DynamicAiHeader;