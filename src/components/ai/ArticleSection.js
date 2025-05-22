import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArticleList from './ArticleList';
import ArticleDetail from './ArticleDetail';
import ArticleCard from './ArticleCard';
import { getRandomTemplate } from './articleTemplates';

// 示例文章数据
const sampleArticles = [
  {
    id: '1',
    title: '智能家居入门指南：打造舒适便捷的生活空间',
    summary: '本文介绍如何通过智能设备打造现代化家居环境，提升生活品质。',
    date: '2023-10-15',
    category: '家居',
    views: 128,
    tags: ['智能家居', '科技生活'],
    coverImage: '/images/smart-home.jpg'
  },
  {
    id: '2',
    title: '智能手表选购指南：哪款最适合你？',
    summary: '本文为您详细比较市面上流行的智能手表，帮助您做出最佳选择。',
    date: '2023-09-28',
    category: '数码',
    views: 253,
    tags: ['智能手表', '购物指南'],
    coverImage: '/images/smartwatch.jpg'
  }
];

const ArticleSection = ({ onRequestArticle, onArticleClick }) => {
  const [articles, setArticles] = useState(sampleArticles);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'create'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟从API加载文章
  useEffect(() => {
    // 实际项目中这里会从API获取文章列表
  }, []);

  // 创建新文章
  const handleCreateArticle = () => {
    setIsLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 使用模板生成一篇新文章
      const newTemplate = getRandomTemplate();
      
      const newArticle = {
        id: `article-${Date.now()}`,
        ...newTemplate,
        views: 0
      };
      
      setArticles([newArticle, ...articles]);
      setSelectedArticle(newArticle);
      setCurrentView('detail');
      setIsLoading(false);
    }, 1000);
  };

  // 查看文章详情
  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setCurrentView('detail');
    
    // 如果提供了外部点击处理函数，则调用它
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  // 编辑文章
  const handleEditArticle = (article) => {
    // 在实际项目中，这里会打开文章编辑表单
    console.log('编辑文章:', article.id);
  };

  // 删除文章
  const handleDeleteArticle = (articleId) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      setArticles(articles.filter(article => article.id !== articleId));
      if (selectedArticle && selectedArticle.id === articleId) {
        setCurrentView('list');
        setSelectedArticle(null);
      }
    }
  };

  // 分享文章
  const handleShareArticle = (article) => {
    // 实际项目中，这里会打开分享对话框
    console.log('分享文章:', article.id);
    alert(`文章《${article.title}》已分享到您的朋友圈`);
  };

  // 导出文章
  const handleExportArticle = (article) => {
    // 实际项目中，这里会提供下载或打印功能
    console.log('导出文章:', article.id);
    alert(`文章《${article.title}》已导出到您的设备`);
  };

  // 返回文章列表
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticle(null);
  };

  // 渲染内容
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ 
          padding: '50px 20px', 
          textAlign: 'center'
        }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>正在加载内容...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'detail':
        return (
          <ArticleDetail 
            article={selectedArticle}
            onBack={handleBackToList}
            onEdit={handleEditArticle}
            onShare={handleShareArticle}
            onExport={handleExportArticle}
          />
        );
      case 'list':
      default:
        return (
          <ArticleList 
            articles={articles}
            onCreateNew={handleCreateArticle}
            onViewArticle={handleViewArticle}
          />
        );
    }
  };

  return (
    <div className="article-section-container">
      {renderContent()}
    </div>
  );
};

ArticleSection.propTypes = {
  onRequestArticle: PropTypes.func,
  onArticleClick: PropTypes.func
};

export default ArticleSection; 