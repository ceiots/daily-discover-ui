import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// 创建一个上下文来管理登录状态和用户信息
const AuthContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 默认未登录
  const [userAvatar, setUserAvatar] = useState("https://ai-public.mastergo.com/ai/img_res/e988c22c8c382a5c01a13a35609b2b3c.jpg"); // 默认头像

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userAvatar, setUserAvatar }}>
      <Router>
        <CommonHelmet />
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={isLoggedIn ? <Calendar /> : <Navigate to="/login" />} />
          <Route path="/" element={<Discover />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/order-detail/:orderId" element={<OrderDetail />} />
          <Route path="/recommendation/:id" element={<RecommendationDetail/>} /> 
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

// 创建一个自定义钩子来使用 AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export default App;