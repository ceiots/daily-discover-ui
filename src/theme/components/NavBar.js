import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavBar.css';
import { useAuth } from '../../App'; // 确保已导入 useAuth

// 默认头像 - 与 Profile 组件保持一致
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzc2NmRlOCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjkwIiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTAsMTk4LjE5QTE0OS40MSwxNDkuNDEsMCwwLDEsMTI4LDIyNCw0OS4xLDQ5LjEsMCwwLDEsNDYsMTk4LjE5LDEyOCwxMjgsMCwwLDAsMjEwLDE5OC4xOVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';

/**
 * 底部导航栏组件 - 优化版简洁高级UI/UX设计
 */
const NavBar = ({ className }) => {
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

  // 添加 useEffect 监听登录状态变化
  React.useEffect(() => {
    // 只在登录状态变化时输出日志，而不是每次 userInfo 变化
    console.log("NavBar 检测到登录状态变化:", isLoggedIn);
    
    // 添加登录状态变化的事件监听器
    const handleLoginStateChanged = () => {
      console.log("NavBar 检测到登录事件触发");
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
  }, [isLoggedIn]); // 只依赖 isLoggedIn，移除 userInfo

  return (
    <div className={`nav-bar-container ${className || ''}`}>
      <div className="nav-bar">
        <Link to="/daily" className={`nav-item ${isActive('/') || isActive('/daily') ? 'active' : ''}`}>
          <i className="fas fa-calendar-day"></i>
          <span>每日</span>
          {(isActive('/') || isActive('/daily')) && <div className="nav-indicator"></div>}
        </Link>
        
        <div className="nav-center-button-container">
          <a href="#" className="nav-center-button" onClick={handleCenterClick}>
            {!isNotAuthPage && isLoggedIn && userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt="头像"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #fff',
                  background: '#eee'
                }}
              />
            ) : (
              <i className="fas fa-qrcode"></i>
            )}
          </a>
        </div>
        
        <Link to="/discover" className={`nav-item ${isActive('/discover') ? 'active' : ''}`}>
          <i className="fas fa-compass"></i>
          <span>发现</span>
          {isActive('/discover') && <div className="nav-indicator"></div>}
        </Link>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  className: PropTypes.string
};

export default NavBar;