import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavBar.css';
import { useAuth } from '../../App'; // 确保已导入 useAuth

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

  const handleCenterClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      window.location.href = '/profile'; // 跳转到个人中心
    } else {
      window.location.href = '/login'; // 跳转到登录页
    }
  };

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
            {isLoggedIn && userInfo?.avatar ? (
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