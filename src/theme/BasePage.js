import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from './ThemeProvider';
import './theme.css';

/**
 * 基础页面组件 - 可被其他页面继承，保持整体风格一致
 * 提供了统一的页面布局、主题样式和常用功能
 */
const BasePage = ({
  children,
  title,
  showHeader = true,
  headerTitle,
  headerLeft,
  headerRight,
  showFooter = false,
  footerContent,
  backgroundColor = 'default',
  className = '',
  safeArea = true,
  loading = false,
  error = null,
  onRefresh = null,
  style = {}
}) => {
  const theme = useTheme();

  // 构建页面容器的样式类
  const containerClasses = [
    'page-container',
    `bg-${backgroundColor}`,
    safeArea ? 'safe-area-padding' : '',
    className
  ].filter(Boolean).join(' ');

  // 页面头部
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <header className="page-header bg-gradient-primary shadow-sm">
        {headerLeft && <div className="page-header-left">{headerLeft}</div>}
        <h1 className="page-header-title">{headerTitle || title}</h1>
        {headerRight && <div className="page-header-right">{headerRight}</div>}
      </header>
    );
  };

  // 页面底部
  const renderFooter = () => {
    if (!showFooter) return null;

    return (
      <footer className="page-footer">
        {footerContent}
      </footer>
    );
  };

  // 加载状态
  const renderLoading = () => {
    if (!loading) return null;

    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  };

  // 错误状态
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="page-error">
        <div className="error-icon">!</div>
        <p className="error-message">{error}</p>
        {onRefresh && (
          <button 
            className="btn bg-primary text-white rounded-button"
            onClick={onRefresh}
          >
            重试
          </button>
        )}
      </div>
    );
  };

  return (
    <div 
      className={containerClasses} 
      style={{
        ...style,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {renderHeader()}
      
      <main className="page-content">
        {renderLoading()}
        {renderError()}
        {!loading && !error && children}
      </main>
      
      {renderFooter()}
    </div>
  );
};

BasePage.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  showHeader: PropTypes.bool,
  headerTitle: PropTypes.node,
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  showFooter: PropTypes.bool,
  footerContent: PropTypes.node,
  backgroundColor: PropTypes.oneOf(['default', 'paper', 'primary', 'primary-light', 'primary-dark']),
  className: PropTypes.string,
  safeArea: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func,
  style: PropTypes.object
};

export default BasePage; 