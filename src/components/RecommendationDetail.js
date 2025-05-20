import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RecommendationDetail.css"; // Keep your existing styles
import instance from "../utils/axios";
import { useAuth } from "../App"; // 添加上下文导入

const RecommendationDetail = () => {
  
  const { userInfo } = useAuth(); // 获取登录状态
  const { id } = useParams(); // Get the recommendation ID from the URL
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("introduction"); // State to track active tab
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [quantity, setQuantity] = useState(1); // State for quantity
  //const [selectedVariant, setSelectedVariant] = useState(""); // State for selected variant
  const navigate = useNavigate(); // Create navigate object
  // 初始化选择状态
  const [selectedSpecs, setSelectedSpecs] = useState({});
  // 初始化转换后的规格数组
  const [transformedSpecs, setTransformedSpecs] = useState([]);
  
  // 新增状态来记录是否是立即购买
  const [isBuyNow, setIsBuyNow] = useState(false);

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
        
        if (response.data) {
          setRecommendation(response.data);
        } else {
          setError("未找到商品信息");
        }
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setError(
          "获取商品详情失败，请稍后重试。"
        );
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

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p>正在加载商品信息...</p></div>;
  if (error) return <div className="flex flex-col justify-center items-center min-h-screen">
    <p className="text-red-500 mb-4">{error}</p>
    <button 
      className="px-4 py-2 bg-primary text-white rounded-lg"
      onClick={() => navigate(-1)}
    >
      返回上一页
    </button>
  </div>;
  
  if (!recommendation) return <div className="flex flex-col justify-center items-center min-h-screen">
    <p className="text-red-500 mb-4">未找到商品信息</p>
    <button 
      className="px-4 py-2 bg-primary text-white rounded-lg"
      onClick={() => navigate(-1)}
    >
      返回上一页
    </button>
  </div>;

  // Function to handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Function to conf// Function to confirm adding to cart
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

  // 封装导航逻辑
  const navigateToPayment = () => {
    navigate("/payment");
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
    // 这里不需要再调用 handleAddOrBuy，因为在点击确定时再处理
  };
  
  // Function to render product details
  const renderProductDetails = (details) => {
    if (!details || !Array.isArray(details) || details.length === 0) {
      return <p>暂无详细信息</p>;
    }
    
    return details.map((item, index) => {
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
    });
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-[375px] mx-auto bg-white min-h-screen relative pb-16">
        <nav className="fixed top-0 left-0 right-0 bg-primary text-white p-4 flex items-center justify-between z-10">
          <button className="text-xl" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium tracking-wide">商品详情</h1>
          <button className="text-xl">
            <i className="fas fa-share-alt"></i>
          </button>
        </nav>
        <main className="pt-16 mb-5">
          <div className="relative h-[280px] bg-gray-200">
            <img
              src={recommendation.imageUrl} // Use fetched data
              alt={recommendation.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white px-4 py-4 mt-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-lg font-medium leading-tight">
                  {recommendation.title}
                </h1>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-semibold text-primary">
                    ¥ {recommendation.price}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    已售 {recommendation.soldCount}
                  </span>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center ml-2">
                <i className="ri-heart-line text-xl text-gray-400"></i>
              </button>
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <span className="mr-4">快递：免运费</span>
            </div>
          </div>

          <div className="my-0 w-full h-2 bg-gray-100"></div>
          <div className="p-4 bg-white mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={recommendation.shopAvatarUrl || "https://via.placeholder.com/100"} // 添加默认图片
                alt="店铺logo"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium tracking-wide">
                  {recommendation.shopName || "未知店铺"}
                </h3>{" "}
                {/* Use fetched data */}
                <p className="text-xs text-gray-500 font-light">
                  {recommendation.storeDescription || "暂无店铺描述"}
                </p>
              </div>
            </div>
            <button className="bg-primary text-white px-3 py-1 rounded-full text-sm !rounded-button">
              进店逛逛
            </button>
          </div>
          <div className="mt-2 bg-white">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 text-center ${
                  activeTab === "introduction"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("introduction")}
              >
                商品介绍
              </button>
              <button
                className={`flex-1 py-3 text-center ${
                  activeTab === "purchaseNotice"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("purchaseNotice")}
              >
                购买须知
              </button>
            </div>
            <div className="p-4">
              {activeTab === "introduction" && (
                <>
                  <h3 className="text-lg font-medium tracking-wide mb-3">
                    产品详情
                  </h3>
                  {renderProductDetails(recommendation.productDetails)}{" "}
                  {/* Render product details */}
                  {/* <div
                    className="text-sm text-gray-700 leading-relaxed mb-4 font-light"
                    dangerouslySetInnerHTML={{
                      __html: recommendation.productDetails,
                    }} // Use fetched data 
                  /> */}
                </>
              )}

              {activeTab === "purchaseNotice" && (
                <>{renderProductDetails(recommendation.purchaseNotices)}</>
              )}
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
                                className={`px-4 py-2 border rounded-full text-sm cursor-pointer ${
                                  selectedSpecs[spec.name] === value
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
                <button
                  className="w-full py-2 bg-primary text-white rounded-button"
                  onClick={() => handleAddOrBuy(isBuyNow)} // 传递标志位
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </main>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center p-2 z-10">
          {/* <button className="flex items-center justify-center w-10 h-10 mr-2">
            <i className="fas fa-comments text-gray-600 text-xl"></i>
          </button> */}
          <button className="w-12 h-12 flex flex-col items-center justify-center text-gray-500">
            <i className="ri-customer-service-2-line text-xl"></i>
            <span className="text-xs mt-0.5">客服</span>
          </button>

          <button
            className="flex-1 bg-secondary text-primary py-2 rounded-full mr-2 !rounded-button"
            onClick={handleAddToCart}
          >
            加入购物车
          </button>
          <button
            className="flex-1 bg-primary text-white py-2 rounded-full !rounded-button"
            onClick={handleBuyNow}
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDetail;
