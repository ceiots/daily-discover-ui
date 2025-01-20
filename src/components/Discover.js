import React, { useEffect, useState } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Discover.css";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const { isLoggedIn, userAvatar } = useAuth();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const currentDate = new Date().toISOString().split("T")[0]; // 获取当前日期，格式为 YYYY-MM-DD

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取当前日期的事件
        const eventsResponse = await instance.get(
          `/events/date?date=${currentDate}`
        );
        const categoriesResponse = await instance.get(`/categories`);
        const recommendationsResponse = await instance.get(`/recommendations`);

        setEvents(eventsResponse.data);
        setCategories(categoriesResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);

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
    if (searchTerm.trim() === "") {
      // 如果搜索框为空，重新获取所有事件
      const eventsResponse = await instance.get(
        `/events/date?date=${currentDate}`
      );
      setEvents(eventsResponse.data);
      setRecommendations([]); // 清空推荐
    } else {
      // 根据关键字搜索事件
      const searchResponse = await instance.get(
        `/search/events?keyword=${searchTerm}`
      );
      setEvents(searchResponse.data);

      // 根据关键字搜索推荐
      const recommendationResponse = await instance.get(
        `/search/recommendations?keyword=${searchTerm}`
      );
      setRecommendations(recommendationResponse.data);
    }
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
            <i className="fas fa-bell text-white"></i>
            <div className="relative">
              <Link to="/cart" className="flex items-center">
                <i className="fas fa-shopping-cart text-white"></i>
                <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Link>
            </div>
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="w-8 h-8 rounded-full overflow-hidden"
            >
              {isLoggedIn ? (
                <img
                  src={userAvatar}
                  alt="用户头像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="nav-icon text-white">
                  <i className="fas fa-user-circle text-xl"></i>
                </div>
              )}
            </Link>
          </div>
        </div>
        <div className="search-bar mt-3 px-4 py-2 rounded-lg flex items-center">
          <i className="fas fa-search text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索"
            className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <i className="fas fa-qrcode text-gray-400"></i>
        </div>
      </nav>
      <div className="scrollable-content mt-28 px-4">
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {searchTerm ? `搜索结果: ${searchTerm}` : "历史的今天"}
            </h2>
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

        {searchTerm ? null : (
          <div className="flex items-center justify-between mb-3">
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
        )}

        <div className="masonry pb-20">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                onClick={() => handleRecommendationClick(recommendation.id)}
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
