import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './DailyDiscovery.css';

/**
 * 每日新发现模块组件
 * 展示每日更新的AI资讯、工具推荐、灵感启发等内容
 */
const DailyDiscovery = ({
  discoveries,
  formattedDate,
  weekday,
  onRefresh,
  onDiscoveryClick,
  isDarkMode,
  lastUpdateTime
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // 格式化最后更新时间
  const formatLastUpdate = useCallback((timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '刚刚更新';
    if (diffMins < 60) return `${diffMins}分钟前更新`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小时前更新`;
    
    return '今日更新';
  }, []);

  // 自动轮播
  useEffect(() => {
    if (discoveries.length <= 1) return;
    
    const autoPlaySlides = () => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % discoveries.length;
      });
    };
    
    autoPlayRef.current = setInterval(autoPlaySlides, 5000);
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [discoveries.length]);

  // 手动导航到前一项
  const prevSlide = useCallback(() => {
    if (discoveries.length <= 1) return;
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? discoveries.length - 1 : prevIndex - 1;
    });
  }, [discoveries.length]);

  // 手动导航到后一项
  const nextSlide = useCallback(() => {
    if (discoveries.length <= 1) return;
    setCurrentIndex((prevIndex) => {
      return (prevIndex + 1) % discoveries.length;
    });
  }, [discoveries.length]);

  // 处理轮播点击导航
  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // 处理触摸滑动开始
  const handleTouchStart = useCallback((e) => {
    setTouchStartX(e.touches[0].clientX);
  }, []);

  // 处理触摸滑动进行中
  const handleTouchMove = useCallback((e) => {
    setTouchEndX(e.touches[0].clientX);
  }, []);

  // 处理触摸滑动结束
  const handleTouchEnd = useCallback(() => {
    if (touchStartX - touchEndX > 50) {
      // 向左滑动，显示下一项
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      // 向右滑动，显示上一项
      prevSlide();
    }
    // 重置触摸状态
    setTouchStartX(0);
    setTouchEndX(0);
  }, [touchStartX, touchEndX, nextSlide, prevSlide]);

  // 处理刷新操作
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (onRefresh) {
      Promise.resolve(onRefresh()).finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 800);
      });
    } else {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 800);
    }
  }, [onRefresh]);

  // 处理图片加载错误
  const handleImageError = useCallback((e) => {
    e.target.src = `${window.location.origin}/images/placeholder.jpg`;
  }, []);

  // 如果没有发现项，显示占位内容
  if (!discoveries || discoveries.length === 0) {
    return (
      <div className={`daily-discovery ${isDarkMode ? 'dark' : ''}`}>
        <div className="discovery-header">
          <div className="date-info">
            <div className="current-date">{formattedDate}</div>
            <div className="weekday">{weekday}</div>
          </div>
          <h1 className="module-title">每日新发现</h1>
        </div>
        <div className="discovery-card empty-card">
          <div className="loading-text">正在获取今日新发现...</div>
        </div>
      </div>
    );
  }

  // 当前显示的发现项
  const currentDiscovery = discoveries[currentIndex];

  return (
    <div className={`daily-discovery ${isDarkMode ? 'dark' : ''}`}>
      <div className="discovery-header">
        <div className="date-info">
          <div className="current-date">{formattedDate}</div>
          <div className="weekday">{weekday}</div>
        </div>
        <h1 className="module-title">AI发现</h1>
      </div>

      <div className="carousel-container"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 前后导航按钮 */}
        {discoveries.length > 1 && (
          <>
            <button 
              className="nav-btn prev-btn" 
              onClick={prevSlide}
              aria-label="上一项"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="nav-btn next-btn" 
              onClick={nextSlide}
              aria-label="下一项"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        {/* 发现卡片 */}
        <div 
          className="discovery-card"
          onClick={() => onDiscoveryClick(currentDiscovery)}
        >
          <div className="card-content">
            <div className="discovery-info">
              {currentDiscovery.tag && (
                <span className={`discovery-tag ${currentDiscovery.tagType || ''}`}>
                  {currentDiscovery.tag}
                </span>
              )}
              <h2 className="discovery-title">{currentDiscovery.title}</h2>
              <p className="discovery-summary">{currentDiscovery.summary}</p>
              <button className="discovery-cta">
                {currentDiscovery.ctaText || '查看详情'}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="discovery-visual">
              <img 
                src={currentDiscovery.image} 
                alt={currentDiscovery.title}
                onError={handleImageError}
              />
              {currentDiscovery.isNew && <span className="new-badge">NEW</span>}
            </div>
          </div>
        </div>

        {/* 刷新按钮 */}
        <button 
          className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="刷新内容"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* 更新状态和导航点 */}
      <div className="discovery-footer">
        <div className="update-status">
          {formatLastUpdate(lastUpdateTime)} · 今日已更新 {discoveries.length} 条新发现
        </div>
        {discoveries.length > 1 && (
          <div className="carousel-dots">
            {discoveries.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`跳转到第${index + 1}项`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

DailyDiscovery.propTypes = {
  discoveries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      image: PropTypes.string,
      tag: PropTypes.string,
      tagType: PropTypes.string,
      ctaText: PropTypes.string,
      isNew: PropTypes.bool,
      type: PropTypes.string,
      link: PropTypes.string
    })
  ),
  formattedDate: PropTypes.string.isRequired,
  weekday: PropTypes.string.isRequired,
  onRefresh: PropTypes.func,
  onDiscoveryClick: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  lastUpdateTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};

DailyDiscovery.defaultProps = {
  discoveries: [],
  isDarkMode: false,
  lastUpdateTime: new Date()
};

export default DailyDiscovery; 