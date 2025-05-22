import React from 'react';
import PropTypes from 'prop-types';
import './ArticleCard.css'; // 复用相同的CSS文件
import { getImage } from '../DailyAiApp';

const ArticleDetail = ({ article, onBack, onEdit, onShare, onExport }) => {
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

  // 格式化文章内容，支持分段和标题
  const formatContent = (content) => {
    if (!content) return null;
    
    // 假设内容是字符串，我们按段落分割
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // 检查是否是标题（以#开头）
      if (paragraph.startsWith('# ')) {
        return <h2 key={index}>{paragraph.substring(2)}</h2>;
      } else if (paragraph.startsWith('## ')) {
        return <h3 key={index}>{paragraph.substring(3)}</h3>;
      } else {
        return <p key={index}>{paragraph}</p>;
      }
    });
  };

  if (!article) {
    return <div className="article-fullscreen-card">文章不存在或已被删除</div>;
  }

  return (
    <div className="article-fullscreen-card">
      <div className="article-header">
        <button className="article-action-btn secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>返回
        </button>
        <div>
          <button className="article-action-btn secondary" onClick={() => onShare && onShare(article)}>
            <i className="fas fa-share-alt"></i>分享
          </button>
          <button className="article-action-btn secondary" style={{marginLeft: '8px'}} onClick={() => onEdit && onEdit(article)}>
            <i className="fas fa-edit"></i>编辑
          </button>
        </div>
      </div>
      
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
        
        <div className="article-body">
          {article.summary && <p className="article-summary">{article.summary}</p>}
          {formatContent(article.content)}
        </div>
      </div>
      
      <div className="article-actions">
        <button 
          className="article-action-btn secondary"
          onClick={() => onBack && onBack()}
        >
          <i className="fas fa-arrow-left"></i>返回列表
        </button>
        
        <button 
          className="article-action-btn primary"
          onClick={() => onExport && onExport(article)}
        >
          <i className="fas fa-download"></i>导出
        </button>
      </div>
    </div>
  );
};

ArticleDetail.propTypes = {
  article: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onShare: PropTypes.func,
  onExport: PropTypes.func
};

export default ArticleDetail; 