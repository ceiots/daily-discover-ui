import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../utils/axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems, shopInfo } = location.state || { selectedItems: [], shopInfo: {} };

  const [address, setAddress] = useState({
    name: "张文杰",
    phone: "13812345678",
    address: "浙江省杭州市西湖区文三路 478 号创意产业园区",
  });

  const [paymentMethod, setPaymentMethod] = useState("支付宝");
  const [clientIp, setClientIp] = useState("");

  useEffect(() => {
    // Fetch client IP address from an external API
    // Note: This is a placeholder. In a real application, you would use an actual API.
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => setClientIp(data.ip))
      .catch(error => console.error('Error fetching client IP:', error));
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditAddress = () => {
    console.log("Edit address");
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleConfirmPayment = async () => {
    const orderNo = generateOrderNumber();
    // 从 localStorage 中获取当前登录用户的 userId
    const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null;
    if (!userId) {
        // 若未获取到 userId，可根据实际情况处理，这里简单提示
        alert('未获取到用户 ID，请重新登录');
        navigate('/login')
        return;
    }

    try {
        const response = await instance.post('/payment/confirm', {
            userId: userId, // 使用动态获取的 userId
            itemIds: selectedItems.map(item => item.id),
            payType: paymentMethod === "支付宝" ? '1' : '2',
            orderNo,
            totalAmount: calculateTotal(),
            subject: '订单支付',
            clientIp,
        });

        const result = response.data; 
        if (result.code === 200) {
            //alert('支付成功: ' + JSON.stringify(result.data));
            /* if (result.data.payForm) {
                document.write(result.data.payForm);
            } else if (result.data.codeUrl) {
                window.open(result.data.codeUrl, '_blank');
            } */
                navigate('/order-confirmation', {
                  state: {
                    orderNo
                  }
              });
        } else {
            alert('支付失败: ' + result.message);
        }
    } catch (error) {
        console.error('支付请求失败', error);
        alert('支付请求失败，请稍后重试');
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
        <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center">
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
                <div className="flex items-center">
                  <span className="font-medium text-sm mr-2">{address.name}</span>
                  <span className="text-sm text-gray-500">{address.phone}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{address.address}</p>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </div>
          {selectedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-100">
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
                  <p className="text-xs text-gray-500">规格：{item.specifications.map(spec => `${spec.name}-${spec.values.join(', ')}`).join('，')}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-medium">¥ {item.price}</span>
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
              { <div className="flex items-center justify-between">
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
              </div> }
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-5 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <span className="text-sm text-gray-500">合计：</span>
            <span className="text-lg font-medium text-primary ml-1">¥ {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex-1 flex justify-end">
            <button className="px-8 bg-primary text-white text-sm rounded-button" onClick={handleConfirmPayment}>
              确认支付
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;