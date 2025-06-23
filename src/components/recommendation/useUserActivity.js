import { useState, useEffect } from "react";
import { useTheme } from "../../theme/useTheme";

/**
 * 用户活动跟踪钩子
 * 跟踪用户在推荐页面的活动，用于个性化推荐
 */
const useUserActivity = () => {
  const theme = useTheme();
  const [userActivity, setUserActivity] = useState({
    clicks: 0,
    views: {},
    categories: {},
    lastActive: Date.now()
  });

  // 记录点击
  const trackClick = (itemId, itemType, category) => {
    setUserActivity(prev => ({
      ...prev,
      clicks: prev.clicks + 1,
      categories: {
        ...prev.categories,
        [category]: (prev.categories[category] || 0) + 1
      },
      lastActive: Date.now()
    }));
  };

  // 记录浏览
  const trackView = (itemId, itemType, duration) => {
    setUserActivity(prev => ({
      ...prev,
      views: {
        ...prev.views,
        [itemId]: (prev.views[itemId] || 0) + duration
      },
      lastActive: Date.now()
    }));
  };

  // 获取活跃度分数
  const getActivityScore = () => {
    const timeSinceLastActive = (Date.now() - userActivity.lastActive) / 1000 / 60; // 分钟
    const baseScore = userActivity.clicks * 2 + Object.keys(userActivity.views).length;
    
    // 如果用户最近活跃，增加分数
    if (timeSinceLastActive < 30) {
      return baseScore * (1 + (30 - timeSinceLastActive) / 30);
    }
    
    return baseScore;
  };

  return {
    trackClick,
    trackView,
    getActivityScore,
    userActivity
  };
};

export default useUserActivity;