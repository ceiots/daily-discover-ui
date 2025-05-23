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
  // 使用Unsplash高质量图片
  const unsplashImages = {
    'theme': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'product1': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'product2': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'food': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'travel': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'ai': 'https://images.unsplash.com/photo-1677442135136-760c813170d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'health': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'game': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'video': 'https://images.unsplash.com/photo-1616469829941-c7200edec809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'challenge': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
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
      likeCount: '286'
    },
    { 
      id: 'rc2', 
      title: '2024年必备的5款生产力工具', 
      author: { name: '效率专家', avatar: DEFAULT_AVATAR },
      summary: '这些工具将彻底改变你的工作方式，让你事半功倍', 
      category: '工作', 
      image: getImage('tech'),
      readCount: '2.8K',
      likeCount: '195'
    },
    { 
      id: 'rc3', 
      title: '极简主义生活方式指南', 
      author: { name: '生活美学家', avatar: DEFAULT_AVATAR },
      summary: '如何通过减法原则，创造更有品质的生活体验', 
      category: '生活', 
      image: getImage('theme'),
      readCount: '4.2K',
      likeCount: '367'
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
      playerCount: '1.2M'
    },
    { 
      id: 'cg2', 
      name: '数独挑战', 
      icon: getImage('education'), 
      description: '锻炼大脑的数字游戏', 
      category: '益智', 
      popularity: '推荐',
      playerCount: '845K'
    },
    { 
      id: 'cg3', 
      name: '涂鸦跳跃', 
      icon: getImage('game'), 
      description: '考验反应力的休闲游戏', 
      category: '动作', 
      popularity: '新品',
      playerCount: '560K'
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
      salesCount: '2.3万件'
    },
    { 
      id: 'pp2', 
      name: '便携式咖啡机', 
      image: getImage('product1'), 
      price: '¥299',
      originalPrice: '¥399', 
      promotionTag: '新品上市', 
      rating: 4.5,
      salesCount: '1.5万件'
    },
    { 
      id: 'pp3', 
      name: '多功能智能手表', 
      image: getImage('tech'), 
      price: '¥1299',
      originalPrice: '¥1499', 
      promotionTag: '抢购中', 
      rating: 4.7,
      salesCount: '8.7千件'
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
      endTime: '2024-09-30'
    },
    { 
      id: 'gc2', 
      title: '电竞锦标赛', 
      image: getImage('game'),
      reward: '实物奖品+奖金',
      difficulty: '困难',
      participantsCount: '3.2万',
      endTime: '2024-10-15'
    },
    { 
      id: 'gc3', 
      title: '知识竞赛', 
      image: getImage('education'),
      reward: '会员天数×7',
      difficulty: '中等',
      participantsCount: '8.6万',
      endTime: '2024-09-25'
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
      viewCount: '23.5万'
    },
    { 
      id: 'hv2', 
      title: '最新智能家居产品评测', 
      cover: getImage('tech'),
      duration: '08:45',
      creator: '科技达人',
      viewCount: '18.2万'
    },
    { 
      id: 'hv3', 
      title: '15分钟居家健身全套动作', 
      cover: getImage('health'),
      duration: '15:20',
      creator: '健康生活',
      viewCount: '32.6万'
    },
  ],
  
  // 6. 互动话题
  interactiveTopics: [
    { 
      id: 'it1', 
      title: '#数字游民生活方式', 
      participation: '3420人参与',
      trending: true, 
      category: '生活' 
    },
    { 
      id: 'it2', 
      title: '#AI绘画教程', 
      participation: '2815人参与',
      trending: true, 
      category: '科技' 
    },
    { 
      id: 'it3', 
      title: '#极简主义生活', 
      participation: '1950人参与',
      trending: false, 
      category: '生活' 
    },
    { 
      id: 'it4', 
      title: '#居家办公效率提升', 
      participation: '1520人参与',
      trending: true, 
      category: '工作' 
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
      const scrollAmount = 200;
      if (direction === 'left') {
        ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
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
      {scrollProgress > 0 && <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>}
      
      <div className="discover-main-content" ref={mainRef}>
        {/* 顶部搜索栏 - 紫色渐变背景 */}
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

       

        {/* 2. 休闲一刻 */}
        <section className="discover-section">
          <div className="section-header-with-controls">
            <h2 className="discover-section-title"><i className="fas fa-gamepad"></i> 休闲一刻</h2>
            <div className="section-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.casualGames, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.casualGames, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <Link to="/discover/games" className="view-all-link">查看全部</Link>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.casualGames}>
            {casualGames.map(game => (
              <div key={game.id} className="game-card">
                <img src={game.icon} alt={game.name} className="game-card-icon"/>
                <h3 className="game-card-title">{game.name}</h3>
                <p className="game-card-description">{game.description}</p>
                <span className="game-card-category">{game.category}</span>
                <div className="game-card-stats">
                  <span className="game-popularity"><i className="fas fa-fire"></i> {game.popularity}</span>
                  <span className="game-players">{game.playerCount} 玩家</span>
                </div>
                <button className="play-game-btn">立即玩</button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 热门商品 */}
        <section className="discover-section">
          <div className="section-header-with-controls">
            <h2 className="discover-section-title"><i className="fas fa-shopping-bag"></i> 热门商品</h2>
            <div className="section-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.popularProducts, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.popularProducts, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <Link to="/discover/products" className="view-all-link">查看全部</Link>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.popularProducts}>
            {popularProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-image-container">
                  <img src={product.image} alt={product.name} className="product-card-image"/>
                  {product.promotionTag && <span className="product-promotion-tag">{product.promotionTag}</span>}
                </div>
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-prices">
                  <span className="product-current-price">{product.price}</span>
                  {product.originalPrice && <span className="product-original-price">{product.originalPrice}</span>}
                </div>
                <div className="product-card-rating">
                  <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}</span>
                  <span className="rating-value">{product.rating}</span>
                </div>
                <div className="product-card-sales">{product.salesCount} 已售</div>
              </div>
            ))}
          </div>
        </section>

         {/* 1. 推荐创作 */}
         <section className="discover-section">
          <div className="section-header-with-controls">
            <h2 className="discover-section-title"><i className="fas fa-star"></i> 推荐创作</h2>
            <div className="section-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.recommendedContent, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.recommendedContent, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <Link to="/discover/recommended" className="view-all-link">查看全部</Link>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.recommendedContent}>
            {recommendedContent.map(item => (
              <Link to={`/discover/content/${item.id}`} key={item.id} className="content-card-link">
                <div className="content-card">
                  <img src={item.image} alt={item.title} className="content-card-image"/>
                  <div className="content-card-info">
                    <span className="content-card-category">{item.category}</span>
                    <h3 className="content-card-title">{item.title}</h3>
                    <p className="content-card-summary">{item.summary}</p>
                    <div className="content-card-author">
                      <img src={item.author.avatar} alt={item.author.name} className="author-avatar"/>
                      <span>{item.author.name}</span>
                    </div>
                    <div className="content-card-stats">
                      <span><i className="fas fa-eye"></i> {item.readCount}</span>
                      <span><i className="fas fa-heart"></i> {item.likeCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. 游戏挑战 */}
        <section className="discover-section">
          <div className="section-header-with-controls">
            <h2 className="discover-section-title"><i className="fas fa-trophy"></i> 游戏挑战</h2>
            <div className="section-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.gameChallenges, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.gameChallenges, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <Link to="/discover/challenges" className="view-all-link">查看全部</Link>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.gameChallenges}>
            {gameChallenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <img src={challenge.image} alt={challenge.title} className="challenge-card-image"/>
                <h3 className="challenge-card-title">{challenge.title}</h3>
                <div className="challenge-card-details">
                  <div className="challenge-reward">
                    <span className="detail-label">奖励:</span>
                    <span className="detail-value">{challenge.reward}</span>
                  </div>
                  <div className="challenge-difficulty">
                    <span className="detail-label">难度:</span>
                    <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
                  </div>
                  <div className="challenge-participants">
                    <span className="detail-label">参与:</span>
                    <span className="detail-value">{challenge.participantsCount}</span>
                  </div>
                  <div className="challenge-time">
                    <span className="detail-label">截止:</span>
                    <span className="detail-value">{challenge.endTime}</span>
                  </div>
                </div>
                <button className="join-challenge-btn">参与挑战</button>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 热门视频 */}
        <section className="discover-section">
          <div className="section-header-with-controls">
            <h2 className="discover-section-title"><i className="fas fa-play-circle"></i> 热门视频</h2>
            <div className="section-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.hotVideos, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.hotVideos, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <Link to="/discover/videos" className="view-all-link">查看全部</Link>
            </div>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.hotVideos}>
            {hotVideos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-card-cover-container">
                  <img src={video.cover} alt={video.title} className="video-card-cover"/>
                  <span className="video-duration">{video.duration}</span>
                  <div className="video-play-button">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <h3 className="video-card-title">{video.title}</h3>
                <div className="video-card-creator">{video.creator}</div>
                <div className="video-card-views"><i className="fas fa-eye"></i> {video.viewCount}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. 互动话题 */}
        <section className="discover-section">
          <div className="section-header-with-controls">
            <h2 className="discover-section-title"><i className="fas fa-comments"></i> 互动话题</h2>
            <div className="section-controls">
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.interactiveTopics, 'left')}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="scroll-control-btn" onClick={() => scrollHorizontally(horizontalScrollRefs.interactiveTopics, 'right')}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <Link to="/discover/topics" className="view-all-link">查看全部</Link>
            </div>
          </div>
          <div className="horizontal-scroll-container topic-container" ref={horizontalScrollRefs.interactiveTopics}>
            {interactiveTopics.map(topic => (
              <Link to={`/topic/${topic.id}`} key={topic.id} className="topic-card">
                <h4 className="topic-title">{topic.title}</h4>
                <div className="topic-meta">
                  <span className="topic-participation">{topic.participation}</span>
                  {topic.trending && <span className="topic-trending"><i className="fas fa-chart-line"></i> 热门</span>}
                </div>
                <span className="topic-category">{topic.category}</span>
                <button className="join-topic-btn">参与讨论</button>
              </Link>
            ))}
          </div>
        </section>

        {/* 回到顶部按钮 */}
        {showBackToTop && (
          <div className="discover-back-to-top visible" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <NavBar />
    </div>
  );
};

export default DiscoverPage;
