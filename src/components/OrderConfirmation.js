import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, CheckOutlined } from "@ant-design/icons";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewOrder = () => {
    navigate('/order');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 w-full h-[56px] bg-[#7B66FF] flex items-center px-4 z-50">
        <button className="text-white" onClick={handleBack}>
          <LeftOutlined className="text-xl" />
        </button>
        <span className="flex-1 text-center text-white text-lg font-medium">
          支付成功
        </span>
      </div>
      {/* 主要内容区域 */}
      <div className="pt-[56px] px-4">
        {/* 支付结果展示 */}
        <div className="flex flex-col items-center mt-12 mb-10">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-4">
            <CheckOutlined className="text-white text-2xl" />
          </div>
          <h2 className="text-base font-medium mb-2">支付成功</h2>
          <div className="text-[#7B66FF] text-2xl font-semibold">¥468.00</div>
        </div>
        {/* 订单信息 */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">订单编号</span>
            <span className="text-gray-700 text-sm">202502271234567890</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">支付时间</span>
            <span className="text-gray-700 text-sm">2025-02-27 08:26:35</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">支付方式</span>
            <div className="flex items-center">
              <i className="fab fa-alipay text-[#1677FF] mr-1"></i>
              <span className="text-gray-700 text-sm">支付宝</span>
            </div>
          </div>
        </div>
      </div>
      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 w-full p-4 flex space-x-4 bg-white border-t border-gray-100">
        <button
          onClick={handleViewOrder}
          className="flex-1 h-9 border border-[#7B66FF] text-[#7B66FF] text-sm rounded-lg !rounded-button"
        >
          查看订单
        </button>
        <button
          onClick={handleReturnHome}
          className="flex-1 h-9 bg-[#7B66FF] text-white text-sm rounded-lg !rounded-button"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;