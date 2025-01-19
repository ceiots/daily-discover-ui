import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RecommendationDetail.css"; // Keep your existing styles
import instance from "../utils/axios";

const RecommendationDetail = () => {
  const { id } = useParams(); // Get the recommendation ID from the URL
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("introduction"); // State to track active tab
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [selectedVariant, setSelectedVariant] = useState(""); // State for selected variant
  const navigate = useNavigate(); // Create navigate object

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await instance.get(
          `/recommendations/${id}`
        );
        setRecommendation(response.data);
      } catch (error) {
        setError(
          "Error fetching recommendation details. Please try again later."
        );
        console.error("Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Function to handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Function to open the modal
  const handleAddToCart = async () => {
    setIsModalOpen(true);
  };

  // Function to conf// Function to confirm adding to cart
  const confirmAddToCart = async () => {
    if (!selectedVariant) {
      alert("请选择规格"); // Alert if no variant is selected
      return;
    }

    const cartItem = {
      user_id: 23, // Replace with actual user logic
      product_id: recommendation.id,
      product_name: recommendation.title,
      product_image: recommendation.imageUrl,
      product_variant: selectedVariant,
      price: recommendation.price,
      quantity: quantity,
      shopName: recommendation.shopName,
      shopAvatarUrl: recommendation.shopAvatarUrl
    };

    try {
      await instance.post(
        "/cart/add",
        cartItem
      );
      //navigate('/cart'); // Navigate to Cart.js
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
    setIsModalOpen(false); // Close the modal
  };

  // Function to navigate to Order Confirmation
  const handleBuyNow = () => {
    navigate("/payment"); // Navigate to payment.js
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-[375px] mx-auto bg-white min-h-screen relative">
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
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex space-x-1">
                {/* <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div> */}
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h2 className="text-xl font-semibold mb-2 tracking-tight">
              {recommendation.title} {/* Use fetched data */}
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-primary tracking-tight">
                ¥ {recommendation.price} {/* Use fetched data */}
              </span>
              <span className="text-sm text-gray-500 font-light">
                已售 {recommendation.soldCount} {/* Use fetched data */}
              </span>
            </div>
            <button className="text-primary border border-primary rounded-full px-3 py-1 text-sm">
              <i className="far fa-heart mr-1"></i>收藏
            </button>
          </div>
          <div className="p-4 bg-white mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={recommendation.shopAvatarUrl} // Use fetched data
                alt="店铺logo"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium tracking-wide">
                  {recommendation.shopName}
                </h3>{" "}
                {/* Use fetched data */}
                <p className="text-xs text-gray-500 font-light">
                  {recommendation.storeDescription}
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
                  activeTab === "specifications"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                规格参数
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
                  <div
                    className="text-sm text-gray-700 leading-relaxed mb-4 font-light"
                    dangerouslySetInnerHTML={{
                      __html: recommendation.productDetails,
                    }} // Use fetched data
                  />
                </>
              )}
              {activeTab === "specifications" && (
                <>
                  <h3 className="text-lg font-medium tracking-wide mb-3">
                    规格参数
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mb-4 font-light">
                    {recommendation.specifications &&
                    recommendation.specifications.length > 0 ? (
                      recommendation.specifications.map((spec, index) => (
                        <li key={index}>{spec}</li> // Use fetched data
                      ))
                    ) : (
                      <li>暂无规格参数</li> // Fallback message if no specifications
                    )}
                  </ul>
                </>
              )}
              {activeTab === "purchaseNotice" && (
                <>
                  <h3 className="text-lg font-medium tracking-wide mb-3">
                    购买须知
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 font-light">
                    {recommendation.purchaseNotice} {/* Use fetched data */}
                  </p>
                </>
              )}
            </div>
          </div>
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
                        src={comment.userAvatarUrl} // Use fetched data
                        alt="用户头像"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{comment.userName}</p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2 font-light">
                          {comment.content} {/* Display comment content */}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                            <i className="fas fa-star text-yellow-400 text-xs mr-1"></i>
                            <span className="text-xs font-medium text-yellow-700">
                              {comment.rating} {/* Display rating */}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {comment.date} {/* Display date */}
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
              className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center"
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
                
                <div className="mb-4">
                  <p className="mb-2">套装类型</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 border rounded-full text-sm ${
                        selectedVariant === "初学者套装"
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedVariant("初学者套装")}
                    >
                      初学者套装
                    </button>
                    <button
                      className={`px-3 py-1 border rounded-full text-sm ${
                        selectedVariant === "进阶套装"
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedVariant("进阶套装")}
                    >
                      进阶套装
                    </button>
                    <button
                      className={`px-3 py-1 border rounded-full text-sm ${
                        selectedVariant === "高级套装"
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedVariant("高级套装")}
                    >
                      高级套装
                    </button>
                  </div>
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
                  onClick={confirmAddToCart}
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
