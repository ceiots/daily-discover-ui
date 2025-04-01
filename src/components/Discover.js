import React, { useEffect, useState } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Discover.css";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const { isLoggedIn, userInfo, refreshUserInfo } = useAuth();
  const navigate = useNavigate();

  // 组件加载时检查用户信息
  useEffect(() => {
    // 如果已登录但没有用户信息，尝试刷新用户信息
    if (isLoggedIn && userInfo && !userInfo.nickname) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        refreshUserInfo();
      }
    }
  }, [isLoggedIn, userInfo, refreshUserInfo]);

  // 将日期定义提升到组件顶部
  const currentDate = new Date().toISOString().split("T")[0];
  
  // 状态声明
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiContents, setAiContents] = useState([]); // 新增状态用于存储 AI 生成内容
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalRecommendations, setOriginalRecommendations] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0); // 购物车数量状态

  // 合并后的统一数据请求逻辑
  useEffect(() => {
    
    const fetchInitialData = async () => {
      try {
        const [eventsRes, categoriesRes, recommendationsRes] = await Promise.all([
          instance.get(`/events/date?date=${currentDate}`),
          instance.get('/categories'),
          instance.get('/recommendations')
        ]);

        setEvents(eventsRes.data);
        setCategories(categoriesRes.data);
        const recData = recommendationsRes.data;
        setRecommendations(recData);
        setOriginalRecommendations(recData);
      } catch (error) {
        setError("数据加载失败，请稍后重试");
        console.error("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

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

    // 合并执行逻辑
    fetchInitialData();
   
    // 只有在登录状态下才获取购物车数据
    if (isLoggedIn) {
      fetchCartData();
    } else {
      setCartItemCount(0);
    }
  }, [currentDate, isLoggedIn]); // 添加isLoggedIn作为依赖项

  // 点击事件处理函数
  const handleEventClick = (eventId) => {
    const event = events.find((e) => e.id === eventId); // 找到对应的事件
    navigate(`/event/${eventId}`, { state: { event, currentDate } }); // 传递事件数据和当前日期
  };

  const handleCategoryClick = async (categoryId) => {
    console.log("Clicked category ID:", categoryId);
    try {
      // 根据分类 ID 获取推荐内容
      const response = await instance.get(
        `/recommendations?categoryId=${categoryId}`
      );
      setRecommendations(response.data); // 更新推荐内容
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    // 不需要导航到分类页面，保持在当前页面
  };

  const handleRecommendationClick = (recommendationId) => {
    console.log("Clicked recommendation ID:", recommendationId);
    navigate(`/recommendation/${recommendationId}`);
  };

  const handleRefreshRecommendations = async () => {
    try {
      const response = await instance.get(`/recommendations/random`); // 假设后端有这个接口
      setRecommendations(response.data); // 更新推荐内容
    } catch (error) {
      console.error("Error fetching random recommendations:", error);
    }
  };

  const handleSearch = async () => {
    navigate('/search-results', { state: { searchTerm } }); // 跳转到搜索结果页面
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const filteredRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.title.includes(searchTerm) ||
      recommendation.shopName.includes(searchTerm)
  );

  return (
    <div className="discover-container bg-gray-50 ">
      <nav className="nav-bar fixed top-0 w-full px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-lg-title font-medium">每日发现</h1>
          <div className="flex items-center space-x-4">
            {/* <i className="fas fa-bell text-white"></i> */}
            <div className="relative">
              <Link to="/cart" className="flex items-center">
                <i className="fas fa-shopping-cart text-white"></i>
                {cartItemCount > 0 && (
                  <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
            {isLoggedIn && userInfo ? (
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden">
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
        <div className="search-bar mt-3 px-4 py-2 rounded-lg flex items-center">
          <i className="fas fa-search text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索节日、事件、商品"
            className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm no-outline"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // 按下回车键时触发搜索
              }
            }}
          />
          <i onClick={handleSearch} className="fas fa-qrcode text-gray-400 ml-2"></i>
        </div>
      </nav>
      <div className="scrollable-content mt-28 px-4">
        {events.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">历史的今天</h2>
              <span className="text-sm text-gray-500">{currentDate}</span>
            </div>
            <div className="space-y-4">
              {loading ? (
                <p>Loading events...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-4 pb-4 border-b border-gray-100"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                      <h3 className="text-sm font-medium my-2">{event.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {/* <button className="w-full mt-4 text-sm text-primary flex items-center justify-center">
                <span>查看更多历史事件</span>
                <i className="fas fa-chevron-right text-xs ml-1"></i>
              </button> */}
            </div>
          </div>
        )}

        {/* <div className="grid grid-cols-6 gap-4 overflow-x-auto whitespace-nowrap mb-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center"
              onClick={() => handleCategoryClick(category.id)}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="category-icon rounded-lg"
              />
              <span className="text-xs mt-1">{category.name}</span>
            </div>
          ))}
        </div> */}

          <div className="flex items-center justify-between mb-3 mt-5">
            <div className="flex items-center gap-2">
              <i className="fas fa-crown text-primary"></i>
              <h3 className="text-base font-medium">今日推荐</h3>
            </div>
            <button
              className="text-sm text-gray-500"
              onClick={handleRefreshRecommendations}
            >
              换一换 <i className="fas fa-sync-alt ml-1"></i>
            </button>
          </div>
        
        <div className="masonry pb-16">
          {originalRecommendations.length > 0 ? (
            originalRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                /* onClick={() => handleRecommendationClick(recommendation.id)} */
              >
                <Link to={`/recommendation/${recommendation.id}`}>
                  <div className="masonry-item">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={recommendation.imageUrl}
                        alt={recommendation.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-center mb-2">
                          <img
                            src={recommendation.shopAvatarUrl}
                            alt="店铺头像"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs ml-2">
                            {recommendation.shopName}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium mb-1">
                          {recommendation.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="text-primary text-sm font-medium">
                            ¥ {recommendation.price}
                          </div>
                          <div className="text-xs text-gray-400">
                            已售 {recommendation.soldCount}{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">没有推荐内容</p>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Discover;