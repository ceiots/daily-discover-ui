/**
 * 主题系统根索引文件
 * 统一导出所有主题相关的组件、设计令牌和工具
 */

// 导出主题提供者和上下文
export { default as ThemeProvider } from './ThemeProvider';
export { default as useTheme } from './useTheme';

// 导出设计令牌
export * from './tokens';

// 导出全局样式组件
export { default as GlobalStyles } from './GlobalStyles';

// 导出所有主题组件
export * from './components';
export { default as Components } from './components';

// 导出Hooks
export { default as useToast } from './hooks/useToast';

// 导出Providers
export { 
  ToastProvider, 
  ConnectedToastProvider, 
  useToastContext, 
  toast 
} from './providers/ToastProvider';

// 导出工具函数
export { default as PerformanceUtils } from './utils/performance';
export { default as TestingUtils } from './utils/testing';
export { default as Analytics } from './utils/analytics';

// 创建并导出主题对象，便于整体引入
import * as tokens from './tokens';
import Components from './components';
import ThemeProvider from './ThemeProvider';
import useTheme from './useTheme';
import GlobalStyles from './GlobalStyles';
import useToast from './hooks/useToast';
import { ToastProvider, ConnectedToastProvider, useToastContext, toast } from './providers/ToastProvider';
import PerformanceUtils from './utils/performance';
import TestingUtils from './utils/testing';
import Analytics from './utils/analytics';

// 主题对象，包含所有主题相关的内容
const theme = {
  ...tokens,
  Components,
  ThemeProvider,
  useTheme,
  GlobalStyles,
  hooks: {
    useToast,
    useTheme,
    useToastContext
  },
  providers: {
    ThemeProvider,
    ToastProvider,
    ConnectedToastProvider
  },
  utils: {
    performance: PerformanceUtils,
    testing: TestingUtils,
    analytics: Analytics
  },
  toast
};

export default theme; 
