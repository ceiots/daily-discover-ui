import React from 'react';
import PropTypes from 'prop-types';
import ArticleCard from './ArticleCard';
import { getImage } from '../DailyAiApp';

// 默认文章封面图片
const DEFAULT_COVER_IMAGES = [
  'theme1',
  'product1',
  'product2',
  'product3',
  'product4'
];

// 获取随机封面图片
const getRandomCover = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_COVER_IMAGES.length);
  return DEFAULT_COVER_IMAGES[randomIndex];
};

const ArticleList = ({ articles, onViewArticle }) => {
  // 确保文章有封面图片
  const articlesWithCovers = articles.map(article => {
    if (!article.coverImage) {
      return {
        ...article,
        coverImage: getRandomCover()
      };
    }
    return article;
  });
  
  return (
    <div className="article-list">
      {articlesWithCovers.length === 0 ? (
        <div className="empty-article-list">
          <div className="empty-icon">
            <i className="far fa-file-alt"></i>
          </div>
          <h3 className="empty-title">暂无文章</h3>
          <p className="empty-subtitle">AI将为您推荐精选内容</p>
        </div>
      ) : (
        <div className="article-grid">
          {articlesWithCovers.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onClick={onViewArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ArticleList.propTypes = {
  articles: PropTypes.array.isRequired,
  onViewArticle: PropTypes.func
};

export default ArticleList; 