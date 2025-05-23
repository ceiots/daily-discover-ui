import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Daily.css";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import AiChatInterface from './ai/AiChatInterface';
// import DailyFocus from "./DailyFocus"; // Assuming DailyFocus will be part of the new structure or replaced

// Helper function to get Lunar Date (simplified)
const getLunarDate = (date) => {
  // In a real app, use a library for accurate lunar date conversion
  const lunarMonths = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
  const lunarDays = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
  const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  // Simplified for example
  return {
    year: `甲辰[${animals[date.getFullYear() % 12]}]`, // Example, not accurate
    month: lunarMonths[date.getMonth()], // Example
    day: lunarDays[date.getDate() -1], // Example
  };
};

// Helper function to get greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "凌晨";
  if (hour < 9) return "早上";
  if (hour < 12) return "上午";
  if (hour < 14) return "中午";
  if (hour < 18) return "下午";
  if (hour < 22) return "晚上";
  return "夜深了";
};

const Discover = () => {
  const { isLoggedIn, userInfo, refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const horizontalScrollRefs = {
    tips: useRef(null),
    history: useRef(null),
    focus: useRef(null)
  };

  useEffect(() => {
    if (isLoggedIn && userInfo && !userInfo.nickname) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        refreshUserInfo();
      }
    }
  }, [isLoggedIn, userInfo, refreshUserInfo]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [todayFocus, setTodayFocus] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [dailyTips, setDailyTips] = useState([]);
  const [historyTodayEvents, setHistoryTodayEvents] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [productSummary, setProductSummary] = useState(null);
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [originalRecommendations, setOriginalRecommendations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('全部');

  const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
  const weekday = `星期${['日', '一', '二', '三', '四', '五', '六'][currentDate.getDay()]}`;
  const lunarDateInfo = getLunarDate(currentDate);
  const greeting = getGreeting();

  const fetchDailyPageData = useCallback(async () => {
    // Mock data for "Daily" tab
    setWeatherInfo({
      city: "北京",
      temperature: "26",
      condition: "晴朗",
      icon: "sun", // FontAwesome icon name
      airQuality: "优",
    });
    
    // 设置多个今日焦点
    setTodayFocus([
      {
        id: 1,
        title: "冥想的治愈力量",
        content: "探索冥想如何帮助你减轻压力，提高专注力，改善睡眠质量。每天只需10分钟，就能感受内心的平静。",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 2,
        title: "健康饮食新趋势",
        content: "了解2023年最新的健康饮食趋势，从植物性饮食到间歇性断食，找到适合你的健康生活方式。",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 3,
        title: "数字极简主义",
        content: "在信息过载的时代，学习如何减少数字干扰，提高专注力和生产力，重新掌控你的时间和注意力。",
        image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      }
    ]);
    
    setDailyQuote({
      text: "生活不是等待风暴过去，而是学会在雨中跳舞。",
      author: "薇薇安·格林",
    });
    
    setDailyTips([
      { id: 1, text: "喝够8杯水", completed: false, icon: "tint" },
      { id: 2, text: "阅读30分钟", completed: true, icon: "book-reader" },
      { id: 3, text: "完成今日运动目标", completed: false, icon: "running" },
      { id: 4, text: "记录一件感恩的事", completed: false, icon: "heart" },
      { id: 5, text: "整理工作空间", completed: false, icon: "briefcase" },
      { id: 6, text: "与朋友联系", completed: false, icon: "phone" },
    ]);
    
    setHistoryTodayEvents([
      { year: 1969, title: "阿波罗11号成功登月" },
      { year: 2008, title: "北京奥运会开幕" },
      { year: 1955, title: "爱因斯坦-罗素宣言发表" },
      { year: 1997, title: "香港回归中国" },
      { year: 1945, title: "联合国成立" },
    ]);
    
    setAiSuggestion({
      title: "AI助手建议",
      content: "根据您最近的兴趣，我推荐您可以了解「数字极简主义」，这是一种帮助人们减少数字干扰、提高专注力的生活理念。",
      icon: "lightbulb"
    });
    
    // 添加AI商品总结
    setProductSummary({
      title: "今日商品推荐分析",
      content: "根据您的浏览历史，我们发现您对科技产品和健康用品特别感兴趣。今日推荐中包含了多款高性价比智能手表和健康监测设备，适合您的需求。"
    });
  }, []);
  
  useEffect(() => {
    const fetchProductRecommendations = async () => {
      setLoading(true);
      try {
        const recommendationsRes = await instance.get(`/product?page=${page}&size=${size}`);
        if (recommendationsRes.data && recommendationsRes.data.code === 200) {
          const recData = recommendationsRes.data.data || {};
          const newContent = recData.content || [];
          if (page === 0) {
            setRecommendations(newContent);
            setOriginalRecommendations(newContent);
          } else {
            setRecommendations(prev => [...prev, ...newContent]);
            setOriginalRecommendations(prev => [...prev, ...newContent]);
          }
          setTotalPages(recData.totalPages || 0);
        } else {
          if (page === 0) {
            setRecommendations([]);
            setOriginalRecommendations([]);
          }
        }
      } catch (error) {
        setError("商品推荐加载失败");
        console.error("Product recommendations loading error:", error);
      } finally {
        setLoading(false);
        setLoadMoreLoading(false);
      }
    };

    fetchDailyPageData();
    fetchProductRecommendations();

    if (isLoggedIn) {
      const fetchCartData = async () => {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const cartRes = await instance.get(`/cart/${userId}/count`);
            setCartItemCount(cartRes.data);
          }
        } catch (error) {
          console.error("获取购物车数量失败:", error);
        }
      };
      fetchCartData();
    } else {
      setCartItemCount(0);
    }
  }, [isLoggedIn, page, size, fetchDailyPageData]);

  const handleRefreshRecommendations = async () => {
    try {
      setPage(0); // Reset page for refresh
      const response = await instance.get(`/product/random`);
      if (response.data && response.data.length > 0) {
        setRecommendations(response.data);
        setOriginalRecommendations(response.data);
      }
    } catch (error) {
      console.error("Error fetching random recommendations:", error);
    }
  };
  
  const handleLoadMore = () => {
    if (page < totalPages - 1 && !loadMoreLoading) {
      setLoadMoreLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleTipToggle = (id) => {
    setDailyTips(tips => 
      tips.map(tip => tip.id === id ? { ...tip, completed: !tip.completed } : tip)
    );
  };

  const handleAiChatToggle = () => {
    setShowAiChat(prev => !prev);
    if (!showAiChat && aiChatHistory.length === 0) {
      // 添加默认欢迎消息
      setAiChatHistory([
        { type: 'ai', message: '你好！我是你的AI助手，有什么我可以帮助你的吗？' }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // 添加用户消息到聊天历史
    setAiChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setUserMessage('');
    
    // 模拟AI响应
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "我理解你的问题，让我来帮助你解决。",
        "这是个很好的问题！根据我的分析...",
        "我找到了一些相关信息，希望对你有帮助。",
        "我建议你可以尝试这个方法...",
        "很高兴能帮到你！还有其他问题吗？"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiChatHistory(prev => [...prev, { type: 'ai', message: randomResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // 这里可以添加基于类别的筛选逻辑
  };

  const categories = ['全部', '生活', '科技', '健康', '学习', '娱乐'];

  // 水平滚动处理函数
  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200; // 滚动量
      if (direction === 'left') {
        ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="daily-page-container">
      <div className="daily-header-section">
        <div className="greeting-date-weather">
          <div className="greeting-date">
            <h2>{greeting}好, {userInfo?.nickname || '朋友'}!</h2>
            <p className="date-gregorian">{formattedDate} {weekday}</p>
            <p className="date-lunar">{lunarDateInfo.year} {lunarDateInfo.month}{lunarDateInfo.day}</p>
          </div>
          {weatherInfo && (
            <div className="weather-summary">
              <i className={`weather-icon fas fa-${weatherInfo.icon}`}></i>
              <div className="weather-details">
                <span className="temperature">{weatherInfo.temperature}°C</span>
                <span className="condition">{weatherInfo.condition}</span>
                <span className="city-aqi">{weatherInfo.city} · AQI {weatherInfo.airQuality}</span>
              </div>
            </div>
          )}
        </div>
         {/* Profile and Cart Icons */}
        <div className="user-actions">
          <Link to="/cart" className="action-icon cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="action-icon profile-icon">
              <img
                src={userInfo?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"}
                alt="用户头像"
              />
            </Link>
          ) : (
            <button onClick={() => navigate('/login')} className="login-button-daily">
              登录
            </button>
          )}
        </div>
      </div>


      <div className="daily-scrollable-content" ref={scrollRef}>
        <div className="horizontal-scroll-section">
          <div className="horizontal-scroll-header">
            <h3><i className="fas fa-star"></i> 今日焦点</h3>
            <span className="see-all-link">查看全部</span>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.focus}>
            {todayFocus.map(focus => (
              <div key={focus.id} className="daily-card today-focus-card" style={{minWidth: '280px', width: '280px'}}>
                <div className="focus-image-container">
                  <img src={focus.image} alt={focus.title} className="focus-image"/>
                  <div className="focus-overlay">
                    <span className="focus-tag">今日焦点</span>
                  </div>
                </div>
                <h3>{focus.title}</h3>
                <p>{focus.content}</p>
                <button className="card-button">
                  查看详情
                  <i className="fas fa-arrow-right button-icon"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* {productSummary && (
          <div className="ai-product-summary">
            <div className="ai-product-summary-header">
              <i className="fas fa-robot"></i>
              <h3>{productSummary.title}</h3>
            </div>
            <p>{productSummary.content}</p>
          </div>
        )} */}
        
        {/* 引入AiChatInterface */}
        <AiChatInterface />

        {dailyTips.length > 0 && (
          <div className="horizontal-scroll-section">
            <div className="horizontal-scroll-header">
              <h3><i className="fas fa-tasks"></i> 今日小贴士</h3>
              <div className="completion-status">
                {dailyTips.filter(tip => tip.completed).length}/{dailyTips.length}
              </div>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{width: `${(dailyTips.filter(tip => tip.completed).length / dailyTips.length) * 100}%`}}
              ></div>
            </div>
            <div className="horizontal-scroll-container" ref={horizontalScrollRefs.tips}>
              {dailyTips.map(tip => (
                <div 
                  key={tip.id} 
                  className={`daily-tips-item ${tip.completed ? 'completed' : ''}`}
                  onClick={() => handleTipToggle(tip.id)}
                >
                  <i className={`fas fa-${tip.icon} tip-icon`}></i>
                  <span>{tip.text}</span>
                  <i className={`fas ${tip.completed ? 'fa-check-square' : 'fa-square'} checkbox-icon`}></i>
                </div>
              ))}
            </div>
          </div>
        )}

        {historyTodayEvents.length > 0 && (
          <div className="horizontal-scroll-section">
            <div className="horizontal-scroll-header">
              <h3><i className="fas fa-history"></i> 历史上的今天</h3>
              <span className="see-all-link">更多历史</span>
            </div>
            <div className="horizontal-scroll-container" ref={horizontalScrollRefs.history}>
              {historyTodayEvents.map((event, index) => (
                <div key={index} className="history-event-card">
                  <span className="history-year">{event.year}</span>
                  <p className="history-title">{event.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="daily-recommendations-section">
          <div className="recommendations-header">
            <h3><i className="fas fa-crown"></i> 今日推荐</h3>
            <button onClick={handleRefreshRecommendations} className="refresh-button">
              换一换 <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          {loading && page === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>加载推荐中...</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : recommendations.length === 0 ? (
            <div className="no-recommendations">
              <p>暂时没有推荐内容</p>
            </div>
          ) : (
            <>
              <div className="recommendations-grid">
                {recommendations.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                    <div className="product-card">
                      <div className="product-image-container">
                        <img src={product.imageUrl} alt={product.title} className="product-image" />
                        {product.discount && <span className="discount-tag">-{product.discount}%</span>}
                      </div>
                      <div className="product-info">
                        <h4>{product.title}</h4>
                        <div className="product-details">
                          <span className="price">¥{product.price}</span>
                          <span className="sold-count">已售{product.soldCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {page < totalPages - 1 && (
                <div className="load-more-container">
                  <button onClick={handleLoadMore} disabled={loadMoreLoading} className="load-more-button">
                    {loadMoreLoading ? (
                      <>
                        <span className="spinner"></span> 加载中...
                      </>
                    ) : '加载更多'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className={`ai-chat-modal ${showAiChat ? 'show' : ''}`}>
        <div className="ai-chat-header">
          <h3>AI智能助手</h3>
          <button className="close-button" onClick={handleAiChatToggle}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="ai-chat-messages">
          {aiChatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.type}-message`}>
              {chat.type === 'ai' && <div className="ai-avatar"><i className="fas fa-robot"></i></div>}
              <div className="message-content">{chat.message}</div>
              {chat.type === 'user' && <div className="user-avatar">{userInfo?.nickname?.charAt(0) || '我'}</div>}
            </div>
          ))}
          {isTyping && (
            <div className="chat-message ai-message">
              <div className="ai-avatar"><i className="fas fa-robot"></i></div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <div className="ai-chat-input">
          <input 
            type="text" 
            placeholder="输入你的问题..." 
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} disabled={!userMessage.trim()}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discover;