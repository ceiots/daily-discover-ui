/**
 * 设计令牌 (Design Tokens)
 * 合并了colors、spacing、typography、shadows、breakpoints的内容
 * 用于确保UI设计的一致性
 */

/**
 * 颜色系统
 * 采用简洁配色方案
 */
export const colors = {
  // 主色调
  primary: "#5B47E8",    // 主色，用于按钮、高亮元素，保持不变
  primaryHover: "#4a39d1", // 主色悬停状态，鲜明，颜色稍深
  background: "#f8f9fa",  // 浅灰色背景，更柔和且现代
  white: "#FFFFFF",     // 白色，卡片/输入框背景，保持不变
  border: "#e7e7e7",    // 极浅灰色边框，增加柔和感
  textMain: "#2c2c2c",  // 深灰色主文字，与背景形成高对比度，更清晰
  textSub: "#6b6b6b",   // 中灰色次要文字，有层次感
  error: "#ff4d4f",     // 更鲜艳的红色错误提示，更醒目
  success: "#52c41a",   // 新增成功提示色，用于成功反馈
  info: "#1890ff",      // 新增信息提示色，用于信息反馈
  
  // 保留中性色谱供高级组件使用
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },
  
  // 各种状态色
  state: {
    active: '#5B47E8',
    hover: '#4a39d1',
    disabled: '#d4d4d4',
    focus: 'rgba(91, 71, 232, 0.2)'
  },
  
  // 评分星级颜色
  rating: {
    filled: '#FACC15',
    unfilled: '#E5E7EB'
  },
  
  // 营销场景特殊色
  marketing: {
    discount: '#FF4D4F',
    new: '#36CFC9',
    hot: '#FA541C'
  }
};

/**
 * 基于4px网格的间距系统
 */
export const spacing = {
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px'
};

/**
 * 字体排版系统
 */
export const typography = {
  // 字体家族
  fontFamily: {
    sans: "'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
  },
  
  // 字体大小
  fontSize: {
    xs: '12px',
    sm: '13px',
    caption: '13px',
    body: '15px',
    base: '15px',
    lg: '17px',
    xl: '19px',
    '2xl': '22px',
    '3xl': '26px',
    '4xl': '30px',
    '5xl': '36px',
    '6xl': '48px'
  },
  
  // 行高
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  // 字重
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  // 字符间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
};

/**
 * 圆角半径
 */
export const radius = {
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
 * 阴影效果
 * 采用扁平化设计的微妙阴影
 */
export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  md: '0 2px 4px rgba(0, 0, 0, 0.1)',
  lg: '0 2px 6px rgba(0, 0, 0, 0.12)',
  xl: '0 3px 8px rgba(0, 0, 0, 0.14)',
  '2xl': '0 4px 12px rgba(0, 0, 0, 0.16)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
};

/**
 * 过渡动画
 */
export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease-in-out',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

/**
 * 响应式断点
 */
export const breakpoints = {
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
export const borders = {
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
export const cardPresets = {
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
export const zIndex = {
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
export const theme = {
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
export const styleUtils = {
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