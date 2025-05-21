import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.css'; // 保留样式文件引用

const NavBar = () => {
  const location = useLocation();
  
  // 检查当前是否在登录/注册/找回密码页面
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  
  return (
    <nav className="fixed bottom-0 w-full max-w-[375px] bg-white border-t flex items-center justify-around py-2 px-4">
        <NavLink
          to="/"
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
        {({ isActive }) => (
          <>
            <i className={`fas fa-compass ${isActive ? 'text-primary' : 'text-gray-400'}`}></i>
            <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>发现</span>
          </>
        )}
        </NavLink>
        <NavLink
          to={isAuthPage ? "/login" : "/creation"}
          className="flex relative"
        >
          <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg !rounded-button">
            <i className={`fas ${isAuthPage ? 'fa-user-plus' : 'fa-plus'} text-xl`}></i>
          </button>
        </NavLink>
        <NavLink
          to="/daily-ai"
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
        {({ isActive }) => (
          <>
            <i className={`fas fa-robot ${isActive ? 'text-primary' : 'text-gray-400'}`}></i>
            <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>每日AI</span>
          </>
        )}
        </NavLink>
    </nav>
  );
};

export default NavBar;