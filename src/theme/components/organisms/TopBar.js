/**
 * TopBar 有机体组件
 * 顶部区域组件，显示页面标题和操作按钮
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components';
import { useComponentPerformance } from '../../utils/performance';

const TopBarContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 14px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 54px;
`;

const TopBarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

/**
 * 顶部区域组件
 * @param {Object} props - 组件属性
 * @param {string} props.title - 页面标题
 * @param {React.ReactNode} props.actionButton - 操作按钮
 * @returns {React.ReactElement} 顶部区域组件
 */
const TopBar = ({ title, actionButton }) => {
  // 性能监控
  useComponentPerformance('TopBar');
  
  const theme = useContext(ThemeContext);

  return (
    <TopBarContainer theme={theme}>
      <TopBarContent>
        <span>{title}</span>
        {actionButton}
      </TopBarContent>
    </TopBarContainer>
  );
};

TopBar.propTypes = {
  title: PropTypes.string.isRequired,
  actionButton: PropTypes.node
};

// 添加displayName用于性能监控
TopBar.displayName = 'TopBar';

export default TopBar; 