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
  };
  return unsplashImages[imageName] || DEFAULT_IMAGE;
};

// Mock data for "Discover" Tab (to be replaced with API calls or props)
const mockDiscoverData = {
  bannerItems: [
    { id: 'b1', title: '探索AI新边界', description: '最新AI技术与应用深度解析', image: getImage('theme'), link: '/discover/ai-frontiers' },
    { id: 'b2', title: '周末潮玩指南', description: '编辑精选，不容错过的活动与好去处', image: getImage('product1'), link: '/discover/weekend-guide' },
  ],
  aiForYou: {
    title: "AI智能推荐",
    items: [
      { id: 'ai1', type: 'article', title: '个性化学习路径：AI如何助你高效成长', image: getImage('product2'), source: '智能教育平台' },
      { id: 'ai2', type: 'tool', title: '智能写作助手Pro', description: '释放你的写作潜力', icon: 'pencil-alt', cta: '免费试用' },
      { id: 'ai3', type: 'event', title: 'AI开发者大会2024', date: '10月26-28日', location: '线上直播' }
    ]
  },
  curatedCollections: [
    { id: 'c1', title: '提升效率的App', image: getImage('product1'), itemsCount: 8, link: '/collections/productivity-apps' },
    { id: 'c2', title: '夏日特饮秘方', image: getImage('product2'), itemsCount: 12, link: '/collections/summer-drinks' },
    { id: 'c3', title: '居家健身指南', image: getImage('travel'), itemsCount: 6, link: '/collections/home-fitness' },
  ],
  trendingContent: [
    { id: 't1', title: 'AI在艺术创作中的应用', category: '科技', views: '1.2M', image: getImage('theme') },
    { id: 't2', title: '最新智能家居体验报告', category: '生活', views: '890K', image: getImage('product1') },
    { id: 't3', title: '2024年必看科幻电影清单', category: '娱乐', views: '756K', image: getImage('tech') },
  ],
  productShowcase: {
    title: "编辑严选好物",
    items: [
      { id: 'p1', name: '智能降噪耳机X1', price: '¥899', image: getImage('product2'), rating: 4.8, tag: '新品' },
      { id: 'p2', name: '便携咖啡机Go', price: '¥299', image: getImage('product1'), rating: 4.5, tag: '热门' },
      { id: 'p3', name: '多功能智能手表', price: '¥1299', image: getImage('tech'), rating: 4.7, tag: '限时' },
    ]
  },
  eventCalendar: [
    { id: 'e1', title: '全球数字艺术展', date: '2024年11月5日 - 15日', type: '展览', image: getImage('theme')},
    { id: 'e2', title: '线上编程马拉松', date: '2024年12月1日', type: '竞赛', image: getImage('product2')},
  ],
  hotTopics: [
    { id: 'h1', title: '#数字游民生活方式', posts: 3420, trending: true },
    { id: 'h2', title: '#AI绘画教程', posts: 2815, trending: true },
    { id: 'h3', title: '#极简主义生活', posts: 1950, trending: false },
    { id: 'h4', title: '#可持续时尚', posts: 1680, trending: true },
  ]
};

