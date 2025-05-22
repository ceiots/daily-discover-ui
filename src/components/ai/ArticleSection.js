import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArticleList from './ArticleList';
import ArticleDetail from './ArticleDetail';
import { getRandomTemplate } from './articleTemplates';

// 示例文章数据 - 添加默认封面图片
const sampleArticles = [
  {
    id: '1',
    title: '智能家居入门指南：打造舒适便捷的生活空间',
    summary: '本文介绍如何通过智能设备打造现代化家居环境，提升生活品质。',
    date: '2023-10-15',
    category: '家居',
    views: 128,
    tags: ['智能家居', '科技生活'],
    coverImage: 'product3'
  },
  {
    id: '2',
    title: '智能手表选购指南：哪款最适合你？',
    summary: '本文为您详细比较市面上流行的智能手表，帮助您做出最佳选择。',
    date: '2023-09-28',
    category: '数码',
    views: 253,
    tags: ['智能手表', '购物指南'],
    coverImage: 'product2'
  },
  {
    id: '3',
    title: '2023年最值得购买的无线耳机评测',
    summary: '详细对比市面上热门无线耳机的音质、续航和舒适度，助您做出最佳选择。',
    date: '2023-11-02',
    category: '评测',
    views: 321,
    tags: ['无线耳机', '数码产品', '购物指南'],
    coverImage: 'product1'
  }
];

const ArticleSection = ({ onRequestArticle, onArticleClick }) => {
  const [articles, setArticles] = useState(sampleArticles);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟从API加载文章
  useEffect(() => {
    // 实际项目中这里会从API获取文章列表
  }, []);

  // 处理文章点击
  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    
    // 如果提供了外部点击处理函数，则调用它
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  // 渲染内容
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="article-loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      );
    }

    return (
      <ArticleList 
        articles={articles}
        onViewArticle={handleViewArticle}
      />
    );
  };

  return (
    <div className="article-section">
      {renderContent()}
    </div>
  );
};

ArticleSection.propTypes = {
  onRequestArticle: PropTypes.func,
  onArticleClick: PropTypes.func
};

export default ArticleSection; 