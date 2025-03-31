import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import instance from './utils/axios';
import Calendar from './components/Calendar';
import Discover from './components/Discover';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Payment from './components/Payment';
import OrderConfirmation from './components/OrderConfirmation';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import CommonHelmet from './components/CommonHelmet';
import RecommendationDetail from "./components/RecommendationDetail"; // 导入详情页面组件
import './App.css';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import EventDetail from "./components/EventDetail"; // 事件详情页面
import CategoryPage from "./components/CategoryPage"; // 类别页面
import SearchResultsPage from './components/SearchResultsPage';
import PropTypes from 'prop-types';

// 创建一个上下文来管理登录状态和用户信息
// 创建认证上下文
const AuthContext = createContext();

// 导出useAuth函数，移到前面以便在ProtectedRoute中使用
export const useAuth = () => {
  return useContext(AuthContext);
};

// 新增 AuthProvider 组件
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState("https://ai-public.mastergo.com/ai/img_res/e988c22c8c382a5c01a13a35609b2b3c.jpg");

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      const savedUserInfo = localStorage.getItem("userInfo");
      
      if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          setIsLoggedIn(true);
          if (savedUserInfo) {
            const parsedUserInfo = JSON.parse(savedUserInfo);
            setUserInfo(parsedUserInfo);
            if (parsedUserInfo.avatar) {
              setUserAvatar(parsedUserInfo.avatar);
            }
          }
        } catch (error) {
          console.error("Token验证失败:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
        }
      }
      setLoading(false);
    };
    
    checkLoginStatus();
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setUserAvatar("https://ai-public.mastergo.com/ai/img_res/e988c22c8c382a5c01a13a35609b2b3c.jpg");
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    delete instance.defaults.headers.common['Authorization'];
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userInfo,
    setUserInfo,
    logout,
    loading,
    userAvatar,
    setUserAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 新增受保护路由组件
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <CommonHelmet />
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/" element={<Discover />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/recommendation/:id" element={<RecommendationDetail/>} /> 
          <Route path="/search-results" element={<SearchResultsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default App;