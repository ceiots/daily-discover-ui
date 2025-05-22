import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DailyAiApp.css';
import instance from '../utils/axios';
import { useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; // 引入底部导航栏组件
import FixImages from './FixImages'; // 引入图片修复组件
import EnhancedAiChat from './ai/EnhancedAiChat'; // 引入增强型AI聊天组件

// 默认内联占位图片，直接使用内联定义，不依赖任何外部资源
const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAElBMVEXy8vL///8AAADu7u7m5ub5+fk5uGF3AAAADUlEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAA8G4qWAABjyVw+QAAAABJRU5ErkJggg==';
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzc2NmRlOCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE4MCIgcj0iNjAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
const DEFAULT_THEME = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5MzMzZWEiLz48L2xpbmVhckdyYWRpZW50PjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmYiPuaZuuiDveeUn+a0uzwvdGV4dD48L3N2Zz4=';
const DEFAULT_PRODUCT1 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM3NjZkZTgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZiI+aVBob25lPC90ZXh0Pjwvc3ZnPg==';
const DEFAULT_PRODUCT2 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzAiIGZpbGw9IiM3NjZkZTgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmYiPuaZuuiDveasoeihqDwvdGV4dD48L3N2Zz4=';
const DEFAULT_PRODUCT3 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxwYXRoIGQ9Ik01MCw4MHMzMCwtMzAgMTAwLDApIiBzdHJva2U9IiM3NjZkZTgiIHN0cm9rZS13aWR0aD0iMTAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM3NjZkZTgiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMjAiIHI9IjIwIiBmaWxsPSIjNzY2ZGU4Ii8+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiMzMzMiPuaXoOe6v+iAs+aculwvdGV4dD48L3N2Zz4=';
const DEFAULT_PRODUCT4 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjhmZiIvPjxyZWN0IHg9IjQwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzc2NmRlOCIgcng9IjEwIiByeT0iMTAiLz48cmVjdCB4PSI1MCIgeT0iNzAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmYiIHJ4PSI1IiByeT0iNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj7nm7Tol4/nrKzkupvnlLU8L3RleHQ+PC9zdmc+';

// 本地图片映射对象，不依赖window全局变量，直接在组件中定义
const IMAGE_MAP = {
  placeholder: DEFAULT_IMAGE,
  avatar: DEFAULT_AVATAR,
  theme1: DEFAULT_THEME,
  product1: DEFAULT_PRODUCT1,
  product2: DEFAULT_PRODUCT2,
  product3: DEFAULT_PRODUCT3,
  product4: DEFAULT_PRODUCT4,
};

// 获取图片函数，只使用本地变量，完全消除闪烁
// 修改为导出函数，以便其他组件使用
export const getImage = (id) => {
  // 如果ID是完整URL，且不包含ai-public.mastergo.com，则返回该URL
  if (typeof id === 'string' && id.startsWith('http') && !id.includes('ai-public.mastergo.com')) {
    return id;
  }

  // 直接从本地映射获取图片
  if (IMAGE_MAP[id]) {
    return IMAGE_MAP[id];
  }

  // 默认返回基本占位图
  return DEFAULT_IMAGE;
};

const DailyAiApp = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('您好！我可以为您推荐今日精选商品，或者回答您的问题。');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationReasons, setRecommendationReasons] = useState([]);
  const [dailyTheme, setDailyTheme] = useState('智能生活');
  const [placeholdersReady, setPlaceholdersReady] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState([
    { id: 1, name: 'iPhone 15 Pro', price: '8999', sales: '2万+', imageUrl: 'product1' },
    { id: 2, name: '智能手表 Watch 6', price: '2999', sales: '1.5万+', imageUrl: 'product2' },
    { id: 3, name: '无线降噪耳机', price: '1499', sales: '3万+', imageUrl: 'product3' },
    { id: 4, name: '笔记本电脑', price: '6999', sales: '8千+', imageUrl: 'product4' }
  ]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [quickQuestions, setQuickQuestions] = useState([]);
  const [personalizedFeatures, setPersonalizedFeatures] = useState([]);
  const [interactiveGames, setInteractiveGames] = useState([]);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [similarUsers, setSimilarUsers] = useState([]);
  const [showUserPopup, setShowUserPopup] = useState(false);
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
  const speechRecognition = useRef(null);

  // 新增：处理文章请求的函数
  const handleArticleRequest = (prompt) => {
    console.log('请求创建文章:', prompt);
    
    // 从提示中提取主题
    const topic = prompt.replace(/帮我写篇关于|写一篇关于|生成一篇|创建一篇文章关于|的文章/gi, '').trim();
    
    // 设置主题并打开模态框
    setArticleTopic(topic);
    setShowArticleModal(true);
  };
  
  // 新增：生成随机封面图
  const generateCoverImage = (articleTopic) => {
    // 尝试从主题生成相关图片，实际项目中可能是调用AI生成或从库中选择
    const defaultCovers = [
      DEFAULT_PRODUCT1,
      DEFAULT_PRODUCT2,
      DEFAULT_PRODUCT3, 
      DEFAULT_PRODUCT4,
      DEFAULT_THEME
    ];
    
    return defaultCovers[Math.floor(Math.random() * defaultCovers.length)];
  };
  
  // 格式化日期显示
  const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth()+1}月${currentDate.getDate()}日`;

  // 获取星期几
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = `星期${weekdays[currentDate.getDay()]}`;

  // 检查占位图片是否已加载
  useEffect(() => {
    // 验证window.placeholderImages对象是否存在和可用
    const checkPlaceholders = () => {
      if (typeof window !== 'undefined' && window.placeholderImages) {
        setPlaceholdersReady(true);
        return true;
      }
      return false;
    };

    // 立即检查一次
    const isReady = checkPlaceholders();

    // 如果未加载，设置一个检查间隔
    if (!isReady) {
      const intervalId = setInterval(() => {
        if (checkPlaceholders()) {
          clearInterval(intervalId);
        }
      }, 500);

      // 清理
      return () => clearInterval(intervalId);
    }
  }, []);

  // 在组件加载时获取数据
  useEffect(() => {
    fetchDailyDiscovery();
    fetchQuickQuestions();
    fetchPersonalizedFeatures();
    fetchInteractiveGames();
    fetchSimilarUsers();
    fetchTrendingProducts();
    fetchArticles(); // 新增：获取文章列表

    // 监测系统暗色模式
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);

    const darkModeHandler = (e) => setIsDarkMode(e.matches);
    prefersDarkMode.addEventListener('change', darkModeHandler);

    // 模拟首次访问引导
    const hasVisited = localStorage.getItem('hasVisitedAiApp');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedAiApp', 'true');
    } else {
      setIsFirstVisit(false);
    }

    // 监听滚动事件以更新进度条
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

      // 清理语音识别
      if (speechRecognition.current) {
        speechRecognition.current.stop();
      }
    };
  }, [isLoggedIn]);

  // 获取热门商品数据
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

  // 设置默认热门商品数据
  const setDefaultTrendingProducts = () => {
    setTrendingProducts([
      {
        id: 301,
        title: 'iPhone 13',
        imageUrl: 'product1',
        price: 5999.00,
        salesCount: 5243
      },
      {
        id: 302,
        title: '智能手表',
        imageUrl: 'product2',
        price: 1299.00,
        salesCount: 3789
      },
      {
        id: 303,
        title: '无线耳机',
        imageUrl: 'product3',
        price: 899.00,
        salesCount: 4562
      },
      {
        id: 304,
        title: '超薄笔记本电脑',
        imageUrl: 'product4',
        price: 6399.00,
        salesCount: 2876
      }
    ]);
  };

  // 初始化语音识别
  const initSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition.current = new SpeechRecognition();
    speechRecognition.current.lang = 'zh-CN';
    speechRecognition.current.continuous = false;
    speechRecognition.current.interimResults = false;

    speechRecognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setTimeout(() => {
        handleAIRequest();
      }, 500);
    };

    speechRecognition.current.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      setIsVoiceActive(false);
    };

    speechRecognition.current.onend = () => {
      setIsVoiceActive(false);
    };
  };

  // 处理语音输入切换
  const toggleVoiceInput = () => {
    if (!speechRecognition.current) {
      initSpeechRecognition();
    }

    if (isVoiceActive) {
      speechRecognition.current.stop();
    } else {
      try {
        speechRecognition.current.start();
        setIsVoiceActive(true);
      } catch (error) {
        console.error('启动语音识别失败:', error);
      }
    }
  };

  // 文字转语音
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert('您的浏览器不支持语音合成功能');
      return;
    }

    // 停止当前正在播放的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';

    window.speechSynthesis.speak(utterance);
  };

  // 切换暗色模式
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 返回顶部
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // 获取每日发现推荐
  const fetchDailyDiscovery = async () => {
    setLoadingRecommendations(true);
    try {
      const response = await instance.get('/ai/daily-discovery');
      if (response.data && response.data.code === 200) {
        const data = response.data.data;
        setRecommendations(data.products || []);
        setRecommendationReasons(data.reasons || []);
        if (data.theme) {
          setDailyTheme(data.theme);
        }
      } else {
        console.error('获取推荐失败:', response.data);
        setDefaultRecommendations();
      }
    } catch (error) {
      console.error('获取每日发现推荐失败:', error);
      setDefaultRecommendations();
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // 通用图片错误处理函数
  const handleImageError = (e) => {
    // 阻止重复触发onerror事件
    e.target.onerror = null;

    // 检查是否是头像图片
    if (e.target.classList.contains('user-avatar') || 
        e.target.parentElement.classList.contains('ai-avatar') ||
        e.target.classList.contains('user-popup-avatar')) {
      // 使用默认头像
      e.target.src = DEFAULT_AVATAR;
    } else {
      // 其他图片使用默认占位图
      e.target.src = DEFAULT_IMAGE;
    }
  };

  // 设置默认推荐数据
  const setDefaultRecommendations = () => {
    setRecommendations([
      {
        id: 1,
        title: '智能水杯',
        imageUrl: 'product1',
        price: 199.00,
        description: '温度提醒'
      },
      {
        id: 2,
        title: '人体工学椅',
        imageUrl: 'product2',
        price: 1299.00,
        description: '舒适办公'
      },
      {
        id: 3,
        title: '护眼台灯',
        imageUrl: 'product3',
        price: 68.00,
        description: '智能调光'
      }
    ]);
    setRecommendationReasons([
      "基于您的浏览历史，我们认为这款商品会符合您的品味",
      "这是本周最受欢迎的智能产品之一，已有多位用户好评",
      "这款产品兼具美观和实用性，是提升生活品质的不二之选"
    ]);
  };

  // 获取快捷问题
  const fetchQuickQuestions = async () => {
    try {
      const response = await instance.get('/ai/quick-questions');
      if (response.data && response.data.code === 200) {
        setQuickQuestions(response.data.data || []);
      } else {
        setQuickQuestions([
          "今日有什么好物推荐？",
          "这周最热门的智能产品是什么？",
          "有哪些提高生活品质的好物？"
        ]);
      }
    } catch (error) {
      console.error('获取快捷问题失败:', error);
      setQuickQuestions([
        "今日有什么好物推荐？",
        "这周最热门的智能产品是什么？",
        "有哪些提高生活品质的好物？"
      ]);
    }
  };

  // 获取个性化功能入口
  const fetchPersonalizedFeatures = async () => {
    try {
      const response = await instance.get('/ai/personalized-features');
      if (response.data && response.data.code === 200) {
        setPersonalizedFeatures(response.data.data || []);
      } else {
        setDefaultPersonalizedFeatures();
      }
    } catch (error) {
      console.error('获取个性化功能入口失败:', error);
      setDefaultPersonalizedFeatures();
    }
  };

  // 设置默认个性化功能入口
  const setDefaultPersonalizedFeatures = () => {
    setPersonalizedFeatures([
      {
        id: "history",
        title: "浏览历史",
        description: "查看您最近的浏览记录",
        icon: "history",
        color: "blue"
      },
      {
        id: "favorites",
        title: "收藏夹",
        description: "查看您收藏的商品",
        icon: "heart",
        color: "green"
      },
      {
        id: "promotions",
        title: "优惠活动",
        description: "发现限时特价商品",
        icon: "tags",
        color: "purple"
      },
      {
        id: "hotItems",
        title: "热门榜单",
        description: "了解最热门的商品",
        icon: "fire",
        color: "red"
      }
    ]);
  };

  // 获取互动游戏
  const fetchInteractiveGames = async () => {
    try {
      const response = await instance.get('/ai/interactive-games');
      if (response.data && response.data.code === 200) {
        setInteractiveGames(response.data.data || []);
      } else {
        setDefaultInteractiveGames();
      }
    } catch (error) {
      console.error('获取互动游戏失败:', error);
      setDefaultInteractiveGames();
    }
  };

  // 设置默认的互动游戏
  const setDefaultInteractiveGames = () => {
    setInteractiveGames([
      {
        id: 'productQuiz',
        title: '商品知识问答',
        description: '测试您对商品类型、功能和特性的了解程度，提高您的产品认知度',
        icon: 'shopping-bag',
        difficulty: 2,
        playerCount: 1268,
        imageUrl: getImage('productQuiz')
      },
      {
        id: 'brandQuiz',
        title: '品牌知识竞赛',
        description: '挑战您对知名品牌的认识，了解品牌故事和发展历程',
        icon: 'crown',
        difficulty: 3,
        playerCount: 876,
        imageUrl: getImage('brandQuiz')
      },
      {
        id: 'discoveryJourney',
        title: '发现之旅',
        description: '沉浸式探索商品世界，在互动场景中寻找和了解每日推荐商品',
        icon: 'compass',
        difficulty: 1,
        playerCount: 1485,
        imageUrl: getImage('theme1'),
        isH5Game: true,
        isNew: true,
        theme: 'linear-gradient(135deg, #10b981, #059669)'
      }
    ]);
  };

  // 用户头像点击事件处理
  const handleUserAvatarClick = () => {
    setShowUserPopup(!showUserPopup);
  };

  // 获取相似用户推荐
  const fetchSimilarUsers = async () => {
    try {
      const response = await instance.get('/ai/similar-users');
      if (response.data && response.data.code === 200) {
        setSimilarUsers(response.data.data || []);
      } else {
        setSimilarUsers([
          {
            id: 1,
            nickname: "用户8752",
            avatar: 'avatar',
            similarity: 92,
            favoriteProducts: [
              { id: 101, title: "超薄笔记本电脑", imageUrl: 'product4' }
            ]
          },
          {
            id: 2,
            nickname: "用户1354",
            avatar: 'avatar',
            similarity: 85,
            favoriteProducts: [
              { id: 102, title: "智能手表", imageUrl: 'product2' }
            ]
          },
        ]);
      }
    } catch (error) {
      console.error('获取相似用户推荐失败:', error);
      setSimilarUsers([]);
    }
  };

  // 处理AI助手响应
  const handleAIRequest = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `${userInput}`;

      // 检查是否登录
      if (!isLoggedIn) {
        setAiResponse('请先登录后再使用AI助手功能');
        setIsLoading(false);
        return;
      }

      const response = await instance.post('/ai/chat', { prompt });
      if (response.data && response.data.data) {
        const aiText = response.data.data;
        setAiResponse(aiText);

        // 语音播报AI回复
        if (isVoiceActive) {
          speakText(aiText);
        }
      } else {
        setAiResponse('抱歉，我无法处理您的请求，请稍后再试');
      }
    } catch (error) {
      console.error('AI请求失败:', error);
      setAiResponse('连接AI服务出错，请稍后再试');
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  // 处理图片输入
  const handleImageInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // 处理图片上传，实际项目中这里应该调用图像识别API
          setUserInput('正在分析您上传的图片...');
          setTimeout(() => {
            setAiResponse('我识别到这是一张商品图片，这似乎是一款智能手表，需要我为您推荐类似的产品吗？');
            setUserInput('');
          }, 1500);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 生成分享卡片
  const generateShareCard = (product) => {
    alert(`已生成"${product.title}"的分享卡片，可以分享给好友了！`);
    // 这里实际项目中应该实现分享卡片生成和分享功能
  };

  // 快捷问题点击处理
  const handleQuickQuestion = (question) => {
    setUserInput(question);
    // 等待UI更新后发送请求
    setTimeout(() => {
      handleAIRequest();
    }, 100);
  };

  // 刷新推荐
  const handleRefreshRecommendations = () => {
    fetchDailyDiscovery();
  };

  // 关闭首次访问引导
  const handleCloseGuide = () => {
    setIsFirstVisit(false);
  };

  // 渲染首次访问引导
  const renderFirstVisitGuide = () => {
    if (!isFirstVisit) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 max-w-md">
          <h2 className="text-lg font-bold text-primary mb-4">欢迎使用 AI 发现</h2>
          <p className="text-gray-700 mb-4">这是您第一次使用AI发现功能，这里有一些使用提示：</p>
          <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
            <li>您可以向AI助手提问关于商品、购物建议等问题</li>
            <li>探索个性化推荐，发现更适合您的商品</li>
            <li>参与互动游戏，赢取积分和优惠券</li>
            <li>查看用户画像，了解您的购物偏好</li>
          </ul>
          <button
            onClick={handleCloseGuide}
            className="w-full bg-primary text-white font-medium py-2 rounded-lg"
          >
            开始探索
          </button>
        </div>
      </div>
    );
  };

  // 渲染相似用户推荐
  const renderSimilarUserRecommendations = () => {
    if (similarUsers.length === 0) return null;

  return (
      <div className="mb-6">
        <h2 className="text-base font-semibold text-primary mb-3">与您相似的用户也喜欢</h2>
        {similarUsers.map((user) => (
          <div key={user.id} className="share-card mb-4">
            <div className="share-header">
              <img
                src={getImage(user.avatar)}
                alt={user.nickname}
                className="share-avatar"
                onError={handleImageError}
              />
              <div className="share-info">
                <div className="share-name">{user.nickname}</div>
                <div className="share-time">兴趣相似度: {user.similarity}%</div>
              </div>
            </div>
            <div className="share-content">
              <p className="share-text mb-2">ta的收藏</p>
              <div className="grid grid-cols-2 gap-2">
                {user.favoriteProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <img
                      src={getImage(product.imageUrl)}
                      alt={product.title}
                      className="share-image"
                      onError={handleImageError}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                      <p className="text-white text-xs truncate">{product.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="share-actions">
              <div className="share-action">
                <i className="fas fa-thumbs-up"></i>
                <span>有用</span>
              </div>
              <div className="share-action">
                <i className="fas fa-external-link-alt"></i>
                <span>查看详情</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染热门商品排行
  const renderTrendingProducts = () => {
    if (trendingProducts.length === 0) return null;

    return (
      <section className="fade-in">
        <h2 className="section-title mb-4">热门商品排行</h2>
        <div className="trending-products">
          {trendingProducts.map((product, index) => (
            <div key={product.id} className="trending-product-item" style={{maxWidth: '100%', overflow: 'hidden'}}>
              <div className="trending-rank">{index + 1}</div>
              <div className="trending-product-image-container" style={{flexShrink: 0}}>
                <img
                  src={getImage(product.imageUrl)}
                  alt={product.title || product.name}
                  className="trending-product-image"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div className="trending-product-info" style={{minWidth: 0, width: '100%'}}>
                <h3 className="trending-product-title">{product.title || product.name}</h3>
                <div className="trending-product-meta">
                  <span className="trending-product-price">¥{product.price}</span>
                  <span className="trending-product-sales">销量: {product.sales || product.salesCount || '热销'}</span>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="trending-view-details-button"
                  style={{width: '100%', boxSizing: 'border-box'}}
                >
                  查看详情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const getThemeImage = () => {
    return DEFAULT_THEME;
  };

  // 获取文章列表
  const fetchArticles = async () => {
    try {
      if (!isLoggedIn) return;
      
      const response = await instance.get('/ai/articles');
      if (response.data && response.data.code === 200) {
        setArticles(response.data.data || []);
      } else {
        // 使用示例数据
        setArticles([
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
        ]);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      // 使用示例数据
      setArticles([
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
      ]);
    }
  };

  // 处理生成文章
  const handleGenerateArticle = async () => {
    if (!articleTopic.trim()) return;
    
    setIsGeneratingArticle(true);
    try {
      // 构建请求参数
      const requestData = {
        topic: articleTopic,
        category: articleCategory,
        length: articleLength,
        additionalPrompt: articlePrompt
      };
      
      const response = await instance.post('/ai/generate-article', requestData);
      
      if (response.data && response.data.code === 200) {
        const generatedArticle = response.data.data;
        
        // 添加到文章列表
        setArticles(prev => [generatedArticle, ...prev]);
        
        // 重置表单并关闭模态框
        resetArticleForm();
        setShowArticleModal(false);
        
        // 显示成功提示
        alert('文章生成成功！');
      } else {
        // 模拟生成的文章
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
        
        // 添加到文章列表
        setArticles(prev => [mockArticle, ...prev]);
        
        // 重置表单并关闭模态框
        resetArticleForm();
        setShowArticleModal(false);
        
        // 显示成功提示
        alert('文章生成成功！');
      }
    } catch (error) {
      console.error('生成文章失败:', error);
      alert('生成文章失败，请稍后再试');
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // 重置文章表单
  const resetArticleForm = () => {
    setArticleTopic('');
    setArticleCategory('');
    setArticleLength('medium');
    setArticlePrompt('');
  };

  // 处理查看文章
  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setShowArticlePreview(true);
  };

  // 处理编辑文章
  const handleEditArticle = (article) => {
    // 实际项目中应该导航到编辑页面或打开编辑模态框
    alert(`编辑文章: ${article.title}`);
  };

  // 处理删除文章
  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    
    try {
      const response = await instance.delete(`/ai/articles/${articleId}`);
      
      if (response.data && response.data.code === 200) {
        // 从列表中移除
        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('文章已删除');
      } else {
        // 模拟删除
        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('文章已删除');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      // 模拟删除
      setArticles(prev => prev.filter(article => article.id !== articleId));
      alert('文章已删除');
    }
  };

  // 处理分享文章
  const handleShareArticle = (article) => {
    // 实际项目中应该实现分享功能
    alert(`分享文章: ${article.title}`);
  };

  // 处理导出文章
  const handleExportArticle = (article) => {
    // 实际项目中应该实现导出功能（如PDF、Word等）
    alert(`导出文章: ${article.title}`);
  };

  return (
    <div className="daily-ai-wrapper">
      {/* 添加图片修复组件 */}
      <FixImages />
      <div className={`ai-app-container ${isDarkMode ? 'dark' : ''}`}>
        {/* 滚动进度条 */}
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

        {/* 返回顶部按钮 */}
        {showBackToTop && (
          <div className="back-to-top visible" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
          </div>
        )}

      {renderFirstVisitGuide()}

      <header className="ai-app-header fixed-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">每日发现 AI</h1>
            <p className="text-xs opacity-90">{formattedDate} {weekday}</p>
          </div>
          <div
            className="flex items-center cursor-pointer relative"
            onClick={handleUserAvatarClick}
          >
            {isLoggedIn ? (
              <Link 
                to="/profile" 
                className="w-8 h-8 rounded-full overflow-hidden"
                onClick={(e) => {
                  // 检查登录状态，如果未登录则跳转到登录页
                  if (!isLoggedIn || !localStorage.getItem('userId')) {
                    e.preventDefault();
                    navigate('/login');
                  }
                }}
              >
                <img
                  src={userInfo?.avatar || "https://public.readdy.ai/ai/img_res/7b50db19b2e90195755169d36aa07020.jpg"}
                  alt="用户头像"
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="text-white text-sm"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </header>

        <main ref={mainRef} className="scrollable-content" style={{width: '100%', maxWidth: '100%'}}> {/* 确保可垂直滚动但水平方向内容完全可见 */}
        {/* 使用增强型AI聊天组件替换原来的AI助手区域 */}
        <EnhancedAiChat onRequestArticle={handleArticleRequest} />


        {/* 导航选项卡 */}
        <section className="mb-4">
            <div className="flex border-b border-gray-200 overflow-x-auto"> {/* 添加水平滚动以防止溢出 */}
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'recommendations' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('recommendations')}
            >
              智能推荐
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'games' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('games')}
            >
              互动游戏
            </button>
          </div>
        </section>

        {/* 智能推荐选项卡内容 */}
        {activeTab === 'recommendations' && (
          <section className="fade-in">
             {/* {renderSimilarUserRecommendations()} */}
          </section>
        )}


        {/* 互动游戏选项卡内容 - 使用新的渲染函数 */}
        {activeTab === 'games' && (
          <section className="games-section fade-in">
            {/* H5游戏特色展示区 */}
            <div className="h5-game-preview">
              {interactiveGames.filter(game => game.isH5Game).map((game) => (
                <div 
                  key={game.id} 
                  className="h5-game-mini"
                >
                  <div className="h5-mini-header">
                    <h3 className="h5-mini-title">{game.title}</h3>
                    {game.isNew && <span className="h5-mini-badge">新</span>}
                  </div>
                  
                  <div className="h5-mini-scene">
                    <div className="h5-mini-background">
                      <img src={getImage(game.imageUrl)} alt={game.title} onError={handleImageError} />
                    </div>
                    
                    <div className="h5-mini-items">
                      {/* 展示4个模拟的游戏物品 */}
                      <div className="h5-mini-item" style={{ left: '30%', top: '45%' }}>
                        <div className="mini-item-dot"></div>
                      </div>
                      <div className="h5-mini-item" style={{ left: '65%', top: '25%' }}>
                        <div className="mini-item-dot"></div>
                      </div>
                      <div className="h5-mini-item" style={{ left: '75%', top: '65%' }}>
                        <div className="mini-item-dot"></div>
                      </div>
                      <div className="h5-mini-item" style={{ left: '15%', top: '75%' }}>
                        <div className="mini-item-dot"></div>
                      </div>
                    </div>
                    
                    <div className="h5-mini-message">
                      <p>点击开始体验{'发现之旅'}小游戏</p>
                      <button 
                        className="h5-mini-button"
                        onClick={() => navigate(`/h5game/${game.id}`)}
                      >
                        立即体验
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="h5-mini-info">
                    <div className="h5-mini-stat">
                      <i className="fas fa-user-friends"></i>
                      <span>{game.playerCount || 0}人体验</span>
                    </div>
                    <div className="h5-mini-stat">
                      <i className="fas fa-clock"></i>
                      <span>约5分钟</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="featured-games">
              <h2 className="section-title">趣味知识问答</h2>
              <div className="games-cards-container">
                {interactiveGames.filter(game => game.id === "productQuiz" || game.id === "brandQuiz").map((game) => (
                  <div 
                    key={game.id} 
                    className="featured-game-card"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <div className="game-card-icon-container" style={{
                      background: game.id === "productQuiz" ? 
                        "linear-gradient(135deg, #6366f1, #4f46e5)" : 
                        "linear-gradient(135deg, #ec4899, #db2777)"
                    }}>
                      <i className={`fas fa-${game.icon}`}></i>
                    </div>
                    <div className="game-card-content">
                      <h3 className="game-card-title">{game.title}</h3>
                      <p className="game-card-description">{game.description}</p>
                      <div className="game-card-meta">
                        <div className="game-card-difficulty">
                          {[1, 2, 3].map((level) => (
                            <span
                              key={level}
                              className={`difficulty-dot ${level <= (game.difficulty || 1) ? 'active' : ''}`}
                            ></span>
                          ))}
                          <span className="difficulty-text">
                            {game.difficulty === 1 ? '简单' : game.difficulty === 2 ? '中等' : '困难'}
                          </span>
                        </div>
                        <div className="game-card-players">
                          <i className="fas fa-user-friends"></i>
                          <span>{game.playerCount || 0}人参与</span>
                        </div>
                      </div>
                    </div>
                    <div className="game-card-button">
                      开始挑战
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           
            <div className="daily-challenge-section">
              <div className="daily-challenge-header">
                <h2 className="daily-challenge-title">
                  <i className="fas fa-calendar-day daily-icon"></i>
                  每日知识挑战
                </h2>
                <span className="daily-challenge-date">{formattedDate}</span>
              </div>
              
              <div 
                className="daily-challenge-card"
                onClick={() => navigate('/game/daily-quiz')}
              >
                <div className="daily-challenge-content">
                  <div className="daily-challenge-badge">
                    <span>每日精选</span>
                  </div>
                  <h3 className="daily-challenge-name">AI购物助手知识竞赛</h3>
                  <p className="daily-challenge-desc">
                    测试您对智能购物、AI推荐和消费趋势的了解程度，回答问题赢取积分！
                  </p>
                  
                  <div className="daily-challenge-stats">
                    <div className="challenge-stat">
                      <i className="fas fa-question-circle"></i>
                      <span>10题</span>
                    </div>
                    <div className="challenge-stat">
                      <i className="fas fa-clock"></i>
                      <span>5分钟</span>
                    </div>
                    <div className="challenge-stat">
                      <i className="fas fa-medal"></i>
                      <span>100积分</span>
                    </div>
                  </div>
                </div>
                
                <div className="daily-challenge-image">
                  <div className="image-container">
                    <img src={getImage('theme1')} alt="每日挑战" />
                    <div className="image-overlay">
                      <div className="pulse-circle"></div>
                      <i className="fas fa-trophy challenge-trophy"></i>
                    </div>
                  </div>
                </div>
                
                <button className="daily-challenge-button">
                  立即挑战
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
              
              <div className="daily-rewards-info">
                <div className="reward-item">
                  <i className="fas fa-gift reward-icon"></i>
                  <div className="reward-details">
                    <h4>完成挑战奖励</h4>
                    <p>获得100积分和每日专属徽章</p>
                  </div>
                </div>
                <div className="reward-item">
                  <i className="fas fa-crown reward-icon"></i>
                  <div className="reward-details">
                    <h4>排行榜奖励</h4>
                    <p>每周前10名获得额外优惠券</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

          {/* 热门榜单选项卡内容 - 替换之前的用户画像 */}
          {activeTab === 'trending' && (
          <section className="user-profile-section fade-in">
              {renderTrendingProducts()}
          </section>
        )}

        {/* AI生成文章部分 - 只在推荐TAB中显示 */}
        {activeTab === 'recommendations' && (
        <section className="fade-in">
          {/* AI生成文章部分 */}
          <div className="ai-article-section">
            {/* <div className="section-header">
              <h2 className="text-base font-semibold text-primary">AI文章助手</h2>
              <button 
                className="create-article-btn"
                onClick={() => setShowArticleModal(true)}
              >
                <i className="fas fa-pen-fancy mr-1"></i>
                创建新文章
              </button>
            </div> */}
            
            {/* 文章列表 */}
            <div className="ai-article-list">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <div key={index} className="article-card" onClick={() => handleViewArticle(article)}>
                    <div className="article-card-content">
                      {article.coverImage && (
                        <div className="article-image-container">
                          <img 
                            src={article.coverImage} 
                            alt={article.title}
                            className="article-cover-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_IMAGE;
                            }}
                          />
                        </div>
                      )}
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-summary">{article.summary}</p>
                      <div className="article-meta">
                        <span className="article-date">
                          <i className="far fa-calendar-alt mr-1"></i>
                          {article.createdAt}
                        </span>
                        <span className="article-category">
                          <i className="far fa-folder mr-1"></i>
                          {article.category}
                        </span>
                        <span className="article-status">
                          <i className="far fa-check-circle mr-1"></i>
                          {article.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-articles">
                  <div className="empty-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <p className="empty-text">暂无生成的文章</p>
                  <p className="empty-subtext">点击&quot;创建新文章&quot;按钮开始创作</p>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* 文章创建模态框 */}
        {showArticleModal && (
          <div className="modal-overlay">
            <div className="article-modal">
              <div className="modal-header">
                <h3>创建AI文章</h3>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowArticleModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="articleTopic">文章主题</label>
                  <input 
                    type="text" 
                    id="articleTopic" 
                    value={articleTopic}
                    onChange={(e) => setArticleTopic(e.target.value)}
                    placeholder="例如：智能家居使用指南" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="articleCategory">文章分类</label>
                  <select 
                    id="articleCategory"
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                  >
                    <option value="">选择分类</option>
                    <option value="科技">科技</option>
                    <option value="数码">数码</option>
                    <option value="家居">家居</option>
                    <option value="评测">评测</option>
                    <option value="教程">教程</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="articleLength">文章长度</label>
                  <select 
                    id="articleLength"
                    value={articleLength}
                    onChange={(e) => setArticleLength(e.target.value)}
                  >
                    <option value="short">短文（500字左右）</option>
                    <option value="medium">中等（1000字左右）</option>
                    <option value="long">长文（2000字左右）</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="articlePrompt">更多要求（可选）</label>
                  <textarea 
                    id="articlePrompt" 
                    value={articlePrompt}
                    onChange={(e) => setArticlePrompt(e.target.value)}
                    placeholder="添加更多具体要求，如文风、重点内容等" 
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowArticleModal(false)}
                >
                  取消
                </button>
                <button 
                  className="generate-btn"
                  onClick={handleGenerateArticle}
                  disabled={isGeneratingArticle || !articleTopic.trim()}
                >
                  {isGeneratingArticle ? (
                    <>
                      <span className="loading-dots"></span>
                      生成中...
                    </>
                  ) : '生成文章'}
                </button>
              </div>
            </div>
          </div>
        )}
        
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
                          src={image} 
                          alt={`图片 ${index + 1}`}
                          className={`w-full rounded-lg ${selectedArticle.images.length === 1 ? 'max-h-[300px] object-contain' : 'h-32 object-cover'}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE;
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedArticle.coverImage && !selectedArticle.images && (
                  <div className="article-preview-cover mb-4">
                    <img 
                      src={selectedArticle.coverImage} 
                      alt={selectedArticle.title}
                      className="w-full max-h-[300px] object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
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
      </main>
      </div>

      {/* 底部导航栏 */}
      <NavBar />
    </div>
  );
};

export default DailyAiApp;