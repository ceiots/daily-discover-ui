import { createContext, useContext } from 'react';

// 创建Toast上下文
export const ToastContext = createContext(null);

/**
 * 使用Toast上下文的Hook
 * @returns {Object} Toast控制对象
 */
export const useToastContext = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  
  return context;
}; 