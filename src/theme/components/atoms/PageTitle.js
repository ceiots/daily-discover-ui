 /**
 * PageTitle 原子组件
 * 页面标题组件，显示在页面顶部的主标题栏
 */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UI_COLORS } from '../../styles/uiConstants';
import { useComponentPerformance } from '../../utils/performance';

const TitleContainer = styled.div`
  background-color: ${UI_COLORS.PRIMARY};
  color: white;
  padding: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

/**
 * 页面标题组件
 * @param {Object} props - 组件属性
 * @param {string} props.title - 标题文本
 * @param {string} props.className - 自定义样式类名
 * @returns {React.ReactElement} 页面标题组件
 */
const PageTitle = ({ title, className }) => {
  // 性能监控
  useComponentPerformance('PageTitle');
  
  return (
    <TitleContainer className={className}>
      {title}
    </TitleContainer>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string
};

// 添加displayName用于性能监控
PageTitle.displayName = 'PageTitle';

export default PageTitle;