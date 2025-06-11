import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * 按钮组件
 * 基于Tailwind CSS实现的统一按钮组件
 */
const Button = ({
  children,
  type = 'primary',
  htmlType,
  size = 'medium',
  block = false,
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  onClick,
  ...props
}) => {
  // 按钮类型样式映射
  const typeClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
    text: 'text-primary-500 hover:bg-primary-50',
    danger: 'bg-error-DEFAULT hover:bg-error-dark text-white',
  };

  // 按钮尺寸样式映射
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };

  // 组合所有样式
  const buttonClasses = classNames(
    'rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50',
    typeClasses[type],
    sizeClasses[size],
    {
      'w-full': block,
      'opacity-50 cursor-not-allowed': disabled || loading,
      'flex items-center justify-center': icon || loading,
    },
    className
  );

  // 处理点击事件
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick && onClick(e);
  };

  // 提取htmlType属性，不直接传递给DOM元素
  const buttonProps = { ...props };
  if (htmlType) {
    buttonProps.type = htmlType;
  }

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'danger']),
  htmlType: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;