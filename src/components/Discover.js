import React, { useEffect, useState } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Discover.css";
import axios from "axios";

const Discover = () => {
  const { isLoggedIn, userAvatar } = useAuth();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get("http://localhost:8081/daily-discover/events");
        const categoriesResponse = await axios.get("http://localhost:8081/daily-discover/categories");
        const recommendationsResponse = await axios.get("http://localhost:8081/daily-discover/recommendations");

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
  }, []);

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
            placeholder="搜索节日、事件、商品"
            className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm"
          />
          <i className="fas fa-qrcode text-gray-400"></i>
        </div>
      </nav>
      <div className="scrollable-content mt-28 px-4">
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">历史的今天</h2>
            <span className="text-sm text-gray-500">1 月 15 日</span>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                    <h3 className="text-sm font-medium my-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            )}
            <button className="w-full mt-4 text-sm text-primary flex items-center justify-center">
              <span>查看更多历史事件</span>
              <i className="fas fa-chevron-right text-xs ml-1"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 overflow-x-auto whitespace-nowrap mb-6">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="category-icon rounded-lg"
              />
              <span className="text-xs mt-1">{category.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <i className="fas fa-crown text-primary"></i>
            <h3 className="text-base font-medium">今日推荐</h3>
          </div>
          <button className="text-sm text-gray-500">
            换一换 <i className="fas fa-sync-alt ml-1"></i>
          </button>
        </div>

        <div className="masonry pb-20">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <Link to={`/recommendation/${recommendation.id}`} key={recommendation.id}>
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
                        <span className="text-xs ml-2">{recommendation.shopName}</span>
                      </div>
                      <h3 className="text-sm font-medium mb-1">
                        {recommendation.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-primary text-sm font-medium">¥ {recommendation.price}</div>
                        <div className="text-xs text-gray-400">已售 {recommendation.soldCount} </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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
