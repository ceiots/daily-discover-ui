/**
 * Toast Provider
 * 提供全局Toast消息管理
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Toast } from '../components/organisms/Toast';
import { ToastContext } from './ToastContext';

/**
 * Toast提供者组件
 */
export const ToastProvider = ({ children, defaultOptions = {} }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState({
    type: 'info',
    duration: 3000,
    position: 'center',
    ...defaultOptions
  });
  
  const timerRef = useRef(null);
  
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const hide = useCallback(() => {
    setVisible(false);
    clearTimer();
  }, [clearTimer]);
  
  const show = useCallback((msg, customOptions = {}) => {
    clearTimer();
    setMessage(msg);
    setOptions(prev => ({ ...prev, ...customOptions }));
    setVisible(true);
    
    const duration = customOptions.duration || options.duration;
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        hide();
      }, duration);
    }
    return { hide };
  }, [clearTimer, hide, options.duration]);
  
  const success = useCallback((msg, customOptions = {}) => show(msg, { ...customOptions, type: 'success' }), [show]);
  const error = useCallback((msg, customOptions = {}) => show(msg, { ...customOptions, type: 'error' }), [show]);
  const warning = useCallback((msg, customOptions = {}) => show(msg, { ...customOptions, type: 'warning' }), [show]);
  const info = useCallback((msg, customOptions = {}) => show(msg, { ...customOptions, type: 'info' }), [show]);
  
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);
  
  const toastContextValue = { show, hide, success, error, warning, info };
  
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