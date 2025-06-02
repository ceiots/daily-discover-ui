import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

// 创建主题上下文
export const ThemeContext = createContext(theme);

// 自定义钩子，方便组件获取主题
export const useTheme = () => useContext(ThemeContext);

// 主题提供者组件
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