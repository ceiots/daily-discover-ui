// 主题模块入口文件 - 优化版简洁高级UI/UX设计体系
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';
import BasePage from './BasePage';

// 创建主题上下�?
export const ThemeContext = createContext(theme);

// 自定义钩子，方便组件获取主题
export const useTheme = () => useContext(ThemeContext);

// 主题提供者组�?
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// 导入组件
import * as components from './components';

// 导入样式
import './theme.css';

// 导出所有主题相关组件和工具
export {
  theme,
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
