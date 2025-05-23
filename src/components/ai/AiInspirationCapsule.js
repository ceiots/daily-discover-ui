import React from 'react';
import PropTypes from 'prop-types';
import './AiInspirationCapsule.css';
import { getImage } from '../DailyAiApp';

/**
 * AI灵感胶囊组件
 * 每日展示一个精选AI灵感内容，以胶囊形式呈现
 */
const AiInspirationCapsule = ({ capsuleData, onExplore, onShare, onCollect, onFeedback, isDarkMode }) => {
  const { 
    date,
    title, 
    subtitle, 
    image, 
    description, 
    feedbackOptions, 
    hasInteraction,
    interactionLabel,
    deepLinkText = "深入探索",
    feedbacks = []
  } = capsuleData || {};

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  // 处理图片加载错误
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/default-capsule.jpg';
  };

  // 处理深入探索
  const handleExplore = () => {
    if (onExplore && capsuleData) {
      onExplore(capsuleData);
    }
  };

  // 处理分享
  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare && capsuleData) {
      onShare(capsuleData);
    }
  };

  // 处理收藏
  const handleCollect = (e) => {
    e.stopPropagation();
    if (onCollect && capsuleData) {
      onCollect(capsuleData);
    }
  };

  // 处理反馈
  const handleFeedback = (feedback, e) => {
    e.stopPropagation();
    if (onFeedback && capsuleData) {
      onFeedback(capsuleData, feedback);
    }
  };

  // 处理互动入口点击
  const handleInteraction = (e) => {
    e.stopPropagation();
    if (capsuleData && capsuleData.onInteraction) {
      capsuleData.onInteraction();
    }
  };

  // 渲染历史记录按钮
  const renderHistoryButton = () => (
    <button className="history-capsule-btn" onClick={(e) => {
      e.stopPropagation();
      if (capsuleData && capsuleData.onViewHistory) {
        capsuleData.onViewHistory();
      }
    }}>
      <i className="fas fa-history"></i>
      <span>往期回顾</span>
    </button>
  );

  // 渲染反馈选项
  const renderFeedbackOptions = () => (
    <div className="capsule-feedback-options">
      {feedbackOptions && feedbackOptions.map((option, index) => (
        <button 
          key={index} 
          className={`feedback-option ${feedbacks.includes(option.value) ? 'active' : ''}`} 
          onClick={(e) => handleFeedback(option.value, e)}
        >
          <span className="feedback-emoji">{option.emoji}</span>
          <span className="feedback-text">{option.text}</span>
        </button>
      ))}
    </div>
  );

  return (
    <section className={`ai-inspiration-capsule ${isDarkMode ? 'dark' : ''}`}>
      <div className="section-header">
        <h2>
          <i className="fas fa-lightbulb"></i>
          AI灵感胶囊
          <span className="capsule-subtitle">开启今日AI新视野</span>
        </h2>
        {renderHistoryButton()}
      </div>
      
      <div className="capsule-container" onClick={handleExplore}>
        <div className="daily-capsule">
          <div className="capsule-date">
            <i className="fas fa-calendar-day"></i>
            {formatDate(date) || formatDate(new Date())}
          </div>
          
          <h3 className="capsule-title">{title || "今日AI灵感：探索未知边界"}</h3>
          {subtitle && <div className="capsule-subtitle-text">{subtitle}</div>}
          
          <div className="capsule-image-container">
            <img 
              src={getImage(image) || '/images/default-capsule.jpg'} 
              alt={title || "AI灵感胶囊"}
              className="capsule-image"
              onError={handleImageError}
            />
            
            <div className="capsule-actions">
              <button className="capsule-action-btn collect" onClick={handleCollect}>
                <i className="far fa-heart"></i>
              </button>
              <button className="capsule-action-btn share" onClick={handleShare}>
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
          
          <div className="capsule-description">
            {description || "今天的AI灵感胶囊为你带来了前沿的人工智能见解与创新，点击深入探索更多精彩内容。"}
          </div>
          
          {hasInteraction && (
            <button className="capsule-interaction-btn" onClick={handleInteraction}>
              <i className="fas fa-magic"></i>
              {interactionLabel || "尝试互动体验"}
            </button>
          )}
          
          {feedbackOptions && renderFeedbackOptions()}
          
          <button className="capsule-explore-btn">
            {deepLinkText}
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

AiInspirationCapsule.propTypes = {
  capsuleData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    deepLinkText: PropTypes.string,
    deepLinkUrl: PropTypes.string,
    hasInteraction: PropTypes.bool,
    interactionLabel: PropTypes.string,
    onInteraction: PropTypes.func,
    onViewHistory: PropTypes.func,
    feedbackOptions: PropTypes.arrayOf(
      PropTypes.shape({
        emoji: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string
      })
    ),
    feedbacks: PropTypes.arrayOf(PropTypes.string)
  }),
  onExplore: PropTypes.func,
  onShare: PropTypes.func,
  onCollect: PropTypes.func,
  onFeedback: PropTypes.func,
  isDarkMode: PropTypes.bool
};

export default AiInspirationCapsule; 