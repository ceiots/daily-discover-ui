/**
 * NavBar 有机体组件
 * 底部导航栏组件
 */
import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../../../useTheme';
import { useNavBar } from '../../../hooks/useNavBar';
import { useComponentPerformance } from '../../../utils/performance';

export const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ theme }) => `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`};
  z-index: 100;
`;

// 样式组件
const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => `0 -2px 10px rgba(0, 0, 0, 0.05)`};
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, opacity 0.3s ease;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  will-change: transform;
  ${({ className }) => className && className}
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  height: 72px;
  max-width: 100%;
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
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSub};
  position: relative;
  transition: all 0.2s ease-out;
  flex: 1;
  
  &:hover {
    transform: translateY(-2px);
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  i {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    transition: all 0.2s ease;
    
    ${({ $active, theme }) => $active && `
      text-shadow: 0 0 8px ${theme.colors.primary}40;
    `}
  }
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ $active, theme }) => $active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
    letter-spacing: -0.2px;
    transition: all 0.2s ease;
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
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.primary}60;
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
  width: ${({ theme }) => theme.spacing['12']};
  height: ${({ theme }) => theme.spacing['12']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => `0 4px 10px ${theme.colors.primary}50`};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(-12px);
  will-change: transform;
  
  &:hover {
    transform: translateY(-14px) scale(1.05);
    box-shadow: ${({ theme }) => `0 6px 12px ${theme.colors.primary}60`};
  }
  
  &:active {
    transform: translateY(-10px) scale(0.95);
  }
  
  i {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const AvatarImage = styled.img`
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.colors.neutral[200]};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

/**
 * 底部导航栏组件 - 使用useNavBar钩子处理逻辑
 */
const NavBar = ({ className }) => {
  // 性能监控
  useComponentPerformance('NavBar');
  
  // 使用主题
  const { theme } = useTheme();
  
  // 使用NavBar钩子
  const {
    isLoggedIn,
    userInfo,
    isActive,
    isNotAuthPage,
    handleCenterClick
  } = useNavBar();

  // 优化渲染 - 只有当相关状态变化时才会重新计算
  const homeActive = useMemo(() => isActive('/') || isActive('/daily'), [isActive]);
  const discoverActive = useMemo(() => isActive('/discover'), [isActive]);
  
  // 优化事件处理函数 - 避免每次渲染时重新创建函数
  const onCenterClick = useCallback((e) => {
    e.preventDefault();
    handleCenterClick(e);
  }, [handleCenterClick]);

  // 中心按钮内容 - 使用useMemo优化
  const centerButtonContent = useMemo(() => {
    if (!isNotAuthPage && isLoggedIn && userInfo?.avatar) {
      return (
        <AvatarImage
          src={userInfo.avatar}
          alt="头像"
          theme={theme}
        />
      );
    }
    return <i className="fas fa-qrcode"></i>;
  }, [isNotAuthPage, isLoggedIn, userInfo?.avatar, theme]);

  return (
    <NavContainer className={className} theme={theme}>
      <NavWrapper>
        <NavItem 
          to="/daily" 
          $active={homeActive} 
        >
          <i className="fas fa-calendar-day"></i>
          <span>每日</span>
          {homeActive && <NavIndicator />}
        </NavItem>
        
        <CenterButtonContainer>
          <CenterButton href="#" onClick={onCenterClick}>
            {centerButtonContent}
          </CenterButton>
        </CenterButtonContainer>
        
        <NavItem 
          to="/discover" 
          $active={discoverActive} 
        >
          <i className="fas fa-compass"></i>
          <span>发现</span>
          {discoverActive && <NavIndicator />}
        </NavItem>
      </NavWrapper>
    </NavContainer>
  );
};

NavBar.propTypes = {
  className: PropTypes.string,
};

// 添加displayName用于性能监控
NavBar.displayName = 'NavBar';

// 使用React.memo避免不必要的重渲染
export default React.memo(NavBar); 