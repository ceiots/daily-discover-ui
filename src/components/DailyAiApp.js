import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DailyAiApp.css';
import instance from '../utils/axios';
import { useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import EnhancedAiChat from './ai/EnhancedAiChat';
import ArticleSection from './ai/ArticleSection';

// 默认内联占位图片（不变）
const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAElBMVEXy8vL///8AAADu7u7m5ub5+fk5uGF3AAAADUlEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAA8G4qWAABjyVw+QAAAABJRU5ErkJggg==';
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9IiM3NjZkZTgiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iNDAiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxODAiIHI9IjYwIiBmaWxsPSIjZmZmIi8+PC9zdmc+';
const DEFAULT_THEME = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5MzMzZWEiLz48L2xpbmVhckdyYWRpZW50PjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmYiPuaZuuiDveeUn+a0uzwvdGV4dD48L3N2Zz4=';
const DEFAULT_PRODUCT1 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM3NjZkZTgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZiI+aVBob25lPC90ZXh0Pjwvc3ZnPg==';
const DEFAULT_PRODUCT2 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzAiIGZpbGw9IiM3NjZkZTgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmYiPuaZuuiDveasoeihqDwvdGV4dD48L3N2Zz4=';
const DEFAULT_PRODUCT3 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxwYXRoIGQ9Ik01MCw4MHMzMCwtMzAgMTAwLDApIiBzdHJva2U9IiM3NjZkZTgiIHN0cm9rZS13aWR0aD0iMTAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM3NjZkZTgiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMjAiIHI9IjIwIiBmaWxsPSIjNzY2ZGU4Ii8+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiMzMzMiPuaXoOe6v+iAs+aculwvdGV4dD48L3N2Zz4=';
const DEFAULT_PRODUCT4 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxyZWN0IHg9IjQwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzc2NmRlOCIgcng9IjEwIiByeT0iMTAiLz48cmVjdCB4PSI1MCIgeT0iNzAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmYiIHJ4PSI1IiByeT0iNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj7nm7Tol4/nrKzkupvnlLU8L3N2Zz4=';

const IMAGE_MAP = {
  placeholder: DEFAULT_IMAGE,
  avatar: DEFAULT_AVATAR,
  theme1: DEFAULT_THEME,
  product1: DEFAULT_PRODUCT1,
  product2: DEFAULT_PRODUCT2,
  product3: DEFAULT_PRODUCT3,
  product4: DEFAULT_PRODUCT4,
  // Add other default images if needed for games, etc.
};

export const getImage = (id) => {
  if (typeof id === 'string' && id.startsWith('http') && !id.includes('ai-public.mastergo.com')) {
    return id;
  }
  if (IMAGE_MAP[id]) {
    return IMAGE_MAP[id];
  }
  return DEFAULT_IMAGE;
};

const DailyAiApp = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showArticlePreview, setShowArticlePreview] = useState(false);
  const [articleTopic, setArticleTopic] = useState('');
  const [articleCategory, setArticleCategory] = useState('');
  const [articleLength, setArticleLength] = useState('medium');
  const [articlePrompt, setArticlePrompt] = useState('');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const mainRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = `星期${weekdays[currentDate.getDay()]}`;

  useEffect(() => {
    fetchTrendingProducts();
    fetchArticles();

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);
    const darkModeHandler = (e) => setIsDarkMode(e.matches);
    prefersDarkMode.addEventListener('change', darkModeHandler);

    const hasVisited = localStorage.getItem('hasVisitedAiApp');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedAiApp', 'true');
    } else {
      setIsFirstVisit(false);
    }

    const handleScroll = () => {
      if (!mainRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 300);
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      prefersDarkMode.removeEventListener('change', darkModeHandler);
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLoggedIn]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    if (e.target.classList.contains('user-avatar') || 
        e.target.parentElement.classList.contains('ai-avatar') ||
        e.target.classList.contains('user-popup-avatar')) {
      e.target.src = DEFAULT_AVATAR;
    } else {
      e.target.src = DEFAULT_IMAGE;
    }
  };

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };


  const fetchTrendingProducts = async () => {
    try {
      const response = await instance.get('/product/trending');
      if (response.data && response.data.code === 200) {
        setTrendingProducts(response.data.data || []);
      } else {
        setDefaultTrendingProducts();
      }
    } catch (error) {
      console.error('获取热门商品失败:', error);
      setDefaultTrendingProducts();
    }
  };

  const setDefaultTrendingProducts = () => {
    setTrendingProducts([
      { id: 301, title: 'iPhone 13', imageUrl: 'product1', price: 5999.00, salesCount: 5243 },
      { id: 302, title: '智能手表', imageUrl: 'product2', price: 1299.00, salesCount: 3789 },
      { id: 303, title: '无线耳机', imageUrl: 'product3', price: 899.00, salesCount: 4562 },
      { id: 304, title: '超薄笔记本电脑', imageUrl: 'product4', price: 6399.00, salesCount: 2876 }
    ]);
  };

  const handleArticleRequest = (prompt) => {
    const topic = prompt.replace(/帮我写篇关于|写一篇关于|生成一篇|创建一篇文章关于|的文章/gi, '').trim();
    setArticleTopic(topic);
    setShowArticleModal(true);
  };

  const generateCoverImage = (articleTopic) => {
    const defaultCovers = [
      DEFAULT_PRODUCT1, DEFAULT_PRODUCT2, DEFAULT_PRODUCT3,
      DEFAULT_PRODUCT4, DEFAULT_THEME
    ];
    return defaultCovers[Math.floor(Math.random() * defaultCovers.length)];
  };

  const fetchArticles = async () => {
    try {
      if (!isLoggedIn) {
        // Fallback to sample data if not logged in
        setArticles(mockArticlesData);
        return;
      }
      const response = await instance.get('/ai/articles');
      if (response.data && response.data.code === 200) {
        setArticles(response.data.data || []);
      } else {
        setArticles(mockArticlesData);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      setArticles(mockArticlesData);
    }
  };

  const mockArticlesData = [
        {
          id: 1,
          title: '智能家居入门指南：打造舒适便捷的生活空间',
          summary: '本文介绍如何通过智能设备打造现代化家居环境，提升生活品质。',
          content: '<p>随着科技的发展，智能家居已经逐渐走进千家万户。本文将详细介绍智能家居的基本概念、核心设备以及如何根据不同需求搭建适合自己的智能家居系统。</p><h3>智能家居的核心设备</h3><p>智能音箱、智能灯具、智能开关和智能窗帘是入门智能家居的首选设备。这些设备不仅安装简单，而且可以通过语音控制，极大地提升了生活便利性。</p><h3>系统互通与场景设置</h3><p>选择支持主流协议的设备，确保不同品牌产品之间可以互相通信。通过场景设置，可以实现一键控制多个设备，例如"回家模式"可以同时打开灯光、空调和窗帘。</p><h3>智能家居的发展趋势</h3><p>未来智能家居将更加注重AI学习用户习惯，自动调整家居环境，提供更加个性化的服务体验。</p>',
          createdAt: '2023-10-15',
          category: '家居',
          coverImage: DEFAULT_PRODUCT3,
          images: [DEFAULT_PRODUCT3, DEFAULT_PRODUCT4],
          status: '已完成'
        },
        {
          id: 2,
          title: '2023年最值得购买的无线耳机评测',
          summary: '详细对比市面上热门无线耳机的音质、续航和舒适度，助您做出最佳选择。',
          content: '<p>无线耳机已经成为现代生活的必备品，本文将从音质、降噪效果、续航能力和佩戴舒适度等方面对市面主流无线耳机进行全面评测。</p><h3>音质表现</h3><p>Sony WF-1000XM4在音质方面表现出色，低频饱满有力，中频清晰，高频明亮但不刺耳。AirPods Pro则在空间感和平衡性方面有优势。</p><h3>降噪效果</h3><p>Bose QuietComfort Earbuds II的降噪能力领先，尤其在嘈杂环境中表现突出。索尼和苹果的产品紧随其后。</p><h3>续航与舒适度</h3><p>三星Galaxy Buds Pro 2在续航方面表现最佳，单次充电可使用10小时。而Beats Fit Pro在佩戴舒适度和运动稳定性方面更具优势。</p>',
          createdAt: '2023-11-02',
          category: '评测',
          coverImage: DEFAULT_PRODUCT2,
          images: [DEFAULT_PRODUCT1, DEFAULT_PRODUCT2],
          status: '已完成'
        }
  ];

  const handleGenerateArticle = async () => {
    if (!articleTopic.trim()) return;
    setIsGeneratingArticle(true);
    try {
      const requestData = {
        topic: articleTopic,
        category: articleCategory,
        length: articleLength,
        additionalPrompt: articlePrompt
      };
      
      const response = await instance.post('/ai/generate-article', requestData);
      
      if (response.data && response.data.code === 200) {
        const generatedArticle = response.data.data;
        setArticles(prev => [generatedArticle, ...prev]);
        resetArticleForm();
        setShowArticleModal(false);
        alert('文章生成成功！');
      } else {
        // Fallback to mock article generation
        const coverImage = generateCoverImage(articleTopic);
        const randomImages = articleCategory === '评测' ? 
          [DEFAULT_PRODUCT1, DEFAULT_PRODUCT2] : 
          (Math.random() > 0.5 ? [generateCoverImage(articleTopic)] : []);
        
        const mockArticle = {
          id: Date.now(),
          title: articleCategory ? `${articleCategory}：${articleTopic}` : articleTopic,
          summary: `关于${articleTopic}的详细解析和最新信息整理。`,
          content: `<h2>${articleTopic}</h2><p>这是一篇关于${articleTopic}的AI生成文章。文章内容将根据您的要求进行生成。</p><h3>主要内容</h3><p>在这部分将详细介绍${articleTopic}的核心内容和要点。</p><h3>深入分析</h3><p>这部分将对${articleTopic}进行深入的分析和讨论，提供专业的见解和建议。</p><h3>总结</h3><p>最后，我们将对${articleTopic}进行总结，并展望未来的发展趋势。</p>`,
          createdAt: new Date().toISOString().split('T')[0],
          category: articleCategory || '未分类',
          coverImage: coverImage,
          images: randomImages,
          status: '已完成'
        };
        setArticles(prev => [mockArticle, ...prev]);
        resetArticleForm();
        setShowArticleModal(false);
        alert('文章生成成功！');
      }
    } catch (error) {
      console.error('生成文章失败:', error);
      alert('生成文章失败，请稍后再试');
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  const resetArticleForm = () => {
    setArticleTopic('');
    setArticleCategory('');
    setArticleLength('medium');
    setArticlePrompt('');
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setShowArticlePreview(true);
  };

  const handleEditArticle = (article) => {
    alert(`编辑文章: ${article.title}`);
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    try {
      const response = await instance.delete(`/ai/articles/${articleId}`);
      if (response.data && response.data.code === 200) {
        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('文章已删除');
      } else {
        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('文章已删除');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      setArticles(prev => prev.filter(article => article.id !== articleId));
      alert('文章已删除');
    }
  };

  const handleShareArticle = (article) => {
    alert(`分享文章: ${article.title}`);
  };

  const handleExportArticle = (article) => {
    alert(`导出文章: ${article.title}`);
  };

  return (
    <div className="daily-ai-wrapper">
      <div className={`ai-app-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

        {showBackToTop && (
          <div className="back-to-top visible" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
          </div>
        )}
      
        <EnhancedAiChat onRequestArticle={handleArticleRequest} />
          <section className="feature-entry-cards">
            <h2 className="feature-section-title">
              <span className="pulse-dot"></span>
              AI智能为您精选
            </h2>
            <div className="entry-cards-container">
              <div 
                className="entry-card" 
                onClick={() => navigate('/recommendations')}
                role="button"
                aria-label="智能推荐"
              >
                <div className="entry-card-icon" style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)"
                }}>
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div className="entry-card-content">
                  <h3 className="entry-card-title">智能推荐</h3>
                  <p className="entry-card-desc">发现专属好物</p>
                </div>
                <div className="entry-card-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>

              <div 
                className="entry-card" 
                onClick={() => navigate('/games')}
                role="button"
                aria-label="互动游戏"
              >
                <div className="entry-card-icon" style={{
                  background: "linear-gradient(135deg, #ec4899, #db2777)",
                  boxShadow: "0 4px 8px rgba(236, 72, 153, 0.15)"
                }}>
                  <i className="fas fa-gamepad"></i>
                </div>
                <div className="entry-card-content">
                  <h3 className="entry-card-title">互动游戏</h3>
                  <p className="entry-card-desc">赢取专属奖励</p>
                </div>
                <div className="entry-card-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </section>

          <section className="trending-entry-section">
            <div 
              className="trending-entry-card" 
              onClick={() => navigate('/trending')}
              role="button"
              aria-label="热门榜单"
            >
              <div className="trending-entry-icon" style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 3px 6px rgba(245, 158, 11, 0.2)"
              }}>
                <i className="fas fa-crown"></i>
              </div>
              <div className="trending-entry-content">
                <h3 className="entry-card-title">热门榜单</h3>
                <p className="entry-card-desc">发现流行趋势</p>
              </div>
              <div className="entry-card-arrow">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </section>

          <section className="fade-in">
            <div className="ai-article-section">
              <div className="section-header" style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "12px"
              }}>
                <div style={{ 
                  width: "3px", 
                  height: "16px", 
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)", 
                  marginRight: "8px", 
                  borderRadius: "2px" 
                }}></div>
                <h2 style={{ 
                  fontSize: "13px", 
                  fontWeight: "600", 
                  color: "#333"
                }}>精选文章</h2>
                <div style={{ flex: 1 }}></div>
                <button 
                  onClick={() => navigate('/articles')}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "11px",
                    cursor: "pointer"
                  }}
                >
                  查看全部
                  <i className="fas fa-chevron-right" style={{ marginLeft: "4px", fontSize: "10px" }}></i>
                </button>
              </div>
              <ArticleSection 
                onRequestArticle={handleArticleRequest} 
                onArticleClick={(article) => {
                  setSelectedArticle(article);
                  setShowArticlePreview(true);
                }}
              />
            </div>
          </section>
        
        {/* 文章预览模态框 */}
        {showArticlePreview && selectedArticle && (
          <div className="modal-overlay">
            <div className="article-preview-modal">
              <div className="modal-header">
                <h3>{selectedArticle.title}</h3>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowArticlePreview(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="article-preview-content">
                <div className="article-meta-info">
                  <span>
                    <i className="far fa-calendar-alt mr-1"></i>
                    {selectedArticle.createdAt}
                  </span>
                  <span>
                    <i className="far fa-folder mr-1"></i>
                    {selectedArticle.category}
                  </span>
                  <span>
                    <i className="fas fa-pen-fancy mr-1"></i>
                    AI生成
                  </span>
                </div>
                {selectedArticle.images && selectedArticle.images.length > 0 && (
                  <div className="article-preview-images">
                    <div className={`grid ${selectedArticle.images.length === 1 ? '' : 'grid-cols-2'} gap-3 mb-4`}>
                      {selectedArticle.images.map((image, index) => (
                        <img 
                          key={index} 
                            src={getImage(image)}
                          alt={`图片 ${index + 1}`}
                          className={`w-full rounded-lg ${selectedArticle.images.length === 1 ? 'max-h-[300px] object-contain' : 'h-32 object-cover'}`}
                            onError={handleImageError}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedArticle.coverImage && !selectedArticle.images && (
                  <div className="article-preview-cover mb-4">
                    <img 
                        src={getImage(selectedArticle.coverImage)}
                      alt={selectedArticle.title}
                      className="w-full max-h-[300px] object-contain rounded-lg"
                        onError={handleImageError}
                    />
                  </div>
                )}
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
              <div className="modal-footer">
                <button 
                  className="share-btn"
                  onClick={() => handleShareArticle(selectedArticle)}
                >
                  <i className="fas fa-share-alt mr-1"></i>
                  分享
                </button>
                <button 
                  className="export-btn"
                  onClick={() => handleExportArticle(selectedArticle)}
                >
                  <i className="fas fa-download mr-1"></i>
                  导出
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => {
                    setShowArticlePreview(false);
                    handleEditArticle(selectedArticle);
                  }}
                >
                  <i className="fas fa-edit mr-1"></i>
                  编辑
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default DailyAiApp;