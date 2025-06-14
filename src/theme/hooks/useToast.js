/**
 * Toast Hook
 * 提供Toast消息显示的逻辑
 */
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Toast配置选项
 * @typedef {Object} ToastOptions
 * @property {string} [type='info'] - Toast类型：'info', 'success', 'warning', 'error'
 * @property {number} [duration=3000] - 显示时长（毫秒）
 * @property {string} [position='center'] - 显示位置
 */

/**
 * Toast Hook
 * @param {ToastOptions} initialOptions - 初始配置选项
 * @returns {Object} Toast控制对象
 */
const useToast = (initialOptions = {}) => {
  // 默认选项
  const defaultOptions = {
    type: 'info',
    duration: 3000,
    position: 'center'
  };
  
  // 状态
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState({ ...defaultOptions, ...initialOptions });
  
  // 引用
  const timerRef = useRef(null);
  
  // 清除定时器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // 隐藏Toast
  const hide = useCallback(() => {
    setVisible(false);
    clearTimer();
  }, [clearTimer]);
  
  // 显示Toast
  const show = useCallback((msg, customOptions = {}) => {
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
  
  // 快捷方法：显示成功消息
  const success = useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'success' });
  }, [show]);
  
  // 快捷方法：显示错误消息
  const error = useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'error' });
  }, [show]);
  
  // 快捷方法：显示警告消息
  const warning = useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'warning' });
  }, [show]);
  
  // 快捷方法：显示信息消息
  const info = useCallback((msg, customOptions = {}) => {
    return show(msg, { ...customOptions, type: 'info' });
  }, [show]);
  
  // 清理定时器
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);
  
  return {
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
};

export default useToast; 