import React from 'react';
import PropTypes from 'prop-types';
import './ArticleCard.css';
import { getImage } from '../DailyAiApp';

const ArticleCard = ({ article, onClick }) => {
  const { title, summary, date, category, tags, coverImage } = article;
  
  // 处理图片加载错误
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImage('theme1'); // 使用默认图片
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  return (
    <div className="article-card" onClick={() => onClick && onClick(article)}>
      {/* 文章封面图片 */}
      <div className="article-image-container">
        <img 
          src={getImage(coverImage)}
          alt={title}
          className="article-cover-image"
          onError={handleImageError}
          loading="lazy"
        />
        {category && <span className="article-category-badge">{category}</span>}
      </div>
      
      {/* 文章内容 */}
      <div className="article-content">
        <h3 className="article-title">{title}</h3>
        <p className="article-summary">{summary}</p>
        
        <div className="article-meta">
          <div className="article-date">
            <i className="far fa-calendar-alt" style={{fontSize: "9px", marginRight: "2px"}}></i>
            <span style={{fontSize: "9px"}}>{formatDate(date)}</span>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="article-tags">
              {tags.slice(0, 1).map((tag, index) => (
                <span key={index} className="article-tag" style={{fontSize: "9px", padding: "1px 3px"}}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="article-read-more">
          <span style={{fontSize: "9px"}}>阅读全文</span>
          <i className="fas fa-arrow-right" style={{fontSize: "8px", marginLeft: "2px"}}></i>
        </div>
      </div>
    </div>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    date: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    coverImage: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func
};

export default ArticleCard; 