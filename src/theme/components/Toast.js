import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "./ThemeProvider";

/**
 * Toast组件 - 优化版简洁高级UI/UX设计
 * 显示临时消息通知
 */
const Toast = ({ message, visible, onClose, duration = 4000, type = 'default' }) => {
  const theme = useTheme();
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;
  
  // 获取Toast类型样式
  const getTypeStyles = () => {
    switch(type) {
      case 'success':
        return {
          backgroundColor: 'rgba(5, 150, 105, 0.95)',
          borderLeft: `4px solid ${theme.colors.success}`
        };
      case 'error':
        return {
          backgroundColor: 'rgba(220, 38, 38, 0.95)',
          borderLeft: `4px solid ${theme.colors.error}`
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.95)',
          borderLeft: `4px solid ${theme.colors.warning}`
        };
      case 'info':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.95)',
          borderLeft: `4px solid ${theme.colors.info}`
        };
      default:
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          borderLeft: 'none'
        };
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        right: '24px',
        top: '24px',
        zIndex: 9999,
        backgroundColor: getTypeStyles().backgroundColor,
        color: '#FFFFFF',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: theme.boxShadow.lg,
        maxWidth: '320px',
        animation: 'fadeIn 0.3s ease-out forwards',
        borderLeft: getTypeStyles().borderLeft,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {message}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
  type: PropTypes.oneOf(['default', 'success', 'error', 'warning', 'info'])
};

export default Toast;