import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';

/**
 * 高级主题卡片组件
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  onClick,
  className = '',
  style = {},
  shadow = 'sm',
  padding = 'md',
  variant = 'default',
  hover = true,
  bordered = false,
  status = null,
  loading = false,
  ...props
}) => {
  const theme = useTheme();
  
  // 处理点击事件
  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  // 获取内边距
  const getPadding = () => {
    switch (padding) {
      case 'none': return '0';
      case 'xs': return theme.spacing[1];
      case 'sm': return theme.spacing[2];
      case 'lg': return theme.spacing[6];
      case 'xl': return theme.spacing[8];
      default: return theme.spacing[4];
    }
  };

  // 获取卡片变体样式
  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'bg-transparent border border-neutral';
      case 'filled':
        return 'bg-primary-50';
      case 'elevated':
        return 'shadow-md';
      case 'glass':
        return 'bg-glass';
      case 'gradient':
        return 'bg-gradient-primary text-white';
      default:
        return 'bg-light';
    }
  };

  // 获取状态样式
  const getStatusClasses = () => {
    if (!status) return '';
    
    switch (status) {
      case 'success':
        return 'border-l-4 border-success';
      case 'warning':
        return 'border-l-4 border-warning';
      case 'error':
        return 'border-l-4 border-error';
      case 'info':
        return 'border-l-4 border-info';
      default:
        return '';
    }
  };

  // 构建卡片样式类
  const cardClasses = [
    'card',
    `shadow-${shadow}`,
    getVariantClasses(),
    getStatusClasses(),
    hover && onClick ? 'hover:shadow-md transition' : '',
    bordered ? 'border border-neutral' : '',
    loading ? 'card-loading' : '',
    onClick ? 'cursor-pointer transition' : '',
    className
  ].filter(Boolean).join(' ');

  // 渲染加载状态
  const renderLoading = () => {
    if (!loading) return null;
    
    return (
      <div className="card-loader">
        <div className="loading-spinner"></div>
      </div>
    );
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      style={{
        padding: getPadding(),
        position: 'relative',
        ...style
      }}
      {...props}
    >
      {loading && renderLoading()}
      
      {(title || subtitle) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <div className="text-neutral text-sm mt-1">{subtitle}</div>}
          </div>
        </div>
      )}
      
      <div className={`card-content ${loading ? 'opacity-50' : ''}`}>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'primary']),
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['default', 'outlined', 'filled', 'elevated', 'glass', 'gradient']),
  hover: PropTypes.bool,
  bordered: PropTypes.bool,
  status: PropTypes.oneOf([null, 'success', 'warning', 'error', 'info']),
  loading: PropTypes.bool
};

export default Card; 