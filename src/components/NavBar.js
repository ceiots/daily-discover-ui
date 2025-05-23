import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css'; // 保留样式文件引用

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 检查当前是否在登录/注册/找回密码页面
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  // 定义主色和次色
  const primaryColor = '#6366f1'; // 主紫色
  const secondaryColor = '#818cf8'; // 次紫色
  const inactiveColor = '#94a3b8'; // 非激活状态灰色
  
  return (
    <>
      {/* 弹出菜单背景遮罩 */}
      {isMenuOpen && (
        <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>
      )}
    
      <nav className="fixed bottom-0 w-full bg-white border-t flex items-center justify-around py-2 px-2 shadow-md z-50">
        <NavLink
          to="/"
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-primary nav-active' : 'text-gray-400'}`}
        >
        {({ isActive }) => (
          <>
            <i className={`fas fa-calendar-day text-lg ${isActive ? 'text-primary' : 'text-gray-400'}`}></i>
            <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>每日</span>
          </>
        )}
        </NavLink>
        
        
        
        {/* 中间弹出菜单按钮 */}
        <div className="flex relative">
          <button 
            className={`w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg transform -translate-y-5 ${isMenuOpen ? 'menu-button-active' : ''}`}
            onClick={toggleMenu}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-th'} text-xl`}></i>
          </button>
          
          {/* 弹出菜单 */}
          <div className={`popup-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="menu-item" onClick={() => handleMenuItemClick('/content')}>
              <div className="menu-icon content-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <span>内容</span>
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('/shop')}>
              <div className="menu-icon shop-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <span>电商</span>
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('/profile')}>
              <div className="menu-icon profile-icon">
                <i className="fas fa-user"></i>
              </div>
              <span>我的</span>
            </div>
          </div>
        </div>
        
        <NavLink
          to="/discover"
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-primary nav-active' : 'text-gray-400'}`}
        >
        {({ isActive }) => (
          <>
            <i className={`fas fa-compass text-lg ${isActive ? 'text-primary' : 'text-gray-400'}`}></i>
            <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>发现</span>
          </>
        )}
        </NavLink>
      </nav>
    </>
  );
};

export default NavBar;