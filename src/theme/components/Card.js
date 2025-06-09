import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from './ThemeProvider';

/**
 * 高级主题卡片组件 - 优化版简洁高级UI/UX设计
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
      case 'xs': return theme.spacing[2]; // 8px
      case 'sm': return theme.spacing[4]; // 16px
      case 'lg': return theme.spacing[6]; // 24px
      case 'xl': return theme.spacing[8]; // 32px
      default: return theme.spacing[5]; // 20px (md)
    }
  };

  // 获取卡片变体样式
  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'bg-transparent border border-neutral-300';
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
    bordered ? 'border border-neutral-300' : '',
    loading ? 'card-loading' : '',
    onClick ? 'cursor-pointer transition' : '',
    className
  ].filter(Boolean).join(' ');

  // 渲染加载状态
  const renderLoading = () => {
    if (!loading) return null;
    
    return (
      <div className="card-loader" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
        borderRadius: 'inherit'
      }}>
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
        borderRadius: '8px',
        ...style
      }}
      {...props}
    >
      {loading && renderLoading()}
      
      {(title || subtitle) && (
        <div className="card-header" style={{ 
          marginBottom: theme.spacing[3],
          paddingBottom: subtitle ? theme.spacing[3] : 0,
          borderBottom: subtitle ? `1px solid ${theme.colors.neutral[200]}` : 'none'
        }}>
          {title && <h3 className="card-title text-h3">{title}</h3>}
          {subtitle && <div className="text-neutral text-caption mt-1">{subtitle}</div>}
        </div>
      )}
      
      <div className={`card-content ${loading ? 'opacity-50' : ''}`}>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer" style={{ 
          marginTop: theme.spacing[4],
          paddingTop: theme.spacing[3],
          borderTop: `1px solid ${theme.colors.neutral[200]}`
        }}>
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