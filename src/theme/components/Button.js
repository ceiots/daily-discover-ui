import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from './ThemeProvider';
import './Button.css';

/**
 * 高级主题按钮组件 - 优化版简洁高级UI/UX设计
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  rounded = 'md',
  elevation = true,
  ripple = true,
  loading = false,
  onClick,
  className = '',
  style = {},
  type = 'button',
  ...props
}) => {
  const theme = useTheme();
  const [isRippling, setIsRippling] = useState(false);
  const [rippleStyle, setRippleStyle] = useState({});
  const buttonRef = useRef(null);
  
  // 构建按钮样式类
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    disabled || loading ? 'btn-disabled' : '',
    `rounded-${rounded}`,
    elevation && !disabled && !loading ? 'shadow-sm hover:shadow' : '',
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  // 处理点击事件和涟漪效果
  const handleClick = (e) => {
    if (disabled || loading) return;
    
    if (ripple && variant === 'primary') {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      setRippleStyle({
        width: `${size}px`,
        height: `${size}px`,
        top: `${y}px`,
        left: `${x}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.25)' // 淡色水波纹
      });
      
      setIsRippling(true);
      
      setTimeout(() => {
        setIsRippling(false);
      }, 600);
    }
    
    if (onClick) onClick(e);
  };

  // 渲染加载指示器
  const renderLoader = () => {
    if (!loading) return null;
    
    return (
      <span className="btn-loader">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
            fill="none"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
    );
  };

  // 获取按钮高度
  const getButtonHeight = () => {
    switch (size) {
      case 'xs': return '32px';
      case 'sm': return '36px';
      case 'lg': return '52px';
      case 'xl': return '60px';
      default: return '44px'; // md
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: getButtonHeight(),
        ...style
      }}
      {...props}
    >
      {loading && renderLoader()}
      
      {isRippling && (
        <span 
          className="ripple-effect"
          style={rippleStyle}
        />
      )}
      
      {icon && iconPosition === 'left' && (
        <span className="btn-icon" style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
      
      {icon && iconPosition === 'right' && (
        <span className="btn-icon-right" style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'text', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']),
  elevation: PropTypes.bool,
  ripple: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;