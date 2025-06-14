/**
 * UI设计常量
 * 包含主题中使用的所有UI设计变量，如颜色、尺寸和间距等
 */

/**
 * UI颜色系统
 * 包含品牌色、中性色和功能色
 */
export const UI_COLORS = {
  // 品牌色
  PRIMARY: '#5B47E8', 
  PRIMARY_LIGHT: '#8274F0',
  PRIMARY_DARK: '#4937C8',
  SECONDARY: '#3CCFCF',
  SECONDARY_LIGHT: '#7BDEDE',
  SECONDARY_DARK: '#29AEAE',
  
  // 中性色
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  NEUTRAL_50: '#F9FAFB',
  NEUTRAL_100: '#F3F4F6',
  NEUTRAL_200: '#E5E7EB',
  NEUTRAL_300: '#D1D5DB',
  NEUTRAL_400: '#9CA3AF',
  NEUTRAL_500: '#6B7280',
  NEUTRAL_600: '#4B5563',
  NEUTRAL_700: '#374151',
  NEUTRAL_800: '#1F2937',
  NEUTRAL_900: '#111827',
  
  // 功能色
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  
  // 背景色
  BACKGROUND_LIGHT: '#F9FAFB',
  BACKGROUND_DARK: '#111827',
  
  // 文本色
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#4B5563',
  TEXT_TERTIARY: '#9CA3AF',
  TEXT_DISABLED: '#D1D5DB',
  TEXT_INVERSE: '#FFFFFF',
  
  // 边框色
  BORDER_LIGHT: '#E5E7EB',
  BORDER_DEFAULT: '#D1D5DB',
  BORDER_DARK: '#9CA3AF'
};

/**
 * UI尺寸系统
 * 包含字体大小、行高、圆角、阴影等
 */
export const UI_SIZES = {
  // 字体大小
  FONT_XS: '0.75rem',    // 12px
  FONT_SM: '0.875rem',   // 14px
  FONT_BASE: '1rem',     // 16px
  FONT_MD: '1.125rem',   // 18px
  FONT_LG: '1.25rem',    // 20px
  FONT_XL: '1.5rem',     // 24px
  FONT_2XL: '1.875rem',  // 30px
  FONT_3XL: '2.25rem',   // 36px
  
  // 行高
  LINE_HEIGHT_NONE: '1',
  LINE_HEIGHT_TIGHT: '1.25',
  LINE_HEIGHT_SNUG: '1.375',
  LINE_HEIGHT_NORMAL: '1.5',
  LINE_HEIGHT_RELAXED: '1.625',
  LINE_HEIGHT_LOOSE: '2',
  
  // 字重
  FONT_WEIGHT_THIN: '100',
  FONT_WEIGHT_EXTRALIGHT: '200',
  FONT_WEIGHT_LIGHT: '300',
  FONT_WEIGHT_NORMAL: '400',
  FONT_WEIGHT_MEDIUM: '500',
  FONT_WEIGHT_SEMIBOLD: '600',
  FONT_WEIGHT_BOLD: '700',
  FONT_WEIGHT_EXTRABOLD: '800',
  FONT_WEIGHT_BLACK: '900',
  
  // 边框圆角
  BORDER_RADIUS_NONE: '0',
  BORDER_RADIUS_SM: '0.125rem',  // 2px
  BORDER_RADIUS_MD: '0.25rem',   // 4px
  BORDER_RADIUS_LG: '0.5rem',    // 8px
  BORDER_RADIUS_XL: '0.75rem',   // 12px
  BORDER_RADIUS_2XL: '1rem',     // 16px
  BORDER_RADIUS_FULL: '9999px',  // 圆形
  
  // 阴影
  SHADOW_NONE: 'none',
  SHADOW_SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  SHADOW_MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  SHADOW_LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  SHADOW_XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  SHADOW_2XL: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  SHADOW_INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // 过渡
  TRANSITION_DEFAULT: 'all 0.2s ease',
  TRANSITION_SLOW: 'all 0.3s ease',
  TRANSITION_FAST: 'all 0.1s ease',
  
  // 组件尺寸
  HEADER_HEIGHT: '64px',
  FOOTER_HEIGHT: '56px',
  NAV_BAR_HEIGHT: '56px',
  SIDEBAR_WIDTH: '240px',
  CONTAINER_SM: '640px',
  CONTAINER_MD: '768px',
  CONTAINER_LG: '1024px',
  CONTAINER_XL: '1280px',
  
  // z-index
  Z_INDEX_DROPDOWN: '1000',
  Z_INDEX_STICKY: '1020',
  Z_INDEX_FIXED: '1030',
  Z_INDEX_MODAL_BACKDROP: '1040',
  Z_INDEX_MODAL: '1050',
  Z_INDEX_POPOVER: '1060',
  Z_INDEX_TOOLTIP: '1070'
};

/**
 * UI间距系统
 * 统一的间距尺寸
 */
export const UI_SPACING = {
  NONE: '0',
  XS: '0.25rem',   // 4px
  SM: '0.5rem',    // 8px
  MD: '1rem',      // 16px
  LG: '1.5rem',    // 24px
  XL: '2rem',      // 32px
  XXL: '3rem',     // 48px
  XXXL: '4rem'     // 64px
};

/**
 * 断点系统
 * 响应式设计的断点
 */
export const BREAKPOINTS = {
  XS: '320px',
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px'
};

/**
 * 动画预设
 * 常用的动画和过渡效果
 */
export const ANIMATIONS = {
  FADE_IN: 'fadeIn 0.3s ease-in',
  FADE_OUT: 'fadeOut 0.3s ease-out',
  SLIDE_UP: 'slideUp 0.3s ease-out',
  SLIDE_DOWN: 'slideDown 0.3s ease-in',
  SLIDE_LEFT: 'slideLeft 0.3s ease-in-out',
  SLIDE_RIGHT: 'slideRight 0.3s ease-in-out',
  PULSE: 'pulse 1.5s infinite'
};

export default {
  UI_COLORS,
  UI_SIZES,
  UI_SPACING,
  BREAKPOINTS,
  ANIMATIONS
}; 