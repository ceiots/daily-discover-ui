import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './AiDiscoveryLens.css';
import { getImage } from '../DailyAiApp';

/**
 * AI视野漫游镜组件
 * 每日通过AI视角带用户漫游探索全球独特地点、技术突破、文化现象或未来趋势
 */
const AiDiscoveryLens = ({ discoveryData, onExplore, onCollect, onShare, onViewHistory, isDarkMode }) => {
  // 随机生成当天的探索标语
  const [tagline] = useState(() => {
    const taglines = [
      "AI视角，重新发现世界",
      "今日漫游，发现不一样的视角",
      "穿越时空的AI探索",
      "用AI视角解锁世界奥秘",
      "突破边界的智能漫游",
      "AI引领的未来探索"
    ];
    return taglines[Math.floor(Math.random() * taglines.length)];
  });

  // 处理日期格式化
  const formatDate = useCallback((date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    // 返回格式化的日期，例如：2023-04-15
    return `${year}-${month}-${day}`;
  }, []);

  // 处理图片路径
  const getImagePath = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/discover/${path}`;
  }, []);

  // 处理图片加载错误
  const handleImageError = useCallback((e) => {
    e.target.src = 'https://via.placeholder.com/600x400?text=漫游照片';
  }, []);

  // 内容渲染函数 - 根据contentType渲染不同类型的内容
  const renderContent = useCallback(() => {
    if (!discoveryData) return null;

    switch (discoveryData.contentType) {
      case 'image':
        return (
          <div className="discovery-image-container">
            <img 
              className="discovery-image" 
              src={getImage(getImagePath(discoveryData.image))}
              alt={discoveryData.title}
              onError={handleImageError}
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="discovery-video-container">
            <video 
              className="discovery-video" 
              src={discoveryData.video} 
              poster={getImage(getImagePath(discoveryData.image))}
              muted 
              loop 
              autoPlay 
            />
            <div className="video-overlay">
              <button className="play-full-btn">
                <i className="fas fa-play"></i>
              </button>
            </div>
          </div>
        );
      
      case 'interactive':
        return (
          <div className="discovery-interactive">
            <div className="interactive-placeholder">
              <img 
                className="interactive-preview" 
                src={getImage(getImagePath(discoveryData.image))}
                alt="互动预览"
                onError={handleImageError}
              />
              <div className="interactive-overlay">
                <div className="interactive-label">
                  <i className="fas fa-hand-pointer"></i>
                  互动体验
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="discovery-image-container">
            <img 
              className="discovery-image" 
              src={getImage(getImagePath(discoveryData.image))}
              alt={discoveryData.title}
              onError={handleImageError}
            />
          </div>
        );
    }
  }, [discoveryData, handleImageError, getImagePath]);

  // 如果没有数据，显示占位内容
  if (!discoveryData) {
    return (
      <div className={`ai-discovery-lens ${isDarkMode ? 'dark' : ''}`}>
        <div className="section-header">
          <h2><i className="fas fa-binoculars"></i> AI视野漫游镜</h2>
          <button className="history-discovery-btn" onClick={onViewHistory}>
            <i className="fas fa-history"></i> 漫游日志
          </button>
        </div>
        <div className="discovery-focus-card empty-card">
          <p>正在准备今日漫游内容...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-discovery-lens ${isDarkMode ? 'dark' : ''}`}>
      <div className="section-header">
        <h2>
          <i className="fas fa-binoculars"></i> 
          AI视野漫游镜
          <span className="discovery-tagline">{tagline}</span>
        </h2>
        <button className="history-discovery-btn" onClick={onViewHistory}>
          <i className="fas fa-history"></i> 漫游日志
        </button>
      </div>

      <div className="discovery-focus-card">
        {/* 操作按钮 */}
        <div className="discovery-actions">
          <button 
            className={`discovery-action-btn collect ${discoveryData.isCollected ? 'active' : ''}`}
            onClick={() => onCollect(discoveryData.id)}
            title={discoveryData.isCollected ? "取消收藏" : "收藏"}
          >
            <i className={discoveryData.isCollected ? "fas fa-bookmark" : "far fa-bookmark"}></i>
          </button>
          <button 
            className="discovery-action-btn share"
            onClick={() => onShare(discoveryData.id)}
            title="分享"
          >
            <i className="fas fa-share-alt"></i>
          </button>
        </div>

        {/* 日期标识 */}
        <div className="discovery-date">
          <i className="far fa-calendar-alt"></i>
          {formatDate(discoveryData.date)}
        </div>

        {/* 漫游主题标题 */}
        <h3 className="discovery-title">{discoveryData.title}</h3>

        {/* 动态内容区域 */}
        {renderContent()}

        {/* AI洞察区域 */}
        {discoveryData.insights && discoveryData.insights.length > 0 && (
          <div className="discovery-insights">
            <div className="insights-title">
              <i className="fas fa-robot"></i> AI视角洞察
            </div>
            <ul className="insights-list">
              {discoveryData.insights.map((insight, index) => (
                <li key={index} className="insight-item">
                  <i className="fas fa-lightbulb"></i>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 探索按钮 */}
        <button 
          className="discovery-explore-btn"
          onClick={() => onExplore(discoveryData.id)}
        >
          深度探索 <i className="fas fa-long-arrow-alt-right"></i>
        </button>
      </div>
    </div>
  );
};

AiDiscoveryLens.propTypes = {
  discoveryData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    video: PropTypes.string,
    contentType: PropTypes.oneOf(['image', 'video', 'interactive']),
    insights: PropTypes.arrayOf(PropTypes.string),
    isCollected: PropTypes.bool
  }),
  onExplore: PropTypes.func.isRequired,
  onCollect: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool
};

AiDiscoveryLens.defaultProps = {
  isDarkMode: false
};

export default AiDiscoveryLens; 