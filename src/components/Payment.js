import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "张文杰",
    phone: "13812345678",
    address: "浙江省杭州市西湖区文三路 478 号创意产业园区",
  });

  const [paymentMethod, setPaymentMethod] = useState("支付宝");
  const [quantities, setQuantities] = useState({
    item1: 1,
    item2: 1,
    item3: 1,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditAddress = () => {
    // 打开地址编辑对话框的逻辑
    console.log("Edit address");
  };

  const handleQuantityChange = (item, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(0, prev[item] + amount),
    }));
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleConfirmPayment = () => {
    // 处理确认支付逻辑
    console.log("Confirm payment with", paymentMethod);
  };

  const calculateTotal = () => {
    const prices = { item1: 300, item2: 468, item3: 288 };
    return Object.keys(quantities).reduce(
      (total, key) => total + quantities[key] * prices[key],
      0
    );
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
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <i className="ri-store-2-line text-white text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium">国家文物局</span>
            </div>
            <div className="flex items-start space-x-3 pb-2 border-b border-gray-100">
              <img
                src="https://public.readdy.ai/ai/img_res/7c193ee857fff69d7fd31a0dd0c7d937.jpg"
                className="w-20 h-20 object-cover rounded"
                alt="茶具"
              />
              <div className="flex-1">
                <h3 className="text-sm mb-1">陕西发现首个完整西周时期贵族墓园</h3>
                <p className="text-xs text-gray-500">规格：毛笔型号-小楷，颜色-蓝色</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-medium">¥ 300</span>
                  <div className="flex items-center space-x-3">
                    <button
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleQuantityChange("item1", -1)}
                    >
                      -
                    </button>
                    <span className="text-sm">{quantities.item1}</span>
                    <button
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleQuantityChange("item1", 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                <i className="ri-store-2-line text-white text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium">品茗轩旗舰店</span>
            </div>
            <div className="flex items-start space-x-3 pb-2 border-b border-gray-100">
              <img
                src="https://public.readdy.ai/ai/img_res/2bc3e5e8ad165e912bd6a192c02a239e.jpg"
                className="w-20 h-20 object-cover rounded"
                alt="兵马俑"
              />
              <div className="flex-1">
                <h3 className="text-sm mb-1">景德镇手绘青花瓷茶具套装</h3>
                <p className="text-xs text-gray-500">规格：毛笔型号-中楷，颜色-蓝色</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-medium">¥ 468</span>
                  <div className="flex items-center space-x-3">
                    <button
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleQuantityChange("item2", -1)}
                    >
                      -
                    </button>
                    <span className="text-sm">{quantities.item2}</span>
                    <button
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleQuantityChange("item2", 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <img
                src="https://public.readdy.ai/ai/img_res/b9535ccc4d6d0134c46e6606e90408a4.jpg"
                className="w-20 h-20 object-cover rounded"
                alt="毛笔"
              />
              <div className="flex-1">
                <h3 className="text-sm mb-1">狼毫毛笔书法套装</h3>
                <p className="text-xs text-gray-500">规格：毛笔型号-大楷，颜色-黑色</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-medium">¥ 288</span>
                  <div className="flex items-center space-x-3">
                    <button
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleQuantityChange("item3", -1)}
                    >
                      -
                    </button>
                    <span className="text-sm">{quantities.item3}</span>
                    <button
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleQuantityChange("item3", 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <div className="flex items-center">
          <span className="text-sm text-gray-500">合计：</span>
          <span className="text-lg font-medium text-primary ml-1">¥ {calculateTotal().toFixed(2)}</span>
        </div>
        <button className="px-8 py-2 bg-primary text-white text-sm rounded-button" onClick={handleConfirmPayment}>
          确认支付
        </button>
      </div>
      </main>
    </div>
  );
};

export default Payment;
