import React from "react";
import { Link } from "react-router-dom";

const OrderList = () => {
  // 示例订单数据
  const orders = [
    {
      id: "202401181530450001",
      amount: "¥2,399.00",
      date: "2024-01-18",
      store: "Apple 官方旗舰店",
      product: {
        name: "iPhone 15 Pro Max 暗紫色 256GB",
        image: "https://public.readdy.ai/ai/img_res/b5d28e562dfc6c03fa6d94b5d5b312d5.jpg",
        color: "暗紫色",
        storage: "256GB",
        price: "¥ 9,999",
        quantity: 1
      },
      status: "待付款",
      countdown: "23:59:59"
    },
    {
      id: "202401181530450002",
      amount: "¥1,199.00",
      date: "2024-01-19",
      store: "Apple 官方旗舰店",
      product: {
        name: "Apple Watch Series 9",
        image: "https://public.readdy.ai/ai/img_res/d74645607e64ba6a1a289605a7553237.jpg",
        color: "银色",
        size: "45mm",
        price: "¥ 3,199",
        quantity: 1
      },
      status: "已完成"
    }
  ];

  return (
    <div className="bg-gray-50">
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
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-store text-gray-600"></i>
                  <span className="text-[13px]">{order.store}</span>
                </div>
                <span className={`text-[13px] ${order.status === '待付款' ? 'text-primary' : 'text-gray-500'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex space-x-4">
                <img
                  src={order.product.image}
                  className="w-20 h-20 object-cover rounded-lg"
                  alt={order.product.name}
                />
                <div className="flex-1">
                  <h3 className="text-[13px] font-medium">
                    {order.product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.product.color ? `颜色：${order.product.color}` : ''}
                    {order.product.storage ? ` | 存储：${order.product.storage}` : ''}
                    {order.product.size ? ` | 尺寸：${order.product.size}` : ''}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[13px]">{order.product.price}</span>
                    <span className="text-xs text-gray-500">x{order.product.quantity}</span>
                  </div>
                </div>
              </div>
              {order.status === '待付款' && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[12px] text-gray-500">
                      订单将在{" "}
                      <span className="text-primary font-medium">{order.countdown}</span>{" "}
                      后自动关闭
                    </div>
                    <button className="!rounded-button bg-primary text-white px-4 py-1.5 text-[13px]">
                      立即付款
                    </button>
                  </div>
                </div>
              )}
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
          ))}
        </div>
      </div>
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100">
        <div className="grid grid-cols-3 h-16">
          <button className="flex flex-col items-center justify-center gap-1">
            <i className="ri-compass-3-line text-xl"></i>
            <span className="text-xs">发现</span>
          </button>
          <button className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -mt-4">
              <i className="ri-add-line text-2xl text-white"></i>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <i className="ri-calendar-line text-xl"></i>
            <span className="text-xs">日历</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default OrderList;
