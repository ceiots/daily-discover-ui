/**
 * NavBar钩子函数
 * 提取导航栏的逻辑和状态，实现逻辑与视图分离
 */
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../useAuth';

/**
 * 导航栏钩子函数
 * @returns {Object} 导航栏状态和方法
 */
const useNavBar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isLoggedIn, userInfo } = useAuth();
  
  // 判断当前路径是否为某个特定路径或其子路径
  const isActive = useCallback((route) => {
    if (route === '/') {
      return path === '/' || path === '/daily';
    }
    return path.startsWith(route);
  }, [path]);

  // 判断是否为登录、注册、找回密码页面
  const isNotAuthPage =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/forgot-password');

  const handleCenterClick = useCallback((e) => {
    e.preventDefault();
    if (isLoggedIn) {
      window.location.href = '/my-service'; // 跳转到个人中心
    } else {
      window.location.href = '/login'; // 跳转到登录页
    }
  }, [isLoggedIn]);
  
  return {
    isLoggedIn,
    userInfo,
    isActive,
    isNotAuthPage,
    handleCenterClick
  };
};

export default useNavBar; 