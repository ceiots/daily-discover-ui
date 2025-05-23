import React, { useState, useRef, useEffect } from 'react';
import './AiApplicationWorkshop.css';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../DailyAiApp';

const AiApplicationWorkshop = ({ applications = [] }) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPosition, setScrollLeftPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // 默认应用列表，当没有传入applications时使用
  const defaultApplications = [
    {
      id: 1,
      name: 'AI写作助手',
      icon: 'pencil-alt',
      description: '智能生成高质量文章、报告和创意内容',
      tags: ['效率', '创作'],
      hotLevel: 5,
      route: '/ai-writing',
      color: '#6366f1'
    },
    {
      id: 2,
      name: '智能数据分析',
      icon: 'chart-bar',
      description: '自动处理复杂数据，提供可视化洞察',
      tags: ['数据', '商业'],
      hotLevel: 4,
      route: '/ai-analytics',
      color: '#8b5cf6'
    },
    {
      id: 3,
      name: '语音助手',
      icon: 'microphone',
      description: '自然语音交互，控制设备和获取信息',
      tags: ['生活', '便捷'],
      hotLevel: 4,
      route: '/voice-assistant',
      color: '#ec4899'
    },
    {
      id: 4,
      name: 'AI图像创作',
      icon: 'image',
      description: '根据文字描述生成惊艳的图像作品',
      tags: ['创意', '设计'],
      hotLevel: 5,
      route: '/ai-image',
      color: '#10b981'
    },
    {
      id: 5,
      name: '智能翻译',
      icon: 'language',
      description: '高精度多语言翻译，支持实时对话',
      tags: ['语言', '国际'],
      hotLevel: 3,
      route: '/ai-translate',
      color: '#f59e0b'
    },
    {
      id: 6,
      name: '个人学习助手',
      icon: 'graduation-cap',
      description: '定制化学习计划，智能答疑解惑',
      tags: ['教育', '成长'],
      hotLevel: 4,
      route: '/ai-learning',
      color: '#3b82f6'
    }
  ];

  const appList = applications.length > 0 ? applications : defaultApplications;

  // 检查滚动位置以显示/隐藏导航箭头
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      
      // 初始检查
      checkScrollPosition();
    }
    
    return () => {
      if (slider) {
        slider.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftPosition(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度
    sliderRef.current.scrollLeft = scrollLeftPosition - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const scrollToLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  };

  const scrollToRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  };

  const handleAppClick = (route) => {
    navigate(route);
  };

  return (
    <div className="ai-application-workshop">
      <div className="workshop-header">
        <div className="workshop-title-section">
          <h3 className="workshop-title">
            <i className="fas fa-compass" style={{ color: '#6366f1', marginRight: '8px' }}></i>
            AI应用工坊
          </h3>
          <div className="workshop-subtitle">探索AI赋能的多元世界，开启前沿应用之旅</div>
        </div>
        
        <div className="workshop-controls">
          <button 
            className={`workshop-nav-btn prev ${showLeftArrow ? '' : 'hidden'}`} 
            onClick={scrollToLeft}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className={`workshop-nav-btn next ${showRightArrow ? '' : 'hidden'}`} 
            onClick={scrollToRight}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div 
        className="applications-slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {appList.map((app) => (
          <div 
            key={app.id} 
            className="application-card" 
            onClick={() => handleAppClick(app.route)}
            style={{
              background: `linear-gradient(135deg, ${app.color}15, ${app.color}30)`,
              borderLeft: `3px solid ${app.color}`
            }}
          >
            <div className="application-icon" style={{ backgroundColor: `${app.color}20`, color: app.color }}>
              <i className={`fas fa-${app.icon}`}></i>
            </div>
            
            <h4 className="application-name">{app.name}</h4>
            <p className="application-description">{app.description}</p>
            
            <div className="application-meta">
              <div className="application-tags">
                {app.tags.map((tag, index) => (
                  <span key={index} className="application-tag">{tag}</span>
                ))}
              </div>
              
              <div className="application-hot-level">
                {[...Array(app.hotLevel)].map((_, i) => (
                  <i key={i} className="fas fa-fire"></i>
                ))}
              </div>
            </div>
            
            <div className="application-action">
              <span>立即体验</span>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        ))}
        
        {/* 查看全部按钮 */}
        <div className="application-card view-all" onClick={() => navigate('/ai-applications')}>
          <div className="view-all-content">
            <i className="fas fa-th-large"></i>
            <span>查看全部</span>
            <p>探索更多AI应用</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiApplicationWorkshop; 