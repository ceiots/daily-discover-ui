import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FragmentedExperience.css';

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
    miniGame: { type: 'click', title: '能量收集', icon: 'dumbbell' }
  },
  '旅行': {
    bubbles: [
      { type: 'info', content: '收拾行李小窍门：卷着放的衣物比折叠更节省空间', icon: 'plane' },
      { type: 'product', content: '便携式多功能旅行转换插头，全球通用', icon: 'plug' },
      { type: 'task', content: '分享旅行照片，参与抽奖赢取旅行金', icon: 'camera' }
    ],
    progressTheme: 'flight-path',
    miniGame: { type: 'quiz', title: '环球知识问答', icon: 'globe' }
  },
  '科技': {
    bubbles: [
      { type: 'info', content: '量子计算可以在几秒内解决传统计算机需要数百年的问题', icon: 'microchip' },
      { type: 'product', content: '新一代智能家居中枢，语音控制所有设备', icon: 'home' },
      { type: 'task', content: '参与科技产品测试，获得提前体验资格', icon: 'flask' }
    ],
    progressTheme: 'tech-circuit',
    miniGame: { type: 'click', title: '数据收集', icon: 'laptop-code' }
  },
  '电影': {
    bubbles: [
      { type: 'info', content: '《阿凡达》是首部全球票房突破20亿美元的电影', icon: 'film' },
      { type: 'product', content: '家庭影院投影仪，打造电影级观影体验', icon: 'video' },
      { type: 'task', content: '参加电影知识问答，赢取电影票', icon: 'ticket-alt' }
    ],
    progressTheme: 'film-reel',
    miniGame: { type: 'quiz', title: '电影冷知识测验', icon: 'film' }
  },
  'AI': {
    bubbles: [
      { type: 'info', content: '人工智能可以学习模式并根据新的情景做出决策', icon: 'brain' },
      { type: 'product', content: '个人AI助手设备，为您的生活提供智能支持', icon: 'robot' },
      { type: 'task', content: '测试最新AI功能，提供产品反馈', icon: 'cogs' }
    ],
    progressTheme: 'neural-network',
    miniGame: { type: 'quiz', title: 'AI知识测验', icon: 'brain' }
  }
};

// 默认体验
const DEFAULT_LOADING_EXPERIENCE = {
  bubbles: [
    { type: 'info', content: '您知道吗？正确的搜索关键词可以帮助您更快找到想要的内容', icon: 'lightbulb' },
    { type: 'product', content: '根据您的搜索习惯，这些商品可能符合您的需求', icon: 'search' },
    { type: 'task', content: '完成个人偏好设置，获得更精准的个性化推荐', icon: 'sliders-h' }
  ],
  progressTheme: 'pulse-wave',
  miniGame: { type: 'click', title: '积分收集', icon: 'star' }
};

/**
 * 碎片化体验组件
 * @param {Object} props - 组件属性
 * @param {string} props.userQuery - 用户输入的查询
 * @param {boolean} props.isLoading - 是否正在加载
 * @param {function} props.onBubbleInteraction - 气泡交互回调
 * @param {string} props.className - 额外的CSS类名
 * @param {boolean} props.showAsHistory - 是否作为历史记录显示
 * @param {string} props.timestamp - 时间戳（当showAsHistory为true时使用）
 * @param {Array} props.customBubbles - 自定义气泡数据（可选）
 * @param {string} props.customTheme - 自定义进度条主题（可选）
 */
