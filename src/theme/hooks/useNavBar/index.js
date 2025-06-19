/**
 * useNavBar Hook索引文件
 * 导出useNavBar钩子函数
 */

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

/**
 * NavBar组件的逻辑钩子
 * 实现导航逻辑与视图分离
 * @returns {Object} 导航逻辑对象
 */
export const useNavBar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isLoggedIn, userInfo } = useAuth();
  
  // 判断当前路径是否为某个特定路径或其子路径
  const isActive = (route) => {
    if (route === '/') {
      return path === '/' || path === '/daily';
    }
    return path.startsWith(route);
  };

  // 判断是否为登录、注册、找回密码页面
  const isNotAuthPage =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/forgot-password');

  const handleCenterClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      window.location.href = '/my-service'; // 跳转到个人中心
    } else {
      window.location.href = '/login'; // 跳转到登录页
    }
  };

  // 监听登录状态变化
  /*
  useEffect(() => {
    // 只在登录状态变化时输出日志，而不是每次 userInfo 变化
    console.log("NavBar 检测到登录状态变化:", isLoggedIn);
    
    // 添加登录状态变化的事件监听器
    const handleLoginStateChanged = () => {
      console.log("NavBar 事件检测 - 登录事件触发");
      // 重新获取token和userId状态
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      console.log("NavBar 事件检测 - token存在:", !!token, "userId:", userId);
    };
    
    window.addEventListener('loginStateChanged', handleLoginStateChanged);
    
    // 清理函数
    return () => {
      window.removeEventListener('loginStateChanged', handleLoginStateChanged);
    };
  }, [isLoggedIn]); // 只依赖 isLoggedIn
  */
  
  return {
    path,
    isLoggedIn,
    userInfo,
    isActive,
    isNotAuthPage,
    handleCenterClick
  };
};

export default useNavBar; 