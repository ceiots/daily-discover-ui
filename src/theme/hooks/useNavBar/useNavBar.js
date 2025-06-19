/**
 * NavBar钩子函数
 * 提取导航栏的逻辑和状态，实现逻辑与视图分离
 */
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 导航栏钩子函数
 * @returns {Object} 导航栏状态和方法
 */
const useNavBar = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // 存储登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  // 初始化时检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    setIsLoggedIn(!!token && !!userId);
    
    // 如果有用户ID，尝试获取用户信息
    if (userId) {
      try {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
      }
    }
  }, []);
  
  // 监听登录状态变化
  useEffect(() => {
    const handleLoginStateChanged = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      setIsLoggedIn(!!token && !!userId);
      
      // 更新用户信息
      try {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
      }
    };
    
    // 监听自定义登录状态事件
    window.addEventListener('loginStateChanged', handleLoginStateChanged);
    
    // 清理函数
    return () => {
      window.removeEventListener('loginStateChanged', handleLoginStateChanged);
    };
  }, []);
  
  // 判断当前路径是否为某个特定路径或其子路径
  const isActive = useCallback((route) => {
    if (route === '/') {
      return path === '/' || path === '/daily';
    }
    return path.startsWith(route);
  }, [path]);
  
  // 判断是否为登录、注册、找回密码页面
  const isNotAuthPage = path.startsWith('/login') ||
    path.startsWith('/forgot-password');
  
  // 处理中心按钮点击
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