/**
 * InfoCard 分子组件
 * 组合多个原子组件形成的信息卡片
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useComponentPerformance } from '../../utils/performance';
import Text from '../atoms/Text';

// 样式化卡片容器
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
  
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  max-width: ${props => props.maxWidth || 'none'};
`;

// 样式化卡片头部
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  
  ${props => props.color && `
    background-color: ${props.color};
    color: white;
  `}
`;

// 样式化卡片内容
const CardContent = styled.div`
  padding: ${props => props.theme.spacing.md};
  flex: 1;
`;

// 样式化卡片底部
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.align || 'flex-start'};
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.subtle};
`;

// 样式化图标容器
const IconContainer = styled.div`
  margin-right: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * InfoCard 组件
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.title - 卡片标题
 * @param {React.ReactNode} [props.icon] - 卡片图标
 * @param {React.ReactNode} props.children - 卡片内容
 * @param {React.ReactNode} [props.footer] - 卡片底部内容
 * @param {string} [props.footerAlign='flex-start'] - 底部对齐方式
 * @param {string} [props.headerColor] - 头部背景颜色
 * @param {boolean} [props.fullWidth=false] - 是否占满容器宽度
 * @param {string} [props.maxWidth] - 最大宽度
 * @param {Object} [props.titleProps] - 传递给标题Text组件的属性
 * @returns {React.ReactElement} InfoCard组件
 */
const InfoCard = ({
  title,
  icon,
  children,
  footer,
  footerAlign = 'flex-start',
  headerColor,
  fullWidth = false,
  maxWidth,
  titleProps = {},
  ...rest
}) => {
  // 性能监控
  useComponentPerformance('InfoCard');
  
  return (
    <CardContainer 
      fullWidth={fullWidth} 
      maxWidth={maxWidth}
      {...rest}
    >
      {title && (
        <CardHeader color={headerColor}>
          {icon && <IconContainer>{icon}</IconContainer>}
          <Text 
            variant="heading5" 
            {...titleProps}
          >
            {title}
          </Text>
        </CardHeader>
      )}
      
      <CardContent>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter align={footerAlign}>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  footerAlign: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between']),
  headerColor: PropTypes.string,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.string,
  titleProps: PropTypes.object
};

export default InfoCard; 