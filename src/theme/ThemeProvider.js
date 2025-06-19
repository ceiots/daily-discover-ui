/**
 * 主题提供者组件
 * 提供整个应用程序的主题上下文
 */
import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { theme as defaultTheme } from './tokens';
import GlobalStyles from './GlobalStyles';

// 创建主题上下文
export const ThemeContext = createContext();

/**
 * 主题提供者组件，用于包装应用并提供主题
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {'light'|'dark'} [props.initialMode='light'] - 初始主题模式
 * @returns {React.ReactElement} 主题提供者组件
 */
const ThemeProvider = ({ children, initialMode = 'light' }) => {
  // 主题模式状态
  const [mode, setMode] = useState(initialMode);
  
  // 从本地存储中恢复主题模式
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);
  
  // 保存主题模式到本地存储
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);
  
  // 切换主题模式
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  // 设置特定模式
  const setThemeMode = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode);
    }
  };
  
  // 创建暗色模式的颜色
  const darkModeColors = {
    primary: defaultTheme.colors.primary,
    primaryHover: defaultTheme.colors.primaryHover,
    background: '#121212',
    white: '#1e1e1e',
    border: '#333333',
    textMain: '#f0f0f0',
    textSub: '#a0a0a0',
    error: defaultTheme.colors.error,
    success: defaultTheme.colors.success,
    info: defaultTheme.colors.info,
    neutral: defaultTheme.colors.neutral,
    state: {
      ...defaultTheme.colors.state,
      disabled: '#555555'
    },
    rating: defaultTheme.colors.rating,
    marketing: defaultTheme.colors.marketing
  };
  
  // 根据当前模式创建主题对象
  const currentTheme = {
    ...defaultTheme,
    mode,
    isDark: mode === 'dark',
    colors: mode === 'light' ? defaultTheme.colors : darkModeColors
  };
  
  // 主题上下文值
  const contextValue = {
    mode,
    toggleMode,
    setMode: setThemeMode,
    isDark: mode === 'dark',
    theme: currentTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// 属性类型验证
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialMode: PropTypes.oneOf(['light', 'dark'])
};

export default ThemeProvider; 