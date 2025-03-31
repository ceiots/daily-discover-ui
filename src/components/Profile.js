import React, { useEffect, useState } from "react";
import { useAuth } from "../App";
import instance from "../utils/axios";

const Profile = () => {
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);

  const ORDER_TABS = [
    { id: "all", name: "全部" },
    { id: 0, name: "待付款" },
    { id: 1, name: "待发货" },
    { id: 2, name: "待收货" },
    { id: 3, name: "已完成" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.get(`/orders/user?status=${activeTab}`);
        setOrders(response.data);
      } catch (error) {
        console.error("获取订单失败:", error);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const handleCancelOrder = async (orderId) => {
    try {
      await instance.post(`/orders/${orderId}/cancel`);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("取消订单失败:", error);
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-50 pb-[60px]">
      {/* 用户信息卡片 */}
      <div className="bg-primary rounded-lg p-4 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
            <img
              src="https://public.readdy.ai/ai/img_res/7b50db19b2e90195755169d36aa07020.jpg"
              className="w-full h-full object-cover"
              alt="用户头像"
            />
          </div>
          <div className="flex-1">
            <div className="text-lg font-medium">陈雅婷</div>
            <div className="text-sm opacity-90">会员等级：黄金会员</div>
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-settings-3-line text-xl"></i>
          </div>
        </div>
      </div>

      {/* 订单管理 */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-medium">我的订单</div>
          <div className="text-xs text-gray-500 flex items-center">
            查看全部订单 <i className="ri-arrow-right-s-line ml-1"></i>
          </div>
        </div>
        <div className="grid grid-cols-5 text-center">
          <div className="order-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center relative">
              <i className="ri-wallet-3-line text-xl text-gray-700"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </div>
            <span className="text-xs">待付款</span>
          </div>
          <div className="order-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-truck-line text-xl text-gray-700"></i>
            </div>
            <span className="text-xs">待发货</span>
          </div>
          <div className="order-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center relative">
              <i className="ri-inbox-archive-line text-xl text-gray-700"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </div>
            <span className="text-xs">待收货</span>
          </div>
          <div className="order-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-chat-1-line text-xl text-gray-700"></i>
            </div>
            <span className="text-xs">待评价</span>
          </div>
          <div className="order-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-customer-service-2-line text-xl text-gray-700"></i>
            </div>
            <span className="text-xs">售后</span>
          </div>
        </div>
      </div>

      {/* 我的服务 */}
      <div className="bg-white rounded-lg p-4">
        <div className="text-base font-medium mb-3">我的服务</div>
        <div className="grid grid-cols-4 gap-y-4">
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/cd9080a28513d62910830645c40aab58.jpg" 
                className="w-full h-full object-cover" 
                alt="地址管理" 
              />
            </div>
            <span className="text-xs">地址管理</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/dbc44988f5c99f32a1c1ee7412fbba35.jpg" 
                className="w-full h-full object-cover" 
                alt="我的收藏" 
              />
            </div>
            <span className="text-xs">我的收藏</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/9eff0e45f6ff14d4aaa12b3be82f20fd.jpg" 
                className="w-full h-full object-cover" 
                alt="优惠券" 
              />
            </div>
            <span className="text-xs">优惠券</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/0a123b33fc2c67bb522bcbafe353e1ea.jpg" 
                className="w-full h-full object-cover" 
                alt="购物车" 
              />
            </div>
            <span className="text-xs">购物车</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/53037345ad836010cf384a85fadbac6a.jpg" 
                className="w-full h-full object-cover" 
                alt="积分商城" 
              />
            </div>
            <span className="text-xs">积分商城</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/90073da34afb4471265da18a254c47ec.jpg" 
                className="w-full h-full object-cover" 
                alt="我的钱包" 
              />
            </div>
            <span className="text-xs">我的钱包</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/7a113086b48c5e0133282226db445fd4.jpg" 
                className="w-full h-full object-cover" 
                alt="联系客服" 
              />
            </div>
            <span className="text-xs">联系客服</span>
          </div>
          <div className="service-item flex flex-col items-center space-y-1 cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/d7fc2f18b0e07eaad3561dbbe1244a7c.jpg" 
                className="w-full h-full object-cover" 
                alt="意见反馈" 
              />
            </div>
            <span className="text-xs">意见反馈</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
