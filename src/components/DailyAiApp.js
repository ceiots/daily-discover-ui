import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DailyAiApp.css';
import instance from '../utils/axios';
import { useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import EnhancedAiChat from './ai/EnhancedAiChat';
import FragmentedExperience from './ai/FragmentedExperience';
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

// 关键词映射表 - 用于根据用户输入生成相关的动态气泡内容（从EnhancedAiChat复制）
const KEYWORD_MAPPING = {
  '咖啡': {
    bubbles: [
      { type: 'info', content: '咖啡冷知识：拿铁源自意大利语"latte"，意为牛奶！', icon: 'coffee' },
      { type: 'product', content: '星巴克咖啡豆限时8折优惠中', icon: 'tag' },
      { type: 'task', content: '点击完成咖啡知识小测验，获得优惠券', icon: 'tasks' }
    ],
    progressTheme: 'coffee-cup',
    miniGame: { type: 'quiz', title: '咖啡知识测验', icon: 'coffee' }
  },
  '健身': {
    bubbles: [
      { type: 'info', content: '每周至少进行150分钟中等强度有氧运动更有益健康', icon: 'heartbeat' },
      { type: 'product', content: '运动手环新品上市，心率监测更精准', icon: 'shopping-bag' },
      { type: 'task', content: '完成7天运动打卡挑战，赢取健身优惠券', icon: 'medal' }
    ],
    progressTheme: 'running-track',
    miniGame: { type: 'click', title: '能量收集挑战', icon: 'bolt' }
  },
  'AI': {
    bubbles: [
      { type: 'info', content: 'AI之父图灵在1950年提出了著名的图灵测试', icon: 'lightbulb' },
      { type: 'product', content: '智能语音助手限时优惠中，提升生活效率', icon: 'microphone' },
      { type: 'task', content: '你能分辨哪些图片是AI生成的吗？', icon: 'image' }
    ],
    progressTheme: 'neural-network',
    miniGame: { type: 'quiz', title: 'AI or 人类？', icon: 'robot' }
  },
  '科技': {
    bubbles: [
      { type: 'info', content: '2023年AI技术发展速度超过过去十年总和', icon: 'robot' },
      { type: 'product', content: '全新智能家居套装，语音控制更便捷', icon: 'microchip' },
      { type: 'task', content: '测测你的科技产品选购指数', icon: 'laptop-code' }
    ],
    progressTheme: 'tech-circuit',
    miniGame: { type: 'quiz', title: 'AI知识问答', icon: 'brain' }
  }
};

// 默认气泡和游戏配置 - 当没有匹配关键词时使用
const DEFAULT_LOADING_EXPERIENCE = {
  bubbles: [
    { type: 'info', content: '每天使用AI助手的用户平均节省30分钟搜索时间', icon: 'clock' },
    { type: 'product', content: '探索更多AI推荐的个性化内容', icon: 'compass' },
    { type: 'task', content: '收集能量球，获取积分奖励', icon: 'star' }
  ],
  progressTheme: 'pulse-wave',
  miniGame: { type: 'click', title: '能量收集', icon: 'tachometer-alt' }
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
  const [dailyTheme, setDailyTheme] = useState('科技改变生活');
  const [dailyInsight, setDailyInsight] = useState({
    title: 'AI驱动的未来工作方式',
    content: 'AI正在重塑我们的工作方式，将重复性任务自动化，让我们专注于更有创造性的工作。',
    type: 'trend'
  });
  const [recommendedTopics, setRecommendedTopics] = useState([
    {
      id: 1,
      title: 'AI驱动的工作效率',
      description: '1.智能文档处理 2.会议内容自动记录 3.高效任务管理',
      icon: 'briefcase',
      views: 1342,
      hotLevel: 3,
      tag: '热门话题',
      color: '#4f46e5',
      route: '/ai-explore'
    },
    {
      id: 2,
      title: '智能家居生活',
      description: '1.智能设备互联 2.语音控制系统 3.场景自动化配置',
      icon: 'home',
      views: 986,
      hotLevel: 2,
      tag: '为您推荐',
      color: '#4f46e5',
      route: '/recommendations'
    },
    {
      id: 3,
      title: '数字娱乐体验',
      description: '1.AI个性化推荐 2.虚拟现实互动 3.智能内容创作',
      icon: 'gamepad',
      views: 658,
      hotLevel: 1,
      tag: '近期热点',
      color: '#4f46e5',
      route: '/games'
    }
  ]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // 碎片化体验相关状态（从EnhancedAiChat复制）
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [showInfoBubbles, setShowInfoBubbles] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressTheme, setProgressTheme] = useState('pulse-wave');
  const progressInterval = useRef(null);
  const [clickedBubbles, setClickedBubbles] = useState(0);

  // 新增历史体验容器
  const [experienceHistory, setExperienceHistory] = useState([]);
  const [showExperiencePage, setShowExperiencePage] = useState(false);

  const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = `星期${weekdays[currentDate.getDay()]}`;

  useEffect(() => {
    fetchTrendingProducts();
    fetchArticles();
    fetchRecommendedTopics();
    fetchDailyInsight();

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);
    const darkModeHandler = (e) => setIsDarkMode(e.matches);
    prefersDarkMode.addEventListener('change', darkModeHandler);

    const topicsRefreshInterval = setInterval(() => {
      fetchRecommendedTopics();
      setLastUpdateTime(new Date());
    }, 10 * 60 * 1000);

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
      clearInterval(topicsRefreshInterval);
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
    
    // 结束加载状态
    setIsAiLoading(false);
    
    // 设置100%进度
    setLoadingProgress(100);
    
    // 停止进度动画
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
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

  const fetchRecommendedTopics = async () => {
    try {
      if (isLoggedIn) {
        const response = await instance.get('/recommend/topics');
        if (response.data && response.data.code === 200) {
          setRecommendedTopics(response.data.data.topics);
          setDailyTheme(response.data.data.theme || '科技改变生活');
        }
      } else {
        // 更丰富的模拟主题内容
        const topicOptions = [
          {
            id: 1,
            title: 'AI驱动的智能工作',
            description: '提升工作效率、自动化任务处理、创意辅助',
            icon: 'brain',
            views: 1000 + Math.floor(Math.random() * 500),
            hotLevel: 3,
            tag: '热门话题',
            color: '#8b5cf6',
            route: '/ai-explore'
          },
          {
            id: 2,
            title: '智能家居生活新体验',
            description: '智能设备互联、语音控制系统、场景自动化',
            icon: 'home',
            views: 800 + Math.floor(Math.random() * 400),
            hotLevel: 2,
            tag: '为您推荐',
            color: '#0ea5e9',
            route: '/recommendations'
          },
          {
            id: 3,
            title: '数字化娱乐新时代',
            description: 'AI游戏体验、虚拟现实互动、智能内容推荐',
            icon: 'gamepad',
            views: 500 + Math.floor(Math.random() * 300),
            hotLevel: 1,
            tag: '近期热点',
            color: '#ec4899',
            route: '/games'
          },
          {
            id: 4,
            title: 'AI辅助健康管理',
            description: '个性化健康方案、实时监测数据、智能饮食建议',
            icon: 'heartbeat',
            views: 600 + Math.floor(Math.random() * 350),
            hotLevel: 2,
            tag: '生活应用',
            color: '#10b981',
            route: '/ai-explore'
          },
          {
            id: 5,
            title: '智能学习与教育',
            description: '个性化学习路径、知识图谱构建、智能答疑系统',
            icon: 'graduation-cap',
            views: 750 + Math.floor(Math.random() * 400),
            hotLevel: 2,
            tag: '知识拓展',
            color: '#f59e0b',
            route: '/ai-explore'
          }
        ];
        
        // 随机选择3个主题
        const shuffled = [...topicOptions].sort(() => 0.5 - Math.random());
        const selectedTopics = shuffled.slice(0, 3);
        selectedTopics.sort((a, b) => b.hotLevel - a.hotLevel);
        
        setRecommendedTopics(selectedTopics);
        
        const themeOptions = [
          '科技改变生活', 
          '智能时代探索', 
          '数字创新前沿', 
          'AI赋能未来',
          '人机协作新纪元',
          '智能科技应用实践'
        ];
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
        setDailyTheme(themeOptions[dayOfYear % themeOptions.length]);
      }
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error('获取推荐主题失败:', error);
    }
  };

  const refreshRecommendations = () => {
    fetchRecommendedTopics();
  };

  // 处理气泡点击
  const handleBubbleClick = (bubble) => {
    setClickedBubbles(prev => prev + 1);
    
    // 如果点击了3个气泡，触发彩蛋效果
    if (clickedBubbles + 1 >= 3) {
      alert('🎉 恭喜您触发了彩蛋！您获得了10积分奖励');
      // 重置点击计数
      setClickedBubbles(0);
    }
  };
  
  // 处理气泡交互回调
  const handleBubbleInteraction = (interaction) => {
    console.log("气泡交互:", interaction);
    
    if (interaction.type === 'easter_egg') {
      alert(interaction.message);
    } else if (interaction.type === 'game_reward') {
      alert(interaction.message);
    }
  };
  
  // 关闭气泡
  const handleDismissBubble = (index) => {
    setBubbles(prev => prev.filter((_, i) => i !== index));
  };

  // 处理AI加载状态变化，增加历史记录
  const handleAiLoadingChange = (isLoading, userInput) => {
    console.log("AI加载状态变化:", isLoading, "用户输入:", userInput);
    setIsAiLoading(isLoading);
    
    if (isLoading) {
      // 无论是否有用户输入，都设置正确的状态
      if (userInput) {
        setUserQuery(userInput);
        
        // 生成新的碎片化体验
        const newExperience = generateFragmentedExperienceData(userInput);
        
        // 设置当前显示的碎片化体验
        setBubbles(newExperience.bubbles);
        setProgressTheme(newExperience.progressTheme);
        
        // 将体验添加到历史记录
        setExperienceHistory(prev => [
          {
            id: Date.now(),
            query: userInput,
            timestamp: new Date().toLocaleTimeString(),
            ...newExperience
          },
          ...prev.slice(0, 9) // 保留最近10条记录
        ]);
      } else {
        // 即使没有用户输入，也设置默认的碎片化体验
        setBubbles(DEFAULT_LOADING_EXPERIENCE.bubbles);
        setProgressTheme(DEFAULT_LOADING_EXPERIENCE.progressTheme);
      }
      
      // 无论有没有用户输入，都显示体验页面和开始进度动画
      setShowInfoBubbles(true);
      setShowExperiencePage(true);
      startProgressAnimation();
    } else if (!isLoading) {
      // AI响应完成，设置进度为100%
      setLoadingProgress(100);
      
      // 停止进度动画但不隐藏碎片化体验
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      // 不再隐藏碎片化体验，保持showInfoBubbles为true
      setShowInfoBubbles(true);
      
      // AI内容生成后，自动滚动到AI回复位置
      setTimeout(() => {
        // 查找最新的AI回复元素
        const aiMessages = document.querySelectorAll('.assistant-message');
        if (aiMessages && aiMessages.length > 0) {
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          if (lastAiMessage) {
            // 平滑滚动到AI回复位置，上方留出一定空间
            lastAiMessage.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
      }, 300); // 稍微延迟，确保DOM已更新
    }
  };
  
  // 生成基于用户输入的碎片化体验数据 - 与renderInfoBubbles分离
  const generateFragmentedExperienceData = (input) => {
    if (!input) return DEFAULT_LOADING_EXPERIENCE;
    
    let matchedKeyword = null;
    let matchedExperience = DEFAULT_LOADING_EXPERIENCE;
    
    // 转换为小写便于匹配
    const inputLower = input.toLowerCase();
    
    // 查找匹配的关键词
    for (const keyword in KEYWORD_MAPPING) {
      const keywordLower = keyword.toLowerCase();
      if (inputLower.includes(keywordLower)) {
        matchedKeyword = keyword;
        matchedExperience = KEYWORD_MAPPING[keyword];
        break;
      }
    }
    
    // 手动检查一些特殊词汇映射
    if (!matchedKeyword) {
      if (inputLower.includes("健身") || inputLower.includes("锻炼") || inputLower.includes("运动")) {
        matchedExperience = KEYWORD_MAPPING["健身"];
      } else if (inputLower.includes("人工智能") || inputLower.includes("机器学习")) {
        matchedExperience = KEYWORD_MAPPING["AI"];
      }
    }
    
    // 返回匹配的体验数据
    return {
      bubbles: [...matchedExperience.bubbles].sort(() => Math.random() - 0.5),
      progressTheme: matchedExperience.progressTheme,
      miniGame: matchedExperience.miniGame
    };
  };
  
  // 渲染碎片化体验历史记录页面
  const renderExperiencePage = () => {
    if (!showExperiencePage) return null;
    
    return (
      <section className="fragmented-experience-page">
        <div className="experience-items-container">
          {/* 当前正在加载的体验 */}
          {isAiLoading && renderInfoBubbles()}
          
          {/* 历史体验记录 */}
          {experienceHistory.length > 0 && (
            <div className="experience-history">
              <h3 className="history-title">历史记录</h3>
              
              {experienceHistory.map((exp, expIndex) => (
                <div key={exp.id} className="experience-history-item">
                  <div className="experience-query-info">
                    <span className="query-text">{exp.query}</span>
                    <span className="query-time">{exp.timestamp}</span>
                  </div>
                  
                  <div className="fragment-bubbles-wrapper">
                    {exp.bubbles.map((bubble, index) => (
                      <div 
                        key={`${exp.id}-${index}`} 
                        className={`fragment-bubble ${bubble.type}`}
                      >
                        <div className="bubble-icon">
                          <i className={`fas fa-${bubble.icon}`}></i>
                      </div>
                        <div className="bubble-content">{bubble.content}</div>
                        <div className="bubble-actions">
                          <button className="bubble-action view" onClick={() => handleBubbleClick(bubble)}>
                            <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  // 渲染动态气泡
  const renderInfoBubbles = () => {
    if (!showInfoBubbles || bubbles.length === 0) return null;
    
    return (
      <div className="fragment-experience-container" style={{ 
        marginTop: '12px',
        marginBottom: '12px',
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        paddingTop: '10px',
        paddingBottom: '10px'
      }}>
        <div className="fragment-experience-title">
          <i className="fas fa-lightbulb" style={{ color: '#f59e0b', marginRight: '6px' }}></i>
          <span>正在生成内容，同时您可能感兴趣：{userQuery ? `"${userQuery}"` : ''}</span>
          
          {/* 添加思考指示器 */}
          <div className="thinking-indicator">
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
          </div>
        </div>
        
        <div className="fragment-bubbles-wrapper">
          {bubbles.map((bubble, index) => (
            <div 
              key={index} 
              className={`fragment-bubble ${bubble.type}`}
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="bubble-icon">
                <i className={`fas fa-${bubble.icon}`}></i>
              </div>
              <div className="bubble-content">{bubble.content}</div>
              <div className="bubble-actions">
                <button className="bubble-action view" onClick={() => handleBubbleClick(bubble)}>
                  <i className="fas fa-eye"></i>
                </button>
                <button className="bubble-action dismiss" onClick={() => handleDismissBubble(index)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ))}
          
          {/* 智能等待卡片 - 根据用户查询显示相关内容 */}
          <div className="smart-waiting-card">
            {userQuery.toLowerCase().includes('技术') || userQuery.toLowerCase().includes('科技') ? (
              <>
                <div className="smart-waiting-header">
                  <i className="fas fa-microchip"></i>
                  <span>科技资讯</span>
                </div>
                <div className="smart-waiting-content">
                  <p>2023年AI技术发展速度超过过去十年总和，推动了多个行业的变革。</p>
                  <button className="smart-action-btn">查看相关文章</button>
                </div>
              </>
            ) : userQuery.toLowerCase().includes('手机') || userQuery.toLowerCase().includes('电子') ? (
              <>
                <div className="smart-waiting-header">
                  <i className="fas fa-mobile-alt"></i>
                  <span>产品推荐</span>
                </div>
                <div className="smart-waiting-content">
                  <p>最新智能手机评测与比较，助您了解市场动向。</p>
                  <button className="smart-action-btn">浏览热门产品</button>
                </div>
              </>
            ) : (
              <>
                <div className="smart-waiting-header">
                  <i className="fas fa-brain"></i>
                  <span>AI小贴士</span>
                </div>
                <div className="smart-waiting-content">
                  <p>提问AI时，尝试详细描述您的需求和背景，能够获得更精准的回答。</p>
                  <button className="smart-action-btn">了解更多技巧</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染进度条（从EnhancedAiChat复制并修改）
  const renderProgressBar = () => {
    if (!isAiLoading) return null;
    
    let progressBarContent;
    
    // 根据主题渲染不同风格的进度条
    switch (progressTheme) {
      case 'neural-network':
        progressBarContent = (
          <div className="themed-progress neural-network">
            <div className="network">
              <div className="connection" style={{ width: `${loadingProgress}%` }}></div>
              <div className="node node1"><i className="fas fa-brain"></i></div>
              <div className="node node2"><i className="fas fa-brain"></i></div>
              <div className="node node3"><i className="fas fa-brain"></i></div>
            </div>
            <div className="progress-text">
              <span className="progress-percentage">{Math.round(loadingProgress)}%</span>
              <span className="progress-status">AI思考中...</span>
            </div>
          </div>
        );
        break;
      
      case 'tech-circuit':
        progressBarContent = (
          <div className="themed-progress tech-circuit">
            <div className="circuit-track">
              <div className="circuit-line" style={{ width: `${loadingProgress}%` }}></div>
              <div className="circuit-node node1"></div>
              <div className="circuit-node node2"></div>
              <div className="circuit-node node3"></div>
              <div className="circuit-pulse" style={{ left: `${loadingProgress}%` }}></div>
            </div>
            <div className="progress-text">
              <span className="progress-percentage">{Math.round(loadingProgress)}%</span>
              <span className="progress-status">正在处理</span>
            </div>
          </div>
        );
        break;
        
      default:
        // 默认脉冲波进度条
        progressBarContent = (
          <div className="themed-progress pulse-wave">
            <div className="progress-bar">
              <div className="progress-filled" style={{ width: `${loadingProgress}%` }}></div>
              <div className="progress-pulse" style={{ left: `${Math.min(loadingProgress, 95)}%` }}></div>
            </div>
            <div className="progress-text">
              <span className="progress-percentage">{Math.round(loadingProgress)}%</span>
              <span className="progress-status">内容生成中</span>
            </div>
          </div>
        );
    }
    
    return (
      <div className="ai-progress-container" style={{
        animation: 'fadeIn 0.5s ease-in-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        {progressBarContent}
      </div>
    );
  };

  // 启动进度条动画（从EnhancedAiChat复制并修改）
  const startProgressAnimation = () => {
    // 清除之前的进度条间隔
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // 重置进度
    setLoadingProgress(0);
    
    // 设置新的进度条更新间隔
    progressInterval.current = setInterval(() => {
      setLoadingProgress(prev => {
        // 随机增加进度，模拟不规则加载
        const increment = Math.random() * 8 + 2;
        const newProgress = prev + increment;
        
        // 如果进度接近100%，停止更新
        if (newProgress >= 90) {
          clearInterval(progressInterval.current);
          return 90; // 留下最后10%在真正完成请求时添加
        }
        
        return newProgress;
      });
    }, 300);
  };

  // 获取每日AI洞察内容
  const fetchDailyInsight = async () => {
    try {
      const response = await instance.get('/ai/daily-insight');
      if (response.data && response.data.code === 200) {
        setDailyInsight(response.data.data);
      } else {
        // 设置默认洞察
        const insightTypes = ['trend', 'research', 'application', 'tip', 'quote'];
        const insights = [
          {
            title: 'AI模型在蛋白质折叠预测上取得新突破',
            content: '最新研究表明，AI已能够以前所未有的精度预测蛋白质结构，这将加速新药研发和疾病治疗。',
            type: 'research'
          },
          {
            title: '生成式AI正在改变创意产业',
            content: '从内容创作到设计流程，生成式AI正在成为创意专业人士的得力助手，而非替代品。',
            type: 'trend'
          },
          {
            title: 'AI提示：尝试用新视角看待旧问题',
            content: '当遇到难题时，尝试让AI从不同的专业角度提供解决思路，往往能带来意想不到的启发。',
            type: 'tip'
          },
          {
            title: '今日份AI壁纸已生成',
            content: '基于您的偏好，AI已为您创建专属壁纸，点击查看并应用到您的设备。',
            type: 'application'
          },
          {
            title: 'AI与人类协作的未来',
            content: '"人工智能不是为了替代人类，而是为了增强我们能力的极限。" —— 行业专家观点',
            type: 'quote'
          }
        ];
        
        // 根据日期选择不同的洞察
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
        setDailyInsight(insights[dayOfYear % insights.length]);
      }
    } catch (error) {
      console.error('获取每日洞察失败:', error);
    }
  };

  return (
    <div className="daily-ai-wrapper">
      <div className={`ai-app-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

        {/* {showBackToTop && (
          <div className="back-to-top visible" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
              </div>
        )} */}
      
        <EnhancedAiChat 
          onRequestArticle={handleArticleRequest} 
          onLoadingChange={handleAiLoadingChange}
        />
        
        {/* 碎片化体验独立页面 */}
        {renderExperiencePage()}
        
        {/* 进度条保留显示，不在卡片上方 */}
        {isAiLoading && renderProgressBar()}
        
        {/* 动态AI发现头条 - 取代静态的"今日AI发现"卡片 */}
        <section className="ai-discovery-header">
          <div className="discovery-header-background">
            <div className="animated-particles"></div>
          </div>
          
          <div className="discovery-header-content">
            <div className="discovery-label">
              <span className="pulse-dot"></span>
              <span>AI今日焦点</span>
            </div>
            
            <h2 className="discovery-title">
              <span className="theme-highlight">{dailyTheme}</span>
            </h2>
            
            <div className="discovery-insight">
              <div className={`insight-icon ${dailyInsight.type}`}>
                {dailyInsight.type === 'research' && <i className="fas fa-microscope"></i>}
                {dailyInsight.type === 'trend' && <i className="fas fa-chart-line"></i>}
                {dailyInsight.type === 'application' && <i className="fas fa-magic"></i>}
                {dailyInsight.type === 'tip' && <i className="fas fa-lightbulb"></i>}
                {dailyInsight.type === 'quote' && <i className="fas fa-quote-right"></i>}
              </div>
              <div className="insight-content">
                <h3 className="insight-title">{dailyInsight.title}</h3>
                <p className="insight-description">{dailyInsight.content}</p>
              </div>
            </div>
            
            <p className="discovery-update-time" onClick={refreshRecommendations}>
              <i className="fas fa-sync-alt"></i> 
              实时更新 · {lastUpdateTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </section>
          
        {/* 碎片化体验插入在这里 - 在AI发现卡片上方 */}
        {(isAiLoading || userQuery) && (
          <FragmentedExperience 
            userQuery={userQuery}
            isLoading={isAiLoading}
            onBubbleInteraction={handleBubbleInteraction}
            className="before-card"
          />
        )}
          
        {/* AI发现频道 - 横向滑动探索内容 */}
        <div className="ai-discovery-channels">
          <div className="channels-header">
            <h3 className="channels-title">
              <i className="fas fa-compass" style={{ color: '#6366f1', marginRight: '8px' }}></i>
              AI应用工坊
            </h3>
            <div className="channels-subtitle">探索AI赋能的多元世界，开启前沿应用之旅</div>
            <div className="channels-controls">
              <button className="channel-nav-btn prev" onClick={() => document.querySelector('.channels-slider').scrollBy({ left: -300, behavior: 'smooth' })}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="channel-nav-btn next" onClick={() => document.querySelector('.channels-slider').scrollBy({ left: 300, behavior: 'smooth' })}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          {/* 横向滑动卡片容器 */}
          <div className="channels-slider">
            {recommendedTopics.map((topic) => (
              <div 
                key={topic.id} 
                className="channel-card" 
                onClick={() => navigate(topic.route)}
                style={{
                  background: `linear-gradient(135deg, ${topic.color}15, ${topic.color}30)`,
                  borderLeft: `3px solid ${topic.color}`
                }}
              >
                <div className="channel-icon" style={{ backgroundColor: `${topic.color}20`, color: topic.color }}>
                  <i className={`fas fa-${topic.icon}`}></i>
                </div>
                <h4 className="channel-title">{topic.title}</h4>
                <p className="channel-description">{topic.description}</p>
                <div className="channel-meta">
                  <span className="channel-views">
                    <i className="fas fa-eye"></i> {topic.views}人关注
                  </span>
                  <span className="channel-hot-level">
                    {[...Array(topic.hotLevel)].map((_, i) => (
                      <i key={i} className="fas fa-fire"></i>
                    ))}
                  </span>
                </div>
                <div className="channel-tag" style={{
                  backgroundColor: `${topic.color}20`,
                  color: topic.color,
                  borderColor: `${topic.color}40`
                }}>
                  {topic.tag}
                </div>
                <div className="channel-enter">
                  <span>进入应用</span>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
            
            {/* 查看全部按钮 */}
            <div className="channel-card view-all" onClick={() => navigate('/ai-applications')}>
              <div className="view-all-content">
                <i className="fas fa-th-large"></i>
                <span>查看全部</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI精选洞察 - 横向滑动文章推荐 */}
        <div className="ai-insights-section">
          <div className="insights-header">
            <h3 className="insights-title">
              <i className="fas fa-lightbulb" style={{ color: '#f59e0b', marginRight: '8px' }}></i>
              AI精选洞察
            </h3>
            <div className="insights-subtitle">前沿解读与深度好文，洞悉AI世界的变革与可能</div>
            <div className="insights-controls">
              <button className="insight-nav-btn prev" onClick={() => document.querySelector('.insights-slider').scrollBy({ left: -320, behavior: 'smooth' })}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="insight-nav-btn next" onClick={() => document.querySelector('.insights-slider').scrollBy({ left: 320, behavior: 'smooth' })}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          {/* 横向滑动文章容器 */}
          <div className="insights-slider">
            {articles.slice(0, 4).map((article, index) => (
              <div key={index} className="insight-card" onClick={() => handleViewArticle(article)}>
                <div className="insight-image-container">
                  <img 
                    src={getImage(article.coverImage)} 
                    alt={article.title} 
                    className="insight-image" 
                    onError={handleImageError}
                  />
                  <div className="insight-overlay">
                    <div className="insight-category">{article.category}</div>
                    <div className="insight-reading-time">
                      <i className="fas fa-clock"></i>
                      {Math.ceil(article.content?.length / 500) || 5}分钟阅读
                    </div>
                  </div>
                </div>
                <h4 className="insight-title">{article.title}</h4>
                <p className="insight-summary">{article.summary}</p>
                <div className="insight-footer">
                  <div className="insight-meta">
                    <span className="insight-date">{article.createdAt}</span>
                    <span className="insight-views">
                      <i className="fas fa-eye"></i> 
                      {article.views || Math.floor(100 + Math.random() * 900)}
                    </span>
                  </div>
                  <button className="insight-action">
                    <span>阅读</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
            
            {/* 查看更多按钮 */}
            <div className="insight-card view-all" onClick={() => navigate('/ai-insights')}>
              <div className="view-all-content">
                <i className="fas fa-book-open"></i>
                <span>更多文章</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI精选内容区域 - 优化样式和交互 */}
        <section className="ai-content-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-robot" style={{ color: '#6366f1', marginRight: '8px' }}></i>
              AI精选内容
            </h2>
            <p className="section-subtitle">智能算法为您筛选，定制专属内容体验</p>
          </div>

          {/* 飘动标签效果区域 - 优化标签样式 */}
          <div className="floating-tags-container">
            <div className="floating-tags-wrapper">
              {['智能家居', '数据分析', '生成式AI', '机器学习', '深度学习', '自然语言处理', 
                '智能助手', '效率提升', '未来趋势', '隐私安全', '元宇宙'].map((tag, index) => (
                <div 
                  key={index} 
                  className="floating-tag"
                  style={{
                    animationDelay: `${index * 0.3}s`,
                    top: `${20 + Math.random() * 30}%`,
                    backgroundColor: index % 3 === 0 ? 'rgba(99, 102, 241, 0.1)' : 
                                     index % 3 === 1 ? 'rgba(16, 185, 129, 0.1)' : 
                                     'rgba(245, 158, 11, 0.1)',
                    color: index % 3 === 0 ? '#6366f1' : 
                           index % 3 === 1 ? '#10b981' : 
                           '#f59e0b',
                    borderColor: index % 3 === 0 ? 'rgba(99, 102, 241, 0.3)' : 
                                 index % 3 === 1 ? 'rgba(16, 185, 129, 0.3)' : 
                                 'rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* AI精选文章卡片布局 - 增强设计与交互体验 */}
          <div className="ai-content-carousel">
            <div className="carousel-controls">
              <button className="carousel-nav-btn prev" onClick={() => document.querySelector('.ai-content-grid').scrollBy({ left: -350, behavior: 'smooth' })}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="carousel-nav-btn next" onClick={() => document.querySelector('.ai-content-grid').scrollBy({ left: 350, behavior: 'smooth' })}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="ai-content-grid">
              {articles.map((article, index) => (
                <div key={index} className="ai-content-card" onClick={() => handleViewArticle(article)}>
                  <div className="card-image-container">
                    <img 
                      src={getImage(article.coverImage)} 
                      alt={article.title} 
                      className="card-image" 
                      onError={handleImageError}
                    />
                    <div className="image-overlay">
                      <span className="reading-time">
                        <i className="fas fa-clock"></i>
                        {Math.ceil(article.content?.length / 500) || 5}分钟阅读
                      </span>
                      <div className="ai-badge-small">
                        <i className="fas fa-robot"></i>
                        <span>AI精选</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-category">
                        <span>{article.category}</span>
                        {index < 2 && <span className="card-hot">热门</span>}
                      </div>
                      <div className="card-actions">
                        <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); handleShareArticle(article); }}>
                          <i className="fas fa-share-alt"></i>
                        </button>
                        <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); handleSaveArticle(article); }}>
                          <i className="fas fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="card-title">{article.title}</h3>
                    <p className="card-summary">{article.summary}</p>
                    
                    <div className="card-tags">
                      {extractKeywords(article.content).map((keyword, i) => (
                        <span key={i} className="card-tag">{keyword}</span>
                      ))}
                    </div>

                    <div className="card-ai-reason">
                      <div className="ai-badge">
                        <i className="fas fa-brain"></i> AI推荐理由
                      </div>
                      <p>{generateAiReason(article)}</p>
                    </div>
                    
                    <div className="card-footer">
                      <div className="card-meta">
                        <span className="card-date">{article.createdAt}</span>
                        <span className="card-popularity">
                          <i className="fas fa-chart-line"></i> {Math.floor(100 + Math.random() * 900)}人已阅读
                        </span>
                      </div>
                      <button className="read-more-btn">
                        <span>了解更多</span>
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 加载更多卡片 - 优化UI */}
              <div className="load-more-card" onClick={() => loadMoreArticles()}>
                <div className="load-more-icon">
                  <i className="fas fa-plus"></i>
                </div>
                <p>加载更多精选内容</p>
                <span>AI持续为您推荐</span>
              </div>
            </div>
          </div>
        </section>
          </div>
      <NavBar />
    </div>
  );
};

// 从文章内容中提取关键词
const extractKeywords = (content) => {
  // 实际项目中应该使用更复杂的算法或API来提取关键词
  // 这里简化处理，提取h3标签内的内容作为关键词
  const keywords = [];
  const h3Regex = /<h3>(.*?)<\/h3>/g;
  let match;
  
  while ((match = h3Regex.exec(content)) !== null) {
    if (match[1] && keywords.length < 3) { // 最多提取3个关键词
      keywords.push(match[1]);
    }
  }
  
  // 如果没有足够的h3标签，添加一些默认关键词
  const defaultKeywords = ['AI应用', '智能科技', '数字化', '机器学习', '用户体验'];
  while (keywords.length < 3) {
    const randomKeyword = defaultKeywords[Math.floor(Math.random() * defaultKeywords.length)];
    if (!keywords.includes(randomKeyword)) {
      keywords.push(randomKeyword);
    }
  }
  
  return keywords;
};

// 生成AI推荐理由
const generateAiReason = (article) => {
  const reasons = [
    `该内容与您最近浏览的${article.category}相关话题高度相关，提供了新的视角。`,
    `基于您的阅读偏好，这篇关于${article.title.split('：')[0]}的深度分析将对您有所启发。`,
    `90%与您兴趣相似的用户对此内容给予了好评，特别是其中的核心观点。`,
    `这篇内容涵盖了您可能感兴趣的${article.category}领域最新进展。`,
    `根据您的阅读习惯，此文章提供的观点和解决方案与您的需求匹配度高。`
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// 保存文章处理函数
const handleSaveArticle = (article) => {
  alert(`已收藏文章: ${article.title}`);
};

// 加载更多文章函数
const loadMoreArticles = () => {
  // 这里可以实现加载更多文章的逻辑
  alert('正在加载更多AI精选内容...');
};

export default DailyAiApp;