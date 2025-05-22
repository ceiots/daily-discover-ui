import React from 'react';
import PropTypes from 'prop-types';
import './ArticleCard.css';
import { getImage } from '../DailyAiApp';

const ArticleCard = ({ article, onView, onEdit, onDelete }) => {
  // 格式化日期
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // 处理图片加载错误
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImage('placeholder');
  };

  // 截断文章摘要
  const truncateSummary = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="article-fullscreen-card" onClick={() => onView && onView(article)}>
      <div className="article-image-container">
        <img 
          src={article.coverImage || getImage('placeholder')} 
          alt={article.title} 
          className="article-cover-image"
          onError={handleImageError}
        />
      </div>
      
      <div className="article-content">
        <h2 className="article-title">{article.title}</h2>
        
        <div className="article-meta">
          <div className="article-meta-item">
            <i className="far fa-calendar"></i>
            <span>{formatDate(article.date)}</span>
          </div>
          
          <div className="article-meta-item">
            <i className="far fa-folder"></i>
            <span>{article.category || '未分类'}</span>
          </div>
          
          <div className="article-meta-item">
            <i className="far fa-eye"></i>
            <span>{article.views || 0} 阅读</span>
          </div>
        </div>
        
        <div className="article-tags">
          {(article.tags || ['智能家居']).map((tag, index) => (
            <span key={index} className="article-tag">{tag}</span>
          ))}
        </div>
        
        <p className="article-desc">{truncateSummary(article.summary)}</p>
      </div>
      
      <div className="article-actions">
        <button 
          className="article-action-btn secondary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit(article);
          }}
        >
          <i className="far fa-edit"></i>编辑
        </button>
        
        <button 
          className="article-action-btn primary"
          onClick={(e) => {
            e.stopPropagation();
            onView && onView(article);
          }}
        >
          <i className="far fa-eye"></i>查看
        </button>
        
        <button 
          className="article-action-btn secondary"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(article.id);
          }}
        >
          <i className="far fa-trash-alt"></i>删除
        </button>
      </div>
    </div>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default ArticleCard; 