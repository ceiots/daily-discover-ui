/**
 * 主题系统统一导出
 * 提供设计令牌(Design Tokens)，确保UI一致性
 * 采用窄边框扁平化设计风格
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import breakpoints from './breakpoints';

// 导入组件
import { Button, Card, BasePage, Form } from './components';
import ThemeProvider from './ThemeProvider';
import { useTheme } from './ThemeProvider';
import unifiedTheme, { visualHelpers, globalStyles } from './unified';
import PageTemplate from './PageTemplate';

/**
 * 主题配置
 * 作为统一的设计系统，供组件使用
 */
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,

  // 主题模式
  modes: {
    light: {
      primary: colors.primary,
      background: colors.neutral[50],
      text: colors.neutral[800],
      border: colors.neutral[200],
      shadow: shadows.default,
    },
    dark: {
      primary: colors.primary,
      background: colors.neutral[900],
      text: colors.neutral[100],
      border: colors.neutral[700],
      shadow: shadows.darkMode,
    },
  },
  
  // 边框设计
  borders: {
    thin: '1px solid',
    medium: '1.5px solid',
    none: 'none',
    radius: {
      small: '4px',
      medium: '6px', 
      large: '8px',
      round: '50%',
    }
  },
  
  // 卡片样式预设
  cardPresets: {
    flat: {
      borderRadius: '8px',
      boxShadow: 'none',
      border: `1px solid ${colors.neutral[200]}`,
    },
    raised: {
      borderRadius: '8px',
      boxShadow: shadows.sm,
      border: `1px solid ${colors.neutral[200]}`,
    }
  }
};

// 导出组件和钩子
export { ThemeProvider, useTheme, Button, Card, BasePage, Form };

// 导出统一主题系统
export { unifiedTheme, visualHelpers, globalStyles, PageTemplate };

/**
 * 样式工具函数
 */
export const styleUtils = {
  // 创建渐变背景
  gradient: (fromColor = colors.primary, toColor = colors.secondary, direction = '135deg') => 
    `linear-gradient(${direction}, ${fromColor} 0%, ${toColor} 100%)`,
  
  // 创建阴影 - 扁平化设计版本
  shadow: (level = 'sm') => {
    const flatShadows = {
      none: 'none',
      xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
      md: '0 2px 4px rgba(0, 0, 0, 0.1)',
      lg: '0 2px 6px rgba(0, 0, 0, 0.12)',
      xl: '0 3px 8px rgba(0, 0, 0, 0.14)',
    };
    
    return flatShadows[level] || flatShadows.sm;
  },
  
  // 响应式断点
  mediaQuery: (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]})`,
  
  // 创建动画
  createAnimation: (name, duration = '0.3s', timing = 'ease') => 
    `${name} ${duration} ${timing} forwards`,
  
  // 创建边框
  createBorder: (width = '1px', style = 'solid', color = colors.neutral[200]) =>
    `${width} ${style} ${color}`,
  
  // 按钮样式生成器
  createButtonStyle: (variant = 'primary', size = 'medium', isFlat = true) => {
    const baseStyle = {
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      cursor: 'pointer',
      border: '1px solid transparent',
    };
    
    const sizeMap = {
      small: {
        fontSize: '14px',
        padding: '6px 12px',
        borderRadius: '4px',
      },
      medium: {
        fontSize: '15px',
        padding: '10px 20px',
      },
      large: {
        fontSize: '16px',
        padding: '12px 24px',
      }
    };
    
    const variantMap = {
      primary: {
        backgroundColor: colors.primary,
        color: '#fff',
        boxShadow: isFlat ? 'none' : '0 2px 4px rgba(91, 71, 232, 0.2)',
        borderColor: colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.primary,
        borderColor: colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.primary,
        borderColor: 'transparent',
      }
    };
    
    return {
      ...baseStyle,
      ...sizeMap[size],
      ...variantMap[variant]
    };
  }
};

// 默认导出主题
export default theme; 
