import React, { useState, useEffect, useRef } from 'react';
import './DailyAiApp.css';
import instance from '../utils/axios';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import NavBar from './NavBar'; // 引入底部导航栏组件
import FixImages from './FixImages'; // 引入图片修复组件
import { useNavigate } from "react-router-dom";

// 默认内联占位图片，直接使用内联定义，不依赖任何外部资源
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjYWFhIj7lm77niYflt7LliqDovb08L3RleHQ+PC9zdmc+';
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
const getImage = (id) => {
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
  const [showUserPopup, setShowUserPopup] = useState(false); // 新增：控制用户信息弹窗
  const mainRef = useRef(null);
  const speechRecognition = useRef(null);

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
    fetchTrendingProducts(); // 获取热门商品数据

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

  // 设置默认互动游戏 - 更新游戏数据，增加难度字段
  const setDefaultInteractiveGames = () => {
    setInteractiveGames([
      {
        id: "productQuiz",
        title: "商品知识问答",
        description: "测试您对商品的了解程度",
        icon: "question-circle",
        playerCount: 1243,
        difficulty: 2 // 新增：难度等级，1-3
      },
      {
        id: "styleGuess",
        title: "风格猜猜猜",
        description: "猜测不同商品的风格",
        icon: "palette",
        playerCount: 987,
        difficulty: 1 // 新增：难度等级，1-3
      },
      {
        id: "priceGuess",
        title: "价格竞猜",
        description: "猜测商品的实际价格",
        icon: "money-bill",
        playerCount: 1576,
        difficulty: 3 // 新增：难度等级，1-3
      },
      {
        id: "brandQuiz",
        title: "品牌知识竞赛",
        description: "测试您对品牌的了解",
        icon: "trademark",
        playerCount: 1123,
        difficulty: 2 // 新增：难度等级，1-3
      }
    ]);
  };

  // 用户头像点击事件处理
  const handleUserAvatarClick = () => {
    setShowUserPopup(!showUserPopup);
  };

  // 渲染用户信息弹窗
  const renderUserPopup = () => {
    if (!showUserPopup) return null;

    return (
      <div className="user-popup">
        <div className="user-popup-header">
          <div className="user-popup-avatar-container">
            <img
              src={isLoggedIn && userInfo && userInfo.avatar ? userInfo.avatar : DEFAULT_AVATAR}
              alt="用户头像"
              className="user-popup-avatar"
              onError={handleImageError}
            />
          </div>
          <div>
            <h3 className="user-popup-name">{isLoggedIn && userInfo ? userInfo.nickname || '用户' : '未登录用户'}</h3>
            <p className="user-popup-info">AI体验测试员</p>
          </div>
        </div>
        <div className="user-popup-body">
          <div className="user-popup-stat">
            <i className="fas fa-star"></i>
            <span>AI互动: 12次</span>
          </div>
          <div className="user-popup-stat">
            <i className="fas fa-shopping-cart"></i>
            <span>收藏商品: 5件</span>
          </div>
          <div className="user-popup-stat">
            <i className="fas fa-gamepad"></i>
            <span>游戏积分: 320分</span>
          </div>
        </div>
        <div className="user-popup-footer">
          <button className="user-popup-button">
            <i className="fas fa-cog"></i> 设置
          </button>
          <button className="user-popup-button primary">
            <i className="fas fa-user-edit"></i> 编辑资料
          </button>
        </div>
      </div>
    );
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

        {/* <div className="accessibility-button" onClick={toggleDarkMode}>
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </div> */}

      {renderFirstVisitGuide()}

      <header className="ai-app-header">
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

        <main ref={mainRef} className="flex-grow p-4 overflow-y-auto overflow-x-visible pb-24" style={{width: '100%', maxWidth: '100%'}}> {/* 确保可垂直滚动但水平方向内容完全可见 */}
        {/* AI助手区域 */}
        <section className="ai-chat-container p-4 text-white">
          <div className="flex items-start">
              <div className="ai-avatar mr-3">
                <img
                  src={getImage('avatar')}
                  alt="AI助手"
                  onError={handleImageError}
                />
              </div>
            <div className="flex-grow">
              <h2 className="text-base font-semibold mb-2">AI智能助手</h2>
              <div className="ai-message-bubble">
                <p className="text-sm">{aiResponse}</p>
                  <button
                    onClick={() => speakText(aiResponse)}
                    className="mt-2 text-xs opacity-70 hover:opacity-100"
                    aria-label="播放语音"
                  >
                    <i className="fas fa-volume-up mr-1"></i>播放语音
                  </button>
              </div>

              <div className="quick-question-container">
                  <span className="quick-question-tag mr-2" onClick={() => handleQuickQuestion("今日有什么好物推荐？")}>
                    今日有什么好物推荐？
                  </span>
                  <span className="quick-question-tag" onClick={() => handleQuickQuestion("这周最热门的智能产品是什么？")}>
                    这周最热门的智能产品是什么？
                  </span>
              </div>

              <div className="chat-input-container">
                  <button
                    className={`voice-button ${isVoiceActive ? 'animate-pulse bg-red-400' : ''}`}
                    onClick={toggleVoiceInput}
                    aria-label="语音输入"
                  >
                    <i className="fas fa-microphone"></i>
                  </button>
                  <button
                    className="image-button"
                    onClick={handleImageInput}
                    aria-label="图片输入"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                <input
                  type="text"
                  className="chat-input"
                    placeholder={isVoiceActive ? "请说话..." : "输入您的问题..."}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIRequest()}
                />
                <button
                  className="send-button"
                  onClick={handleAIRequest}
                  disabled={isLoading}>
                  {isLoading ? (
                      <div className="brand-loader">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>


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
              {/*               <button
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'trending' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('trending')}
              >
                热门榜单
              </button> */}
          </div>
        </section>

        {/* 智能推荐选项卡内容 */}
        {activeTab === 'recommendations' && (
          <section className="fade-in">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold text-primary">每日AI智能推荐</h2>
              <div className="flex items-center">
                <button onClick={handleRefreshRecommendations} className="mr-2 theme-refresh-button">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <Link to="/discover" className="text-primary text-sm">
                  更多 <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
            </div>

            {loadingRecommendations ? (
              <div className="flex justify-center items-center py-10">
                  <div className="brand-loader">
                    <span className="dot bg-primary"></span>
                    <span className="dot bg-primary"></span>
                    <span className="dot bg-primary"></span>
                  </div>
              </div>
            ) : (
              <>
                                    <div className="grid grid-cols-2 gap-3 mb-4" style={{minWidth: 0}}>
                  {recommendations.slice(0, 4).map((product, index) => (
                    <div key={product.id || index} className="recommendation-card" style={{width: '100%'}}>
                      <div style={{position: 'relative', width: '100%', paddingTop: '100%'}}>
                        <img
                          src={getImage(product.imageUrl)}
                          alt={product.title}
                          className="product-image"
                          onError={handleImageError}
                          loading="lazy"
                          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                      </div>
                      <div className="product-info" style={{width: '100%', boxSizing: 'border-box'}}>
                        <h3 className="product-title" style={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{product.title}</h3>
                        <p className="product-description" style={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{product.description || '智能推荐'}</p>
                        <div className="flex justify-between items-center" style={{width: '100%'}}>
                          <p className="product-price">¥{product.price?.toFixed(2)}</p>
                          <div className="flex">
                            <button
                              onClick={() => generateShareCard(product)}
                              className="mr-1 text-gray-500 text-sm hover:text-primary"
                              aria-label="分享"
                            >
                              <i className="fas fa-share-alt"></i>
                            </button>
                            <Link 
                              to={`/product/${product.id}`}
                              className="view-details-button"
                            >
                              查看详情
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recommendationReasons.length > 0 && (
                  <div className="recommendation-reasons">
                    <h3 className="reasons-title">
                      <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                      AI智能推荐理由
                    </h3>
                    <ul className="space-y-2">
                      {recommendationReasons.slice(0, 3).map((reason, index) => (
                        <li key={index} className="reason-item">
                          <span className="reason-bullet">•</span>
                          <p className="reason-text">{reason}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                  {/* 渲染相似用户推荐 */}
                  {renderSimilarUserRecommendations()}
              </>
            )}
          </section>
        )}

        {/* 个性化体验选项卡内容 - 已移除 */}

        {/* 互动游戏选项卡内容 - 使用新的渲染函数 */}
        {activeTab === 'games' && (
          <section className="games-section fade-in">
            <h2 className="section-title">趣味AI游戏</h2>
            <div className="games-container">
              {interactiveGames.map((game) => (
                <div key={game.id} className="game-card">
                  <div className="game-image">
                    <i className={`fas fa-${game.icon} game-icon`}></i>
                  </div>
                  <div className="game-content">
                    <h3 className="game-title">{game.title}</h3>
                    <p className="game-description">{game.description}</p>
                    <div className="game-footer">
                      <div className="game-difficulty">
                        {[1, 2, 3].map((level) => (
                          <span
                            key={level}
                            className={`difficulty-dot ${level <= (game.difficulty || 1) ? 'active' : ''}`}
                            title={`难度等级: ${game.difficulty || 1}/3`}
                          ></span>
                        ))}
                      </div>
                      <span className="game-players">
                        <i className="fas fa-user-friends mr-1"></i>
                        {game.playerCount}
                      </span>
                    </div>
                    <button className="play-button">
                      开始游戏
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 排行榜区域 */}
            <h2 className="section-title mt-6">游戏排行榜</h2>
            <div className="profile-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">用户</span>
                <span className="text-sm font-medium">得分</span>
              </div>
              {[
                { name: "用户A", score: 98 },
                { name: "用户B", score: 87 },
                { name: "用户C", score: 75 }
              ].map((user, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-amber-600' : 'bg-gray-200'} text-white`}>
                      {index + 1}
                    </span>
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <span className="text-sm font-medium">{user.score}</span>
                </div>
              ))}
            </div>
          </section>
        )}

          {/* 热门榜单选项卡内容 - 替换之前的用户画像 */}
          {activeTab === 'trending' && (
          <section className="user-profile-section fade-in">
              {renderTrendingProducts()}
          </section>
        )}
      </main>
      </div>

      {/* 底部导航栏 */}
      <NavBar />
    </div>
  );
};

export default DailyAiApp;