const FragmentedExperience = ({ 
  userQuery = "", 
  isLoading = false, 
  onBubbleInteraction,
  className = "",
  showAsHistory = false,
  timestamp = "",
  customBubbles = null,
  customTheme = null
}) => {
  // 碎片化体验相关状态
  const [showInfoBubbles, setShowInfoBubbles] = useState(true);
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

  // 生成碎片化体验
  useEffect(() => {
    if (userQuery && !showAsHistory) {
      // 如果有自定义数据，则使用自定义数据
      if (customBubbles && customTheme) {
        setBubbles(customBubbles);
        setProgressTheme(customTheme);
        return;
      }
      
      // 否则根据用户输入生成匹配体验
      generateFragmentedExperience(userQuery);
    }
  }, [userQuery, customBubbles, customTheme, showAsHistory]);

  // 监听加载状态
  useEffect(() => {
    console.log("碎片化体验组件：加载状态更新:", isLoading, "用户查询:", userQuery);
    if (isLoading && !showAsHistory) {
      // 开始进度条动画
      startProgressAnimation();
      setShowInfoBubbles(true); // 确保气泡可见
      
      // 如果没有用户查询但是正在加载，使用默认体验
      if (!userQuery) {
        console.log("使用默认体验数据");
        setBubbles(DEFAULT_LOADING_EXPERIENCE.bubbles);
        setProgressTheme(DEFAULT_LOADING_EXPERIENCE.progressTheme);
        setCurrentMiniGame(DEFAULT_LOADING_EXPERIENCE.miniGame);
      }
    } else if (!isLoading && !showAsHistory) {
      // 完成加载
      completeLoading();
    }
  }, [isLoading, showAsHistory, userQuery]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // 处理气泡点击
  const handleBubbleClick = (bubble) => {
    setClickedBubbles(prev => prev + 1);
    
    // 如果点击了3个气泡，触发彩蛋效果
    if (clickedBubbles + 1 >= 3) {
      // 添加彩蛋效果，调用回调
      onBubbleInteraction && onBubbleInteraction({
        type: 'easter_egg',
        message: '🎉 恭喜您触发了彩蛋！您获得了10积分奖励，可在"我的账户"中查看。'
      });
      
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
      onBubbleInteraction && onBubbleInteraction({
        type: 'game_reward',
        score: gameScore,
        message: `🏆 游戏结束！您获得了${gameScore}分，赢得了优惠券奖励！查看"我的奖品"领取。`
      });
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
    console.log("生成碎片化体验，输入:", input);
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
        console.log("匹配到关键词:", keyword);
        break;
      }
    }
    
    // 手动检查一些特殊词汇映射
    if (!matchedKeyword) {
      if (inputLower.includes("健身") || inputLower.includes("锻炼") || inputLower.includes("运动")) {
        matchedExperience = KEYWORD_MAPPING["健身"];
        console.log("特殊匹配到关键词: 健身/锻炼/运动");
      } else if (inputLower.includes("咖啡厅") || inputLower.includes("星巴克")) {
        matchedExperience = KEYWORD_MAPPING["咖啡"];
        console.log("特殊匹配到关键词: 咖啡相关");
      } else if (inputLower.includes("旅游") || inputLower.includes("飞机") || inputLower.includes("度假")) {
        matchedExperience = KEYWORD_MAPPING["旅行"];
        console.log("特殊匹配到关键词: 旅行相关");
      }
    }
    
    // 设置气泡内容 - 稍微随机化顺序，提高体验感
    const shuffledBubbles = [...matchedExperience.bubbles].sort(() => Math.random() - 0.5);
    setBubbles(shuffledBubbles);
    setProgressTheme(matchedExperience.progressTheme);
    setCurrentMiniGame(matchedExperience.miniGame);
    
    // 显示气泡和进度条
    setShowInfoBubbles(true);
    
    // 延迟显示侧边探索面板，现在可以略微缩短延迟时间
    setTimeout(() => {
      //if (isLoading) { // 只有在仍然加载时才显示
        // 随机决定是否自动打开侧边栏，增加多样性
        if (Math.random() > 0.7) {
          const randomIndex = Math.floor(Math.random() * shuffledBubbles.length);
          const randomBubble = shuffledBubbles[randomIndex];
          
          if (randomBubble) {
            if (randomBubble.type === 'info') {
              setShowExplorerContent({
                type: 'article',
                title: '相关知识',
                content: randomBubble.content,
                icon: randomBubble.icon
              });
              setShowSideExplorer(true);
            } else if (randomBubble.type === 'product') {
              setShowExplorerContent({
                type: 'product',
                title: '推荐商品',
                content: randomBubble.content,
                icon: randomBubble.icon
              });
              setShowSideExplorer(true);
            }
          }
        }
      //}
    }, 180000);
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
      progressInterval.current = null;
    }
    
    // 设置100%进度
    setLoadingProgress(100);
    
    // 历史模式下不需要隐藏元素
    if (showAsHistory) return;
    
    // 不再隐藏任何元素，保留所有体验内容
    // 只隐藏侧边栏和游戏，但保留气泡
    setShowSideExplorer(false);
    setShowMiniGame(false);
    
    // 这里不再设置showInfoBubbles为false，确保气泡持续显示
  };
  
  // 渲染动态气泡
  const renderInfoBubbles = () => {
    if (bubbles.length === 0) return null;
    
    return (
      <div className={`fragment-experience-container ${className}`} style={showAsHistory ? {} : { 
        opacity: 1,
        transition: 'opacity 0.5s ease',
        background: 'rgba(252, 252, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <div className="fragment-experience-title">
          <i className="fas fa-brain" style={{ color: '#6366f1', marginRight: '8px' }}></i>
          <span>
            {showAsHistory 
              ? `历史查询: "${userQuery}"` 
              : `AI灵感闪现${userQuery ? `：关于"${userQuery}"的思考` : ''}`
            }
            {timestamp && <span className="query-time"> ({timestamp})</span>}
          </span>
          {!showAsHistory && (
            <div className="thinking-indicator">
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
            </div>
          )}
        </div>
        <div className="fragment-bubbles-wrapper">
          {bubbles.map((bubble, index) => (
            <div 
              key={index} 
              className={`fragment-bubble ${bubble.type}`}
              style={{
                animationDelay: `${index * 0.2}s`,
                background: bubble.type === 'info' 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.12))' 
                  : bubble.type === 'product' 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.12))' 
                    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.12))',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transform: 'translateZ(0)'
              }}
            >
              <div className="bubble-icon"
                style={{
                  background: bubble.type === 'info' 
                    ? 'rgba(99, 102, 241, 0.15)' 
                    : bubble.type === 'product' 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(245, 158, 11, 0.15)',
                  boxShadow: `0 0 0 4px ${bubble.type === 'info' 
                    ? 'rgba(99, 102, 241, 0.05)' 
                    : bubble.type === 'product' 
                      ? 'rgba(16, 185, 129, 0.05)' 
                      : 'rgba(245, 158, 11, 0.05)'}`,
                }}
              >
                <i className={`fas fa-${bubble.icon}`}></i>
              </div>
              <div className="bubble-content">{bubble.content}</div>
              <div className="bubble-actions">
                <button className="bubble-action view" onClick={() => handleBubbleClick(bubble)}>
                  <i className="fas fa-eye"></i>
                  <span className="action-tooltip">探索</span>
                </button>
                <button className="bubble-action dismiss" onClick={() => handleDismissBubble(index)}>
                  <i className="fas fa-times"></i>
                  <span className="action-tooltip">关闭</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染进度条
  const renderProgressBar = () => {
    // 只有在加载中且不是历史记录时显示进度条
    if (showAsHistory || !isLoading) return null;
    
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
      <div className="ai-progress-container" style={{
        animation: 'fadeIn 0.5s ease-in-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
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

  return (
    <div className={`fragmented-experience ${className}`}>
      {renderProgressBar()}
      {renderInfoBubbles()}
      {renderSideExplorer()}
      {renderMiniGame()}
    </div>
  );
};

FragmentedExperience.propTypes = {
  userQuery: PropTypes.string,
  isLoading: PropTypes.bool,
  onBubbleInteraction: PropTypes.func,
  className: PropTypes.string,
  showAsHistory: PropTypes.bool,
  timestamp: PropTypes.string,
  customBubbles: PropTypes.array,
  customTheme: PropTypes.string
};

export default FragmentedExperience; 