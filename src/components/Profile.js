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
  // 添加店铺状态
  const [hasShop, setHasShop] = useState(false);
  const [shopId, setShopId] = useState(null);

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

  // 添加检查用户是否有店铺的逻辑
  useEffect(() => {
    const checkUserShop = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          return;
        }
        
        const response = await instance.get('/shops/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.code === 200 && response.data.data) {
          setHasShop(true);
          setShopId(response.data.data.id);
        } else {
          setHasShop(false);
        }
      } catch (error) {
        console.error('检查用户店铺失败：', error);
        setHasShop(false);
      }
    };
    
    if (isLoggedIn) {
      checkUserShop();
    }
  }, [isLoggedIn]);

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

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userInfo.id);

    try {
      const response = await instance.post("/user/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.avatar) {
        setProfileInfo((prev) => ({ ...prev, avatar: response.data.avatar }));
        refreshUserInfo(); // 刷新全局用户信息
      }
    } catch (error) {
      console.error("头像上传失败:", error);
    }
  };

  // 添加退出登录处理函数
  const handleLogout = async () => {
    try {
      await instance.post("/user/logout");
      // 清除本地存储
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      // 重置用户状态
      refreshUserInfo();
      // 跳转到登录页
      navigate("/login");
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  // 在页面加载时检查
  useEffect(() => {
    /* console.log(
      "页面加载检查 - token:",
      localStorage.getItem("token"),
      "userId:",
      localStorage.getItem("userId")
    ); */
  }, []);

  // 功能菜单配置
  const FEATURE_MENUS = [
    {
      title: "我的服务",
      items: [
        { 
          icon: "ri-shopping-bag-line", 
          text: "我的订单", 
          onClick: () => navigate('/order-list/all') 
        },
        { 
          icon: "ri-map-pin-line", 
          text: "收货地址", 
          onClick: () => navigate('/edit-address') 
        },
        { 
          icon: "ri-user-3-line", 
          text: "个人信息", 
          onClick: () => navigate('/settings/profile') 
        },
      ]
    },
    {
      title: "创作与经营",
      items: [
        { 
          icon: "ri-pencil-line", 
          text: "内容创作", 
          onClick: () => navigate('/content-creation') 
        },
        { 
          icon: "ri-shopping-cart-2-line", 
          text: "商品发布", 
          onClick: () => navigate('/ecommerce-creation') 
        },
        { 
          icon: "ri-file-list-line", 
          text: "内容管理", 
          onClick: () => navigate('/my-content') 
        }
      ]
    },
    {
      title: "设置",
      items: [
        { 
          icon: "ri-settings-3-line", 
          text: "账户设置", 
          onClick: () => navigate('/settings') 
        },
        { 
          icon: "ri-lock-password-line", 
          text: "支付密码", 
          onClick: () => navigate('/payment-password') 
        },
        { 
          icon: "ri-logout-box-r-line", 
          text: "退出登录", 
          onClick: handleLogout 
        }
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-50 pb-[60px]">
      {/* 用户信息卡片 */}
      <div className="bg-primary rounded-lg p-4 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white relative">
            <img
              src={
                profileInfo?.avatar ||
                "https://public.readdy.ai/ai/img_res/7b50db19b2e90195755169d36aa07020.jpg"
              }
              className="w-full h-full object-cover"
              alt="用户头像"
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleAvatarUpload}
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
          <div 
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => navigate('/settings')} // 添加点击事件
          >
            <i className="ri-settings-3-line text-xl"></i>
          </div>
        </div>
      </div>

      {/* 订单管理 */}
      {false && (
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-medium">我的订单</div>
            <div
            className="text-xs text-gray-500 flex items-center cursor-pointer"
            onClick={() => navigate("/order-list")} // 添加点击事件处理函数
          >
            查看全部订单 <i className="ri-arrow-right-s-line ml-1"></i>
            </div> 
        </div>
        {loading && <div>加载中...</div>}
           {error && <div>{error}</div>} 
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
                    navigate(`/order-list/${tab.id === 0 ? 'all' : tab.id}`);
                }}
              >
                  {/* 图标 */}
                {tab.id === 0 && (
                    <i className="ri-file-list-line text-xl"></i>
                )}
                {tab.id === 1 && (
                    <i className="ri-bank-card-line text-xl"></i>
                )}
                {tab.id === 2 && (
                    <i className="ri-gift-line text-xl"></i>
                )}
                {tab.id === 3 && (
                    <i className="ri-truck-line text-xl"></i>
                )}
                {tab.id === 4 && (
                    <i className="ri-checkbox-circle-line text-xl"></i>
                )}
                  {/* 数量提示 */}
                   {tab.count > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {tab.count}
                    </div>
                  )} 
                </div>
                <div className="text-xs">{tab.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      

      {/* 功能菜单 */}
      {FEATURE_MENUS.map((menu, index) => (
        <div key={index} className="bg-white rounded-lg p-4 mt-3">
          <div className="text-base font-medium mb-3">{menu.title}</div>
          <div className="grid grid-cols-3 gap-3">
            {menu.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center py-3 cursor-pointer"
                onClick={item.onClick}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                  <i className={`${item.icon} text-primary text-xl`}></i>
                </div>
                <div className="text-xs">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
      ))}

      {/* 店铺信息卡片 */}
      <div className="bg-white rounded-lg p-4 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-medium">我的店铺</div>
          <div
            className="text-xs text-gray-500 flex items-center cursor-pointer"
            onClick={() => hasShop ? navigate(`/shop/${shopId}`) : navigate('/create-shop')}
          >
            {hasShop ? '查看店铺主页' : '创建店铺'} <i className="ri-arrow-right-s-line ml-1"></i>
          </div>
          </div>
        
        {hasShop ? (
        <div className="grid grid-cols-2 gap-3">
          <div 
              className="flex flex-col items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => navigate(`/shop-edit/${shopId}`)}
          >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <i className="ri-store-2-line text-primary text-xl"></i>
              </div>
              <div className="text-xs mt-1">店铺设置</div>
          </div>
          
          <div 
              className="flex flex-col items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => navigate('/product-manage')}
          >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <i className="ri-shopping-basket-2-line text-primary text-xl"></i>
              </div>
              <div className="text-xs mt-1">商品管理</div>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center py-5 bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => navigate('/create-shop')}
          >
            <i className="ri-store-2-line text-primary text-3xl mb-2"></i>
            <div className="text-sm text-gray-600 mb-2">您还没有创建店铺</div>
            <button 
              className="px-4 py-1.5 bg-primary text-white text-xs rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/create-shop');
              }}
            >
              立即创建
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
