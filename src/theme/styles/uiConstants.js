/**
 * UI常量文件
 * 定义全局通用的UI常量，供各组件共享
 */

// 颜色常量
export const UI_COLORS = {
  // 主色系
  PRIMARY: '#5B47E8',
  PRIMARY_HOVER: '#4A3BD1',
  PRIMARY_SHADOW: 'rgba(91, 71, 232, 0.2)',
  PRIMARY_LIGHT: '#F4F2FF',
  
  // 背景色
  BG_LIGHT: '#F8F8FB',
  BG_WHITE: '#FFFFFF',
  
  // 文本颜色
  TEXT_DARK: '#1F2937',
  TEXT_MEDIUM: '#4B5563',
  TEXT_LIGHT: '#6B7280',
  
  // 边框颜色
  BORDER_LIGHT: '#E5E7EB',
  BORDER_MEDIUM: '#D1D5DB',
  
  // 状态颜色
  ERROR: '#DC2626',
  SUCCESS: '#059669',
  WARNING: '#F59E0B',
  INFO: '#3B82F6'
};

// 尺寸常量
export const UI_SIZES = {
  // 字体尺寸
  FONT_TINY: '11px',
  FONT_SMALL: '12px',
  FONT_MEDIUM: '13px',
  FONT_NORMAL: '14px',
  FONT_LARGE: '16px',
  
  // 输入框尺寸
  INPUT_HEIGHT: '40px',
  INPUT_SPACING: '12px',
  
  // 表单间距
  FORM_GROUP_SPACING: '14px',
  FORM_LABEL_SPACING: '5px',
  FORM_CONTAINER_WIDTH: '340px',
  
  // 按钮尺寸
  BUTTON_HEIGHT: '42px',
  BUTTON_SPACING: '12px',
  
  // 导航栏尺寸
  NAV_HEIGHT: '56px',
  NAV_ICON_SIZE: '20px',
  NAV_TEXT_SIZE: '12px',
  NAV_TEXT_SPACING: '2px',
  
  // 内容区域
  CONTENT_MAX_WIDTH: '520px',
  CONTENT_PADDING: '16px',
  
  // 头部栏尺寸
  HEADER_HEIGHT: '54px'
};

// 边框常量
export const UI_BORDERS = {
  // 圆角半径
  RADIUS_SMALL: '4px',
  RADIUS_MEDIUM: '6px',
  RADIUS_LARGE: '8px',
  RADIUS_ROUNDED: '10px',
  RADIUS_CIRCLE: '50%',
  
  // 边框宽度
  WIDTH_THIN: '1px',
  WIDTH_MEDIUM: '2px',
  WIDTH_THICK: '3px'
};

// 阴影常量
export const UI_SHADOWS = {
  // 基础阴影
  NONE: 'none',
  LIGHT: '0 1px 6px rgba(0, 0, 0, 0.05)',
  MEDIUM: '0 4px 12px rgba(0, 0, 0, 0.08)',
  HEAVY: '0 8px 24px rgba(0, 0, 0, 0.12)',
  
  // 特定组件阴影
  CARD: '0 1px 6px rgba(0, 0, 0, 0.05)',
  BUTTON: '0 2px 8px rgba(91, 71, 232, 0.2)',
  BUTTON_HOVER: '0 4px 10px rgba(91, 71, 232, 0.3)',
  BUTTON_ACTIVE: '0 2px 6px rgba(91, 71, 232, 0.25)',
  DROPDOWN: '0 2px 10px rgba(0, 0, 0, 0.1)',
  NAV: '0 -2px 10px rgba(0, 0, 0, 0.05)',
  MODAL: '0 10px 35px rgba(0, 0, 0, 0.15)'
};

// 动画常量
export const UI_ANIMATIONS = {
  // 动画持续时间
  FAST: 'all 0.2s ease',
  NORMAL: 'all 0.3s ease',
  SLOW: 'all 0.5s ease',
  
  // 特定动画
  FADE_IN: 'fadeIn 0.3s ease-in-out',
  SLIDE_UP: 'slideUp 0.3s ease-out',
  SCALE: 'scale 0.2s ease-in-out',
  PULSE: 'pulse 1.5s infinite',
  
  // 贝塞尔曲线
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)'
};

// 层级常量
export const UI_Z_INDEX = {
  BELOW: -1,
  BASE: 0,
  ABOVE: 1,
  FLOATING: 10,
  DROPDOWN: 100,
  STICKY: 200,
  FIXED: 300,
  MODAL: 400,
  POPOVER: 500,
  TOOLTIP: 600,
  OVERLAY: 700,
  NOTIFICATION: 800,
  MAXIMUM: 9999
};

// 断点常量
export const UI_BREAKPOINTS = {
  XS: '320px',
  SM: '480px',
  MD: '768px',
  LG: '992px',
  XL: '1200px'
};

// 导出UI常量对象
const uiConstants = {
  colors: UI_COLORS,
  sizes: UI_SIZES,
  borders: UI_BORDERS,
  shadows: UI_SHADOWS,
  animations: UI_ANIMATIONS
};

export default uiConstants; 