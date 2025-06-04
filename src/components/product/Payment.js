import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../../utils/axios";
import BasePage from "../../theme/BasePage";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [address, setAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("支付宝");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return navigate("/login");
        const res = await instance.get(`/address/getDefaultByUserId?userId=${userId}`);
        setAddress(res.data.data || {});
      } catch (error) {
        console.error("获取默认地址失败", error);
      }
    };
    fetchAddress();
  }, [navigate]);

  const handleBack = () => navigate(-1);

  const handleEditAddress = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/address-list", { state: { userId, currentAddress: address } });
    }
  };

  const handleConfirmPayment = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return navigate("/login");
    try {
      const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const res = await instance.post("/order/create", {
        userId,
        orderNo,
        itemIds: selectedItems.map(i => i.id),
        totalAmount: calculateTotal(),
        payType: paymentMethod === "支付宝" ? 1 : 2,
        address,
        items: selectedItems.map(i => ({
          id: i.id,
          productId: i.productId,
          quantity: i.quantity,
          shopAvatarUrl: i.shopAvatarUrl,
          shopName: i.shopName,
          imageUrl: i.productImage,
          name: i.productName,
          price: i.price,
          specifications: i.specifications,
        })),
      });
      if (res.data.code === 200) {
        navigate("/payment-password", {
          state: {
            orderNo,
            paymentAmount: res.data.data.paymentAmount,
            paymentMethod: res.data.data.paymentMethod,
          },
        });
      } else {
        alert("订单创建失败: " + res.data.message);
      }
    } catch {
      alert("支付请求失败，请稍后重试");
    }
  };

  const calculateTotal = () =>
    selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // 主题 headerLeft
  const headerLeft = (
    <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center">
      <i className="ri-arrow-left-line text-xl"></i>
    </button>
  );

  return (
    <BasePage
      title="确认订单"
      showHeader
      headerLeft={headerLeft}
      backgroundColor="paper"
      className="!pb-0"
    >
      <div className="max-w-lg mx-auto w-full pt-2 pb-28">
        {/* 地址卡片 */}
        <div
          className="bg-white rounded-xl shadow flex items-center px-4 py-3 mb-4 cursor-pointer border border-gray-100"
          onClick={handleEditAddress}
        >
          <i className="ri-map-pin-2-line text-xl text-primary mr-3" />
          <div className="flex-1 min-w-0">
            {address && address.name ? (
              <>
                <div className="flex items-center mb-1">
                  <span className="font-medium text-base mr-2">{address.name}</span>
                  <span className="text-gray-500 text-sm">{address.phone}</span>
                </div>
                <div className="text-gray-500 text-sm truncate">
                  {[address.province, address.city, address.district, address.address].filter(Boolean).join(" ")}
                </div>
              </>
            ) : (
              <span className="text-gray-400 text-sm">暂无默认收货地址，点击添加</span>
            )}
          </div>
          <i className="ri-arrow-right-s-line text-gray-400 ml-2" />
        </div>

        {/* 商品卡片 */}
        {selectedItems.map(item => (
          <div
            key={item.productId}
            className="bg-white rounded-xl shadow flex px-4 py-3 mb-3 border border-gray-100"
          >
            <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded object-cover mr-3" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base truncate">{item.productName}</div>
              <div className="text-xs text-gray-400 mt-1 truncate">
                {item.specifications?.map(spec => `${spec.name}-${spec.values.join(",")}`).join("，")}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-primary font-bold">¥{item.price}</span>
                <span className="text-xs text-gray-500">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}

        {/* 支付方式 */}
        <div className="bg-white rounded-xl shadow px-4 py-3 border border-gray-100 mb-3">
          <div className="font-medium text-base mb-2">支付方式</div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "支付宝"}
              onChange={() => setPaymentMethod("支付宝")}
              className="accent-primary mr-2"
            />
            <i className="ri-alipay-line text-xl text-blue-500 mr-2" />
            <span className="text-sm">支付宝</span>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "微信支付"}
              onChange={() => setPaymentMethod("微信支付")}
              className="accent-primary mr-2"
            />
            <i className="ri-wechat-pay-line text-xl text-green-500 mr-2" />
            <span className="text-sm">微信支付</span>
          </div>
        </div>
      </div>

      {/* 底部栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between shadow-lg z-10">
        <div>
          <span className="text-gray-500 text-sm">合计：</span>
          <span className="text-primary text-xl font-bold ml-1">¥{calculateTotal().toFixed(2)}</span>
        </div>
        <button
          className="rounded-button px-8 py-2 bg-primary text-white text-base font-bold shadow"
          onClick={handleConfirmPayment}
        >
          确认支付
        </button>
      </div>
    </BasePage>
  );
};

export default Payment;