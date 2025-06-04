import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import instance from "../../utils/axios";
import { useAuth } from "../../App";
import { useTheme } from "../../theme";
import "./Recommendations.css";

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
  const scrollRef = useRef(null);

  useEffect(() => {
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

  // Scroll controls
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <div className="loading-recommendations">加载推荐中...</div>;
  }

  return (
    <>
      <div className="daily-recommendations-section">
        <div className="recommendations-header">
          <h3 style={{ fontSize: theme.fontSize["2xl"] }}>
            <i className="fas fa-thumbs-up"></i> 今日推荐
            {!showPreferenceModal && isLoggedIn && (
              <button 
                className="preference-button"
                onClick={() => {
                  fetchCategories(); // Make sure we fetch categories before showing modal
                  setShowPreferenceModal(true);
                }}
              >
                <i className="fas fa-sliders-h"></i> 设置偏好
              </button>
            )}
          </h3>
          <div className="scroll-controls">
            <button
              className="scroll-control-btn"
              onClick={() => handleScroll("left")}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="scroll-control-btn"
              onClick={() => handleScroll("right")}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="recommendations-scroll" ref={scrollRef}>
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
                  onError={handleImageError}
                />
              </div>
              <div className="product-info">
                <div className="product-name" style={{ fontSize: theme.fontSize.base }}>{product.title}</div>
                <div className="product-price" style={{ fontSize: theme.fontSize.lg }}>{`¥${product.price}`}</div>
                <div className="product-match">
                  <i className="fas fa-chart-line"></i>
                  匹配度{product.matchScore || "90"}%
                </div>

                {aiInsights[`product${product.id}`] && (
                  <div className="product-ai-insight">
                    {aiInsights[`product${product.id}`]}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

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
                        <i className={category.icon || "fas fa-tag"}></i>
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