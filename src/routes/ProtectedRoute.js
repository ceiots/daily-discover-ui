import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * 保护路由组件 - 用于保护需要认证的路由
 * 未登录用户将被重定向到登录页面，并保存原目标路径
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} ProtectedRoute组件
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userLoading } = useAuth();
  const location = useLocation();

  // 如果正在加载用户信息，显示加载中
  if (userLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // 如果未登录，重定向到登录页面，并保存原目标路径
  if (!isLoggedIn) {
    // 保存当前路径到sessionStorage，登录成功后可以跳转回来
    sessionStorage.setItem('redirectUrl', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // 已登录，渲染原始组件
  return children;
};

export default ProtectedRoute; 