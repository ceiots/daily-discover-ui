import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './EnhancedAiChat.css';
import instance from '../../utils/axios';
import { useAuth } from '../../App';
import { getImage } from '../DailyAiApp';

// AI头像默认数据URL - 使用紫色渐变的AI图标
const AI_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5MzMzZWEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTM1LDkwIEMxMzUsNzAgMTIwLDU1IDEwMCw1NSBDODAsNTUgNjUsNzAgNjUsOTAgQzY1LDEwMCA3MCwxMDkgNzgsMTE0IEw3OCwxMzAgQzc4LDEzNSA4MiwxNDAgOTAsMTQwIEwxMTAsMTQwIEMxMTgsMTQwIDEyMiwxMzUgMTIyLDEzMCBMMTIyLDExNCBDMTMwLDEwOSAxMzUsMTAwIDEzNSw5MCBaIE05MCwxMjAgTDExMCwxMjAgTDExMCwxMzAgTDkwLDEzMCBaIE03OSwxMTEgQzc0LDEwNyA3MCwxMDAgNzAsOTAgQzcwLDcyIDg0LDYwIDEwMCw2MCBDMTE2LDYwIDEzMCw3MiAxMzAsOTAgQzEzMCwxMDAgMTI2LDEwNyAxMjEsMTExIEwxMjEsOTUgQzEyMSw4NCAxMTIsNzUgMTAwLDc1IEM4OCw3NSA3OSw4NCA3OSw5NSBaIE05Nyw3NSBDOTcsNzcgOTgsNzggMTAwLDc4IEMxMDIsNzggMTAzLDc3IDEwMyw3NSBDMTAzLDczIDEwMiw3MiAxMDAsNzIgQzk4LDcyIDk3LDczIDk3LDc1IFogTTEwNSw5NiBDMTA1LDk4IDEwNyw5OSAxMDksOTkgQzExMSw5OSAxMTMsOTggMTEzLDk2IEMxMTMsOTQgMTExLDkzIDEwOSw5MyBDMTA3LDkzIDEwNSw5NCAxMDUsOTYgWiBNODcsOTYgQzg3LDk4IDg5LDk5IEM5Myw5OSA5NSw5OCA5NSw5NiBDOTUsOTQgOTMsOTMgOTEsOTMgQzg5LDkzIDg3LDk0IDg3LDk2IFoiLz48L3N2Zz4=';

