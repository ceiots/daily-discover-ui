/**
 * NavBar 有机体组件
 * 底部导航栏组件
 */
import React from 'react';
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
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.animations.normal};
  ${({ className }) => className && className}
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  height: ${({ theme }) => theme.spacing['xl']}; /* 假设 NAV_HEIGHT 对应 theme.spacing.xl */
  max-width: 100%; /* 假设 CONTENT_MAX_WIDTH 对应 100% */
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
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSub};
  position: relative;
  transition: ${({ theme }) => theme.animations.fast};
  flex: 1;
  
  &:hover {
    transform: translateY(-2px);
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  i {
    font-size: ${({ theme }) => theme.typography.fontSize.lg}; /* 假设 NAV_ICON_SIZE 对应 theme.typography.fontSize.lg */
    margin-bottom: ${({ theme }) => theme.spacing.xs}; /* 假设 NAV_TEXT_SPACING 对应 theme.spacing.xs */
  }
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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
  transition: ${({ theme }) => theme.animations.normal};
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
  width: ${({ theme }) => theme.spacing['10']};
  height: ${({ theme }) => theme.spacing['10']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: ${({ theme }) => theme.animations.normal};
  transform: translateY(-8px);
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  &:active {
    transform: translateY(-6px) scale(0.95);
  }
  
  i {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
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

  return (
    <NavContainer className={className} theme={theme}>
      <NavWrapper>
        <NavItem 
          to="/daily" 
          $active={isActive('/') || isActive('/daily')} 
        >
          <i className="fas fa-calendar-day"></i>
          <span>每日</span>
          {(isActive('/') || isActive('/daily')) && <NavIndicator />}
        </NavItem>
        
        <CenterButtonContainer>
          <CenterButton href="#" onClick={handleCenterClick}>
            {!isNotAuthPage && isLoggedIn && userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt="头像"
                style={{
                  width: theme.spacing[8],
                  height: theme.spacing[8],
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${theme.colors.white}`,
                  background: theme.colors.neutral[200],
                }}
              />
            ) : (
              <i className="fas fa-qrcode"></i>
            )}
          </CenterButton>
        </CenterButtonContainer>
        
        <NavItem 
          to="/discover" 
          $active={isActive('/discover')} 
        >
          <i className="fas fa-compass"></i>
          <span>发现</span>
          {isActive('/discover') && <NavIndicator />}
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

export default React.memo(NavBar); 