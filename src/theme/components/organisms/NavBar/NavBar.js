/**
 * NavBar 有机体组件
 * 底部导航栏组件
 */
import React, { useState, useMemo, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components';
import { useNavBar } from '../../../hooks/useNavBar';
import { useComponentPerformance } from '../../../utils/performance';

// 颜色定义 - 中国传统色彩搭配
const PRIMARY_COLOR = '#5B47E8'; // 主色：靛青色
const SECONDARY_COLOR = '#E8614F'; // 辅助色：中国红
const NEUTRAL_COLOR = '#F5F7FA'; // 中性背景色
const TEXT_COLOR = '#2D3748'; // 文字主色

export const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  background: ${PRIMARY_COLOR};
  z-index: 100;
`;

// 导航栏容器
const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0); /* 兼容iPhone底部安全区域 */
`;

// 导航栏包装器
const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  height: 58px; /* 调整导航栏高度，确保可见 */
  max-width: 100%;
  margin: 0 auto;
  position: relative;
`;

// 导航项
const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 4px 10px; /* 调整内边距，确保可点击区域 */
  font-size: 15px;
  color: ${({ $active }) => $active ? PRIMARY_COLOR : '#94A3B8'};
  position: relative;
  transition: color 0.2s ease;
  flex: 1;
  
  i {
    font-size: 16px; /* 调整图标大小 */
    margin-bottom: 2px; /* 调整间距 */
    color: ${({ $active }) => $active ? PRIMARY_COLOR : '#94A3B8'};
  }
  
  span {
    font-size: 11px; /* 调整文字大小 */
    font-weight: ${({ $active }) => $active ? '600' : '500'};\
  }
`;

// 导航指示器
const NavIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 2px;
  background: ${({ $secondary }) => $secondary ? SECONDARY_COLOR : PRIMARY_COLOR}; /* 根据位置使用不同颜色 */
  border-radius: 1px;
`;

// 中心按钮容器
const CenterButtonContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px; /* 调整容器宽度 */
  height: 100%;
  z-index: 2;
`;

// 中心按钮
const CenterButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px; /* 调整按钮大小 */
  height: 48px; /* 调整按钮大小 */
  border-radius: 50%;
  background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #4A3CD9 100%); /* 渐变背景 */
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(91, 71, 232, 0.2); /* 精致阴影 */
  transform: translateY(-5px); /* 略微上移，更加突出 */
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(91, 71, 232, 0.25);
    transform: translateY(-6px);
  }
  &:active {
    transform: translateY(-4px);
    box-shadow: 0 2px 6px rgba(91, 71, 232, 0.15);
  }
  
  i {
    font-size: 17px; /* 调整图标大小 */
  }
`;

// 头像图片
const AvatarImage = styled.img`
  width: 38px; /* 调整头像大小 */
  height: 38px; /* 调整头像大小 */
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #FFFFFF;
  background: #F1F5F9;
`;

// 使用 React.memo 包装单个导航项组件
const MemoizedNavItem = React.memo(({ to, isActive, iconClassName, label, isSecondary }) => (
  <NavItem to={to} $active={isActive(to)}>
    <i className={iconClassName}></i>
    <span>{label}</span>
    {isActive(to) && <NavIndicator $secondary={isSecondary} />}
  </NavItem>
));

MemoizedNavItem.displayName = 'MemoizedNavItem';

MemoizedNavItem.propTypes = {
  to: PropTypes.string.isRequired,
  isActive: PropTypes.func.isRequired,
  iconClassName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isSecondary: PropTypes.bool
};

// 使用 React.memo 包装中心按钮组件
const MemoizedCenterButton = React.memo(({ onClick, isLoggedIn, userInfo }) => (
  <CenterButtonContainer>
    <CenterButton href="#" onClick={onClick}>
      {isLoggedIn && userInfo?.avatarUrl ? (
        <AvatarImage src={userInfo.avatarUrl} alt="avatar" />
      ) : (
        <i className="iconfont icon-user" style={{ color: '#FFFFFF' }}></i>
      )}
    </CenterButton>
  </CenterButtonContainer>
));

MemoizedCenterButton.displayName = 'MemoizedCenterButton';

MemoizedCenterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object
};

/**
 * 底部导航栏组件 - 使用useNavBar钩子处理逻辑
 * 性能优化：使用React.memo和useMemo减少不必要的重渲染
 */
const NavBar = React.memo(({ className }) => {
  const { path, isLoggedIn, userInfo, isActive, isNotAuthPage, handleCenterClick } = useNavBar();
  useComponentPerformance('NavBar');
  
  // 避免在每次渲染时创建新的函数引用
  const memoizedHandleCenterClick = useCallback((e) => {
    handleCenterClick(e);
  }, [handleCenterClick]);
  
  // 如果是登录/注册页面，不显示导航栏
  // if (isNotAuthPage) return null;
  
  return (
    <>
      <TopBar />
      <NavContainer className={className}>
        <NavWrapper>
          <MemoizedNavItem 
            to="/daily" 
            isActive={isActive} 
            iconClassName="iconfont icon-calendar" 
            label="每日" 
            isSecondary={false}
          />
          <div style={{ flex: 1 }}></div>
          <MemoizedNavItem 
            to="/discover" 
            isActive={isActive} 
            iconClassName="iconfont icon-compass" 
            label="发现" 
            isSecondary={true}
          />
          <MemoizedCenterButton 
            onClick={memoizedHandleCenterClick}
            isLoggedIn={isLoggedIn}
            userInfo={userInfo}
          />
        </NavWrapper>
      </NavContainer>
    </>
  );
});

NavBar.propTypes = {
  className: PropTypes.string,
};

// 添加displayName用于性能监控
NavBar.displayName = 'NavBar';

// 使用React.memo避免不必要的重渲染
export default NavBar; 