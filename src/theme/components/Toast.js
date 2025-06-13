import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '../useTheme';
import classNames from 'classnames';

/**
 * 轻提示组件
 * 基于Tailwind CSS实现的统一轻提示组件
 */
const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'top',
  onClose,
  visible = false,
  icon = null,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const theme = useTheme();

  // 类型样式映射
  const typeClasses = {
    info: 'bg-primary-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-error-DEFAULT text-white',
  };

  // 位置样式映射
  const positionClasses = {
    top: 'top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  // 组合所有样式
  const toastClasses = classNames(
    'fixed z-50 px-4 py-2 rounded-md shadow-md transition-opacity duration-300',
    typeClasses[type],
    positionClasses[position],
    {
      'opacity-0 pointer-events-none': !isVisible,
      'opacity-100': isVisible,
    },
    className
  );

  // 处理自动关闭
  useEffect(() => {
    setIsVisible(visible);

    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  // 处理图标
  const renderIcon = () => {
    if (!icon) return null;

    return <span className="mr-2">{icon}</span>;
  };

  return (
    <div className={toastClasses}>
      <div className="flex items-center">
        {renderIcon()}
        <span>{message}</span>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  duration: PropTypes.number,
  position: PropTypes.oneOf(['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Toast;