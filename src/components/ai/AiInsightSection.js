import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { getImage } from '../DailyAiApp';

/**
 * AI精选洞察组件
 * 按照requirement-for-discover.md的需求实现，采用横向滑动布局
 */
const AiInsightSection = ({ articles, onViewArticle, isDarkMode }) => {
  const scrollRef = useRef(null);

  // 处理左右滚动
  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 300; // 每次滚动的像素数
    const currentScroll = scrollRef.current.scrollLeft;
    
    scrollRef.current.scrollTo({
      left: currentScroll + (direction === 'right' ? scrollAmount : -scrollAmount),
      behavior: 'smooth'
    });
  };

  // 处理更多文章点击
  const handleMoreArticlesClick = () => {
    console.log("查看更多AI精选洞察文章");
    // 在这里可以实现跳转到文章列表页面的逻辑
    // navigate('/ai-insights');
  };

  return (
    <section className={`ai-insight-section ${isDarkMode ? 'dark' : ''}`}>
      <div className="section-header">
        <h2>
          <i className="fas fa-brain"></i>
          AI精选洞察
        </h2>
        <div className="section-actions">
          <button className="scroll-btn left" onClick={() => handleScroll('left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="view-all-btn" onClick={handleMoreArticlesClick}>更多文章</button>
          <button className="scroll-btn right" onClick={() => handleScroll('right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="insights-container" ref={scrollRef}>
        <div className="insights-slider">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="insight-card"
              onClick={() => onViewArticle(article)}
            >
              <div className="insight-image">
                <img 
                  src={getImage(article.coverImage)} 
                  alt={article.title}
                  onError={(e) => e.target.src = getImage('/images/default-article.jpg')}
                />
              </div>
              <div className="insight-content">
                <h3 className="insight-title">{article.title}</h3>
                <p className="insight-summary">{article.summary}</p>
                
                <div className="insight-meta">
                  <div className="insight-tags">
                    {article.tags && article.tags.map((tag, index) => (
                      <span key={index} className="insight-tag">{tag}</span>
                    ))}
                    {!article.tags && (
                      <span className="insight-tag">{article.category || '未分类'}</span>
                    )}
                  </div>
                  
                  <div className="insight-info">
                    <span className="insight-read-time">
                      <i className="fas fa-clock"></i>
                      {article.readTime || '5分钟阅读'}
                    </span>
                    <span className="insight-date">
                      <i className="fas fa-calendar-alt"></i>
                      {article.createdAt}
                    </span>
                    {article.author && (
                      <span className="insight-author">
                        <i className="fas fa-user"></i>
                        {article.author}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

AiInsightSection.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      coverImage: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      category: PropTypes.string,
      readTime: PropTypes.string,
      createdAt: PropTypes.string,
      author: PropTypes.string
    })
  ).isRequired,
  onViewArticle: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool
};

export default AiInsightSection;
