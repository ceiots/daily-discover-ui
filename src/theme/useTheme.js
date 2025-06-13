/**
 * 主题钩子 - 用于在组件中访问主题
 */
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

/**
 * 获取当前主题上下文
 * @returns {Object} 主题上下文对象
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};

// 默认导出钩子函数
export default useTheme; 