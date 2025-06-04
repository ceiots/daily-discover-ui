import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css"; // Keep your existing styles
import instance from "../../utils/axios";
import { useAuth } from "../../App"; // 添加上下文导入
import { BasePage, Button } from "../../theme";

const ProductDetail = () => {

  const { userInfo } = useAuth(); // 获取登录状态
  const { id } = useParams(); // Get the recommendation ID from the URL
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("introduction"); // State to track active tab
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [quantity, setQuantity] = useState(1); // State for quantity
  const navigate = useNavigate(); // Create navigate object
  // 初始化选择状态
  const [selectedSpecs, setSelectedSpecs] = useState({});
  // 初始化转换后的规格数组
  const [transformedSpecs, setTransformedSpecs] = useState([]);
  // 新增状态来记录是否是立即购买
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  // 新增客服对话状态
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // 处理选择变化
  const handleSpecChange = (specName, value) => {
    // 更新选择状态
    const updatedSpecs = {
      ...selectedSpecs,
      [specName]: value,
    };
    setSelectedSpecs(updatedSpecs);

    // 转换为所需格式
    const transformed = recommendation?.specifications?.map((spec) => ({
      ...spec,
      values: [updatedSpecs[spec.name]].filter(Boolean), // 只保留选中的值
    })) || [];

    // 更新转换后的规格数组
    setTransformedSpecs(transformed);

    console.log("Selected Specs:", updatedSpecs);
    console.log("Transformed Specs:", transformed);
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/product/${id}`);
        // 打印返回内容
        console.log('商品详情接口返回：', response.data);

        const data = response.data?.data;
        if (data) {
          setRecommendation(data);  // 修正这里，使用data而不是response.data

          // Record browsing history
          try {
            await instance.post("/browsing-history/record", {
              productId: id,
              categoryId: data.categoryId
            });
          } catch (historyError) {
            console.error("Failed to record browsing history:", historyError);
          }

          // Fetch AI insights for this product
          try {
            const insightsResponse = await instance.get(`/product/recommendations`);
            if (insightsResponse.data && insightsResponse.data.code === 200) {
              const insights = insightsResponse.data.data.insights || {};
              setAiInsight(insights[`product${id}`] || "");
            }
          } catch (insightError) {
            console.error("Failed to fetch AI insights:", insightError);
          }
        } else {
          setError("商品不存在或已下架");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("获取商品详情失败");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecommendation();
    } else {
      setError("无效的商品ID");
      setLoading(false);
    }
  }, [id]);

  // 处理客服消息发送
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      content: messageInput,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
    
    // 模拟客服回复
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        content: "您好，感谢您的咨询。我们的客服人员将尽快回复您的问题。",
        sender: 'service',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, reply]);
    }, 1000);
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

  // Function to render product details - 修改后确保始终返回内容
  const renderProductDetails = (details) => {
    if (!details || !Array.isArray(details) || details.length === 0) {
      return <p className="text-neutral-500 text-center py-4">暂无内容</p>;
    }

    const renderedItems = details.map((item, index) => {
      if (item.type === "image") {
        return (
          <img
            key={index}
            src={item.content}
            alt="Product Detail"
            className="w-full h-auto mb-4"
          />
        );
      } else if (item.type === "text") {
        return (
          <div
            key={index}
            className="text-sm text-gray-800 leading-relaxed mb-4 font-light"
          >
            {item.content}
          </div>
        );
      } else if (item.title && item.content) {
        return (
          <div key={index} className="mb-4">
            <h4 className="text-base font-semibold mb-2">{item.title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed font-light">
              {item.content}
            </p>
          </div>
        );
      }
      return null;
    }).filter(Boolean);
    
    return renderedItems.length > 0 
      ? renderedItems 
      : <p className="text-neutral-500 text-center py-4">暂无内容</p>;
  };

  if (loading) {
    return (
      <BasePage showHeader={true}>
        <div className="recommendation-detail-loading">加载商品详情中...</div>
      </BasePage>
    );
  }

  if (error || !recommendation) {
    return (
      <BasePage showHeader={true}>
        <div className="recommendation-detail-error">
          <h3>{error || "商品不存在"}</h3>
          <button onClick={() => navigate(-1)} className="back-button">
            返回
          </button>
        </div>
      </BasePage>
    );
  }

  // Function to handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // 抽取共用逻辑到新函数
  const prepareOrderPayload = (
    userInfo,
    productId,
    productInfo,
    selectedQuantity,
    selectedSpecs
  ) => {
    // 打印 productInfo.specifications 以确认其结构
    console.log("productInfo.specifications:", productInfo.specifications);

    // 检查是否所有规格都已选择
    const areAllSpecsSelected = () => {
      // 如果没有规格，或者规格数组为空，直接返回true
      if (!productInfo.specifications || productInfo.specifications.length === 0) {
        return true;
      }

      const allSpecs = productInfo.specifications.map(spec => spec.name);
      console.log("All possible specs:", allSpecs);
      console.log("Selected specs:", selectedSpecs);

      // 修复逻辑：确保所有规格都有对应的选择值
      return allSpecs.every(specName => {
        // 判断 selectedSpecs 是否有该规格的值
        return selectedSpecs[specName] !== undefined &&
          selectedSpecs[specName] !== null &&
          selectedSpecs[specName].toString().trim() !== '';
      });
    };

    console.log("areAllSpecsSelected:", areAllSpecsSelected());

    // 检查用户是否已登录
    const isUserLoggedIn = () => userInfo && userInfo.id;

    console.log("isUserLoggedIn:", isUserLoggedIn()); // 打印规格数组

    // 如果规格未全部选择或用户未登录，返回 null
    if (!areAllSpecsSelected()) {
      alert("请选择所有规格");
      return null;
    }

    if (!isUserLoggedIn()) {
      navigate("/login");
      return null;
    }

    // 继续执行后续逻辑
    console.log("All specs are selected and user is logged in. Proceeding...");

    // 将选择的规格转换为后端需要的格式
    const formattedSpecifications = Object.keys(selectedSpecs).map(specName => ({
      name: specName,
      values: [selectedSpecs[specName]],
    }));

    const orderPayload = {
      userId: userInfo.id, // 动态获取用户ID
      productId: productId,
      productName: productInfo.title,
      productImage: productInfo.imageUrl,
      // 确保 specifications 是有效的数组
      specifications: formattedSpecifications,
      price: productInfo.price,
      quantity: selectedQuantity,
      shopName: productInfo.shopName || '',
      shopAvatarUrl: productInfo.shopAvatarUrl || '',
    };

    return orderPayload;
  };

  // 封装错误处理逻辑
  const handleOrderError = (error, action) => {
    console.error(`Error ${action}:`, error);
    alert(`操作失败: ${error.message || '请稍后重试'}`);
  };

  // 修改为通用的处理函数
  const handleAddOrBuy = async (isBuyNow) => {
    try {
      const orderPayload = prepareOrderPayload(
        userInfo,
        id,
        recommendation,
        quantity,
        selectedSpecs
      );

      console.log("orderPayload:", orderPayload); // 打印 orderPayload 以确认其结构
      console.log("isBuyNow:", isBuyNow); // 打印 isBuyNow 

      if (orderPayload) {
        if (isBuyNow) {
          // 立即购买，直接跳转到支付页面并传递 orderPayload
          navigate("/payment", { state: { selectedItems: [orderPayload] } });
        } else {
          // 加入购物车，调用加入购物车接口
          const response = await instance.post("/cart/add", orderPayload);
          if (response.data && response.data.code === 200) {
            alert("已成功加入购物车");
          } else {
            alert(response.data?.message || "加入购物车失败");
          }
        }
      }
    } catch (error) {
      handleOrderError(error, isBuyNow ? "购买商品" : "加入购物车");
    } finally {
      setIsModalOpen(false); // 无论成功失败都关闭模态框
    }
  };

  // 修改 handleAddToCart 为 handleAddToCart
  const handleAddToCart = () => {
    setIsModalOpen(true);
    setIsBuyNow(false); // 标记为加入购物车
  };

  // 添加 handleBuyNow 函数
  const handleBuyNow = () => {
    setIsModalOpen(true);
    setIsBuyNow(true); // 标记为立即购买
  };

  // 处理客服点击
  const handleCustomerServiceClick = () => {
    setShowCustomerService(!showCustomerService);
  };

  return (
    <BasePage title="商品详情"
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }>
      <div className="recommendation-detail-container">
        <div className="recommendation-detail-content">
          <div className="product-image-gallery">
            <img
              src={recommendation.imageUrl}
              alt={recommendation.title}
              className="product-main-image"
              data-category={`product-${recommendation.title?.substring(0, 10) || "generic"}`}
              onError={handleImageError}
            />
            {recommendation.images && recommendation.images.length > 1 && (
              <div className="product-thumbnails">
                {recommendation.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${recommendation.title} - 图片 ${index + 1}`}
                    className="product-thumbnail"
                    onError={handleImageError}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info-container">
            <h1 className="product-title">{recommendation.title}</h1>

            <div className="product-price-section">
              <div className="product-price">¥{recommendation.price}</div>
              {recommendation.originalPrice && recommendation.originalPrice > recommendation.price && (
                <div className="product-original-price">¥{recommendation.originalPrice}</div>
              )}
            </div>

            {recommendation.matchScore && (
              <div className="product-match-score">
                <i className="fas fa-chart-line"></i>
                匹配度: <span>{recommendation.matchScore}%</span>
              </div>
            )}

            {aiInsight && (
              <div className="product-ai-insight-detail">
                <div className="ai-insight-header">
                  <i className="fas fa-robot"></i>
                  <span>AI洞察</span>
                </div>
                <p>{aiInsight}</p>
              </div>
            )}

            {/* 美化店铺/库存/销量UI */}
            <div className="product-stats-container">
              <div className="product-stat-item">
                <div className="stat-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">销量</div>
                  <div className="stat-value">{recommendation.soldCount || 0}</div>
                </div>
              </div>
              
              <div className="product-stat-item">
                <div className="stat-icon">
                  <i className="fas fa-cubes"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">库存</div>
                  <div className="stat-value">{recommendation.stock || 0}</div>
                </div>
              </div>
              
              {recommendation.shopName && (
                <div className="product-stat-item">
                  <div className="stat-icon">
                    <i className="fas fa-store"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">店铺</div>
                    <div className="stat-value shop-name">{recommendation.shopName}</div>
                  </div>
                </div>
              )}
            </div>

            {recommendation.specifications && recommendation.specifications.length > 0 && (
              <div className="product-specifications">
                <h3>规格参数</h3>
                <div className="specifications-list">
                  {recommendation.specifications.map((spec, index) => (
                    <div key={index} className="specification-item">
                      <span className="spec-name">{spec.name}:</span>
                      <span className="spec-value">
                        {spec.values && spec.values.length > 0
                          ? spec.values.join(", ")
                          : spec.value || "无"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              <Button 
                variant="secondary" 
                icon={<i className="fas fa-shopping-cart"></i>}
                onClick={handleAddToCart}
              >
                加入购物车
              </Button>
              <Button 
                variant="primary" 
                icon={<i className="fas fa-bolt"></i>}
                onClick={handleBuyNow}
              >
                立即购买
              </Button>
            </div>
          </div>
        </div>

        <div className="my-0 w-full h-2 bg-gray-100"></div>

        <div className="mt-2 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium tracking-wide">用户评论</h3>
            <span className="text-sm text-primary">
              查看全部 <i className="fas fa-chevron-right text-xs ml-1"></i>
            </span>
          </div>
          <div className="mb-4 pb-4 border-b">
            {recommendation.comments && recommendation.comments.length > 0 ? (
              recommendation.comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <img
                      src={comment.userAvatarUrl || "https://via.placeholder.com/100"} // 添加默认头像
                      alt="用户头像"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{comment.userName || "匿名用户"}</p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2 font-light">
                        {comment.content || "暂无评论内容"} {/* Display comment content */}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <i className="fas fa-star text-yellow-400 text-xs mr-1"></i>
                          <span className="text-xs font-medium text-yellow-700">
                            {comment.rating || "5.0"} {/* Display rating */}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {comment.date || "未知日期"} {/* Display date */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>暂无用户评论</p>
            )}
          </div>
        </div>

        <div className="my-0 w-full h-2 bg-gray-100"></div>

        {/* 修复TAB切换问题 */}
        <div className="mt-2 bg-white">
          <div className="flex border-b tab-container">
            <button
              className={`flex-1 py-3 text-center ${activeTab === "introduction"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
                }`}
              onClick={() => setActiveTab("introduction")}
            >
              商品介绍
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === "purchaseNotice"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
                }`}
              onClick={() => setActiveTab("purchaseNotice")}
            >
              购买须知
            </button>
          </div>
          <div className="p-4 tab-content">
            {activeTab === "introduction" && (
              <div className="tab-pane">
                <h3 className="text-lg font-medium tracking-wide mb-3">
                  产品详情
                </h3>
                {renderProductDetails(recommendation.productDetails)}
              </div>
            )}

            {activeTab === "purchaseNotice" && (
              <div className="tab-pane">
                <h3 className="text-lg font-medium tracking-wide mb-3">
                  购买须知
                </h3>
                {renderProductDetails(recommendation.purchaseNotices)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for selecting specifications */}
      {isModalOpen && (
        <div
          id="specificationModal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
        >
          <div className="bg-white w-full max-w-md rounded-t-xl p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">选择规格</h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div>
              {recommendation.specifications && recommendation.specifications.length > 0 ? (
                recommendation.specifications.map((spec, index) => (
                  <div key={index} className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      {spec.name}
                    </div>
                    <div className="flex flex-wrap gap-3 specs-item">
                      {spec.values.map((value, idx) => (
                        <React.Fragment key={idx}>
                          <input
                            type="radio"
                            name={spec.name}
                            id={`${spec.name}-${idx}`}
                            className="hidden"
                            onChange={() =>
                              handleSpecChange(spec.name, value)
                            }
                            checked={selectedSpecs[spec.name] === value}
                          />
                          <label
                            htmlFor={`${spec.name}-${idx}`}
                            className={`px-4 py-2 border rounded-full text-sm cursor-pointer ${selectedSpecs[spec.name] === value
                                ? "bg-primary text-white"
                                : ""
                              }`}
                          >
                            {value}
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-2">该商品无规格选择</p>
              )}
            </div>

            <div className="mb-4">
              <p className="mb-2">数量</p>
              <div className="flex items-center">
                <button
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  className="w-12 text-center mx-2 border-none"
                  readOnly
                />
                <button
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <Button
              variant="primary"
              block
              onClick={() => handleAddOrBuy(isBuyNow)}
            >
              确定
            </Button>
          </div>
        </div>
      )}

      {/* 客服聊天组件 */}
      <div className="customer-service-container">
        <button 
          className="customer-service-button"
          onClick={handleCustomerServiceClick}
        >
          <i className="fas fa-headset"></i>
          <span>客服</span>
        </button>
        
        {showCustomerService && (
          <div className="customer-service-panel">
            <div className="customer-service-header">
              <h3>在线客服</h3>
              <button onClick={() => setShowCustomerService(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="customer-service-messages">
              {chatMessages.length > 0 ? (
                chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'service-message'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">{msg.time}</div>
                  </div>
                ))
              ) : (
                <div className="empty-chat">
                  <p>您好，有什么可以帮助您的吗？</p>
                </div>
              )}
            </div>
            
            <div className="customer-service-input">
              <input
                type="text"
                placeholder="请输入您的问题..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 固定底部按钮栏 */}
      <div className="product-detail-bottom-bar">
        <Button
          variant="secondary"
          icon={<i className="fas fa-shopping-cart"></i>}
          onClick={handleAddToCart}
          block
        >
          加入购物车
        </Button>
        <Button
          variant="primary"
          icon={<i className="fas fa-bolt"></i>}
          onClick={handleBuyNow}
          block
        >
          立即购买
        </Button>
      </div>
    </BasePage>
  );
};

export default ProductDetail;