import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import instance from './utils/axios';
import Daily from './components/Daily';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Payment from './components/Payment';
import OrderConfirmation from './components/OrderConfirmation';
import { lazy, Suspense } from 'react';
const OrderList = lazy(() => import('./components/OrderList'));
import OrderDetail from './components/OrderDetail';
import LogisticsTracker from './components/LogisticsTracker';
import CommonHelmet from './components/CommonHelmet';
import RecommendationDetail from "./components/RecommendationDetail"; // 导入详情页面组件
import RefundForm from "./components/RefundForm"; // 导入退款表单组件
import RefundDetail from "./components/RefundDetail"; // 导入退款详情组件
import './App.css';
import EditAddress from './components/EditAddress';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import EventDetail from "./components/EventDetail"; // 事件详情页面
import CategoryPage from "./components/CategoryPage"; // 类别页面
import SearchResultsPage from './components/SearchResultsPage';
import PropTypes from 'prop-types';
import Settings from './components/settings/Settings';
import PaymentPassword from './components/PaymentPassword';
import PaymentPasswordSetting from './components/settings/PaymentPasswordSetting'; // 导入支付密码设置页面
import ContentCreationPage from './components/ContentCreationPage'; // 图文创作页面
import EcommerceCreationPage from './components/Creation/EcommerceCreationPage'; // 电商创建页面
import MyContentPage from './components/MyContentPage'; // 我的图文内容页面
import MyShopPage from './components/MyShopPage'; // 我的店铺内容页面
import ProductManagePage from './components/ProductManagePage'; // 商品管理页面
import CategoryManagePage from './components/CategoryManagePage'; // 商品分类管理页面
import ShopCreationPage from './components/ShopCreationPage'; // 店铺创建页
import ShopDetailPage from './components/ShopDetailPage'; // 店铺详情页面
import ShopEditPage from './components/ShopEditPage'; // 店铺编辑页面
import Discover from './components/Discover'; 
import { ThemeProvider } from './theme';
import ExamplePage from './ExamplePage';
import ProfileEdit from './components/settings/ProfileEdit';

// 创建认证上下文
const AuthContext = createContext();

// 导出useAuth函数，确保可以在其他组件中使用
export const useAuth = () => {
  return useContext(AuthContext);
};

// 新增 AuthProvider 组件
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // 新增加载状态
  const isInitialMountRef = useRef(true); // 添加一个引用来跟踪初始挂载

  // 初始化时加载用户信息
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 从本地存储中获取 token 和 userId
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // 使用 ref 确保只在第一次渲染时输出日志
        if (isInitialMountRef.current) {
          console.log("初始化检查 - token:", !!token, "userId:", userId);
          isInitialMountRef.current = false;
        }

        // 检查 token 和 userId 是否存在
        if (token && userId) {
          // 确保 userId 是有效值
          if (!userId || userId === 'null' || userId === 'undefined') {
            console.error('无效的 userId:', userId);
            // 清除本地存储中的无效数据
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setIsLoggedIn(false);
          } else {
            // 设置请求头中的 Authorization 字段
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 向服务器请求用户信息
            const response = await instance.get(`/user/info?userId=${userId}`);

            // 检查响应状态
            if (response.status === 200) {
              // 更新用户信息和登录状态
              setUserInfo(response.data);
              setIsLoggedIn(true);
            } else {
              console.error('用户信息请求失败:', response.statusText);
              // 清除本地存储中的无效数据
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              setIsLoggedIn(false);
            }
          }
        }
      } catch (error) {
        console.error("用户信息加载失败:", error);
        // 清除本地存储中的无效数据
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
      } finally {
        // 加载完成，设置加载状态为 false
        setUserLoading(false);
      }
    };

    // 调用检查认证状态的函数
    checkAuth();
  }, []);

  // 添加一个自定义事件监听器来更新认证状态
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token && userId) {
        setIsLoggedIn(true);
        // 更新用户信息...
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userInfo,
      userLoading, // 暴露加载状态
      refreshUserInfo: async () => {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response = await instance.get(`/user/info?userId=${userId}`);
            setUserInfo(response.data);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("用户信息刷新失败:", error);
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserInfo(null);
      },
      userAvatar: userInfo?.avatar || '',
      setUserAvatar: (newAvatar) => {
        setUserInfo(prev => ({...prev, avatar: newAvatar}));
      }
    }}>
      {!userLoading && children}
    </AuthContext.Provider>
  );
};

// 新增受保护路由组件
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>加载中...</div>;
  }
 console.log("ProtectedRoute isLoggedIn:", isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  // 确定当前路径是否需要显示导航栏
  const shouldShowNavBar = () => {
    // 获取当前路径
    const currentPath = window.location.pathname;
    // 这些路径已经在自己的页面中引入了NavBar，不需要全局显示
    const pathsWithoutNavBar = ['/login', '/register', '/forgot-password', '/ecommerce-creation'];
    return !pathsWithoutNavBar.includes(currentPath);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="page-container">
          <Router>
            <CommonHelmet />
            {shouldShowNavBar() && <NavBar className="bottom-nav" />}
            <Routes>
              {/* 主题示例页面 */}
              <Route path="/theme-example" element={<ExamplePage />} />
              
              {/* 原有路由 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
              <Route path="/" element={<Daily />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route
                path="/order-list/:status"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <OrderList />
                  </Suspense>
                }
              />
              <Route path="/edit-address" element={<EditAddress />} />
              <Route path="/order/:orderNumber" element={<OrderDetail />} />
              <Route path="/logistics/:orderNumber" element={<LogisticsTracker />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/product/:id" element={<RecommendationDetail/>} />
              <Route path="/search-results" element={<SearchResultsPage />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/payment-password" element={<PaymentPassword />} />
              <Route path="/payment-password-setting" element={<ProtectedRoute><PaymentPasswordSetting /></ProtectedRoute>} />
              <Route path="/content-creation" element={<ProtectedRoute><ContentCreationPage /></ProtectedRoute>} />
              <Route path="/ecommerce-creation" element={<ProtectedRoute><EcommerceCreationPage /></ProtectedRoute>} />
              <Route path="/category-manage" element={<ProtectedRoute><CategoryManagePage /></ProtectedRoute>} />
              <Route path="/my-content" element={<ProtectedRoute><MyContentPage /></ProtectedRoute>} />
              <Route path="/my-shop" element={<ProtectedRoute><MyShopPage /></ProtectedRoute>} />
              <Route path="/product-manage" element={<ProtectedRoute><ProductManagePage /></ProtectedRoute>} />
              <Route path="/create-shop" element={<ProtectedRoute><ShopCreationPage /></ProtectedRoute>} />          
              <Route path="/edit-shop/:id" element={<ProtectedRoute><ShopCreationPage /></ProtectedRoute>} />          
              <Route path="/shop/:shopId" element={<ShopDetailPage />} />
              <Route path="/shop-edit/:id" element={<ProtectedRoute><ShopEditPage /></ProtectedRoute>} />
              <Route path="/refund/apply/:orderId" element={<ProtectedRoute><RefundForm /></ProtectedRoute>} />
              <Route path="/refund/:refundId" element={<ProtectedRoute><RefundDetail /></ProtectedRoute>} />
              <Route path="/profile-edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default App;