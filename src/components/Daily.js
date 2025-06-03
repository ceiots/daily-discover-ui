import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "./Daily.css";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import AiAssistant from "./AiAssistant"; // 引入AI助手组件
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
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [todayFocus, setTodayFocus] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [dailyTips, setDailyTips] = useState([]);
  const [historyTodayEvents, setHistoryTodayEvents] = useState([]);
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
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [hotArticles, setHotArticles] = useState([]);

  // 添加焦点活动索引状态
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  const [aiInsights, setAiInsights] = useState({});
  const focusScrollRef = useRef(null);

  const formattedDate = `${currentDate.getFullYear()}年${
    currentDate.getMonth() + 1
  }月${currentDate.getDate()}日`;
  const weekday = `星期${
    ["日", "一", "二", "三", "四", "五", "六"][currentDate.getDay()]
  }`;
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
        content:
          "探索冥想如何帮助你减轻压力，提高专注力，改善睡眠质量。每天只需10分钟，就能感受内心的平静。",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "meditation",
        relevance: "今日精选",
        aiInsight:
          "研究表明，每天10分钟冥想可降低40%压力，提升25%专注力，有助于促进深度睡眠。",
      },
      {
        id: 2,
        title: "健康饮食新趋势",
        content:
          "了解2023年最新的健康饮食趋势，从植物性饮食到间歇性断食，找到适合你的健康生活方式。",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "healthy-food",
        relevance: "今日热门",
        aiInsight:
          "植物性饮食可减少30%慢性疾病风险，增强免疫系统功能，有助于维持健康体重。",
      },
      {
        id: 3,
        title: "数字极简主义",
        content:
          "在信息过载的时代，学习如何减少数字干扰，提高专注力和生产力，重新掌控你的时间和注意力。",
        image:
          "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "digital-minimalism",
        relevance: "今日最佳",
        aiInsight:
          "数字极简主义帮助用户每天节省1.5小时，减少42%分心次数，提升工作效率达35%。",
      },
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

    // 添加AI商品总结
    setProductSummary({
      title: "今日商品推荐分析",
      content:
        "根据您的浏览历史，我们发现您对科技产品和健康用品特别感兴趣。今日推荐中包含了多款高性价比智能手表和健康监测设备，适合您的需求。",
    });

    // 设置热门文章数据
    setHotArticles([
      {
        id: 1,
        title: "AI如何重塑我们的日常生活？从智能家居到个人助手",
        image:
          "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 2456,
        publishTime: "3小时前",
        tag: "科技",
      },
      {
        id: 2,
        title: "数字极简主义：如何在信息爆炸时代保持专注",
        image:
          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 1872,
        publishTime: "5小时前",
        tag: "生活",
      },
      {
        id: 3,
        title: "每天10分钟冥想，一个月后身心的惊人变化",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 1543,
        publishTime: "8小时前",
        tag: "健康",
      },
      {
        id: 4,
        title: "2023年最值得关注的五款智能家居设备",
        image:
          "https://images.unsplash.com/photo-1558002038-1055e2dae2d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        views: 1298,
        publishTime: "12小时前",
        tag: "科技",
      },
    ]);

    // 设置AI洞察为每个推荐产品
    setAiInsights({
      product1:
        "基于您的搜索历史，这款产品比同类产品价格低15%，同时评分高出0.5分",
      product2: "根据您的浏览习惯，这款产品最适合您的使用场景，满足度预计达90%",
      product3: "本周热销榜首，库存仅剩不到10%，适合立即购买",
      product4: "与您最近购买的商品搭配使用，可提升整体使用体验达35%",
    });
  }, []);

  useEffect(() => {
    const fetchProductRecommendations = async () => {
      setLoading(true);
      try {
        const recommendationsRes = await instance.get(
          `/product?page=${page}&size=${size}`
        );
        if (recommendationsRes.data && recommendationsRes.data.code === 200) {
          const recData = recommendationsRes.data.data || {};
          const newContent = recData.content || [];
          console.log(newContent);
          if (page === 0) {
            setRecommendations(newContent);
            setOriginalRecommendations(newContent);
          } else {
            setRecommendations((prev) => [...prev, ...newContent]);
            setOriginalRecommendations((prev) => [...prev, ...newContent]);
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
          const userId = localStorage.getItem("userId");
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
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleTipToggle = (id) => {
    setDailyTips((tips) =>
      tips.map((tip) =>
        tip.id === id ? { ...tip, completed: !tip.completed } : tip
      )
    );
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // 这里可以添加基于类别的筛选逻辑
  };

  const categories = ["全部", "生活", "科技", "健康", "学习", "娱乐"];

  // 水平滚动处理函数
  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200; // 滚动量
      if (direction === "left") {
        ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // 添加滚动处理函数
  const handleFocusScroll = () => {
    if (focusScrollRef.current) {
      const scrollContainer = focusScrollRef.current;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      const scrollLeft = scrollContainer.scrollLeft;

      // 计算当前滚动位置对应的卡片索引
      const cardWidth = clientWidth * 0.9; // 90% 宽度的卡片
      const currentIndex = Math.round(scrollLeft / (cardWidth + 15)); // 15px 是卡片间隔

      if (currentIndex !== activeFocusIndex) {
        setActiveFocusIndex(currentIndex);
      }
    }
  };

  // 滑动到特定索引的卡片
  const scrollToFocusCard = (index) => {
    if (focusScrollRef.current) {
      const scrollContainer = focusScrollRef.current;
      const cardWidth = scrollContainer.clientWidth * 0.9; // 90% 宽度的卡片
      const scrollPosition = index * (cardWidth + 15); // 15px 是卡片间隔

      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // 优化图片加载错误处理函数
  const handleImageError = (event) => {
    const target = event.target;
    const category = target.dataset.category || target.alt || "nature";
    // 使用unsplash作为图片备选源
    const fallbackUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
      category
    )}`;

    // 添加错误标记类
    target.classList.add("image-error");

    // 设置新的图片源并防止循环触发error事件
    target.onerror = null;
    target.src = fallbackUrl;

    console.log(`图片加载失败，替换为: ${fallbackUrl}`);
  };

  // 添加头像图片加载错误处理
  const handleAvatarError = (event) => {
    const target = event.target;
    target.classList.add("load-error");
    target.style.display = "none";

    // 将父容器样式修改为显示默认用户图标
    const userIcon = target.closest(".user-icon");
    if (userIcon) {
      userIcon.classList.add("avatar-fallback");
      userIcon.innerHTML = '<i class="fas fa-user"></i>';
    }
  };

  // 修改今日焦点渲染函数，实现单卡片左右滑动
  const renderTodayFocus = () => {
    return (
      <div className="today-focus-section">
        <div className="section-header">
          <h3>
            <i className="fas fa-star"></i> 今日焦点
          </h3>
          <div className="scroll-controls">
            <button
              className="scroll-control-btn"
              onClick={() =>
                scrollToFocusCard(Math.max(0, activeFocusIndex - 1))
              }
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="scroll-control-btn"
              onClick={() =>
                scrollToFocusCard(
                  Math.min(todayFocus.length - 1, activeFocusIndex + 1)
                )
              }
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div
          className="focus-scroll"
          ref={focusScrollRef}
          onScroll={handleFocusScroll}
        >
          {todayFocus.map((item, index) => (
            <div key={item.id} className="focus-card">
              <div className="focus-card-image-container">
                <img
                  src={item.image}
                  alt={item.title}
                  data-category={item.category || "nature"}
                  className="focus-card-image"
                  onError={handleImageError}
                />
                {item.relevance && (
                  <div className="today-relevance">
                    <i className="fas fa-calendar-check"></i>
                    {item.relevance}
                  </div>
                )}
              </div>
              <div className="focus-card-content">
                <h4 className="focus-card-title">{item.title}</h4>
                <p className="focus-card-description">{item.content}</p>

                {item.aiInsight && (
                  <div className="ai-insight">
                    <div className="ai-insight-header">
                      <i className="fas fa-robot"></i>
                      <span>AI洞察</span>
                    </div>
                    <div className="ai-insight-text">{item.aiInsight}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 滑动指示器 */}
        <div className="focus-scroll-indicator">
          {todayFocus.map((_, index) => (
            <div
              key={index}
              className={`focus-scroll-dot ${
                index === activeFocusIndex ? "active" : ""
              }`}
              onClick={() => scrollToFocusCard(index)}
            ></div>
          ))}
        </div>
      </div>
    );
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
    // 提供更有深度和教育意义的历史解析
    if (eventTitle.includes("登月")) {
      return "这一壮举标志着人类探索太空的重大突破，不仅展示了科技实力，也开启了太空探索的新纪元。";
    } else if (eventTitle.includes("奥运")) {
      return "北京奥运会成为中国向世界展示国家形象的重要窗口，其影响远超体育领域，促进了国际文化交流。";
    } else if (eventTitle.includes("宣言")) {
      return "该宣言由多位顶尖科学家联名发表，呼吁和平利用核能，对国际核裁军进程产生深远影响。";
    } else if (eventTitle.includes("回归")) {
      return "香港回归不仅是中国领土完整的重要里程碑，也开启了'一国两制'的伟大实践，具有重大历史意义。";
    } else if (eventTitle.includes("联合国")) {
      return "联合国的成立为战后国际秩序奠定基础，构建了全球治理的核心框架，至今仍是维护世界和平的重要机构。";
    }

    // 更丰富的默认解析选项
    const insights = [
      "这一事件深刻改变了当时的国际格局，其影响一直延续至今，塑造了现代社会的多个方面。",
      "作为历史的重要转折点，该事件不仅反映了当时的社会变革，也为后世提供了宝贵的历史经验。",
      "这一历史事件背后蕴含着深刻的政治、经济和文化因素，对全球发展产生了长远影响。",
      "从历史视角看，这一事件标志着一个时代的结束和新时代的开始，是人类文明进程中的关键节点。",
      "该事件不仅是历史的重要组成部分，也为我们理解当代世界提供了重要的历史参照。",
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  };

  // 优化今日推荐的渲染函数，添加AI总结
  const renderRecommendations = () => {
    return (
      <div className="daily-recommendations-section">
        <div className="recommendations-header">
          <h3>
            <i className="fas fa-thumbs-up"></i> 今日推荐
          </h3>
          <div className="scroll-controls">
            <button
              className="scroll-control-btn"
              onClick={() =>
                scrollRefs.recommendations.current?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                })
              }
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="scroll-control-btn"
              onClick={() =>
                scrollRefs.recommendations.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                })
              }
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div
          className="recommendations-scroll"
          ref={scrollRefs.recommendations}
        >
          {recommendations.slice(0, 6).map((product, index) => (
            <div
              key={product.id || index}
              className="product-recommendation-card"
            >
              <div className="product-image-container">
                <img
                  src={
                    product.imageUrl ||
                    `https://source.unsplash.com/featured/800x600/?product`
                  }
                  data-category={`product-${
                    product.name?.substring(0, 10) || "generic"
                  }`}
                  alt={product.name || product.title || `产品${index + 1}`}
                  className="product-image"
                  onError={handleImageError}
                />
              </div>
              <div className="product-info">
                <div className="product-name">
                  {product.name || product.title}
                </div>
                <div className="product-price">¥{product.price}</div>
                <div className="product-match">
                  <i className="fas fa-chart-line"></i>
                  匹配度{product.matchScore || "90"}%
                </div>

                {aiInsights[`product${index + 1}`] && (
                  <div className="product-ai-insight">
                    {aiInsights[`product${index + 1}`]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 历史的今天 - 左右滑动和两列布局
  const renderHistoryEvents = () => {
    return (
      <div className="history-events-section">
        <div className="history-events-header">
          <h3>
            <i className="fas fa-history"></i> 历史上的今天
          </h3>
          <div className="scroll-controls">
            <button
              className="scroll-control-btn"
              onClick={() => handleScroll("historyEvents", "left")}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="scroll-control-btn"
              onClick={() => handleScroll("historyEvents", "right")}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="history-events-scroll" ref={scrollRefs.historyEvents}>
          {historyTodayEvents.map((event) => (
            <div key={event.year} className="history-event-card">
              <div className="history-event-year">{event.year}年</div>
              <div className="history-event-title">{event.title}</div>
              <div className="history-event-tag">
                <i className="fas fa-robot"></i> AI解析
              </div>
              <p className="history-event-description">
                {event.aiInsight || generateHistoryInsight(event.title)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 修复DEFAULT_AVATAR引用
  const DEFAULT_AVATAR = "/default-avatar.png"; // 添加默认头像常量


  // 添加滚动引用和处理函数
  const scrollRefs = {
    todayFocus: useRef(null),
    historyEvents: useRef(null),
    recommendations: useRef(null),
  };

  // 滚动处理函数
  const handleScroll = (refName, direction) => {
    const container = scrollRefs[refName].current;
    if (container) {
      const scrollAmount = direction === "left" ? -180 : 180;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 调整主页面渲染，使用AiAssistant组件替换原有的AI相关部分
  return (
    <BasePage
      showHeader={true}
      headerLeft={
        <div style={{ marginLeft: '30px', fontSize: '13px' }}>
            <h2>
              {greeting}好，{userInfo?.nickname || "测试者"}！
            </h2>
            <p className="date-compact">
              {formattedDate} {weekday} · {lunarDateInfo.month}
              {lunarDateInfo.day}
            </p>
          </div>
      }
    >
      <div className="daily-page-container">
        {/* 使用AiAssistant组件替代原有的AI功能 */}
        <AiAssistant userInfo={userInfo} />
        {renderTodayFocus()}
        {/* {renderHistoryEvents()} */}
        {renderRecommendations()}
        {/* 其他内容... */}
      </div>
    </BasePage>
  );
};

export default Daily;
