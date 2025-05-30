import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Discover.css';
import { useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const DEFAULT_AVATAR = '/default-avatar.png';
const DEFAULT_IMAGE = '/default-image.png';
const DEFAULT_PRODUCT1 = '/default-product1.png'; // Example: for banners or product showcases
const DEFAULT_PRODUCT2 = '/default-product2.png';
const DEFAULT_THEME = '/default-theme.png'; // Example: for featured content

export const getImage = (imageName) => {
  // 使用更高质量、主题更匹配的Unsplash图片
  const unsplashImages = {
    'theme': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'product1': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'product2': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'tech': 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'food': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'travel': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'ai': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'health': 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'game': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'video': 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'challenge': 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  };
  return unsplashImages[imageName] || DEFAULT_IMAGE;
};

// 模拟数据 - 按照产品需求重构
const mockDiscoverData = {
  // 1. 推荐创作
  recommendedContent: [
    { 
      id: 'rc1', 
      title: '如何利用AI提升工作效率', 
      author: { name: '科技先锋', avatar: DEFAULT_AVATAR },
      summary: '探索最新AI工具如何帮助你在日常工作中节省时间和提高产出质量', 
      category: '科技', 
      image: getImage('ai'),
      readCount: '3.5K',
      likeCount: '286',
      aiInsight: '核心要点：自动化重复任务可节省40%时间，AI辅助写作提升产出质量' // 添加AI总结
    },
    { 
      id: 'rc2', 
      title: '2024年必备的5款生产力工具', 
      author: { name: '效率专家', avatar: DEFAULT_AVATAR },
      summary: '这些工具将彻底改变你的工作方式，让你事半功倍', 
      category: '工作', 
      image: getImage('tech'),
      readCount: '2.8K',
      likeCount: '195',
      aiInsight: '精选推荐：Notion全能笔记、Todoist任务管理、Calendly日程安排' // 添加AI总结
    },
    { 
      id: 'rc3', 
      title: '极简主义生活方式指南', 
      author: { name: '生活美学家', avatar: DEFAULT_AVATAR },
      summary: '如何通过减法原则，创造更有品质的生活体验', 
      category: '生活', 
      image: getImage('theme'),
      readCount: '4.2K',
      likeCount: '367',
      aiInsight: '研究表明：减少30%物品拥有量可提升幸福感达25%' // 添加AI总结
    },
  ],
  
  // 2. 休闲一刻
  casualGames: [
    { 
      id: 'cg1', 
      name: '消除星球', 
      icon: getImage('game'), 
      description: '轻松休闲的三消游戏', 
      category: '休闲', 
      popularity: '热门',
      playerCount: '1.2M',
      aiRecommend: '匹配度92%：基于您的游戏偏好推荐' // 添加AI推荐
    },
    { 
      id: 'cg2', 
      name: '数独挑战', 
      icon: getImage('education'), 
      description: '锻炼大脑的数字游戏', 
      category: '益智', 
      popularity: '推荐',
      playerCount: '845K',
      aiRecommend: '匹配度88%：有助于提升逻辑思维能力' // 添加AI推荐
    },
    { 
      id: 'cg3', 
      name: '涂鸦跳跃', 
      icon: getImage('game'), 
      description: '考验反应力的休闲游戏', 
      category: '动作', 
      popularity: '新品',
      playerCount: '560K',
      aiRecommend: '匹配度85%：适合短时间放松的最佳选择' // 添加AI推荐
    },
  ],
  
  // 3. 热门商品
  popularProducts: [
    { 
      id: 'pp1', 
      name: '智能降噪耳机X1', 
      image: getImage('product2'), 
      price: '¥899',
      originalPrice: '¥1099', 
      promotionTag: '限时特惠', 
      rating: 4.8,
      salesCount: '2.3万件',
      aiInsight: '智能分析：降噪效果领先同类产品35%' // 添加AI分析
    },
    { 
      id: 'pp2', 
      name: '便携式咖啡机', 
      image: getImage('product1'), 
      price: '¥299',
      originalPrice: '¥399', 
      promotionTag: '新品上市', 
      rating: 4.5,
      salesCount: '1.5万件',
      aiInsight: '智能分析：92%用户认为性价比极高' // 添加AI分析
    },
    { 
      id: 'pp3', 
      name: '多功能智能手表', 
      image: getImage('tech'), 
      price: '¥1299',
      originalPrice: '¥1499', 
      promotionTag: '抢购中', 
      rating: 4.7,
      salesCount: '8.7千件',
      aiInsight: '智能分析：续航能力超出同价位产品50%' // 添加AI分析
    },
  ],
  
  // 4. 游戏挑战
  gameChallenges: [
    { 
      id: 'gc1', 
      title: '七日连续登录挑战', 
      image: getImage('challenge'),
      reward: '金币×500',
      difficulty: '简单',
      participantsCount: '12.5万',
      endTime: '2024-09-30',
      aiTip: 'AI提示：设置每日提醒可提高完成率达85%' // 添加AI提示
    },
    { 
      id: 'gc2', 
      title: '电竞锦标赛', 
      image: getImage('game'),
      reward: '实物奖品+奖金',
      difficulty: '困难',
      participantsCount: '3.2万',
      endTime: '2024-10-15',
      aiTip: 'AI提示：提前练习特定地图可提升胜率30%' // 添加AI提示
    },
    { 
      id: 'gc3', 
      title: '知识竞赛', 
      image: getImage('education'),
      reward: '会员天数×7',
      difficulty: '中等',
      participantsCount: '8.6万',
      endTime: '2024-09-25',
      aiTip: 'AI提示：历史和科技类题目出现频率最高' // 添加AI提示
    },
  ],
  
  // 5. 热门视频
  hotVideos: [
    { 
      id: 'hv1', 
      title: '5分钟学会高效时间管理', 
      cover: getImage('education'),
      duration: '05:28',
      creator: '效率专家',
      viewCount: '23.5万',
      aiSummary: 'AI摘要：重点是番茄工作法和任务分类优先级' // 添加AI摘要
    },
    { 
      id: 'hv2', 
      title: '最新智能家居产品评测', 
      cover: getImage('tech'),
      duration: '08:45',
      creator: '科技达人',
      viewCount: '18.2万',
      aiSummary: 'AI摘要：智能音箱和安防系统性价比最高' // 添加AI摘要
    },
    { 
      id: 'hv3', 
      title: '15分钟居家健身全套动作', 
      cover: getImage('health'),
      duration: '15:20',
      creator: '健康生活',
      viewCount: '32.6万',
      aiSummary: 'AI摘要：无需器械，燃脂效果优于60%同类视频' // 添加AI摘要
    },
  ],
  
  // 6. 互动话题
  interactiveTopics: [
    { 
      id: 'it1', 
      title: '#数字游民生活方式', 
      participation: '3420人参与',
      trending: true, 
      category: '生活',
      aiInsight: 'AI洞察：近期讨论热度上升42%' // 添加AI洞察
    },
    { 
      id: 'it2', 
      title: '#AI绘画教程', 
      participation: '2815人参与',
      trending: true, 
      category: '科技',
      aiInsight: 'AI洞察：Midjourney相关内容最受关注' // 添加AI洞察
    },
    { 
      id: 'it3', 
      title: '#极简主义生活', 
      participation: '1950人参与',
      trending: false, 
      category: '生活',
      aiInsight: 'AI洞察：与心理健康话题高度相关' // 添加AI洞察
    },
    { 
      id: 'it4', 
      title: '#居家办公效率提升', 
      participation: '1520人参与',
      trending: true, 
      category: '工作',
      aiInsight: 'AI洞察：工作环境布置是热门讨论点' // 添加AI洞察
    },
  ]
};

const DiscoverPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const mainRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 水平滚动引用
  const horizontalScrollRefs = {
    recommendedContent: useRef(null),
    casualGames: useRef(null),
    popularProducts: useRef(null),
    gameChallenges: useRef(null),
    hotVideos: useRef(null),
    interactiveTopics: useRef(null)
  };

  // 数据状态
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [casualGames, setCasualGames] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [gameChallenges, setGameChallenges] = useState([]);
  const [hotVideos, setHotVideos] = useState([]);
  const [interactiveTopics, setInteractiveTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    const progress = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
    setScrollProgress(progress);
    setShowBackToTop(scrollTop > 300);
  }, []);

  // 水平滚动处理函数
  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const loadDiscoverData = async () => {
      setIsLoading(true);
      // 模拟API调用加载数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecommendedContent(mockDiscoverData.recommendedContent);
      setCasualGames(mockDiscoverData.casualGames);
      setPopularProducts(mockDiscoverData.popularProducts);
      setGameChallenges(mockDiscoverData.gameChallenges);
      setHotVideos(mockDiscoverData.hotVideos);
      setInteractiveTopics(mockDiscoverData.interactiveTopics);
      setIsLoading(false);
    };

    loadDiscoverData();

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);
    const darkModeListener = (e) => setIsDarkMode(e.matches);
    prefersDarkMode.addEventListener('change', darkModeListener);

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      prefersDarkMode.removeEventListener('change', darkModeListener);
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    console.log('搜索:', searchTerm);
    navigate(`/discover/search?q=${encodeURIComponent(searchTerm)}`);
  };
  
  // 加载状态展示
  if (isLoading) {
    return (
      <div className="discover-loading-container">
        <div className="discover-spinner"></div>
        <p>正在加载发现内容...</p>
        <NavBar /> 
      </div>
    );
  }
  
  return (
    <div className={`discover-tab-wrapper ${isDarkMode ? 'dark' : ''}`}>
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      
      {/* 搜索栏 - 紫色主题 */}
        <div className="discover-search-header">
          <div className="discover-search-bar">
            <i className="fas fa-search search-bar-icon"></i>
            <input 
              type="text" 
              placeholder="搜索节日、事件、商品、AI内容..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
        </div>
      </div>
      
      <div className="discover-main-content" ref={mainRef} onScroll={handleScroll}>
        
        {/* 1. 推荐创作模块 */}
        <div className="content-module-container creative-content-container">
          <div className="content-module-header">
            <div className="module-title">
              <i className="fas fa-star"></i> 推荐创作
            </div>
            <div className="scroll-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.recommendedContent, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.recommendedContent, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.recommendedContent}>
            {recommendedContent.map(item => (
              <div key={item.id} className="module-card content-card">
                <img src={item.image} alt={item.title} className="content-card-image" />
                <div className="content-card-info">
                  <span className="content-card-category">{item.category}</span>
                  <h3 className="content-card-title">{item.title}</h3>
                  {/* 添加AI总结元素 */}
                  <p className="ai-insight-text">{item.aiInsight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 休闲一刻模块 */}
        <div className="content-module-container leisure-moment-container">
          <div className="content-module-header">
            <div className="module-title">
              <i className="fas fa-gamepad"></i> 休闲一刻
            </div>
            <div className="scroll-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.casualGames, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.casualGames, 'right')}>
                <i className="fas fa-chevron-right"></i>
            </button>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.casualGames}>
            {casualGames.map(game => (
              <div key={game.id} className="module-card game-card">
                <div className="game-card-header">
                  <img src={game.icon} alt={game.name} className="game-card-icon" />
                  <div className="game-card-title-container">
                    <h4 className="game-card-title">{game.name}</h4>
                    <div className="game-card-category">{game.category}</div>
                  </div>
                </div>
                <div className="game-card-stats">
                  <div>{game.popularity}</div>
                  <div>{game.playerCount}人在玩</div>
                </div>
                {/* 添加AI推荐元素 */}
                <div className="ai-recommend-badge">
                  <i className="fas fa-brain"></i> {game.aiRecommend}
                </div>
                <button className="play-game-btn">开始游戏</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 3. 热门商品模块 */}
        <div className="content-module-container popular-products-container">
          <div className="content-module-header">
            <div className="module-title">
              <i className="fas fa-shopping-bag"></i> 热门商品
            </div>
              <div className="scroll-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.popularProducts, 'left')}>
                  <i className="fas fa-chevron-left"></i>
                </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.popularProducts, 'right')}>
                  <i className="fas fa-chevron-right"></i>
                </button>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.popularProducts}>
            {popularProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-image-container">
                  <img src={product.image} alt={product.name} className="product-card-image" />
                  {product.promotionTag && <div className="product-promotion-tag">{product.promotionTag}</div>}
                </div>
                <div className="product-card-info">
                  <h4 className="product-card-name">{product.name}</h4>
                  <div className="product-card-prices">
                    <div className="product-current-price">{product.price}</div>
                    <div className="product-original-price">{product.originalPrice}</div>
                  </div>
                  <div className="product-card-rating">
                    <div className="stars">★{product.rating}</div>
                    <div className="rating-value">{product.salesCount} 已售</div>
                  </div>
                  {/* 添加AI分析元素 */}
                  <div className="ai-product-insight">
                    <i className="fas fa-chart-line"></i> {product.aiInsight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 4. 游戏挑战模块 */}
        {/* <div className="content-module-container game-challenge-container">
          <div className="content-module-header">
            <div className="module-title">
              <i className="fas fa-trophy"></i> 游戏挑战
            </div>
            <div className="scroll-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.gameChallenges, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.gameChallenges, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.gameChallenges}>
            {gameChallenges.map(challenge => (
              <div key={challenge.id} className="module-card challenge-card">
                <img src={challenge.image} alt={challenge.title} className="challenge-card-image" />
                <div className="challenge-card-info">
                  <h4 className="challenge-card-title">{challenge.title}</h4>
                  <div className="challenge-card-details">
                    <div><span className="detail-label">难度:</span> <span className={`difficulty-badge ${challenge.difficulty}`}>{challenge.difficulty}</span></div>
                    <div><span className="detail-label">奖励:</span> <span className="detail-value">{challenge.reward}</span></div>
                    <div><span className="detail-label">参与:</span> <span className="detail-value">{challenge.participantsCount}</span></div>
                    <div><span className="detail-label">截止:</span> <span className="detail-value">{challenge.endTime}</span></div>
                  </div>
                  <div className="ai-tip-container">
                    <i className="fas fa-lightbulb"></i> {challenge.aiTip}
                  </div>
                  <button className="join-challenge-btn">参与挑战</button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        
        {/* 5. 热门视频模块 */}
        <div className="content-module-container trending-videos-container">
          <div className="content-module-header">
            <div className="module-title">
              <i className="fas fa-video"></i> 热门视频
            </div>
              <div className="scroll-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.hotVideos, 'left')}>
                  <i className="fas fa-chevron-left"></i>
                </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.hotVideos, 'right')}>
                  <i className="fas fa-chevron-right"></i>
            </button>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.hotVideos}>
            {hotVideos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-card-cover-container">
                  <img src={video.cover} alt={video.title} className="video-card-cover" />
                  <div className="video-duration">{video.duration}</div>
                  <div className="video-play-button">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <div className="video-card-info">
                  <h4 className="video-card-title">{video.title}</h4>
                  <div className="video-card-creator">{video.creator}</div>
                  <div className="video-card-views">
                    <i className="fas fa-eye"></i> {video.viewCount}
                  </div>
                  {/* 添加AI摘要元素 */}
                  <div className="ai-video-summary">
                    <i className="fas fa-magic"></i> {video.aiSummary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 6. 互动话题模块 */}
        {/* <div className="content-module-container interactive-topics-container">
          <div className="content-module-header">
            <div className="module-title">
              <i className="fas fa-comments"></i> 互动话题
            </div>
            <div className="scroll-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.interactiveTopics, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.interactiveTopics, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
                      </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.interactiveTopics}>
            {interactiveTopics.map(topic => (
              <div key={topic.id} className="topic-card">
                <span className="topic-category">{topic.category}</span>
                <h4 className="topic-title">{topic.title}</h4>
                <div className="topic-meta">
                  <div className="topic-participation">{topic.participation}</div>
                  {topic.trending && (
                    <div className="topic-trending">
                      <i className="fas fa-fire"></i> 热门
                    </div>
                  )}
                </div>
                <div className="ai-topic-insight">
                  <i className="fas fa-brain"></i> {topic.aiInsight}
                </div>
                <button className="join-topic-btn">参与讨论</button>
              </div>
            ))}
          </div>
        </div> */}
        
        {/* 返回顶部按钮 */}
        {showBackToTop && (
          <div className="discover-back-to-top" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default DiscoverPage;


