import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EventDetail.css";

const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, currentDate } = location.state || {}; // 获取传递的事件数据和当前日期

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[480px] mx-auto">
        <header className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="text-white p-2 !rounded-button"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-white text-lg ml-3">历史的今天</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white p-2 !rounded-button">
              <i className="fas fa-bell"></i>
            </button>
            <button className="text-white p-2 !rounded-button">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </header>
        <main className="px-4 py-6 pb-16">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{currentDate}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                文化
              </span>
            </div>
            {event ? (
              <div>
                <h2 className="text-lg font-bold mb-4">{event.title}</h2>
                <p className="text-small mb-2">{event.description}</p>
                <img src={event.imageUrl} alt={event.title} />
              </div>
            ) : (
              <p className="text-red-500">未找到事件信息</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;