/**
 * Design Tokens
 * ---
 * The single source of truth for all stylistic values, as defined in:
 * `docs/04_FRONTEND.md`
 */

// 7.2.1. 颜色 (Color)
export const colors = {
  primary: {
    main: '#5B47E8',      // 核心品牌色
    dark: '#4936D8',      // 用于Hover状态
    light: '#E8E5FB',     // 用于背景或辅助元素
  },
  text: {
    primary: '#212121',     // 正文和标题
    secondary: '#666666',   // 辅助、次要信息
    disabled: '#BDBDBD',    // 禁用状态
    onPrimary: '#FFFFFF',   // 在主色背景上使用的文本颜色
  },
  background: {
    page: '#F7F8FA',         // 应用的最底层页面背景
    container: '#FFFFFF',      // 卡片、容器等内容区域的背景
    containerHover: '#F7F8FA', // 容器在Hover状态下的背景色
  },
  feedback: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  border: {
    main: '#E0E0E0',
  },
};

// 7.2.2. 字体 (Typography)
export const typography = {
  fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '15px',
    lg: '17px',
    xl: '20px',
    xxl: '24px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
  },
};

// 7.2.3. 间距 (Spacing)
export const spacing = {
  unit: '4px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
};

// 7.2.4. 布局 (Layout)
export const layout = {
  borderRadius: {
    sm: '4px',
    md: '8px',
  },
  boxShadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  maxWidthForm: '400px',
};

// 7.2.5. 图标 (Iconography)
export const iconography = {
  size: {
    sm: '16px',
    md: '24px',
  }
};

/**
 * The complete theme object provided to styled-components' ThemeProvider
 */
export const theme = {
  colors,
  typography,
  spacing,
  // Direct access for convenience, matching older structure if needed temporarily
  borderRadius: layout.borderRadius,
  shadows: layout.boxShadow,
  layout,
  iconography,
};

export default theme; 