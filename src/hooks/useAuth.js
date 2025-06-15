import React from 'react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import httpClient from '../services/http/instance';
import { API_PATHS } from '../constants/api';

// 创建认证上下文
const AuthContext = createContext();

/**
 * 使用认证钩子 - 在组件中获取认证状态和方法
 * @returns {Object} 认证状态和方法
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * 认证提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} AuthProvider组件
 */
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const isInitialMountRef = useRef(true);

  // 初始化时加载用户信息
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 从本地存储中获取 token 和 userId
        const token = localStorage.getItem('auth_token');
        const userId = localStorage.getItem('user_id');

        // 使用 ref 确保只在第一次渲染时输出日志
        if (isInitialMountRef.current) {
          console.log("[Auth] 初始化检查 - token:", !!token, "userId:", userId);
          isInitialMountRef.current = false;
        }

        // 检查 token 和 userId 是否存在
        if (token && userId) {
          // 确保 userId 是有效值
          if (!userId || userId === 'null' || userId === 'undefined') {
            console.error('[Auth] 无效的 userId:', userId);
            // 清除本地存储中的无效数据
            clearAuthData();
            setIsLoggedIn(false);
          } else {
            // 向服务器请求用户信息
            const response = await httpClient.get(API_PATHS.USER.PROFILE);

            // 检查响应
            if (response && response.code === 0) {
              setUserInfo(response.data);
              setIsLoggedIn(true);
              console.log("[Auth] 初始化用户信息成功:", response.data);
            } else {
              console.error('[Auth] 用户信息响应格式错误:', response);
              clearAuthData();
              setIsLoggedIn(false);
            }
          }
        }
      } catch (error) {
        console.error("[Auth] 用户信息加载失败:", error);
        clearAuthData();
        setIsLoggedIn(false);
      } finally {
        // 加载完成，设置加载状态为 false
        setUserLoading(false);
      }
    };

    // 调用检查认证状态的函数
    checkAuth();
  }, []);

  // 清除认证数据的辅助函数
  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  };

  // 添加一个自定义事件监听器来更新认证状态
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('user_id');
      
      if (token && userId) {
        // 触发刷新用户信息
        refreshUserInfo();
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 刷新用户信息的方法
  const refreshUserInfo = async () => {
    try {
      setUserLoading(true);
      const userId = localStorage.getItem('user_id');
      if (userId) {
        const response = await httpClient.get(API_PATHS.USER.PROFILE);
        
        if (response && response.code === 0) {
          setUserInfo(response.data);
          setIsLoggedIn(true);
          console.log("[Auth] 用户信息刷新成功:", response.data);
        } else {
          console.error('[Auth] 用户信息响应格式错误:', response);
          throw new Error('获取用户信息失败');
        }
      } else {
        console.error("[Auth] 无法刷新用户信息: 未找到用户ID");
        throw new Error('未找到用户ID');
      }
    } catch (error) {
      console.error("[Auth] 用户信息刷新失败:", error);
      throw error; // 将错误向上传递，让调用者处理
    } finally {
      setUserLoading(false);
    }
  };

  // 登出的方法
  const logout = () => {
    clearAuthData();
    // 确保用户信息被清空
    setIsLoggedIn(false);
    setUserInfo(null);
    // 强制跳转到首页
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userInfo,
      userLoading,
      refreshUserInfo,
      logout,
      login: async (username, password) => {
        try {
          const response = await httpClient.post(API_PATHS.AUTH.LOGIN, {
            username,
            password
          });
          
          if (response && response.code === 0 && response.data) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_id', response.data.userId);
            setUserInfo(response.data.userInfo || response.data);
            setIsLoggedIn(true);
            return true;
          }
          return false;
        } catch (error) {
          console.error("[Auth] 登录失败:", error);
          return false;
        }
      },
      register: async (userData) => {
        try {
          const response = await httpClient.post(API_PATHS.AUTH.REGISTER, userData);
          
          if (response && response.code === 0 && response.data) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_id', response.data.userId);
            setUserInfo(response.data.userInfo || response.data);
            setIsLoggedIn(true);
            return true;
          }
          return false;
        } catch (error) {
          console.error("[Auth] 注册失败:", error);
          return false;
        }
      },
      updateUserInfo: (newInfo) => {
        setUserInfo(prev => ({...prev, ...newInfo}));
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 组合AuthProvider和加载状态
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} AuthWrapper组件
 */
export const AuthWrapper = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default useAuth;