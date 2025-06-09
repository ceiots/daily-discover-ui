// 主题模块入口文件 - 优化版简洁高级UI/UX设计体系
import theme from './theme';
import ThemeProvider, { useTheme, ThemeContext } from './components/ThemeProvider';
import BasePage from './BasePage';

// 导入组件
import * as components from './components';

// 导入样式
import './theme.css';

// 导出所有主题相关组件和工具
export {
  theme,
  ThemeProvider,
  ThemeContext,
  useTheme,
  BasePage,
  components
};

// 直接导出常用组件
export const { 
  Button, 
  Card, 
  NavBar, 
  ScrollableSection, 
  ShopInfo,
  Toast 
} = components;

// 默认导出 ThemeProvider
export default ThemeProvider; 