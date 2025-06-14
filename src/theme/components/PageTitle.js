import React from 'react';
import styled from 'styled-components';
import { UI_COLORS } from '../styles/uiConstants';

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
 * 页面标题组件 - 显示在页面顶部的主标题栏
 * @param {Object} props 组件属性
 * @param {string} props.title 标题文本
 * @param {string} props.className 自定义样式类名
 * @returns {JSX.Element} 页面标题组件
 */
const PageTitle = ({ title, className }) => {
  return (
    <TitleContainer className={className}>
      {title}
    </TitleContainer>
  );
};

export default PageTitle; 