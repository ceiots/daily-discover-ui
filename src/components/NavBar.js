import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavBar.css';

const NavBar = ({ className }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // 判断当前路径是否为某个特定路径或其子路径
  const isActive = (route) => {
    if (route === '/') {
      return path === '/' || path === '/daily';
    }
    return path.startsWith(route);
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
          <Link to="" className="nav-center-button">
            <i className="fas fa-qrcode"></i>
          </Link>
        </div>
        
        <Link to="/discover" className={`nav-item ${isActive('/discover') ? 'active' : ''}`}>
          <i className="fas fa-compass"></i>
          <span>发现</span>
          {isActive('/discover') && <div className="nav-indicator"></div>}
        </Link>
      </div>
      <div className="nav-bar-safe-area"></div>
    </div>
  );
};

NavBar.propTypes = {
  className: PropTypes.string
};

export default NavBar;