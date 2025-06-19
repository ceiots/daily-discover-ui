import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import instance from "../../services/http/instance";
import { useAuth } from "../../hooks/useAuth";
import { useTheme, ScrollableSection } from "../../theme";
import "./Recommendations.css";

// 默认头像常量
const DEFAULT_AVATAR = "https://source.unsplash.com/featured/100x100/?avatar";

const Recommendations = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState({});
  const [showPreferenceModal, setShowPreferenceModal] = useState(false); // Changed to false initially
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isColdStart, setIsColdStart] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [todayFocus, setTodayFocus] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [dailyTips, setDailyTips] = useState([]);
  const [historyTodayEvents, setHistoryTodayEvents] = useState([]);
  const [productSummary, setProductSummary] = useState(null);


  const [error, setError] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [hotArticles, setHotArticles] = useState([]);

  // 冷启动兴趣标签弹窗
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [popularTags, setPopularTags] = useState([]);

  // 获取热门标签（冷启动用）
  const fetchPopularTags = async () => {
    try {
      const response = await instance.get('/tags/popular');
      if (response.data && Array.isArray(response.data.data)) {
        setPopularTags(response.data.data);
      } else {
        setPopularTags([]);
      }
    } catch (error) {
      setPopularTags([]);
      console.error('获取热门标签失败:', error);
    }
  };

  // 检查是否需要冷启动，仅在 isLoggedIn 和 userInfo.id 变化时执行
  useEffect(() => {
    let cancelled = false;
    const checkNeedColdStart = async () => {
      if (isLoggedIn && userInfo?.id) {
        try {
          const response = await instance.get(`/tags/${userInfo.id}/need-cold-start`);
          if (!cancelled && response.data?.data === true) {
            // 需要冷启动，获取热门标签
            fetchPopularTags();
            setShowInterestModal(true);
          }
        } catch (error) {
          if (!cancelled) {
            console.error("检查冷启动状态失败:", error);
          }
        }
      }
    };
    checkNeedColdStart();
    return () => { cancelled = true; };
  }, [isLoggedIn, userInfo]);

  // 添加事件监听器，用于监听refreshRecommendations事件
  useEffect(() => {
    // 由于fetchRecommendations在useEffect中定义，我们需要在这里提前声明
    let refreshHandler;

    const setupEventListener = () => {
      refreshHandler = () => {
        console.log("收到刷新推荐事件，正在刷新数据...");
        // 直接调用获取推荐的逻辑，而不是调用fetchRecommendations
        setLoading(true);
        instance.get(`/product/recommendations`)
          .then(response => {
            if (response.data && response.data.code === 200) {
              const data = response.data.data || {};
              const products = data.products || [];
              
              if (products.length === 0 || data.isColdStart) {
                setIsColdStart(true);
                fetchRandomRecommendations();
              } else {
                setRecommendations(products);
                setAiInsights(data.insights || {});
                setIsColdStart(false);
              }
            } else {
              fetchRandomRecommendations();
            }
          })
          .catch(error => {
            console.error("Error refreshing recommendations:", error);
            fetchRandomRecommendations();
          })
          .finally(() => {
            setLoading(false);
          });
      };

      // 添加事件监听
      window.addEventListener('refreshRecommendations', refreshHandler);
    };

    setupEventListener();

    // 组件卸载时移除事件监听
    return () => {
      if (refreshHandler) {
        window.removeEventListener('refreshRecommendations', refreshHandler);
      }
    };
  }, []);

  useEffect(() => {

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
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Fetch recommendations with AI insights
        const response = await instance.get(`/product/recommendations`);
        if (response.data && response.data.code === 200) {
          const data = response.data.data || {};
          const products = data.products || [];
          
          // Check if we need to show cold start experience
          if (products.length === 0 || data.isColdStart) {
            setIsColdStart(true);
            await fetchRandomRecommendations();
            
            // Only show preference modal for logged-in users
            if (isLoggedIn) {
              await fetchCategories();
              setShowPreferenceModal(true);
            }
          } else {
            setRecommendations(products);
            setAiInsights(data.insights || {});
            setIsColdStart(false);
          }
        } else {
          // Fallback to random recommendations
          await fetchRandomRecommendations();
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        // Fallback to random recommendations on error
        await fetchRandomRecommendations();
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isLoggedIn]);

  // Fetch random recommendations for cold start
  const fetchRandomRecommendations = async () => {
    try {
      const response = await instance.get(`/product/random?limit=6`);
      if (response.data) {
        setRecommendations(response.data);
        
        // Generate generic insights for random recommendations
        const genericInsights = {};
        response.data.forEach(product => {
          genericInsights[`product${product.id}`] = getGenericInsight();
        });
        setAiInsights(genericInsights);
      }
    } catch (error) {
      console.error("Error fetching random recommendations:", error);
      setRecommendations([]);
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




  // Fetch available categories for preference selection
  const fetchCategories = async () => {
    try {
      const response = await instance.get('/category/all');
      console.log('fetchCategories: ',response.data);
      if (response.data) {
        setAvailableCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAvailableCategories([]);
    }
  };

  // 简化的辅助函数，直接使用数据库中存储的类名
  const getIconClassName = (iconName) => {
    if (!iconName) return "fas fa-tag"; // 默认图标
    
    // 检查是否已经包含"fas"或"fa"前缀
    if (iconName.startsWith('fas ') || iconName.startsWith('fa ')) {
      return iconName;
    }
    
    // 否则添加"fas"前缀
    return `fas fa-${iconName}`;
  };

  // Handle preference selection
  const handlePreferenceToggle = (categoryId) => {
    setSelectedPreferences(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Save user preferences and fetch new recommendations
  const savePreferences = async () => {
    if (selectedPreferences.length === 0) {
      setShowPreferenceModal(false);
      return;
    }

    try {
      await instance.post('/user/preferences', {
        categoryIds: selectedPreferences
      });
      
      // Fetch new recommendations based on preferences
      const response = await instance.get(`/product/recommendations`);
      if (response.data && response.data.code === 200) {
        const data = response.data.data || {};
        setRecommendations(data.products || []);
        setAiInsights(data.insights || {});
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setShowPreferenceModal(false);
    }
  };

  // 修改今日焦点渲染函数，使用ScrollableSection组件
  const renderTodayFocus = () => {
    return (
      <ScrollableSection 
        title="今日焦点"
        titleIcon={<i className="fas fa-star"></i>}
        className="today-focus-section"
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
      </ScrollableSection>
    );
  };

  // Generate generic insights for cold start
  const getGenericInsight = () => {
    const insights = [
      "这款产品在同类中好评率较高",
      "近期热门商品，受到多数用户关注",
      "该商品性价比较高，值得考虑",
      "这款产品设计精美，功能齐全",
      "用户反馈使用体验良好的产品"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  // Handle image loading error
  const handleImageError = (event) => {
    const target = event.target;
    const category = target.dataset.category || target.alt || "product";
    const fallbackUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
      category
    )}`;

    target.classList.add("image-error");
    target.onerror = null;
    target.src = fallbackUrl;
  };

  if (loading) {
    return <div className="loading-recommendations">加载推荐中...</div>;
  }

  return (
    <>
      {/* 今日焦点区域 - 作为独立的一行内容块 */}
      {renderTodayFocus()}
      
      {/* 使用ScrollableSection组件替换推荐区域 */}
      <ScrollableSection
        title="今日推荐"
        titleIcon={<i className="fas fa-thumbs-up"></i>}
        actionButton={
          !showPreferenceModal && isLoggedIn && (
            <button 
              className="preference-button"
              onClick={() => {
                fetchCategories();
                setShowPreferenceModal(true);
              }}
            >
              <i className="fas fa-sliders-h"></i> 设置偏好
            </button>
          )
        }
        className="daily-recommendations-section"
      >
        {recommendations.slice(0, 6).map((product, index) => (
          <Link
            to={`/product/${product.id}`}
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
                  product.title?.substring(0, 10) || "generic"
                }`}
                alt={product.title || `产品${index + 1}`}
                className="product-image"
              />
            </div>
            <div className="product-info">
              <div className="product-name" style={{ fontSize: theme.fontSize.base, color: theme.colors.neutral[900] }}>{product.title}</div>
              <div className="product-price" style={{ color: theme.colors.error }}>{`¥${product.price}`}</div>
              <div className="product-match" style={{ color: theme.colors.primary.main }}>
                <i className="fas fa-chart-line"></i>
                匹配度{product.matchScore || "90"}%
              </div>

              {product && product.id && aiInsights[`product${product.id}`] && (
                <div className="product-ai-insight">
                  {aiInsights[`product${product.id}`]}
                </div>
              )}
            </div>
            <div className="shop-info">
              {product.shopAvatarUrl && (
                <img src={product.shopAvatarUrl || DEFAULT_AVATAR} className="shop-avatar" alt="店铺logo" />
              )}
              <span className="shop-name">{product.shopName || "官方商城"}</span>
            </div>
          </Link>
        ))}
      </ScrollableSection>

      {/* User Preference Modal */}
      {showPreferenceModal && (
        <div className="preference-modal-overlay">
          <div className="preference-modal">
            <div className="preference-modal-header">
              <h3>选择您感兴趣的类别</h3>
              <button 
                className="close-button"
                onClick={() => setShowPreferenceModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="preference-modal-content">
              <p>为了给您提供更精准的推荐，请选择您感兴趣的类别</p>
              
              {availableCategories.length > 0 ? (
                <div className="category-grid">
                  {availableCategories.map(category => (
                    <div 
                      key={category.id}
                      className={`category-item ${selectedPreferences.includes(category.id) ? 'selected' : ''}`}
                      onClick={() => handlePreferenceToggle(category.id)}
                    >
                      <div className="category-icon">
                        <i className={getIconClassName(category.icon)}></i>
                      </div>
                      <div className="category-name">{category.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="category-loading">
                  <p>正在加载类别...</p>
                </div>
              )}
            </div>
            <div className="preference-modal-footer">
              <button 
                className="skip-button"
                onClick={() => setShowPreferenceModal(false)}
              >
                跳过
              </button>
              <button 
                className="save-button"
                onClick={savePreferences}
                disabled={selectedPreferences.length === 0}
              >
                保存偏好
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Recommendations;