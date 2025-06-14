/**
 * Text 原子组件
 * 基础文本显示组件，支持不同的变体和样式
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useComponentPerformance } from '../../utils/performance';

// 预设尺寸
const sizeStyles = {
  xs: css`
    font-size: 0.75rem;
    line-height: 1rem;
  `,
  sm: css`
    font-size: 0.875rem;
    line-height: 1.25rem;
  `,
  md: css`
    font-size: 1rem;
    line-height: 1.5rem;
  `,
  lg: css`
    font-size: 1.125rem;
    line-height: 1.75rem;
  `,
  xl: css`
    font-size: 1.25rem;
    line-height: 1.75rem;
  `,
  '2xl': css`
    font-size: 1.5rem;
    line-height: 2rem;
  `,
  '3xl': css`
    font-size: 1.875rem;
    line-height: 2.25rem;
  `,
  '4xl': css`
    font-size: 2.25rem;
    line-height: 2.5rem;
  `
};

// 预设字重
const weightStyles = {
  thin: css`font-weight: 100;`,
  extralight: css`font-weight: 200;`,
  light: css`font-weight: 300;`,
  normal: css`font-weight: 400;`,
  medium: css`font-weight: 500;`,
  semibold: css`font-weight: 600;`,
  bold: css`font-weight: 700;`,
  extrabold: css`font-weight: 800;`,
  black: css`font-weight: 900;`
};

// 预设变体
const variantStyles = {
  body: css`
    ${sizeStyles.md}
    ${weightStyles.normal}
    color: ${props => props.theme.colors.text.primary};
  `,
  bodySmall: css`
    ${sizeStyles.sm}
    ${weightStyles.normal}
    color: ${props => props.theme.colors.text.secondary};
  `,
  bodyLarge: css`
    ${sizeStyles.lg}
    ${weightStyles.normal}
    color: ${props => props.theme.colors.text.primary};
  `,
  heading1: css`
    ${sizeStyles['4xl']}
    ${weightStyles.bold}
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5em;
  `,
  heading2: css`
    ${sizeStyles['3xl']}
    ${weightStyles.bold}
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5em;
  `,
  heading3: css`
    ${sizeStyles['2xl']}
    ${weightStyles.semibold}
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5em;
  `,
  heading4: css`
    ${sizeStyles.xl}
    ${weightStyles.semibold}
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5em;
  `,
  heading5: css`
    ${sizeStyles.lg}
    ${weightStyles.semibold}
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5em;
  `,
  heading6: css`
    ${sizeStyles.md}
    ${weightStyles.semibold}
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5em;
  `,
  caption: css`
    ${sizeStyles.xs}
    ${weightStyles.normal}
    color: ${props => props.theme.colors.text.secondary};
  `,
  overline: css`
    ${sizeStyles.xs}
    ${weightStyles.medium}
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${props => props.theme.colors.text.secondary};
  `
};

// 文本截断样式
const truncateStyles = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 多行截断样式
const multiLineTruncateStyles = lines => css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
`;

// 样式化组件
const StyledText = styled.span`
  margin: 0;
  padding: 0;
  
  /* 应用变体样式 */
  ${props => props.variant && variantStyles[props.variant]}
  
  /* 应用自定义尺寸 */
  ${props => props.size && sizeStyles[props.size]}
  
  /* 应用自定义字重 */
  ${props => props.weight && weightStyles[props.weight]}
  
  /* 应用自定义颜色 */
  ${props => props.color && css`color: ${props.color};`}
  
  /* 应用文本对齐 */
  ${props => props.align && css`text-align: ${props.align};`}
  
  /* 应用文本转换 */
  ${props => props.transform && css`text-transform: ${props.transform};`}
  
  /* 应用文本装饰 */
  ${props => props.decoration && css`text-decoration: ${props.decoration};`}
  
  /* 应用字母间距 */
  ${props => props.letterSpacing && css`letter-spacing: ${props.letterSpacing};`}
  
  /* 应用行高 */
  ${props => props.lineHeight && css`line-height: ${props.lineHeight};`}
  
  /* 应用单行截断 */
  ${props => props.truncate && truncateStyles}
  
  /* 应用多行截断 */
  ${props => props.lines > 1 && multiLineTruncateStyles(props.lines)}
  
  /* 应用自定义样式 */
  ${props => props.css}
`;

/**
 * Text 组件
 * 
 * @param {Object} props - 组件属性
 * @param {string} [props.variant='body'] - 文本变体
 * @param {string} [props.size] - 文本尺寸
 * @param {string} [props.weight] - 文本字重
 * @param {string} [props.color] - 文本颜色
 * @param {string} [props.align] - 文本对齐方式
 * @param {string} [props.transform] - 文本转换
 * @param {string} [props.decoration] - 文本装饰
 * @param {string} [props.letterSpacing] - 字母间距
 * @param {string} [props.lineHeight] - 行高
 * @param {boolean} [props.truncate=false] - 是否单行截断
 * @param {number} [props.lines=1] - 显示行数
 * @param {string} [props.as='span'] - 渲染为的HTML元素
 * @param {React.ReactNode} props.children - 子元素
 * @returns {React.ReactElement} Text组件
 */
const Text = ({
  variant = 'body',
  size,
  weight,
  color,
  align,
  transform,
  decoration,
  letterSpacing,
  lineHeight,
  truncate = false,
  lines = 1,
  as,
  children,
  ...rest
}) => {
  // 性能监控
  useComponentPerformance('Text');
  
  // 根据变体自动设置元素类型
  const elementType = as || (
    variant.startsWith('heading') 
      ? `h${variant.charAt(variant.length - 1)}` 
      : 'span'
  );
  
  return (
    <StyledText
      as={elementType}
      variant={variant}
      size={size}
      weight={weight}
      color={color}
      align={align}
      transform={transform}
      decoration={decoration}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      truncate={truncate}
      lines={lines}
      {...rest}
    >
      {children}
    </StyledText>
  );
};

Text.propTypes = {
  variant: PropTypes.oneOf([
    'body', 'bodySmall', 'bodyLarge', 
    'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
    'caption', 'overline'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']),
  weight: PropTypes.oneOf([
    'thin', 'extralight', 'light', 'normal', 
    'medium', 'semibold', 'bold', 'extrabold', 'black'
  ]),
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  transform: PropTypes.oneOf(['none', 'capitalize', 'uppercase', 'lowercase']),
  decoration: PropTypes.oneOf(['none', 'underline', 'line-through']),
  letterSpacing: PropTypes.string,
  lineHeight: PropTypes.string,
  truncate: PropTypes.bool,
  lines: PropTypes.number,
  as: PropTypes.string,
  children: PropTypes.node
};

export default Text; 