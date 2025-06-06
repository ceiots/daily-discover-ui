import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Daily.css";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import AiAssistant from "./ai/AiAssistant"; // 引入AI助手组件
import Recommendations from "./recommendation/Recommendations"; // Import the new Recommendations component
import { BasePage } from "../theme";
// Helper function to get Lunar Date (simplified)
const getLunarDate = (date) => {
  // In a real app, use a library for accurate lunar date conversion
  const lunarMonths = [
    "正月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "冬月",
    "腊月",
  ];
  const lunarDays = [
    "初一",
    "初二",
    "初三",
    "初四",
    "初五",
    "初六",
    "初七",
    "初八",
    "初九",
    "初十",
    "十一",
    "十二",
    "十三",
    "十四",
    "十五",
    "十六",
    "十七",
    "十八",
    "十九",
    "二十",
    "廿一",
    "廿二",
    "廿三",
    "廿四",
    "廿五",
    "廿六",
    "廿七",
    "廿八",
    "廿九",
    "三十",
  ];
  const animals = [
    "鼠",
    "牛",
    "虎",
    "兔",
    "龙",
    "蛇",
    "马",
    "羊",
    "猴",
    "鸡",
    "狗",
    "猪",
  ];
  // Simplified for example
  return {
    year: `甲辰[${animals[date.getFullYear() % 12]}]`, // Example, not accurate
    month: lunarMonths[date.getMonth()], // Example
    day: lunarDays[date.getDate() - 1], // Example
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

const Daily = () => {
  const { isLoggedIn, userInfo, refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const horizontalScrollRefs = {
    tips: useRef(null),
    history: useRef(null),
    focus: useRef(null),
  };

  useEffect(() => {
    if (isLoggedIn && userInfo && !userInfo.nickname) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        refreshUserInfo();
      }
    }
  }, [isLoggedIn, userInfo, refreshUserInfo]);

  const [currentDate, setCurrentDate] = useState(new Date());
  

  // 添加焦点活动索引状态
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  const focusScrollRef = useRef(null);

  // 1. 添加状态
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = `${currentDate.getFullYear()}年${
    currentDate.getMonth() + 1
  }月${currentDate.getDate()}日`;
  const weekday = `星期${
    ["日", "一", "二", "三", "四", "五", "六"][currentDate.getDay()]
  }`;
  const lunarDateInfo = getLunarDate(currentDate);
  const greeting = getGreeting();

  // 2. 在 useEffect 中检查是否需要冷启动
  useEffect(() => {
    const checkNeedColdStart = async () => {
      if (isLoggedIn && userInfo?.id) {
        try {
          // 检查用户是否需要冷启动
          const response = await instance.get(`/tags/${userInfo.id}/need-cold-start`);
          if (response.data?.data === true) {
            // 需要冷启动，获取热门标签
            fetchPopularTags();
            setShowInterestModal(true);
          }
        } catch (error) {
          console.error("检查冷启动状态失败:", error);
        }
      }
    };
    
    checkNeedColdStart();
  }, [isLoggedIn, userInfo]);

  // 3. 获取热门标签
  const fetchPopularTags = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get('/tags/popular?limit=30');
      if (response.data?.code === 200) {
        setAvailableTags(response.data.data || []);
      }
    } catch (error) {
      console.error("获取热门标签失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 处理标签选择
  const handleTagSelect = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // 5. 保存用户兴趣
  const saveUserInterests = async () => {
    if (selectedTags.length === 0) {
      alert("请至少选择一个感兴趣的类别");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await instance.post('/user/interests', {
        userId: userInfo.id,
        tagIds: selectedTags
      });
      
      if (response.data?.code === 200) {
        setShowInterestModal(false);
        // 发布一个自定义事件，通知Recommendations组件刷新数据
        const refreshEvent = new CustomEvent('refreshRecommendations');
        window.dispatchEvent(refreshEvent);
      } else {
        alert(response.data?.message || "保存失败，请重试");
      }
    } catch (error) {
      console.error("保存用户兴趣失败:", error);
      alert("网络错误，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. 跳过冷启动
  const skipColdStart = async () => {
    try {
      await instance.post('/user/skip-cold-start', {
        userId: userInfo.id
      });
      setShowInterestModal(false);
    } catch (error) {
      console.error("跳过冷启动失败:", error);
    }
  };

  // 7. 渲染兴趣选择弹窗
  const renderInterestModal = () => {
    if (!showInterestModal) return null;
    
    return (
      <div className="interest-modal-overlay">
        <div className="interest-modal">
          <div className="interest-modal-header">
            <h3>选择您感兴趣的类别</h3>
            <button className="close-btn" onClick={() => setShowInterestModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="interest-modal-body">
            <p className="interest-modal-description">
              为了给您提供更精准的推荐，请选择您感兴趣的类别
            </p>
            
            {isLoading ? (
              <div className="loading-spinner">正在加载类别...</div>
            ) : (
              <div className="tag-selection-container">
                {availableTags.map(tag => (
                  <div 
                    key={tag.id}
                    className={`tag-item ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="interest-modal-footer">
            <button 
              className="skip-btn" 
              onClick={skipColdStart}
              disabled={isLoading}
            >
              跳过
            </button>
            <button 
              className="save-btn" 
              onClick={saveUserInterests}
              disabled={isLoading || selectedTags.length === 0}
            >
              保存偏好
            </button>
          </div>
        </div>
      </div>
    );
  };



  // 调整主页面渲染，使用AiAssistant组件替换原有的AI相关部分
  return (
    <BasePage
      showHeader={true}
      headerLeft={
        <div style={{ marginLeft: '30px', fontSize: '13px' }}>
            <h2>
              {greeting}好，{userInfo?.nickname || "未知用户"}！
            </h2>
            <p className="date-compact">
              {formattedDate} {weekday} · {lunarDateInfo.month}
              {lunarDateInfo.day}
            </p>
          </div>
      }
    >
      {renderInterestModal()}
      <div className="daily-page-container">
        {/* 使用AiAssistant组件替代原有的AI功能 */}
        <AiAssistant userInfo={userInfo} />
        <Recommendations /> 
      </div>
    </BasePage>
  );
};

export default Daily;