// 关键词映射表 - 用于根据用户输入生成相关的动态气泡内容
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
  '旅行': {
    bubbles: [
      { type: 'info', content: '最新研究：旅行有助于减轻压力，提升创造力', icon: 'info-circle' },
      { type: 'product', content: '旅行箱套装特惠，出行更轻松', icon: 'suitcase' },
      { type: 'task', content: '猜猜这是哪个国家的地标建筑？', icon: 'landmark' }
    ],
    progressTheme: 'flight-path',
    miniGame: { type: 'puzzle', title: '环球地标拼图', icon: 'globe-asia' }
  },
  '科技': {
    bubbles: [
      { type: 'info', content: '2023年AI技术发展速度超过过去十年总和', icon: 'robot' },
      { type: 'product', content: '全新智能家居套装，语音控制更便捷', icon: 'microchip' },
      { type: 'task', content: '测测你的科技产品选购指数', icon: 'laptop-code' }
    ],
    progressTheme: 'tech-circuit',
    miniGame: { type: 'quiz', title: 'AI知识问答', icon: 'brain' }
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
  '电影': {
    bubbles: [
      { type: 'info', content: '《盗梦空间》拍摄用了将近10年的筹备时间', icon: 'film' },
      { type: 'product', content: '在线影院年卡8折，数万部影片任你看', icon: 'ticket-alt' },
      { type: 'task', content: '猜猜这句经典台词出自哪部电影？', icon: 'quote-left' }
    ],
    progressTheme: 'film-reel',
    miniGame: { type: 'quiz', title: '电影知识达人', icon: 'film' }
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

const EnhancedAiChat = ({ onRequestArticle }) => {
  const { isLoggedIn, userInfo } = useAuth();
  const [messages, setMessages] = useState([
    { type: 'ai', text: '您好！我是今日发现AI助手。请告诉我您想了解什么，我可以帮您找到商品、回答问题或创建个性化内容。' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognition = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // 碎片化体验相关状态
  const [showInfoBubbles, setShowInfoBubbles] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressTheme, setProgressTheme] = useState('pulse-wave');
  const [showSideExplorer, setShowSideExplorer] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [clickedBubbles, setClickedBubbles] = useState(0);
  const [showExplorerContent, setShowExplorerContent] = useState(null);
  const progressInterval = useRef(null);

  // 快捷提问选项 - 更现代化的设计和描述
  const quickSuggestions = [
    { 
      id: 1,
      title: "无线降噪耳机推荐", 
      icon: "headphones",
      color: "#4f46e5",
      description: "高音质长续航"
    },
    { 
      id: 2,
      title: "智能手表排行榜", 
      icon: "smartwatch",
      color: "#10b981",
      description: "多功能健康监测"
    },
    { 
      id: 3,
      title: "抽奖赢好礼", 
      icon: "gift",
      color: "#f43f5e",
      description: "限时活动进行中"
    }
  ];

  // 自动滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 聚焦输入框
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 500);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // 发送消息
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    // 添加用户消息到聊天记录
    const userMessage = { type: 'user', text: userInput };
    setMessages([...messages, userMessage]);
    
    // 清空输入框并设置加载状态
    setUserInput('');
    setIsLoading(true);
    // 发送后隐藏快捷提问
    setShowSuggestions(false);

    // 生成基于用户输入的碎片化等待体验
    generateFragmentedExperience(userMessage.text);
    
    // 确保滚动到底部显示用户消息
    setTimeout(() => scrollToBottom(), 100);

    try {
      // 检查是否登录
      if (!isLoggedIn) {
        setMessages(prev => [...prev, { type: 'ai', text: '请先登录后再使用AI助手功能，登录后可以获得个性化推荐和更多专属内容。' }]);
        setIsLoading(false);
        completeLoading(); // 完成加载动画
        return;
      }

      // 检查是否请求创建文章
      if (userInput.includes('写篇') || userInput.includes('创建文章') || userInput.includes('生成文章')) {
        onRequestArticle && onRequestArticle(userInput);
        setMessages(prev => [...prev, { type: 'ai', text: '好的，我可以帮您创建一篇文章。请在弹出的表单中补充详细信息，我会根据您的需求生成高质量的内容。' }]);
        setIsLoading(false);
        completeLoading(); // 完成加载动画
        return;
      }

      // 模拟AI响应 - 在实际项目中替换为真实API调用
      let aiResponse = "";
      
      if (userInput.includes('推荐') || userInput.includes('好物')) {
        aiResponse = "根据最新数据，我为您推荐几款好评产品：\n\n1. 索尼WH-1000XM5无线降噪耳机 - 音质和降噪效果出色\n2. 小米空气净化器Pro - 高效过滤PM2.5\n3. Dyson V12 Detect Slim - 轻量化设计，清洁效果好\n\n要了解更多详情，您可以点击下方的\"智能推荐\"查看完整列表。";
      } else if (userInput.includes('游戏') || userInput.includes('互动')) {
        aiResponse = "我们有多款互动游戏可以体验：\n\n1. 「每日挑战」- 答对题目可获得积分\n2. 「知识问答」- 测试您的商品知识\n3. 「幸运抽奖」- 有机会获得折扣券\n\n您可以点击\"互动游戏\"开始体验，玩游戏还能获得积分哦！";
      } else {
        // 模拟通用回复
        aiResponse = "感谢您的提问。作为每日发现AI助手，我可以帮您：\n\n• 查找和推荐适合您的商品\n• 解答商品相关问题\n• 生成个性化内容\n• 提供购物建议\n\n您可以尝试询问特定产品推荐，或点击下方功能入口探索更多服务。";
      }
      
      // 延迟一点时间模拟网络请求
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
        setIsLoading(false);
        completeLoading(); // 完成加载动画
        
        // 回复后重新显示快捷提问
        setTimeout(() => setShowSuggestions(true), 1000);
        
        // 滚动到回复内容
        setTimeout(() => scrollToBottom(), 100);
      }, 3000); // 增加延迟以展示碎片化体验
      
    } catch (error) {
      console.error('AI请求失败:', error);
      setMessages(prev => [...prev, { type: 'ai', text: '连接AI服务出错，请稍后再试' }]);
      setIsLoading(false);
      completeLoading(); // 完成加载动画
      setTimeout(() => setShowSuggestions(true), 1000);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  // 处理输入框键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 处理快捷问题点击
  const handleQuickQuestion = (question) => {
    setUserInput(question.title);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  // 处理图片上传
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 实际项目中这里应该上传图片到服务器并获取URL
        const userMessage = { type: 'user', text: '上传了一张图片', isImage: true };
        setMessages([...messages, userMessage]);
        setShowSuggestions(false);
        
        // 模拟AI响应
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: '我看到您上传了一张图片。这似乎是一个商品的照片，我可以帮您：\n\n1. 查找类似的商品\n2. 分析商品特性\n3. 提供购买建议\n\n请告诉我您需要什么帮助？' 
          }]);
          setIsLoading(false);
          setTimeout(() => setShowSuggestions(true), 1000);
        }, 1500);
      }
    };
    input.click();
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImage('avatar');
  };

  // 处理气泡点击
  const handleBubbleClick = (bubble) => {
    setClickedBubbles(prev => prev + 1);
    
    // 如果点击了3个气泡，触发彩蛋效果
    if (clickedBubbles + 1 >= 3) {
      // 添加彩蛋效果，如奖励积分或者展示特殊内容
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: '🎉 恭喜您触发了彩蛋！您获得了10积分奖励，可在"我的账户"中查看。' 
      }]);
      
      // 重置点击计数
      setClickedBubbles(0);
    }
    
    if (bubble.type === 'task') {
      setShowMiniGame(true);
    } else if (bubble.type === 'info') {
      setShowExplorerContent({
        type: 'article',
        title: '相关知识',
        content: bubble.content,
        icon: bubble.icon
      });
      setShowSideExplorer(true);
    } else if (bubble.type === 'product') {
      setShowExplorerContent({
        type: 'product',
        title: '推荐商品',
        content: bubble.content,
        icon: bubble.icon
      });
      setShowSideExplorer(true);
    }
  };
  
  // 关闭气泡
  const handleDismissBubble = (index) => {
    setBubbles(prev => prev.filter((_, i) => i !== index));
  };
  
  // 更新游戏分数
  const updateGameScore = (points) => {
    setGameScore(prev => prev + points);
  };
  
  // 关闭迷你游戏
  const handleCloseGame = () => {
    setShowMiniGame(false);
    // 如果游戏分数大于特定值，添加奖励消息
    if (gameScore > 5) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: `🏆 游戏结束！您获得了${gameScore}分，赢得了优惠券奖励！查看"我的奖品"领取。` 
      }]);
    }
    setGameScore(0);
  };
  
  // 处理探索面板关闭
  const handleCloseExplorer = () => {
    setShowSideExplorer(false);
    setShowExplorerContent(null);
  };
  
  // 基于用户输入生成碎片化体验内容
  const generateFragmentedExperience = (input) => {
    let matchedKeyword = null;
    let matchedExperience = DEFAULT_LOADING_EXPERIENCE;
    
    // 查找匹配的关键词
    for (const keyword in KEYWORD_MAPPING) {
      if (input.toLowerCase().includes(keyword.toLowerCase())) {
        matchedKeyword = keyword;
        matchedExperience = KEYWORD_MAPPING[keyword];
        break;
      }
    }
    
    // 设置气泡内容
    setBubbles(matchedExperience.bubbles);
    setProgressTheme(matchedExperience.progressTheme);
    setCurrentMiniGame(matchedExperience.miniGame);
    
    // 显示气泡和边栏
    setShowInfoBubbles(true);
    
    // 启动进度条更新
    startProgressAnimation();
    
    // 0.5秒后显示侧边栏，确保先显示气泡
    setTimeout(() => {
      if (isLoading) { // 只有在仍然加载时才显示
        setShowSideExplorer(true);
      }
    }, 500);
  };
  
  // 启动进度条动画
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
  
  // 停止进度动画并完成加载
  const completeLoading = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // 设置100%进度
    setLoadingProgress(100);
    
    // 隐藏碎片化体验元素
    setTimeout(() => {
      setShowInfoBubbles(false);
      setShowSideExplorer(false);
      setShowMiniGame(false);
      setLoadingProgress(0);
    }, 500);
  };
  
  // 渲染动态气泡
  const renderInfoBubbles = () => {
    if (!showInfoBubbles || bubbles.length === 0) return null;
    
    return (
      <div className="info-bubbles-container">
        {bubbles.map((bubble, index) => (
          <div 
            key={index} 
            className={`info-bubble ${bubble.type}`}
            style={{
              animationDelay: `${index * 0.2}s`,
              left: `${15 + Math.floor(Math.random() * 10) + index * 20}%`,
              bottom: `${10 + Math.floor(Math.random() * 20)}px`
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
      </div>
    );
  };
  
  // 渲染进度条
  const renderProgressBar = () => {
    if (!isLoading) return null;
    
    let progressBarContent;
    
    // 根据主题渲染不同风格的进度条
    switch (progressTheme) {
      case 'coffee-cup':
        progressBarContent = (
          <div className="themed-progress coffee-cup">
            <div className="cup-body">
              <div className="coffee-level" style={{ height: `${loadingProgress}%` }}>
                <div className="coffee-bubbles">
                  <div className="bubble"></div>
                  <div className="bubble"></div>
                  <div className="bubble"></div>
                </div>
              </div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
        break;
        
      case 'running-track':
        progressBarContent = (
          <div className="themed-progress running-track">
            <div className="track">
              <div className="runner" style={{ left: `${loadingProgress}%` }}>
                <i className="fas fa-running"></i>
              </div>
              <div className="finish-line">
                <i className="fas fa-flag-checkered"></i>
              </div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
        break;
        
      case 'flight-path':
        progressBarContent = (
          <div className="themed-progress flight-path">
            <div className="sky">
              <div className="plane" style={{ left: `${loadingProgress}%` }}>
                <i className="fas fa-plane"></i>
              </div>
              <div className="cloud cloud1"><i className="fas fa-cloud"></i></div>
              <div className="cloud cloud2"><i className="fas fa-cloud"></i></div>
              <div className="cloud cloud3"><i className="fas fa-cloud"></i></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
        break;
        
      case 'tech-circuit':
        progressBarContent = (
          <div className="themed-progress tech-circuit">
            <div className="circuit-board">
              <div className="data-packet" style={{ left: `${loadingProgress}%` }}>
                <i className="fas fa-microchip"></i>
              </div>
              <div className="circuit-path" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
        break;
        
      case 'neural-network':
        progressBarContent = (
          <div className="themed-progress neural-network">
            <div className="network">
              <div className="connection" style={{ width: `${loadingProgress}%` }}></div>
              <div className="node node1"><i className="fas fa-brain"></i></div>
              <div className="node node2"><i className="fas fa-brain"></i></div>
              <div className="node node3"><i className="fas fa-brain"></i></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
        break;
        
      case 'film-reel':
        progressBarContent = (
          <div className="themed-progress film-reel">
            <div className="reel">
              <div className="film" style={{ width: `${loadingProgress}%` }}></div>
              <div className="frame frame1"></div>
              <div className="frame frame2"></div>
              <div className="frame frame3"></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
        break;
        
      default:
        // 默认脉冲波进度条
        progressBarContent = (
          <div className="themed-progress pulse-wave">
            <div className="progress-bar">
              <div className="progress-filled" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <div className="progress-text">{Math.round(loadingProgress)}%</div>
          </div>
        );
    }
    
    return (
      <div className="ai-progress-container">
        {progressBarContent}
      </div>
    );
  };
  
  // 渲染迷你游戏
  const renderMiniGame = () => {
    if (!showMiniGame || !currentMiniGame) return null;
    
    let gameContent;
    
    switch (currentMiniGame.type) {
      case 'click':
        gameContent = (
          <div className="mini-game click-game">
            <h3><i className={`fas fa-${currentMiniGame.icon}`}></i> {currentMiniGame.title}</h3>
            <p>点击飘落的能量球收集积分！</p>
            <div className="game-area">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="energy-ball"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                  onClick={() => updateGameScore(1)}
                >
                  <i className="fas fa-star"></i>
                </div>
              ))}
            </div>
            <div className="game-score">得分: {gameScore}</div>
            <button className="game-close-btn" onClick={handleCloseGame}>
              完成
            </button>
          </div>
        );
        break;
        
      case 'quiz':
        // 知识问答简易实现
        gameContent = (
          <div className="mini-game quiz-game">
            <h3><i className={`fas fa-${currentMiniGame.icon}`}></i> {currentMiniGame.title}</h3>
            <div className="question">
              AI之父被称为?
            </div>
            <div className="options">
              <button className="option" onClick={() => { updateGameScore(3); handleCloseGame(); }}>
                阿兰·图灵
              </button>
              <button className="option" onClick={handleCloseGame}>
                比尔·盖茨
              </button>
              <button className="option" onClick={handleCloseGame}>
                马克·扎克伯格
              </button>
            </div>
          </div>
        );
        break;
        
      // 其他游戏类型...
      
      default:
        gameContent = (
          <div className="mini-game default-game">
            <h3><i className={`fas fa-${currentMiniGame.icon}`}></i> {currentMiniGame.title}</h3>
            <p>游戏加载中...</p>
            <button className="game-close-btn" onClick={handleCloseGame}>
              关闭
            </button>
          </div>
        );
    }
    
    return (
      <div className="mini-game-overlay">
        <div className="mini-game-container">
          {gameContent}
        </div>
      </div>
    );
  };
  
  // 渲染侧边探索面板
  const renderSideExplorer = () => {
    if (!showSideExplorer || !showExplorerContent) return null;
    
    return (
      <div className="side-explorer">
        <div className="explorer-header">
          <div className="explorer-title">
            <i className={`fas fa-${showExplorerContent.icon}`}></i>
            <h3>{showExplorerContent.title}</h3>
          </div>
          <button className="explorer-close" onClick={handleCloseExplorer}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="explorer-content">
          {showExplorerContent.type === 'article' && (
            <div className="article-content">
              <p>{showExplorerContent.content}</p>
              <div className="article-extended">
                <h4>延伸阅读</h4>
                <ul>
                  <li>相关主题1</li>
                  <li>相关主题2</li>
                  <li>相关主题3</li>
                </ul>
              </div>
            </div>
          )}
          
          {showExplorerContent.type === 'product' && (
            <div className="product-content">
              <div className="product-card">
                <div className="product-image">
                  <i className="fas fa-box"></i>
                </div>
                <div className="product-details">
                  <h4>{showExplorerContent.content}</h4>
                  <div className="product-price">¥199.00</div>
                  <button className="product-action">查看详情</button>
                </div>
              </div>
              <div className="related-products">
                <h4>相关商品</h4>
                <div className="product-grid">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="mini-product">
                      <div className="mini-product-image">
                        <i className="fas fa-gift"></i>
                      </div>
                      <div className="mini-product-name">相关商品{i}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInputArea = () => {
    return (
      <div className="chat-input-container" style={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '6px 4px',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        background: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        margin: '6px 1px 1px 1px'
      }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="输入问题或需求..."
          style={{ 
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '12px',
            backgroundColor: 'transparent',
            padding: '6px 8px'
          }}
        />
        <div className="chat-input-icons" style={{ 
          display: 'flex',
          alignItems: 'center',
          marginLeft: '4px'
        }}>
          <button
            className="image-button"
            onClick={handleImageUpload}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#4f46e5',
              cursor: 'pointer',
              marginRight: '6px',
              fontSize: '10px'
            }}
          >
            <i className="fas fa-image"></i>
          </button>
          <button
            className="send-button"
            onClick={sendMessage}
            disabled={isLoading || userInput.trim() === ''}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (isLoading || userInput.trim() === '') ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.9)',
              color: 'white',
              cursor: (isLoading || userInput.trim() === '') ? 'not-allowed' : 'pointer',
              fontSize: '10px'
            }}
          >
            {isLoading ? (
              <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="ai-chat-card">
      <div className="ai-chat-header">
        <div className="ai-info">
          <div className="ai-avatar">
            <img src={AI_AVATAR} alt="AI助手" onError={handleImageError} />
          </div>
          <div>
            <h3 className="ai-name">每日发现</h3>
            <p className="ai-description">智能AI助手</p>
          </div>
        </div>
      </div>
      
      <div className="ai-chat-body">
        {renderProgressBar()}
        
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-message ${message.type} ${message.isImage ? 'image-message' : ''}`}
            >
              {message.type === 'ai' && (
                <div className="assistant-message">
                  <div className="message-content">{message.text}</div>
                </div>
              )}
              {message.type === 'user' && (
                <div className="user-message">
                  <div className="message-content">
                    {message.isImage ? (
                      <div className="uploaded-image-placeholder">
                        <i className="fas fa-image"></i>
                        <span>已上传图片</span>
                      </div>
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="loading-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ float: 'left', clear: 'both' }} />
        </div>
        
        {/* 动态信息气泡 */}
        {renderInfoBubbles()}
        
        {/* 侧边探索面板 */}
        {renderSideExplorer()}
        
        {/* 迷你游戏 */}
        {renderMiniGame()}
      </div>
      
      <div className="ai-chat-footer">
        {showSuggestions && (
          <div className="suggestion-cards">
            {quickSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="suggestion-card"
                onClick={() => handleQuickQuestion(suggestion)}
                style={{
                  borderLeft: `3px solid ${suggestion.color}`
                }}
              >
                <div 
                  className="suggestion-icon"
                  style={{
                    backgroundColor: `${suggestion.color}15`,
                    color: suggestion.color
                  }}
                >
                  <i className={`fas fa-${suggestion.icon}`}></i>
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-title">{suggestion.title}</div>
                  {suggestion.description && (
                    <div className="suggestion-description" style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                      {suggestion.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {renderInputArea()}
      </div>
    </div>
  );
};

EnhancedAiChat.propTypes = {
  onRequestArticle: PropTypes.func
};

export default EnhancedAiChat; 