import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useAuth } from '../../App';
import { useTheme } from '../useTheme';

// 默认头像 - 与 Profile 组件保持一致
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzc2NmRlOCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjkwIiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMTAsMTk4LjE5QTE0OS40MSwxNDkuNDEsMCwwLDEsMTI4LDIyNCw0OS4xLDQ5LjEsMCwwLDEsNDYsMTk4LjE5LDEyOCwxMjgsMCwwLDAsMjEwLDE5OC4xOVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';

// 样式组件
const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  ${({ className }) => className && className}
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  height: 56px;
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 2px;
    background: transparent;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 6px 12px;
  font-size: 12px;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSub};
  position: relative;
  transition: all 0.2s ease;
  flex: 1;
  
  &:hover {
    transform: translateY(-2px);
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  i {
    font-size: 18px;
    margin-bottom: 3px;
  }
  
  span {
    font-size: 12px;
    font-weight: 500;
  }
`;

const NavIndicator = styled.div`
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  transition: all 0.3s ease;
`;

const CenterButtonContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  z-index: 2;
`;

const CenterButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  box-shadow: 0 4px 10px rgba(91, 71, 232, 0.3);
  transition: all 0.3s ease;
  transform: translateY(-8px);
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 6px 15px rgba(91, 71, 232, 0.4);
  }
  
  &:active {
    transform: translateY(-6px) scale(0.95);
  }
  
  i {
    font-size: 18px;
  }
`;

/**
 * 底部导航栏组件 - 优化版简洁高级UI/UX设计
 */
const NavBar = ({ className }) => {
  const location = useLocation();
  const path = location.pathname;
  const { isLoggedIn, userInfo } = useAuth();
  const { theme } = useTheme();
  
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
    <NavContainer className={className} theme={theme}>
      <NavWrapper>
        <NavItem 
          to="/daily" 
          active={isActive('/') || isActive('/daily')} 
          theme={theme}
        >
          <i className="fas fa-calendar-day"></i>
          <span>每日</span>
          {(isActive('/') || isActive('/daily')) && <NavIndicator theme={theme} />}
        </NavItem>
        
        <CenterButtonContainer>
          <CenterButton href="#" onClick={handleCenterClick} theme={theme}>
            {!isNotAuthPage && isLoggedIn && userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt="头像"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #fff',
                  background: '#eee'
                }}
              />
            ) : (
              <i className="fas fa-qrcode"></i>
            )}
          </CenterButton>
        </CenterButtonContainer>
        
        <NavItem 
          to="/discover" 
          active={isActive('/discover')} 
          theme={theme}
        >
          <i className="fas fa-compass"></i>
          <span>发现</span>
          {isActive('/discover') && <NavIndicator theme={theme} />}
        </NavItem>
      </NavWrapper>
    </NavContainer>
  );
};

NavBar.propTypes = {
  className: PropTypes.string
};

export default NavBar;