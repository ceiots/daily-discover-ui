/**
 * Design Tokens
 * ---
 * The single source of truth for all stylistic values.
 * Following the "Token-First" principle from docs/04_FRONTEND.md
 */

/**
 * 颜色系统
 * 采用简洁配色方案
 */
const colors = {
  primary: '#007BFF',
  primaryDark: '#0056b3',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  white: '#FFFFFF',
  black: '#000000',
  grey: {
    100: '#f8f9fa',
    300: '#dee2e6',
    500: '#adb5bd',
    700: '#495057',
    900: '#212529',
  },
};

/**
 * 基于4px网格的间距系统
 */
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

/**
 * 字体排版系统
 */
const typography = {
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  size: {
    sm: '0.875rem', // 14px
    md: '1rem',      // 16px
    lg: '1.25rem',   // 20px
    xl: '1.5rem',    // 24px
  },
  weight: {
    regular: 400,
    bold: 700,
  }
};

/**
 * 阴影效果
 * 采用扁平化设计的微妙阴影
 */
const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
};

/**
 * 圆角半径
 */
const radius = {
  none: '0',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px'
};

/**
 * 过渡动画
 */
const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease-in-out',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

/**
 * 响应式断点
 */
const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

/**
 * 边框样式
 */
const borders = {
  none: 'none',
  thin: `1px solid ${colors.neutral[200]}`,
  normal: `1px solid ${colors.neutral[300]}`,
  thick: `2px solid ${colors.neutral[300]}`,
  primary: `1px solid ${colors.primary[500]}`,
  error: `1px solid ${colors.error}`
};

/**
 * 卡片预设样式
 */
const cardPresets = {
  flat: {
    borderRadius: radius.lg,
    boxShadow: shadows.none,
    border: borders.thin
  },
  raised: {
    borderRadius: radius.lg,
    boxShadow: shadows.md,
    border: 'none'
  },
  interactive: {
    borderRadius: radius.lg,
    boxShadow: shadows.sm,
    border: borders.none,
    transition: transitions.fast,
    hover: {
      boxShadow: shadows.md,
      transform: 'translateY(-2px)'
    }
  }
};

/**
 * z-index层级系统
 */
const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  drawer: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700
};

/**
 * 完整主题对象
 */
const theme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  transitions,
  breakpoints,
  borders,
  cardPresets,
  zIndex
};

/**
 * 样式工具函数
 */
const styleUtils = {
  // 创建渐变背景
  gradient: (fromColor = colors.primary[500], toColor = colors.primary[700], direction = '135deg') => 
    `linear-gradient(${direction}, ${fromColor} 0%, ${toColor} 100%)`,
  
  // 创建阴影 - 扁平化设计版本
  shadow: (level = 'sm') => shadows[level] || shadows.sm,
  
  // 创建动画
  createAnimation: (name, duration = '0.3s', timing = 'ease') => 
    `${name} ${duration} ${timing} forwards`,
  
  // 创建边框
  createBorder: (width = '1px', style = 'solid', color = colors.neutral[200]) =>
    `${width} ${style} ${color}`,
  
  // 按钮样式生成器
  createButtonStyle: (variant = 'primary', size = 'medium', isFlat = true) => {
    const baseStyle = {
      borderRadius: radius.base,
      transition: transitions.fast,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      border: '1px solid transparent',
    };
    
    const sizeMap = {
      small: {
        fontSize: typography.fontSize.sm,
        padding: `${spacing[1.5]} ${spacing[3]}`,
        borderRadius: radius.sm,
      },
      medium: {
        fontSize: typography.fontSize.base,
        padding: `${spacing[2.5]} ${spacing[5]}`,
      },
      large: {
        fontSize: typography.fontSize.lg,
        padding: `${spacing[3]} ${spacing[6]}`,
      }
    };
    
    const variantMap = {
      primary: {
        backgroundColor: colors.primary[500],
        color: '#fff',
        boxShadow: isFlat ? 'none' : `0 2px 4px rgba(91, 71, 232, 0.2)`,
        borderColor: colors.primary[500],
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.primary[500],
        borderColor: colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.primary[500],
        borderColor: 'transparent',
      }
    };
    
    return {
      ...baseStyle,
      ...sizeMap[size],
      ...variantMap[variant]
    };
  },
  
  // 媒体查询生成器
  media: (breakpoint) => {
    return `@media (min-width: ${breakpoints[breakpoint]})`;
  },
  
  // 截断文本样式
  truncateText: (lines = 1) => {
    if (lines === 1) {
      return {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      };
    }
    
    return {
      display: '-webkit-box',
      WebkitLineClamp: lines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    };
  }
};

export default theme; 