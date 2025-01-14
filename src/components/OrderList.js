import React from "react";
import { Link } from "react-router-dom";

const OrderList = () => {
  // 示例订单数据
  const orders = [
    { id: "202401181530450001", amount: "¥2,399.00", date: "2024-01-18" },
    { id: "202401181530450002", amount: "¥1,199.00", date: "2024-01-19" },
  ];

  return (
    <body className="bg-gray-50">
      <div className="max-w-[375px] mx-auto min-h-screen pb-16">
        <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
          <div className="flex items-center h-[44px] px-4">
            <button className="!rounded-button p-2">
              <i className="fas fa-arrow-left text-gray-700"></i>
            </button>
            <h1 className="flex-1 text-center text-[15px] font-medium">
              我的订单
            </h1>
            <button className="!rounded-button p-2">
              <i className="fas fa-ellipsis-vertical text-gray-700"></i>
            </button>
          </div>
          <div className="flex px-4 h-[44px] items-center space-x-6 text-[13px]">
            <a href="#" className="text-primary border-b-2 border-primary px-1">
              全部
            </a>
            <a href="#" className="text-gray-600 px-1">
              待付款
            </a>
            <a href="#" className="text-gray-600 px-1">
              待发货
            </a>
            <a href="#" className="text-gray-600 px-1">
              待收货
            </a>
            <a href="#" className="text-gray-600 px-1">
              已完成
            </a>
          </div>
        </nav>
        <div className="mt-[88px] px-4 space-y-4">
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-store text-gray-600"></i>
                <span className="text-[13px]">Apple 官方旗舰店</span>
              </div>
              <span className="text-primary text-[13px]">待付款</span>
            </div>
            <div className="flex space-x-4">
              <img
                src="https://ai-public.mastergo.com/ai/img_res/d427ec27402fd44b3979a30a5e5f59c5.jpg"
                className="w-20 h-20 object-cover rounded-lg"
                alt="iPhone"
              />
              <div className="flex-1">
                <h3 className="text-[13px] font-medium">
                  iPhone 15 Pro Max 暗紫色 256GB
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  颜色：暗紫色 | 存储：256GB
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[13px]">¥ 9,999</span>
                  <span className="text-xs text-gray-500">x1</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div className="text-[12px] text-gray-500">
                  订单将在{" "}
                  <span className="text-primary font-medium">23:59:59</span>{" "}
                  后自动关闭
                </div>
                <button className="!rounded-button bg-primary text-white px-4 py-1.5 text-[13px]">
                  立即付款
                </button>
              </div>
              <div className="flex justify-between text-[13px] text-gray-600">
                <button className="!rounded-button flex items-center space-x-1">
                  <i className="fas fa-headset"></i>
                  <span>联系商家</span>
                </button>
                <button className="!rounded-button flex items-center space-x-1">
                  <i className="fas fa-undo"></i>
                  <span>申请售后</span>
                </button>
              </div>
            </div>
          </div>

          <Link
            to={`/order-detail/2`}
            key={2}
            className="bg-white rounded-lg shadow-sm p-4 mb-4"
          >
            <div className="bg-white rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-store text-gray-600"></i>
                  <span className="text-[13px]">Apple 官方旗舰店</span>
                </div>
                <span className="text-gray-500 text-sm">已完成</span>
              </div>
              <div className="flex space-x-4">
                <img
                  src="https://ai-public.mastergo.com/ai/img_res/c8d8d545a37d640d5c527ca92568e7db.jpg"
                  className="w-20 h-20 object-cover rounded-lg"
                  alt="Apple Watch"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Apple Watch Series 9</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    颜色：银色 | 尺寸：45mm
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">¥ 3,199</span>
                    <span className="text-xs text-gray-500">x1</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-[13px] text-gray-600">
                  <button className="!rounded-button flex items-center space-x-1">
                    <i className="fas fa-headset"></i>
                    <span>联系商家</span>
                  </button>
                  <button className="!rounded-button flex items-center space-x-1">
                    <i className="fas fa-undo"></i>
                    <span>申请售后</span>
                  </button>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fas fa-store text-gray-600"></i>
                <span className="text-[13px]">Apple 官方旗舰店</span>
              </div>
              <span className="text-green-500 text-sm">待收货</span>
            </div>
            <div className="flex space-x-4">
              <img
                src="https://ai-public.mastergo.com/ai/img_res/8623f1bdc63950b1f729ff9424a0f80b.jpg"
                className="w-20 h-20 object-cover rounded-lg"
                alt="AirPods"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium">AirPods Pro 2 降噪耳机</h3>
                <p className="text-xs text-gray-500 mt-1">
                  颜色：白色 | 版本：标准版
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">¥ 1,899</span>
                  <span className="text-xs text-gray-500">x1</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-truck mr-2"></i>
                  预计今日送达
                </div>
                <button className="!rounded-button bg-primary text-white px-4 py-1.5 text-sm">
                  确认收货
                </button>
              </div>
              <div className="bg-gray-50/60 rounded-lg p-3 mb-3 text-[13px]">
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-truck mr-2 text-primary"></i>
                  <span>包裹已由顺丰快递揽收，预计今日 18:00 前送达</span>
                </div>
              </div>
              <div className="flex justify-between text-[13px] text-gray-600">
                <button className="!rounded-button flex items-center space-x-1">
                  <i className="fas fa-headset"></i>
                  <span>联系商家</span>
                </button>
                <button className="!rounded-button flex items-center space-x-1">
                  <i className="fas fa-undo"></i>
                  <span>申请售后</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default OrderList;
