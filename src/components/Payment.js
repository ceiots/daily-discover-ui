import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../utils/axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  // 打印 selectedItems 进行调试
  console.log("selectedItems:", selectedItems);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("支付宝");
  const [clientIp, setClientIp] = useState("");

  useEffect(() => {
    const fetchClientIp = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setClientIp(data.ip);
      } catch (error) {
        console.error("Error fetching client IP:", error);
      }
    };
    fetchClientIp();

    const fetchAddress = async () => {
      try {
        const userId = localStorage.getItem("userId")
          ? parseInt(localStorage.getItem("userId"))
          : null;
        if (!userId) {
          console.error("未获取到用户 ID");
          return navigate("/login");
        }
        const response = await instance.get(
          `/orderAddr/getDefaultByUserId?userId=${userId}`
        );
        console.log(userId + " 获取到的地址信息:", response.data);
        setAddress(response.data.data);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditAddress = () => {
    const userId = localStorage.getItem("userId")
      ? parseInt(localStorage.getItem("userId"))
      : null;
    if (userId) {
      navigate("/edit-address", {
        state: {
          userId,
          currentAddress: address,
        },
      });
    } else {
      console.error("未获取到用户 ID，无法编辑地址");
    }
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleConfirmPayment = async () => {
    const orderNo = generateOrderNumber();
    const userId = localStorage.getItem("userId")
      ? parseInt(localStorage.getItem("userId"))
      : null;
    if (!userId) {
      alert("未获取到用户 ID，请重新登录");
      navigate("/login");
      return;
    }

    try {

      const createOrderResponse = await instance.post("/order/create", {
        userId,
        orderNo,
        itemIds: selectedItems.map((item) => item.id),
        totalAmount: calculateTotal(),
        payType: paymentMethod === "支付宝" ? 1 : 2,
        address: {
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          address: address.address,
        },
        items: selectedItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          shopAvatarUrl: item.shopAvatarUrl,
          shopName: item.shopName,
          imageUrl: item.productImage,
          name: item.productName,
          price: item.price,
          specifications: item.specifications,
        })), // 新增，传递商品数量、价格及规格信息
      });

      const createOrderResult = createOrderResponse.data;
      if (createOrderResult.code === 200) {
        // 跳转到输入密码页面
        navigate("/payment-password", {
          state: {
            orderNo,
            paymentAmount: createOrderResult.data.paymentAmount,
            paymentMethod: createOrderResult.data.paymentMethod,
          },
        });
      } else {
        alert("订单创建失败: " + createOrderResult.message);
      }
    } catch (error) {
      console.error("支付请求失败:", error);
      alert("支付请求失败，请稍后重试");
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`;
  };

  return (
    <div className="bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-white h-12 flex items-center justify-between px-4">
        <button
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>
        <span className="text-base font-medium">确认订单</span>
        <button className="w-8 h-8 flex items-center justify-center">
          <i className="ri-more-line text-xl"></i>
        </button>
      </nav>
      <main className="pt-14 pb-24 px-4">
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div
              className="flex items-center space-x-3 mb-2 cursor-pointer"
              onClick={handleEditAddress}
            >
              <i className="ri-map-pin-2-line text-lg text-primary"></i>
              <div className="flex-1">
                {address &&
                (address.name ||
                  address.phone ||
                  address.province ||
                  address.city ||
                  address.district ||
                  address.address) ? (
                  <>
                    <div className="flex items-center">
                      <span className="font-medium text-sm mr-2">
                        {address.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {address.phone}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {address.province} {address.city} {address.district}{" "}
                      {address.address}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    暂无默认收货地址，请点击编辑添加
                  </p>
                )}
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </div>
          {selectedItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg p-3 border border-gray-100"
            >
              <div className="flex items-center mt-2 pb-2">
                <img
                  src={item.shopAvatarUrl}
                  className="w-6 h-6 rounded-full"
                  alt={item.shopName}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {item.shopName}
                </span>
              </div>
              <div className="flex items-start space-x-3 border-b border-gray-100">
                <img
                  src={item.productImage}
                  className="w-20 h-20 object-cover rounded"
                  alt={item.productName}
                />
                <div className="flex-1">
                  <h3 className="text-sm mb-1">{item.productName}</h3>
                  <p className="text-xs text-gray-500">
                    规格：
                    {item.specifications
                      .map((spec) => `${spec.name}-${spec.values.join(", ")}`)
                      .join("，")}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-medium">
                      ¥ {item.price}
                    </span>
                    <span className="text-sm">数量: {item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <h3 className="text-sm font-medium mb-2">支付方式</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-alipay-line text-2xl text-blue-500"></i>
                  <span className="ml-2 text-sm">支付宝</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "支付宝"}
                  onChange={() => handlePaymentChange("支付宝")}
                  className="w-4 h-4 accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-wechat-pay-line text-2xl text-green-500"></i>
                  <span className="ml-2 text-sm">微信支付</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "微信支付"}
                  onChange={() => handlePaymentChange("微信支付")}
                  className="w-4 h-4 accent-primary"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-5 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <span className="text-sm text-gray-500">合计：</span>
            <span className="text-lg font-medium text-primary ml-1">
              ¥ {calculateTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              className="px-8 bg-primary text-white text-sm rounded-button"
              onClick={handleConfirmPayment}
            >
              确认支付
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
