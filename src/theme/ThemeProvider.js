import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import breakpoints from './breakpoints';

// 只在本文件定义theme对象，绝不从index.js导入
const theme = {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
  modes: {
    light: {
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.neutral[50],
      text: colors.neutral[800],
      border: colors.neutral[200],
      shadow: shadows.default,
    },
    dark: {
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.neutral[900],
      text: colors.neutral[100],
      border: colors.neutral[700],
      shadow: shadows.darkMode,
    },
  },
};

// 创建主题上下文
export const ThemeContext = createContext(theme);

/**
 * 主题钩子
 * 用于在组件中访问主题配置
 */
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return theme;
};

/**
 * 主题提供者组件
 * 为应用提供统一的主题配置
 */
const ThemeProvider = ({ children, initialMode = 'light' }) => {
  const [mode, setMode] = useState(initialMode);
  const [currentTheme, setCurrentTheme] = useState({
    ...theme,
    mode,
    current: theme.modes[mode],
  });

  // 切换主题模式
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // 设置特定主题模式
  const setThemeMode = (newMode) => {
    if (theme.modes[newMode]) {
      setMode(newMode);
    }
  };

  // 当模式改变时更新当前主题
  useEffect(() => {
    setCurrentTheme({
      ...theme,
      mode,
      current: theme.modes[mode],
      toggleMode,
      setThemeMode,
    });

    // 更新文档根元素的数据属性
    document.documentElement.setAttribute('data-theme', mode);
    
    // 如果是暗色模式，添加相应的类
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialMode: PropTypes.oneOf(['light', 'dark']),
};

export default ThemeProvider; 