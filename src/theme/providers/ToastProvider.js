/**
 * Toast Provider
 * 提供全局Toast消息管理
 */
import React, { createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Toast } from '../components/Toast';
import useToast from '../hooks/useToast';

// 创建Toast上下文
const ToastContext = createContext(null);

/**
 * Toast提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {Object} props.defaultOptions - 默认Toast选项
 * @returns {React.ReactElement} Toast提供者组件
 */
export const ToastProvider = ({ children, defaultOptions = {} }) => {
  // 使用内部状态实现Toast功能
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [options, setOptions] = React.useState({
    type: 'info',
    duration: 3000,
    position: 'center',
    ...defaultOptions
  });
  
  const timerRef = React.useRef(null);
  
  // 清除定时器
  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // 隐藏Toast
  const hide = React.useCallback(() => {
    setVisible(false);
    clearTimer();
  }, [clearTimer]);
  
  // 显示Toast
  const show = React.useCallback((msg, customOptions = {}) => {
    // 清除之前的定时器
    clearTimer();
    
    // 更新消息和选项
    setMessage(msg);
    setOptions(prev => ({ ...prev, ...customOptions }));
    setVisible(true);
    
    // 设置自动关闭
    const duration = customOptions.duration || options.duration;
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        hide();
      }, duration);
    }
    
    // 返回隐藏方法，方便链式调用
    return { hide };
  }, [clearTimer, hide, options.duration]);
  
  // 快捷方法
  const success = React.useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'success' });
  }, [show]);
  
  const error = React.useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'error' });
  }, [show]);
  
  const warning = React.useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'warning' });
  }, [show]);
  
  const info = React.useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'info' });
  }, [show]);
  
  // 清理定时器
  React.useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);
  
  const toastContextValue = {
    visible,
    message,
    options,
    show,
    hide,
    success,
    error,
    warning,
    info
  };
  
  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={options.type}
        position={options.position}
        onClose={hide}
      />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultOptions: PropTypes.object
};

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

/**
 * 创建全局Toast实例
 * 用于在非React组件中使用Toast
 */
export const createGlobalToast = () => {
  // 保存最新的Toast实例
  let currentToast = null;
  
  // 更新Toast实例的方法
  const updateToast = (toast) => {
    currentToast = toast;
  };
  
  // 创建代理方法
  const createProxy = (methodName) => {
    return (...args) => {
      if (!currentToast) {
        console.warn(`Toast ${methodName} called before ToastProvider was initialized`);
        return { hide: () => {} };
      }
      return currentToast[methodName](...args);
    };
  };
  
  // 返回代理对象
  return {
    // 更新方法
    __updateToast: updateToast,
    
    // 代理方法
    show: createProxy('show'),
    success: createProxy('success'),
    error: createProxy('error'),
    warning: createProxy('warning'),
    info: createProxy('info'),
    hide: createProxy('hide')
  };
};

// 创建全局Toast实例
export const toast = createGlobalToast();

/**
 * 连接Toast提供者和全局Toast实例
 * @param {Object} props - 组件属性
 * @returns {React.ReactElement} 连接的Toast提供者
 */
export const ConnectedToastProvider = (props) => {
  const toastInstance = useToast(props.defaultOptions);
  
  // 更新全局Toast实例
  React.useEffect(() => {
    toast.__updateToast(toastInstance);
    return () => toast.__updateToast(null);
  }, [toastInstance]);
  
  return (
    <ToastContext.Provider value={toastInstance}>
      {props.children}
      <Toast
        visible={toastInstance.visible}
        message={toastInstance.message}
        type={toastInstance.options.type}
        position={toastInstance.options.position}
        onClose={toastInstance.hide}
      />
    </ToastContext.Provider>
  );
};

ConnectedToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultOptions: PropTypes.object
};

export default {
  ToastProvider,
  ConnectedToastProvider,
  useToastContext,
  toast
}; 