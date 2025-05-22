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
  const [page, setPage] = useState(0); // 商品分页页码
  const [size, setSize] = useState(10); // 每页商品数量
  const [totalPages, setTotalPages] = useState(0); // 总页数
  const [loadMoreLoading, setLoadMoreLoading] = useState(false); // 加载更多状态

  // 合并后的统一数据请求逻辑
  useEffect(() => {
    console.log("Fetching data for isLoggedIn:", isLoggedIn);
    
    const fetchInitialData = async () => {
      try {
        // 使用分页参数获取商品数据
        const [eventsRes, categoriesRes, recommendationsRes] = await Promise.all([
          instance.get(`/events/date?date=${currentDate}`),
          instance.get('/categories'),
          instance.get(`/product?page=${page}&size=${size}`)
        ]);

        setEvents(eventsRes.data);
        setCategories(categoriesRes.data);
        
        // 处理带分页的商品数据
        if (recommendationsRes.data && recommendationsRes.data.code === 200) {
          const recData = recommendationsRes.data.data || {};
          console.log("recData:", recData);
          
          const newContent = recData.content || [];
          
          // 如果是第一页，直接设置数据
          if (page === 0) {
            setRecommendations(newContent);
            setOriginalRecommendations(newContent);
          } else {
            // 如果不是第一页，追加数据
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
        setError("数据加载失败，请稍后重试");
        console.error("Data loading error:", error);
      } finally {
        setLoading(false);
        setLoadMoreLoading(false);
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
  }, [currentDate, isLoggedIn, page, size]); // 添加page和size作为依赖项

  // 点击事件处理函数
  const handleEventClick = (eventId) => {
    const event = events.find((e) => e.id === eventId); // 找到对应的事件
    navigate(`/event/${eventId}`, { state: { event, currentDate } }); // 传递事件数据和当前日期
  };


  const handleRefreshRecommendations = async () => {
    try {
      // 先重置页码
      setPage(0);
      // 使用random API获取随机商品
      const response = await instance.get(`/product/random`);
      if (response.data && response.data.length > 0) {
        setRecommendations(response.data); // 更新推荐内容
        setOriginalRecommendations(response.data);
      } else {
        console.log("没有获取到随机商品");
      }
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

  // 加载更多商品
  const handleLoadMore = () => {
    if (page < totalPages - 1 && !loadMoreLoading) {
      setLoadMoreLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };
  
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
      <div className="scrollable-content mt-12 px-3">
        {events.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-4">
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
                        {event.plainDescription}
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

          <div className="flex items-center justify-between mb-2 mt-2">
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
          
          {/* 今日推荐列表 */}
          {(recommendations?.length === 0) ? (
            <div className="bg-white rounded-lg p-5 text-center">
              <p className="text-gray-500">没有推荐内容</p>
              {/* <button
                onClick={handleRefreshRecommendations}
                className="mt-3 bg-primary text-white px-4 py-1.5 rounded-full text-xs"
              >
                刷新推荐
              </button> */}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-0.1">
                {recommendations.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="text-sm line-clamp-2">{product.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-medium">¥{product.price}</span>
                          <span className="text-xs text-gray-500">已售{product.soldCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* 加载更多按钮 */}
              {page < totalPages - 1 && (
                <div className="flex justify-center mt-4 mb-20">
                  <button 
                    onClick={handleLoadMore} 
                    className="bg-primary text-white px-5 py-2 rounded-full text-sm flex items-center"
                    disabled={loadMoreLoading}
                  >
                    {loadMoreLoading ? (
                      <>
                        <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        加载中...
                      </>
                    ) : (
                      '加载更多'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

        
      </div>
    </div>
  );
};

export default Discover;