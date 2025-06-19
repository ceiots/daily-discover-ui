/**
 * 主题提供者组件
 * 提供整个应用程序的主题上下文
 */
import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import chineseInkTheme from './chineseInkTheme'; // 导入新的中国风主题
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
  // 主题模式状态，暂时锁定为 'light' 以应用中国风主题
  const [mode, setMode] = useState('light');
  
  // 从本地存储中恢复主题模式 - 暂时禁用
  // useEffect(() => {
  //   const savedMode = localStorage.getItem('theme-mode');
  //   if (savedMode) {
  //     setMode(savedMode);
  //   }
  // }, []);
  
  // 保存主题模式到本地存储 - 暂时禁用
  // useEffect(() => {
  //   localStorage.setItem('theme-mode', mode);
  // }, [mode]);
  
  // 切换主题模式 - 暂时禁用
  const toggleMode = () => {
    // setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    console.log("主题切换功能已禁用，以应用统一风格");
  };
  
  // 设置特定模式
  const setThemeMode = (newMode) => {
    // if (newMode === 'light' || newMode === 'dark') {
    //   setMode(newMode);
    // }
  };
  
  // 直接使用中国风主题
  const currentTheme = {
    ...chineseInkTheme,
    mode: 'light', // 设定为 light
    isDark: false,
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