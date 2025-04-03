import React, { useEffect, useState } from "react";
import { useAuth } from "../App";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userInfo, refreshUserInfo, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 新增登录态校验
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 组件加载时强制刷新
  useEffect(() => {
    // 确保只有在已登录且没有用户信息时才刷新
    if (isLoggedIn && (!userInfo || !userInfo.id)) {
      refreshUserInfo();
    }
  }, [isLoggedIn, refreshUserInfo, userInfo]);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        
        if (!userId) {
          navigate("/login");
          return;
        }
        const response = await instance.get(`/user/info?userId=${userId}`);
        setProfileInfo(response.data);

        console.log("userInfo:", userInfo);
        // 只有当全局用户信息不存在时才刷新
        if (!userInfo || !userInfo.id) {
          refreshUserInfo();
        }
      } catch (error) {
        setError("获取用户信息失败");
      } finally {
        setLoading(false);
      }
    };

    // 只有在已登录状态下才获取用户信息
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [navigate, refreshUserInfo, isLoggedIn, userInfo]);

  const ORDER_TABS = [
    { id: 0, name: "全部" },
    { id: 1, name: "待付款" },
    { id: 2, name: "待发货" },
    { id: 3, name: "待收货" },
    { id: 4, name: "已完成" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      try {
        if (!userId) {
          navigate("/login");
          return;
        }
      
      } catch (error) {
          setError("获取订单失败");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab, refreshUserInfo]);


  // 在页面加载时检查
  useEffect(() => {
    /* console.log(
      "页面加载检查 - token:",
      localStorage.getItem("token"),
      "userId:",
      localStorage.getItem("userId")
    ); */
  }, []);

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-50 pb-[60px]">
      {/* 用户信息卡片 */}
      <div className="bg-primary rounded-lg p-4 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
            <img
              src={
                profileInfo?.avatar ||
                "https://public.readdy.ai/ai/img_res/7b50db19b2e90195755169d36aa07020.jpg"
              }
              className="w-full h-full object-cover"
              alt="用户头像"
            />
          </div>
          <div className="flex-1">
            <div className="text-lg font-medium">
              {profileInfo?.nickname || "加载中..."}
            </div>
            <div className="text-sm opacity-90">
              会员等级：{profileInfo?.memberLevel || "加载中..."}
            </div>
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
          {/* <div
            className="text-xs text-gray-500 flex items-center cursor-pointer"
            onClick={() => navigate("/order-list")} // 添加点击事件处理函数
          >
            查看全部订单 <i className="ri-arrow-right-s-line ml-1"></i>
          </div> */}
        </div>
        {loading && <div>加载中...</div>}
       {/*  {error && <div>{error}</div>} */}
        <div className="grid grid-cols-5 text-center">
          {ORDER_TABS.map((tab) => (
            <div
              key={tab.id}
              className={`order-item flex flex-col items-center space-y-1 cursor-pointer ${
                activeTab === tab.id ? "text-primary" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center relative"
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发父元素的 onClick
                  navigate(`/order-list/${tab.id}`);
                }}
              >
                {/* 根据不同状态显示不同图标 */}
                {tab.id === 0 && (
                  <i className="ri-list-unordered text-xl text-gray-700"></i>
                )}
                {tab.id === 1 && (
                  <i className="ri-wallet-3-line text-xl text-gray-700"></i>
                )}
                {tab.id === 2 && (
                  <i className="ri-truck-line text-xl text-gray-700"></i>
                )}
                {tab.id === 3 && (
                  <i className="ri-inbox-archive-line text-xl text-gray-700"></i>
                )}
                {tab.id === 4 && (
                  <i className="ri-check-line text-xl text-gray-700"></i>
                )}
              </div>
              <span 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发父元素的 onClick
                  navigate(`/order-list/${tab.id}`);
                }}
              >
                {tab.name}
              </span>
            </div>
          ))}
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
