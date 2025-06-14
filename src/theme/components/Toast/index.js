import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UI_COLORS, UI_SIZES, UI_BORDERS, UI_ANIMATIONS, UI_Z_INDEX } from '../../styles/uiConstants';

/**
 * 简单轻提示容器
 */
export const ToastContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 16px;
  border-radius: ${UI_BORDERS.RADIUS_MEDIUM};
  z-index: ${UI_Z_INDEX.NOTIFICATION};
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  font-size: ${UI_SIZES.FONT_MEDIUM};
  
  &.show {
    opacity: 1;
    visibility: visible;
  }
`;

/**
 * 简单轻提示组件
 * 可以通过id直接控制的简单Toast组件
 */
export const SimpleToast = ({ id = "toast" }) => {
  return <ToastContainer id={id} className="toast" />;
};

SimpleToast.propTypes = {
  id: PropTypes.string
};

/**
 * 显示一个简单的轻提示
 * @param {string} message - 提示内容
 * @param {number} duration - 显示时长(毫秒)，默认3000
 * @param {string} toastId - Toast元素ID，默认"toast"
 */
export const showToast = (message, duration = 3000, toastId = "toast") => {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }
};

/**
 * 更复杂的轻提示组件
 * 支持不同类型、位置和自动关闭功能
 */
export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'center',
  onClose,
  visible = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(visible);

  // 类型样式
  const getTypeStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: UI_COLORS.SUCCESS };
      case 'warning': 
        return { backgroundColor: UI_COLORS.WARNING };
      case 'error':
        return { backgroundColor: UI_COLORS.ERROR };
      default: // info
        return { backgroundColor: UI_COLORS.PRIMARY };
    }
  };

  // 位置样式
  const getPositionStyle = () => {
    switch (position) {
      case 'top': 
        return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
      case 'top-left':
        return { top: '10%', left: '10%' };
      case 'top-right':
        return { top: '10%', right: '10%' };
      case 'bottom-left':
        return { bottom: '10%', left: '10%' };
      case 'bottom-right':
        return { bottom: '10%', right: '10%' };
      default: // center
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  // 自动关闭
  useEffect(() => {
    setIsVisible(visible);

    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const toastStyle = {
    ...getTypeStyle(),
    ...getPositionStyle(),
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
  };

  return (
    <ToastContainer 
      style={toastStyle} 
      className={className}
    >
      {message}
    </ToastContainer>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  duration: PropTypes.number,
  position: PropTypes.oneOf(['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default {
  SimpleToast,
  Toast,
  showToast,
  ToastContainer
}; 