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
import { UI_COLORS, UI_SIZES, UI_SHADOWS, UI_ANIMATIONS } from '../../../styles/uiConstants';
import { useComponentPerformance } from '../../../utils/performance';

// 样式组件
const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background-color: ${UI_COLORS.BG_WHITE};
  box-shadow: ${UI_SHADOWS.NAV};
  transition: ${UI_ANIMATIONS.NORMAL};
  ${({ className }) => className && className}
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  height: ${UI_SIZES.NAV_HEIGHT};
  max-width: ${UI_SIZES.CONTENT_MAX_WIDTH};
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
  font-size: ${UI_SIZES.NAV_TEXT_SIZE};
  color: ${({ active }) => active ? UI_COLORS.PRIMARY : UI_COLORS.TEXT_LIGHT};
  position: relative;
  transition: ${UI_ANIMATIONS.FAST};
  flex: 1;
  
  &:hover {
    transform: translateY(-2px);
    color: ${UI_COLORS.PRIMARY};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  i {
    font-size: ${UI_SIZES.NAV_ICON_SIZE};
    margin-bottom: ${UI_SIZES.NAV_TEXT_SPACING};
  }
  
  span {
    font-size: ${UI_SIZES.NAV_TEXT_SIZE};
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
  background: ${UI_COLORS.PRIMARY};
  border-radius: 3px;
  transition: ${UI_ANIMATIONS.NORMAL};
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
  background-color: ${UI_COLORS.PRIMARY};
  color: white;
  box-shadow: ${UI_SHADOWS.BUTTON_HOVER};
  transition: ${UI_ANIMATIONS.NORMAL};
  transform: translateY(-8px);
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 6px 15px ${UI_COLORS.PRIMARY_SHADOW};
  }
  
  &:active {
    transform: translateY(-6px) scale(0.95);
  }
  
  i {
    font-size: 18px;
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
          active={isActive('/') || isActive('/daily')} 
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
  className: PropTypes.string
};

// 添加displayName用于性能监控
NavBar.displayName = 'NavBar';

export default NavBar; 