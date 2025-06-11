/**
 * 主题系统统一导出
 * 提供设计令牌(Design Tokens)，确保UI一致性
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import breakpoints from './breakpoints';

// 导入组件
import { Button, Card, BasePage } from './components';
import ThemeProvider from './ThemeProvider';
import { useTheme } from './ThemeProvider';

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
};

export { ThemeProvider, useTheme, Button, Card, BasePage }; 