const DailyAiApp = () => { // This component now represents the "Discover" Tab
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth(); // Keep auth context if needed for user-specific content
  const mainRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Keep dark mode if needed
  const [searchTerm, setSearchTerm] = useState('');

  // States for Discover Tab content
  const [bannerItems, setBannerItems] = useState([]);
  const [aiForYou, setAiForYou] = useState(null);
  const [curatedCollections, setCuratedCollections] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);
  const [productShowcase, setProductShowcase] = useState(null);
  const [eventCalendar, setEventCalendar] = useState([]);
  const [hotTopics, setHotTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', '科技', '生活', '健康', '学习', '娱乐'];

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    const progress = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
    setScrollProgress(progress);
    setShowBackToTop(scrollTop > 300);
  }, []);

  useEffect(() => {
    const loadDiscoverData = async () => {
      setIsLoading(true);
      // Simulate API call for Discover Tab data
      // In a real app, replace this with actual instance.get() calls
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setBannerItems(mockDiscoverData.bannerItems);
      setAiForYou(mockDiscoverData.aiForYou);
      setCuratedCollections(mockDiscoverData.curatedCollections);
      setTrendingContent(mockDiscoverData.trendingContent);
      setProductShowcase(mockDiscoverData.productShowcase);
      setEventCalendar(mockDiscoverData.eventCalendar);
      setHotTopics(mockDiscoverData.hotTopics);
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
  }, [handleScroll]); // Add other dependencies if data fetching relies on them (e.g., userId for personalized content)

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    console.log('Discover Tab Search:', searchTerm);
    // Navigate to a search results page or filter current view
    navigate(`/discover/search?q=${encodeURIComponent(searchTerm)}`);
  };
  

  
  // Placeholder for isLoading state
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
        {/* Top Search Bar for Discover Tab */}
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
            {/* Optional: Profile icon can be added here if design requires */}
          </div>
        </div>

        {/* Banner/Featured Section */}
        {/* {bannerItems.length > 0 && (
          <section className="discover-section discover-banner-section">
            {bannerItems.slice(0, 1).map(item => (
              <Link to={item.link} key={item.id} className="banner-item-link">
                <div className="banner-item">
                  <img src={item.image} alt={item.title} className="banner-image"/>
                  <div className="banner-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )} */}

        {/* AI For You Section */}
        {/* {aiForYou && aiForYou.items.length > 0 && (
          <section className="discover-section ai-for-you-section">
            <h2 className="discover-section-title">{aiForYou.title || "AI智能推荐"}</h2>
            <div className="ai-for-you-grid">
              {aiForYou.items.map(item => (
                <div key={item.id} className="ai-for-you-card">
                  {item.image && <img src={item.image} alt={item.title} className="ai-card-image"/>}
                  {item.icon && <i className={`fas fa-${item.icon} ai-card-icon`}></i>}
                  <h4>{item.title}</h4>
                  {item.description && <p className="ai-card-description">{item.description}</p>}
                  {item.source && <small className="ai-card-source">来源: {item.source}</small>}
                  {item.date && <small className="ai-card-date">{item.type === 'event' ? `${item.date} @ ${item.location}` : item.date}</small>}
                  {item.cta && <button className="ai-card-cta" onClick={() => alert(`Action: ${item.cta}`)}>{item.cta}</button>}
                </div>
              ))}
            </div>
          </section>
        )} */}

        {/* Curated Collections Section */}
        {/* {curatedCollections.length > 0 && (
          <section className="discover-section curated-collections-section">
            <h2 className="discover-section-title">专题合集</h2>
            <div className="horizontal-scroll-container">
              {curatedCollections.map(collection => (
                <Link to={collection.link} key={collection.id} className="collection-card-link">
                  <div className="collection-card">
                    <img src={collection.image} alt={collection.title} className="collection-image"/>
                    <div className="collection-info">
                      <h4>{collection.title}</h4>
                      <span>{collection.itemsCount}项内容</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )} */}

        {/* Trending Content Section */}
        {trendingContent.length > 0 && (
          <section className="discover-section trending-content-section">
            <h2 className="discover-section-title">热门内容</h2>
            <div className="trending-list">
              {trendingContent.map(item => (
                <Link to={`/discover/trending/${item.id}`} key={item.id} className="trending-item-card-link">
                  <div className="trending-item-card">
                    <img src={item.image} alt={item.title} className="trending-item-image"/>
                    <div className="trending-item-info">
                      <span className="trending-item-category">{item.category}</span>
                      <h4>{item.title}</h4>
                      <span className="trending-item-views"><i className="fas fa-fire"></i> {item.views} 热度</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {/* Product Showcase Section */}
        {/* {productShowcase && productShowcase.items.length > 0 && (
          <section className="discover-section product-showcase-section">
            <h2 className="discover-section-title">{productShowcase.title || "编辑严选好物"}</h2>
            <div className="horizontal-scroll-container product-scroll">
              {productShowcase.items.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="showcase-product-card-link">
                  <div className="showcase-product-card">
                    <img src={product.image} alt={product.name} className="showcase-product-image"/>
                    <div className="showcase-product-info">
                      <h5>{product.name}</h5>
                      <div className="product-meta">
                        <span className="price">{product.price}</span>
                        <span className="rating"><i className="fas fa-star"></i> {product.rating}</span>
                      </div>
                      {product.tag && <span className="product-tag">{product.tag}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )} */}

        {/* Hot Topics Section */}
        {hotTopics.length > 0 && (
          <section className="discover-section hot-topics-section">
            <h2 className="discover-section-title">热门话题</h2>
            <div className="hot-topics-grid">
              {hotTopics.map(topic => (
                <Link to={`/topic/${topic.id}`} key={topic.id} className="hot-topic-card">
                  <h4>{topic.title}</h4>
                  <div className="topic-meta">
                    <span className="topic-posts">{topic.posts}篇内容</span>
                    {topic.trending && <span className="topic-trending"><i className="fas fa-chart-line"></i> 热门</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {showBackToTop && (
          <div className="discover-back-to-top visible" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default DailyAiApp;
