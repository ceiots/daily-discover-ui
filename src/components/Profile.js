import React, { useEffect, useState } from 'react';
import { useAuth } from "../App";
import instance from '../utils/axios';

const Profile = () => {
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);

  const ORDER_TABS = [
    { id: 'all', name: '全部' },
    { id: 0, name: '待付款' },
    { id: 1, name: '待发货' },
    { id: 2, name: '待收货' },
    { id: 3, name: '已完成' }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.get(`/orders/user?status=${activeTab}`);
        setOrders(response.data);
      } catch (error) {
        console.error('获取订单失败:', error);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const handleCancelOrder = async (orderId) => {
    try {
      await instance.post(`/orders/${orderId}/cancel`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('取消订单失败:', error);
    }
  };

  return (
    <div className="w-[375px] min-h-screen mx-auto bg-gray-50 pb-[60px]">
      {/* 用户信息头部 */}
      <div className="profile-card h-[180px] pt-8 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="avatar w-16 h-16 rounded-full bg-white overflow-hidden">
              <img 
                src={userInfo?.avatar || "https://public.readdy.ai/ai/img_res/default-avatar.jpg"} 
                className="w-full h-full object-cover"
                alt="用户头像"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-white text-lg font-medium">{userInfo?.nickname || '未登录'}</h3>
              <p className="text-white/80 text-sm mt-1">ID: {userInfo?.id || '--'}</p>
            </div>
          </div>
          <button className="text-white text-sm">设置</button>
        </div>
      </div>

      {/* 服务网格 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-lg p-4 grid grid-cols-4 gap-4">
          {[
            { icon: 'ri-heart-line', name: '我的收藏' },
            { icon: 'ri-coupon-line', name: '优惠券' },
            { icon: 'ri-shopping-cart-line', name: '购物车' },
            { icon: 'ri-gift-line', name: '积分商城' },
            { icon: 'ri-wallet-line', name: '我的钱包' },
            { icon: 'ri-customer-service-line', name: '联系客服' },
            { icon: 'ri-feedback-line', name: '意见反馈' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                <i className={`${item.icon} text-xl text-gray-600`} />
              </div>
              <span className="text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 订单导航 */}
      <div className="px-4 mt-6">
        <div className="flex overflow-x-auto order-tab gap-4 pb-2">
          {ORDER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 订单列表 */}
      <div className="px-4 mt-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">订单号：{order.orderNumber}</span>
              <span className="text-primary text-sm">{order.statusStr}</span>
            </div>
            {/* 订单商品项... */}
            <div className="flex justify-end gap-2 mt-4">
              {order.status === 0 && (
                <button 
                  onClick={() => handleCancelOrder(order.id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  取消订单
                </button>
              )}
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                立即支付
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Profile;