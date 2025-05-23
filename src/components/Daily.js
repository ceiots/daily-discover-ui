import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Daily.css";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
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

const Daily = () => {
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
  const [aiTopics, setAiTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hotArticles, setHotArticles] = useState([]);

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
    
    // 设置热门文章数据
    setHotArticles([
      {
        id: 1,
        title: "AI如何重塑我们的日常生活？从智能家居到个人助手",
        image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 2456,
        publishTime: "3小时前",
        tag: "科技"
      },
      {
        id: 2,
        title: "数字极简主义：如何在信息爆炸时代保持专注",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 1872,
        publishTime: "5小时前",
        tag: "生活"
      },
      {
        id: 3,
        title: "每天10分钟冥想，一个月后身心的惊人变化",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 1543,
        publishTime: "8小时前",
        tag: "健康"
      },
      {
        id: 4,
        title: "2023年最值得关注的五款智能家居设备",
        image: "https://images.unsplash.com/photo-1558002038-1055e2dae2d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 1298,
        publishTime: "12小时前",
        tag: "科技"
      }
    ]);
    
    // 添加热门话题数据
    setAiTopics([
      { id: 1, text: "数字极简主义", icon: "mobile-alt" },
      { id: 2, text: "每日冥想技巧", icon: "brain" },
      { id: 3, text: "健康饮食新趋势", icon: "apple-alt" },
      { id: 4, text: "高效工作法", icon: "briefcase" },
      { id: 5, text: "睡眠质量提升", icon: "moon" },
      { id: 6, text: "减压放松方法", icon: "spa" },
      { id: 7, text: "居家健身计划", icon: "dumbbell" },
    ]);
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
    
    // 保存当前用户消息
    const currentMessage = userMessage;
    
    // 清空输入框
    setUserMessage('');
    
    // 模拟AI响应
    setIsTyping(true);
    
    // 根据关键词生成更智能的回复
    setTimeout(() => {
      let aiResponse;
      
      // 检查是否为热门话题，提供更个性化的回答
      if (currentMessage.includes("数字极简主义")) {
        aiResponse = "数字极简主义是一种减少数字干扰的生活方式，研究表明它能提高专注力40%，每天节省约1.5小时的时间。要开始实践，可以从设置手机免打扰、整理应用和限制社交媒体使用时间开始。";
      } else if (currentMessage.includes("冥想")) {
        aiResponse = "每天进行10-15分钟的冥想可以显著降低压力水平，提高注意力，改善睡眠质量。我可以推荐一些适合初学者的冥想技巧和应用，你想了解哪方面的信息？";
      } else if (currentMessage.includes("健康饮食") || currentMessage.includes("饮食")) {
        aiResponse = "植物性饮食是2023年的主要趋势之一，研究表明它可以减少30%的慢性疾病风险。均衡的饮食结构应包括多样化的蔬果、全谷物、优质蛋白和健康脂肪，每天喝足够的水也很重要。";
      } else if (currentMessage.includes("高效工作") || currentMessage.includes("效率")) {
        aiResponse = "高效工作的关键包括：番茄工作法（25分钟专注工作+5分钟休息）、批处理类似任务、减少多任务处理、设定明确目标和优先级，以及创建无干扰的工作环境。";
      } else if (currentMessage.includes("睡眠") || currentMessage.includes("失眠")) {
        aiResponse = "提升睡眠质量的技巧：坚持规律的睡眠时间表、睡前1小时避免电子屏幕、创建舒适的睡眠环境（温度18-20℃、黑暗、安静）、睡前放松活动如阅读或冥想，以及白天适度运动。";
      } else if (currentMessage.includes("减压") || currentMessage.includes("压力") || currentMessage.includes("放松")) {
        aiResponse = "有效的减压方法包括：深呼吸练习（4秒吸气-7秒屏息-8秒呼气）、规律运动、与朋友交流、适当休息、大自然疗愈和限制咖啡因摄入。持续的高压可能导致多种健康问题，建议及时寻求专业帮助。";
      } else if (currentMessage.includes("健身") || currentMessage.includes("运动")) {
        aiResponse = "居家健身不需要复杂器材，高效的计划应包括：每周3-5次锻炼、结合有氧和力量训练、专注大肌群复合动作（如深蹲、俯卧撑）、合理休息和充分水分摄入。科学表明每周150分钟中等强度运动可显著改善健康。";
      } else {
        // 随机通用回复
        const responses = [
          "这是个很好的问题！根据最新研究，" + currentMessage + "相关的领域有很多新发现。您想了解哪方面的具体内容？",
          "关于" + currentMessage + "，有几个关键点值得注意：首先，它与我们的日常习惯密切相关；其次，小的改变可以带来显著效果；最后，坚持是最重要的。您需要更详细的建议吗？",
          "我找到了一些关于" + currentMessage + "的实用信息。研究表明，70%的人通过调整日常习惯获得了明显改善。您想了解如何开始吗？",
          "关于" + currentMessage + "，专家建议从小目标开始，逐步建立长期习惯。这种方法的成功率提高了约60%。我可以提供一个简单的入门计划。",
          "很高兴您对" + currentMessage + "感兴趣！这是近期热门话题，对提升生活质量有显著帮助。您是想了解理论知识还是实践方法？"
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      // 添加AI回复到聊天历史
      setAiChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
      setIsTyping(false);
    }, 1000);
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

  // 渲染今日焦点卡片
  const renderFocusCard = (focus) => {
    // 生成AI摘要，如果没有提供则从内容中提取
    const aiSummary = focus.aiInsight || generateAiSummary(focus.content);
    
    // 随机选择AI标签类型
    const aiTagType = Math.random() > 0.5 ? "AI精选" : "AI推荐";
    
    // 确保使用unsplash图片
    const imageUrl = focus.image.includes('unsplash.com') 
      ? focus.image 
      : `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000}-${Math.random().toString(36).substring(2, 8)}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`;
    
    return (
      <div key={focus.id} className="daily-card today-focus-card">
        <div className="focus-image-container">
          <img src={imageUrl} alt={focus.title} className="focus-image"/>
          <div className="focus-overlay">
            <span className="focus-ai-tag">
              <i className="fas fa-robot"></i> {aiTagType}
            </span>
          </div>
        </div>
        <div className="focus-content">
          <h3>{focus.title}</h3>
          <div className="ai-insight-badge">
            <i className="fas fa-lightbulb"></i> AI洞察
          </div>
          <p className="focus-ai-summary">{aiSummary}</p>
          <button className="card-button">
            {focus.interactionPrompt || "查看详情"} <i className="fas fa-arrow-right button-icon"></i>
          </button>
        </div>
      </div>
    );
  };

  // 生成AI摘要
  const generateAiSummary = (content) => {
    const summaries = [
      "研究表明，每天10分钟冥想可降低40%压力，提升25%专注力",
      "植物性饮食可减少30%慢性疾病风险，增强免疫系统功能",
      "数字极简主义帮助用户每天节省1.5小时，减少42%分心次数",
      "每日阅读30分钟可提升认知能力，延缓大脑衰老达32%",
      "适度运动能提高工作效率35%，改善睡眠质量达40%"
    ];
    
    // 根据内容关键词选择相关摘要
    if (content.includes("冥想") || content.includes("压力")) {
      return summaries[0];
    } else if (content.includes("饮食") || content.includes("健康")) {
      return summaries[1];
    } else if (content.includes("数字") || content.includes("极简")) {
      return summaries[2];
    } else if (content.includes("阅读") || content.includes("书")) {
      return summaries[3];
    } else if (content.includes("运动") || content.includes("健身")) {
      return summaries[4];
    }
    
    // 默认返回随机摘要
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  // 渲染历史上的今天卡片
  const renderHistoryCard = (event) => {
    // 生成AI解析，如果没有提供则随机生成
    const aiInsight = event.aiInsight || generateHistoryInsight(event.title);
    
    return (
      <div key={event.year} className="history-event-card">
        <div className="history-year">{event.year}年</div>
        <div className="history-title">{event.title}</div>
        <div className="ai-history-insight">
          <i className="fas fa-brain"></i> AI解析
        </div>
        <div className="history-ai-analysis">{aiInsight}</div>
      </div>
    );
  };

  // 生成历史事件AI解析
  const generateHistoryInsight = (eventTitle) => {
    const insights = [
      "改变了世界科技格局",
      "影响至今的历史转折点",
      "开创了新的时代篇章",
      "人类文明的重要里程碑",
      "塑造了现代社会结构"
    ];
    
    // 根据事件标题选择相关解析
    if (eventTitle.includes("登月")) {
      return "太空探索的里程碑事件";
    } else if (eventTitle.includes("奥运")) {
      return "体育外交的典范案例";
    } else if (eventTitle.includes("宣言")) {
      return "影响深远的思想转折点";
    } else if (eventTitle.includes("回归")) {
      return "民族复兴的重要节点";
    } else if (eventTitle.includes("联合国")) {
      return "全球治理体系的基石";
    }
    
    // 默认返回随机解析
    return insights[Math.floor(Math.random() * insights.length)];
  };

  // 渲染推荐产品卡片
  const renderProductCard = (product) => {
    // 生成85%-98%的随机匹配度
    const matchScore = Math.floor(85 + Math.random() * 14);
    
    // 生成个性化推荐理由
    const aiReason = generatePersonalizedReason(product);
    
    // 确保使用unsplash图片
    const imageUrl = product.imageUrl && product.imageUrl.includes('unsplash.com') 
      ? product.imageUrl 
      : `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000}-${Math.random().toString(36).substring(2, 8)}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`;
    
    return (
      <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
        <div className="product-card">
          <div className="product-image-container">
            <img src={imageUrl} alt={product.title} className="product-image"/>
            {product.discount && (
              <div className="discount-tag">-{product.discount}%</div>
            )}
            <div className="ai-match-tag">
              <i className="fas fa-robot"></i> 匹配度{matchScore}%
            </div>
          </div>
          <div className="product-info">
            <h4>{product.title}</h4>
            <div className="ai-reason-tag">
              <i className="fas fa-magic"></i> {aiReason}
            </div>
            <div className="product-details">
              <div className="price">¥{product.price}</div>
              <div className="sold-count">已售{product.soldCount}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // 生成个性化推荐理由
  const generatePersonalizedReason = (product) => {
    const reasons = [
      "基于您的浏览历史推荐",
      "与您的兴趣高度匹配",
      "90%相似用户都喜欢",
      "符合您的购物偏好",
      "为您的需求量身定制",
      "近期热门，好评如潮"
    ];
    
    // 根据产品类型或价格选择更相关的理由
    if (product.price > 500) {
      return "高品质选择，值得投资";
    } else if (product.soldCount > 1000) {
      return "热销产品，用户好评如潮";
    }
    
    // 默认返回随机理由
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  // 处理话题点击 - 优化功能实现一键代入热门词
  const handleTopicClick = (topic) => {
    // 设置搜索词
    setSearchQuery(topic.text);
    
    // 直接设置到AI聊天输入框
    setUserMessage(topic.text);
    
    // 如果聊天框没有打开，则自动打开
    if (!showAiChat) {
      handleAiChatToggle();
    }
    
    // 可选：添加动画效果提示用户已选择
    const topicElements = document.querySelectorAll('.ai-topic-bubble');
    topicElements.forEach(el => {
      if (el.textContent.includes(topic.text)) {
        el.classList.add('topic-selected');
        setTimeout(() => {
          el.classList.remove('topic-selected');
        }, 500);
      }
    });
  };

  // 渲染热门文章卡片
  const renderHotArticleCard = (article) => {
    // 确保使用unsplash图片
    const imageUrl = article.image.includes('unsplash.com') 
      ? article.image 
      : `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000}-${Math.random().toString(36).substring(2, 8)}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`;
    
    return (
      <div key={article.id} className="hot-article-card">
        <div className="article-image-container">
          <img src={imageUrl} alt={article.title} className="article-image" />
          <div className="article-tag">{article.tag}</div>
        </div>
        <div className="article-content">
          <h4 className="article-title">{article.title}</h4>
          <div className="article-meta">
            <span className="article-time">{article.publishTime}</span>
            <span className="article-views">
              <i className="fas fa-eye"></i> {article.views}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="daily-page-container">
      <div className="daily-header-compact">
        <div className="header-top-row">
          <div className="greeting-compact">
            <h2>{greeting}好, {userInfo?.nickname || '朋友'}!</h2>
            <p className="date-compact">{formattedDate} {weekday} · {lunarDateInfo.month}{lunarDateInfo.day}</p>
          </div>
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
        
        <div className="weather-ai-row">
          {weatherInfo && (
            <div className="weather-compact">
              <i className={`weather-icon fas fa-${weatherInfo.icon}`}></i>
              <span>{weatherInfo.temperature}°C</span>
              <span className="weather-condition">{weatherInfo.condition}</span>
              <span className="weather-city">{weatherInfo.city}</span>
            </div>
          )}
          
          {aiSuggestion && (
            <div className="ai-suggestion-compact" onClick={handleAiChatToggle}>
              <i className="fas fa-lightbulb"></i>
              <span>{aiSuggestion.content.substring(0, 30)}...</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        </div>
        
        {/* AI推荐搜索词/热门话题 */}
        <div className="ai-topics-container">
          <div className="ai-topics-label">
            <i className="fas fa-fire"></i> 热门话题
          </div>
          <div className="ai-topics-scroll">
            {aiTopics.map(topic => (
              <div 
                key={topic.id} 
                className="ai-topic-bubble"
                onClick={() => handleTopicClick(topic)}
              >
                <i className={`fas fa-${topic.icon}`}></i>
                <span>{topic.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="daily-scrollable-content" ref={scrollRef}>

        {/* AI助手建议卡片 */}
        {aiSuggestion && (
          <div className="ai-suggestion-card">
            <div className="ai-suggestion-header">
              <i className={`fas fa-${aiSuggestion.icon || 'lightbulb'}`}></i>
              <h3>{aiSuggestion.title}</h3>
            </div>
            <p className="ai-suggestion-content">{aiSuggestion.content}</p>
            <button className="ai-chat-button" onClick={handleAiChatToggle}>
              开始对话 <i className="fas fa-comment"></i>
            </button>
          </div>
        )}
        
        {/* 今日焦点板块 */}
        <div className="horizontal-scroll-section">
          <div className="horizontal-scroll-header">
            <h3><i className="fas fa-star"></i> 今日焦点</h3>
            <span className="see-all-link">查看全部 <i className="fas fa-chevron-right"></i></span>
          </div>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.focus}>
            {todayFocus.map(focus => renderFocusCard(focus))}
          </div>
          <div className="scroll-navigation">
            <button className="scroll-nav-btn left" onClick={() => scrollHorizontally(horizontalScrollRefs.focus, 'left')}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="scroll-nav-btn right" onClick={() => scrollHorizontally(horizontalScrollRefs.focus, 'right')}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="section-footer">
            <button className="view-more-btn">
              发现更多焦点内容 <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* 历史上的今天板块 */}
        <div className="horizontal-scroll-section">
          <div className="horizontal-scroll-header">
            <h3><i className="fas fa-history"></i> 历史上的今天</h3>
          <div className="horizontal-scroll-container" ref={horizontalScrollRefs.history}>
            {historyTodayEvents.map(event => renderHistoryCard(event))}
          </div>
          <div className="scroll-navigation">
            <button className="scroll-nav-btn left" onClick={() => scrollHorizontally(horizontalScrollRefs.history, 'left')}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="scroll-nav-btn right" onClick={() => scrollHorizontally(horizontalScrollRefs.history, 'right')}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="section-footer">
            <button className="view-more-btn">
              探索更多历史事件 <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        
        
        
        {/* 今日推荐部分 */}
        <div className="daily-recommendations-section">
          <div className="recommendations-header">
            <h3><i className="fas fa-thumbs-up"></i> 今日推荐</h3>
            <div className="ai-recommendation-badge">
              <i className="fas fa-robot"></i> AI精选
            </div>
            <button className="refresh-button" onClick={handleRefreshRecommendations}>
              <i className="fas fa-sync-alt"></i> 换一批
            </button>
          </div>
          
          {/* 商品总结 */}
          {productSummary && (
            <div className="ai-product-summary">
              <i className="fas fa-chart-line"></i>
              <p>{productSummary.content}</p>
            </div>
          )}
          
          {/* 商品推荐网格 */}
          {loading && page === 0 ? (
            <div className="recommendations-grid">
              {Array(4).fill().map((_, index) => (
                <div key={index} className="product-card skeleton">
                  <div className="product-image-container skeleton"></div>
                  <div className="product-info">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : recommendations.length === 0 ? (
            <div className="no-recommendations">
              <p>暂时没有推荐内容</p>
            </div>
          ) : (
            <div className="recommendations-grid">
              {recommendations.map(product => renderProductCard(product))}
            </div>
          )}
          
          {/* 加载更多按钮 */}
          {!loading && page < totalPages - 1 && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={handleLoadMore} disabled={loadMoreLoading}>
                {loadMoreLoading ? (
                  <><span className="spinner"></span> 加载中...</>
                ) : (
                  <>查看更多推荐 <i className="fas fa-chevron-down"></i></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 在页面底部添加今日热文模块 */}
      <div className="hot-articles-section">
        <div className="section-header">
          <h3><i className="fas fa-fire"></i> 今日热文</h3>
          <Link to="/articles" className="see-all-link">查看更多 <i className="fas fa-chevron-right"></i></Link>
        </div>
        <div className="hot-articles-grid">
          {hotArticles.map(article => renderHotArticleCard(article))}
        </div>
      </div>

      {/* AI聊天界面 */}
      {showAiChat && (
        <div className="ai-chat-overlay">
          <div className="ai-chat-container">
            <div className="ai-chat-header">
              <h3>AI助手</h3>
              <button className="close-chat-btn" onClick={handleAiChatToggle}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="ai-chat-messages">
              {aiChatHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type}`}>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message ai">
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
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="输入您的问题..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} disabled={!userMessage.trim()}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  </div>
);
};

export default Daily;
