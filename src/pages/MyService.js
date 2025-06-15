import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useAuth } from "../hooks/useAuth";
import instance from "../services/http/instance";
import { useNavigate } from "react-router-dom";
import { BasePage } from "../theme";

// 默认头像 - 更适合的用户头像
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzc2NmRlOCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjkwIiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTAsMTk4LjE5QTE0OS40MSwxNDkuNDEsMCwwLDEsMTI4LDIyNCw0OS4xLDQ5LjEsMCwwLDEsNDYsMTk4LjE5LDEyOCwxMjgsMCwwLDAsMjEwLDE5OC4xOVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';

const Profile = () => {
  const { userInfo, refreshUserInfo, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // 强化登录态校验，确保未登录时不显示头像
  useEffect(() => {
    // 登出状态时强制跳转登录页
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // 检查 localStorage 是否有 token，没有则直接登出并跳转
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      navigate("/login");
      return;
    }
    
    // 强制刷新用户信息，确保退出登录后不会显示头像
    refreshUserInfo();
  }, [isLoggedIn, navigate, logout, refreshUserInfo]);

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
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          logout();
          navigate("/login");
          return;
        }
        
        const response = await instance.get(`/user/info?userId=${userId}`);
        if (response.data && response.data.code === 200) {
          setProfileInfo(response.data.data);
        } else {
          // 如果获取失败，可能是登录状态有问题，清理登录状态
          logout();
          navigate("/login");
        }
      } catch (error) {
        setError("获取用户信息失败");
        // 如果获取失败，可能是登录状态有问题，清理登录状态
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    // 只有在已登录状态下才获取用户信息
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [navigate, refreshUserInfo, isLoggedIn, logout]);

  // 添加检查用户是否有店铺的逻辑
  useEffect(() => {
    const checkUserShop = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          return;
        }
        
        const response = await instance.get('/shop/user', {
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
          onClick: () => navigate('/address-list') 
        },
        { 
          icon: "ri-shopping-cart-line", 
          text: "购物车", 
          onClick: () => navigate('/cart') 
        },
      ]
    },
    {
      title: "创作与经营",
      items: [
        { 
          icon: "ri-pencil-line", 
          text: "我的创作", 
          onClick: () => navigate('/my-content') 
        },
        { 
          icon: hasShop ? "ri-store-2-line" : "ri-store-line", 
          text: hasShop ? "我的店铺" : "开通店铺", 
          onClick: () => hasShop ? navigate(`/shop-edit/${shopId}`) : navigate('/shop-creation')
        },
        { 
          icon: "ri-shopping-basket-line", 
          text: "商品管理", 
          onClick: () => navigate('/product-manage'),
          disabled: !hasShop
        },
      ]
    },
    {
      title: "设置与帮助",
      items: [
        { 
          icon: "ri-settings-line", 
          text: "账号设置", 
          onClick: () => navigate('/settings') 
        },
        { 
          icon: "ri-customer-service-line", 
          text: "客户服务", 
          onClick: () => navigate('/customer-service') 
        },
        { 
          icon: "ri-information-line", 
          text: "关于我们", 
          onClick: () => navigate('/about') 
        },
      ]
    }
  ];

  // 功能菜单组件
  const FeatureMenu = ({ title, items }) => (
    <div className="feature-menu bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h3 className="text-gray-700 font-medium mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`feature-item flex flex-col items-center justify-center p-3 rounded-lg ${
              item.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-gray-50'
            }`}
            onClick={!item.disabled ? item.onClick : undefined}
          >
            <i className={`${item.icon} text-2xl text-primary-600 mb-2`}></i>
            <span className="text-sm text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  FeatureMenu.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool
      })
    ).isRequired
  };

  return (
    <BasePage title="我的" showHeader={true} headerTitle="我的服务">
      <div className="profile-page bg-gray-100 min-h-screen pb-20">
        {/* 用户信息卡片 */}
        <div className="user-card bg-white p-4 mb-4 relative">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={profileInfo?.avatar || DEFAULT_AVATAR}
                alt="用户头像"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
              />
              <label className="absolute bottom-0 right-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                <i className="ri-camera-line text-white text-xs"></i>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-800">
                {profileInfo?.nickname || userInfo?.nickname || "用户"}
              </h2>
              <p className="text-sm text-gray-500">
                {profileInfo?.bio || "这个用户很懒，还没有设置个人简介"}
              </p>
            </div>
          </div>
          
          {/* 会员信息 */}
          <div className="mt-4 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg p-3 text-white">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs opacity-80">会员等级</span>
                <div className="flex items-center">
                  <i className="ri-vip-crown-line mr-1"></i>
                  <span className="font-medium">{profileInfo?.vipLevel || "普通会员"}</span>
                </div>
              </div>
              <div>
                <span className="text-xs opacity-80">积分</span>
                <div className="flex items-center">
                  <i className="ri-coin-line mr-1"></i>
                  <span className="font-medium">{profileInfo?.points || 0}</span>
                </div>
              </div>
              <div>
                <span className="text-xs opacity-80">优惠券</span>
                <div className="flex items-center">
                  <i className="ri-coupon-line mr-1"></i>
                  <span className="font-medium">{profileInfo?.couponCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 功能菜单 */}
        {FEATURE_MENUS.map((menu, index) => (
          <FeatureMenu key={index} title={menu.title} items={menu.items} />
        ))}

        {/* 退出登录按钮 */}
        <div className="mt-6 px-4">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full py-3 text-center text-gray-600 bg-white rounded-lg shadow-sm"
          >
            退出登录
          </button>
        </div>
      </div>
    </BasePage>
  );
};

export default Profile;