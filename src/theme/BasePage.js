import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from './components/ThemeProvider';
import './theme.css';

/**
 * 基础页面组件 - 优化版简洁高级UI/UX设计
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
    backgroundColor === 'default' ? 'bg-light' : `bg-${backgroundColor}`,
    safeArea ? 'safe-area-padding' : '',
    className
  ].filter(Boolean).join(' ');

  // 页面头部
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <header className="page-header">
        <div className="page-header-left">
          {headerLeft}
        </div>
        <h1 className="text-h1 text-light">{headerTitle || title}</h1>
        <div className="page-header-right">
          {headerRight}
        </div>
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
      <div className="page-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing[8],
        width: '100%'
      }}>
        <div className="loading-spinner" style={{ marginBottom: theme.spacing[4] }}></div>
        <p className="text-neutral">加载中...</p>
      </div>
    );
  };

  // 错误状态
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="page-error" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing[8],
        width: '100%'
      }}>
        <div className="error-icon" style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: theme.colors.error,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: theme.spacing[4]
        }}>!</div>
        <p className="error-message text-error text-body-large" style={{ marginBottom: theme.spacing[4] }}>{error}</p>
        {onRefresh && (
          <button 
            className="btn btn-primary"
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
        minHeight: '100vh',
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
  backgroundColor: PropTypes.oneOf(['default', 'paper', 'tertiary', 'primary', 'primary-light', 'primary-dark']),
  className: PropTypes.string,
  safeArea: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func,
  style: PropTypes.object
};

export default BasePage; 