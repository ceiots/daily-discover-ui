import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import theme from '../../theme';

/**
 * 主题上下文 - 优化版简洁高级UI/UX设计
 */
export const ThemeContext = createContext(theme);

/**
 * 自定义钩子，方便组件获取主题
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * 主题提供者组件
 * 为整个应用提供统一的主题变量和设计系统
 */
const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeProvider; 