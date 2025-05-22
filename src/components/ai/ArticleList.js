import React from 'react';
import PropTypes from 'prop-types';
import './ArticleCard.css'; // 复用相同的CSS文件
import { getImage } from '../DailyAiApp';

const ArticleList = ({ articles, onCreateNew, onViewArticle }) => {
  // 处理图片加载错误
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImage('placeholder');
  };

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="articles-list">
      {/* <div style={{ padding: '16px' }}>
        <button 
          className="article-action-btn primary"
          style={{ width: '100%' }}
        >
          <i className="fas"></i>AI文章
        </button>
      </div> */}
      
      {articles && articles.length > 0 ? (
        articles.map((article) => (
          <div 
            key={article.id} 
            className="article-list-item"
            onClick={() => onViewArticle(article)}
          >
            <div className="article-list-image">
              <img 
                src={article.coverImage || getImage('placeholder')} 
                alt={article.title}
                onError={handleImageError}
              />
            </div>
            
            <div className="article-list-info">
              <h3 className="article-list-title">{article.title}</h3>
              
              <div className="article-list-meta">
                <span>
                  <i className="far fa-calendar"></i>
                  {formatDate(article.date)}
                </span>
                
                <span>
                  <i className="far fa-folder"></i>
                  {article.category || '未分类'}
                </span>
              </div>
              
              <p className="article-list-desc">
                {article.summary ? (
                  article.summary.length > 70 
                    ? article.summary.substring(0, 70) + '...' 
                    : article.summary
                ) : '暂无简介'}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div style={{ 
          padding: '50px 20px', 
          textAlign: 'center', 
          color: '#888',
          background: '#f9f9f9',
          margin: '0 16px',
          borderRadius: '8px'
        }}>
          <i className="far fa-file-alt" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', opacity: 0.5 }}></i>
          <h3 style={{ margin: '0 0 12px 0', color: '#666' }}>暂无文章</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>点击上方按钮创建您的第一篇文章</p>
          <button 
            className="article-action-btn primary"
            onClick={onCreateNew}
          >
            <i className="fas fa-plus"></i>创建文章
          </button>
        </div>
      )}
    </div>
  );
};

ArticleList.propTypes = {
  articles: PropTypes.array,
  onCreateNew: PropTypes.func.isRequired,
  onViewArticle: PropTypes.func.isRequired
};

export default ArticleList; 