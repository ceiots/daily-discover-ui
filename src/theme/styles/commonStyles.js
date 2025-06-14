/**
 * 通用样式
 * 提供可复用的样式定义和样式组合
 */
import { css } from 'styled-components';
import { UI_COLORS, UI_SIZES, UI_SPACING } from './uiConstants';

/**
 * 卡片样式
 * 为组件添加标准卡片样式
 */
export const cardStyle = css`
  background-color: ${UI_COLORS.WHITE};
  border-radius: ${UI_SIZES.BORDER_RADIUS_LG};
  box-shadow: ${UI_SIZES.SHADOW_SM};
  padding: ${UI_SPACING.MD};
`;

/**
 * 弹性布局-行
 * 水平方向的弹性布局
 */
export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

/**
 * 弹性布局-列
 * 垂直方向的弹性布局
 */
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

/**
 * 居中布局
 * 水平和垂直方向都居中
 */
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * 文本截断
 * 单行文本溢出时显示省略号
 */
export const textTruncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * 多行文本截断
 * @param {number} lines - 最大行数
 * @returns {string} CSS样式字符串
 */
export const multiLineTruncate = (lines = 2) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * 响应式间距
 * 根据屏幕尺寸调整间距
 */
export const responsiveSpacing = css`
  padding: ${UI_SPACING.SM};
  
  @media (min-width: 768px) {
    padding: ${UI_SPACING.MD};
  }
  
  @media (min-width: 1024px) {
    padding: ${UI_SPACING.LG};
  }
`;

/**
 * 可点击元素样式
 * 为可交互元素添加统一的点击效果
 */
export const clickable = css`
  cursor: pointer;
  transition: ${UI_SIZES.TRANSITION_DEFAULT};
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

/**
 * 无障碍聚焦样式
 * 为键盘聚焦元素提供清晰的视觉提示
 */
export const focusOutline = css`
  &:focus-visible {
    outline: 2px solid ${UI_COLORS.PRIMARY};
    outline-offset: 2px;
  }
`;

/**
 * 全宽元素
 * 使元素横向填满容器
 */
export const fullWidth = css`
  width: 100%;
`;

/**
 * 全高元素
 * 使元素纵向填满容器
 */
export const fullHeight = css`
  height: 100%;
`;

/**
 * 可滚动容器
 * 为内容溢出的元素添加滚动条
 */
export const scrollable = css`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

export default {
  cardStyle,
  flexRow,
  flexColumn,
  flexCenter,
  textTruncate,
  multiLineTruncate,
  responsiveSpacing,
  clickable,
  focusOutline,
  fullWidth,
  fullHeight,
  scrollable
};
