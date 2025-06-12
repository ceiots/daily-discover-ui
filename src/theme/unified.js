/**
 * 统一主题系统 (Unified Theme System)
 * 提供完整的设计系统配置，适用于所有页面组件
 * 窄边框扁平化设计
 */
import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import breakpoints from './breakpoints';
import { useTheme } from './ThemeProvider';

// 全局样式变量
const globalStyles = {
  // 表单样式
  form: {
    input: {
      base: {
        height: '44px',
        padding: '0 14px',
        fontSize: '15px',
        border: `1px solid`,
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        outline: 'none',
      },
      states: {
        normal: {
          borderColor: 'var(--color-neutral-300)',
          background: '#fff',
        },
        focus: {
          borderColor: 'var(--color-primary-500)',
          boxShadow: '0 0 0 1px rgba(91, 71, 232, 0.2)',
        },
        error: {
          borderColor: 'var(--color-error)',
          boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
        },
      },
      variants: {
        standard: {},
        filled: {
          backgroundColor: 'var(--color-neutral-100)',
        },
        outlined: {
          backgroundColor: 'transparent',
        },
      },
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '6px',
      color: 'var(--color-neutral-700)',
    },
    errorText: {
      fontSize: '13px',
      color: 'var(--color-error)',
      marginTop: '6px',
    },
    helperText: {
      fontSize: '13px',
      color: 'var(--color-neutral-500)',
      marginTop: '6px',
    },
  },
  
  // 卡片样式
  card: {
    base: {
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      border: '1px solid var(--color-neutral-200)',
    },
    variants: {
      elevated: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        border: 'none',
      },
      outlined: {
        boxShadow: 'none',
        border: '1px solid var(--color-neutral-200)',
      },
      flat: {
        boxShadow: 'none',
        border: 'none',
      },
    },
    states: {
      hover: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  
  // 按钮样式
  button: {
    base: {
      borderRadius: '6px',
      padding: '10px 20px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      outline: 'none',
      border: '1px solid transparent',
      textAlign: 'center',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    variants: {
      primary: {
        backgroundColor: 'var(--color-primary-500)',
        color: '#fff',
        boxShadow: 'none',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary-500)',
        border: '1px solid var(--color-primary-500)',
      },
      text: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary-500)',
        boxShadow: 'none',
        border: 'none',
      },
      danger: {
        backgroundColor: 'var(--color-error)',
        color: '#fff',
      },
    },
    states: {
      hover: {
        primary: {
          backgroundColor: 'var(--color-primary-600)',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(91, 71, 232, 0.15)',
        },
        secondary: {
          backgroundColor: 'var(--color-primary-50)',
        },
        text: {
          backgroundColor: 'var(--color-primary-50)',
        },
        danger: {
          backgroundColor: '#b91c1c',
          transform: 'translateY(-1px)',
        },
      },
      active: {
        primary: {
          transform: 'translateY(0)',
          boxShadow: 'none',
        },
        secondary: {
          transform: 'translateY(0)',
        },
        text: {
          opacity: 0.8,
        },
        danger: {
          transform: 'translateY(0)',
        },
      },
      disabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
      },
    },
    sizes: {
      small: {
        fontSize: '14px',
        padding: '6px 12px',
        borderRadius: '4px',
      },
      medium: {
        fontSize: '15px',
        padding: '10px 20px',
        borderRadius: '6px',
      },
      large: {
        fontSize: '16px',
        padding: '12px 24px',
        borderRadius: '6px',
      },
    },
  },
  
  // 页面布局
  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      responsive: {
        sm: {
          padding: '0 16px',
        },
      },
    },
    section: {
      marginBottom: '48px',
      responsive: {
        sm: {
          marginBottom: '32px',
        },
      },
    },
  },
  
  // 标题样式
  headers: {
    h1: {
      fontSize: '28px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '16px',
      color: 'var(--color-neutral-800)',
    },
    h2: {
      fontSize: '22px',
      fontWeight: '700',
      lineHeight: '1.3',
      marginBottom: '12px',
      color: 'var(--color-neutral-800)',
    },
    h3: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.4',
      marginBottom: '10px',
      color: 'var(--color-neutral-800)',
    },
  },
  
  // 响应式设计助手
  responsive: {
    isMobile: `@media (max-width: ${breakpoints.sm})`,
    isTablet: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
    isDesktop: `@media (min-width: ${breakpoints.lg})`,
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  },
  
  // 常用阴影 (扁平化设计，减少阴影)
  elevation: {
    none: 'none',
    small: '0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: '0 1px 3px rgba(0, 0, 0, 0.08)',
    large: '0 2px 5px rgba(0, 0, 0, 0.1)',
    primary: '0 2px 4px rgba(91, 71, 232, 0.2)',
  },
  
  // 动画效果
  animation: {
    fadeIn: 'fadeIn 0.3s ease-out',
    slideUp: 'slideUp 0.3s ease-out',
    bounce: 'bounce 1s infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    spin: 'spin 1s linear infinite',
  },
  
  // 调色板生成工具
  generatePalette: (baseColor, steps = 9) => {
    // 简单实现，实际应用中可使用更复杂的算法
    const lighten = (color, amount) => {
      // 简化的色彩变亮逻辑
      return color;
    };
    
    const darken = (color, amount) => {
      // 简化的色彩变暗逻辑
      return color;
    };
    
    const palette = {};
    for (let i = 1; i <= steps; i++) {
      if (i < 5) {
        palette[i * 100] = lighten(baseColor, (5 - i) * 20);
      } else if (i > 5) {
        palette[i * 100] = darken(baseColor, (i - 5) * 20);
      } else {
        palette[i * 100] = baseColor;
      }
    }
    
    return palette;
  },
};

// 组合主题对象
const unifiedTheme = {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
  styles: globalStyles,
};

// 视觉设计助手函数
export const visualHelpers = {
  // 调整颜色亮度
  adjustBrightness: (color, amount) => {
    // 简化实现，实际应用需要更复杂的算法
    return color;
  },
  
  // 生成渐变色
  createGradient: (fromColor, toColor, direction = 'to right') => {
    return `linear-gradient(${direction}, ${fromColor}, ${toColor})`;
  },
  
  // 创建阴影
  createShadow: (elevation, color = 'rgba(0, 0, 0, 0.1)') => {
    const shadows = {
      xs: `0 1px 2px ${color}`,
      sm: `0 1px 2px ${color}`,
      md: `0 1px 3px ${color}`,
      lg: `0 2px 4px ${color}`,
      xl: `0 2px 5px ${color}`,
    };
    
    return shadows[elevation] || shadows.md;
  },
  
  // 生成适合文本颜色（基于背景色）
  getContrastText: (backgroundColor) => {
    // 简化实现，根据背景色亮度返回黑色或白色文字
    return '#ffffff'; // 或 '#000000' 根据背景色决定
  }
};

export { globalStyles };
export { useTheme };
export default unifiedTheme; 