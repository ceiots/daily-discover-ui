import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
import instance from './utils/axios';
import Daily from './components/Daily';
import NavBar from './theme/components/NavBar';
import LoginPage from './components/account/LoginPage';
import MyService from './components/MyService';
import Cart from './components/myService/Cart';
import Payment from './components/order/Payment';
import { lazy, Suspense } from 'react';
const OrderList = lazy(() => import('./components/order/OrderList'));
import OrderDetail from './components/order/OrderDetail';
import LogisticsTracker from './components/LogisticsTracker';
import CommonHelmet from './components/CommonHelmet';
import ProductDetail from "./components/product/ProductDetail"; // 导入详情页面组件
import RefundForm from "./components/RefundForm"; // 导入退款表单组件
import RefundDetail from "./components/RefundDetail"; // 导入退款详情组件
import './App.css';
import AddressList from './components/myService/AddressList'; // 导入地址管理列表组件
import RegisterPage from './components/account/RegisterPage';
import ForgotPasswordPage from './components/account/ForgotPasswordPage';
import EventDetail from "./components/EventDetail"; // 事件详情页面
import CategoryPage from "./components/CategoryPage"; // 类别页面
import SearchResultsPage from './components/SearchResultsPage';
import PropTypes from 'prop-types';
import Settings from './components/settings/Settings';
import PaymentPassword from './components/settings/PaymentPassword';
import ContentCreationPage from './components/ContentCreationPage'; // 图文创作页面
import EcommerceCreationPage from './components/creation/EcommerceCreationPage'; // 电商创建页面
import MyContentPage from './components/MyContentPage'; // 我的图文内容页面
import MyShopPage from './components/shop/MyShopPage'; // 我的店铺内容页面
import ProductManagePage from './components/product/ProductManagePage'; // 商品管理页面
import ShopCreationPage from './components/shop/ShopCreationPage'; // 店铺创建页
import ShopDetailPage from './components/shop/ShopDetailPage'; // 店铺详情页面
import ShopEditPage from './components/shop/ShopEditPage'; // 店铺编辑页面
import Discover from './components/Discover'; 
import { ThemeProvider } from './theme';
import ExamplePage from './ExamplePage';
import ProfileEdit from './components/settings/ProfileEdit';
import OrderSuccess from './components/order/OrderSuccess'; // 添加订单成功页面
import ThemeTestPage from './pages/ThemeTestPage';
import SimpleThemeTest from './pages/SimpleThemeTest';

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

            // 检查响应状态和数据结构
            if (response.status === 200) {
              // 根据后端API的实际返回结构调整
              if (response.data && response.data.code === 200) {
                // 优先使用response.data.data，如果不存在则使用response.data
                const userData = response.data.data || response.data;
                setUserInfo(userData);
                setIsLoggedIn(true);
                console.log("初始化用户信息成功:", userData);
              } else {
                console.error('用户信息响应格式错误:', response.data);
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setIsLoggedIn(false);
              }
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
            console.log("用户信息刷新成功:", response.data);
            // 检查响应结构，确保正确设置用户信息
            if (response.data && response.data.code === 200) {
              setUserInfo(response.data.data || response.data);
              setIsLoggedIn(true);
              console.log("用户信息刷新成功:", response.data);
            } else {
              console.error('用户信息响应格式错误:', response.data);
              throw new Error('获取用户信息失败');
            }
          } else {
            console.error("无法刷新用户信息: 未找到用户ID");
            throw new Error('未找到用户ID');
          }
        } catch (error) {
          console.error("用户信息刷新失败:", error);
          throw error; // 将错误向上传递，让调用者处理
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // 清除请求头中的 Authorization 字段
        instance.defaults.headers.common['Authorization'] = '';
        // 确保用户信息被清空
        setIsLoggedIn(false);
        setUserInfo(null);
        // 强制刷新页面以确保所有组件状态重置
        window.location.href = '/';
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
  const location = useLocation();

  if (loading) {
    return <div>加载中...</div>;
  }
  console.log("ProtectedRoute isLoggedIn:", isLoggedIn);
  if (!isLoggedIn) {
    // 保存当前路径到sessionStorage，登录成功后可以跳转回来
    sessionStorage.setItem('redirectUrl', location.pathname + location.search);
    return <Navigate to="/login" />;
  }

  return children;
};

function showNavBar(pathname) {
  const pathsWithoutNavBar = [
    '/ecommerce-creation',
    '/address-list',
    '/cart',
    '/payment',
    '/payment-password',
    '/order-success',
    '/theme-test', // 添加主题测试页面路径
    '/simple-theme-test' // 添加简单主题测试页面路径
  ];

  // 使用传入的pathname参数而不是全局location
  console.log("pathname", pathname);
  // 只要是 /ecommerce-creation 开头的都不显示
  if (pathname.startsWith('/ecommerce-creation') || pathname.startsWith('/product/')) return false;
  return !pathsWithoutNavBar.includes(pathname);
}

const AppContent = () => {
  const location = useLocation();
  const shouldShowNavBar = showNavBar(location.pathname);

  return (
    <AuthProvider>
      <CommonHelmet />
      {shouldShowNavBar && <NavBar className="bottom-nav" />}
      <div className="page-container">
        <Routes>
          {/* 主题测试页面 */}
          <Route path="/theme-test" element={<ThemeTestPage />} />
          <Route path="/simple-theme-test" element={<SimpleThemeTest />} />
          
          {/* 主题示例页面 */}
          <Route path="/theme-example" element={<ExamplePage />} />
          
          {/* 原有路由 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/" element={<Daily />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/my-service" element={<ProtectedRoute><MyService /></ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/order-list/:status"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <OrderList />
              </Suspense>
            }
          />
          <Route path="/address-list" element={<ProtectedRoute><AddressList /></ProtectedRoute>} />
          <Route path="/order/:orderNumber" element={<OrderDetail />} />
          <Route path="/logistics/:orderNumber" element={<LogisticsTracker />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail/>} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/payment-password" element={<PaymentPassword />} />
          <Route path="/content-creation" element={<ProtectedRoute><ContentCreationPage /></ProtectedRoute>} />
          <Route path="/ecommerce-creation" element={<ProtectedRoute><EcommerceCreationPage /></ProtectedRoute>} />
         
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
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default App;