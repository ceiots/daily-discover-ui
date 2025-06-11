import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * 基础页面组件
 * 提供统一的页面布局结构
 */
const BasePage = ({
  children,
  title,
  subtitle,
  headerActions,
  backButton,
  onBack,
  loading = false,
  padding = true,
  className = '',
  contentClassName = '',
  headerClassName = '',
  showHeader,
  headerLeft,
  ...props
}) => {
  // 组合所有样式
  const pageClasses = classNames(
    'base-page flex flex-col min-h-screen bg-neutral-50',
    className
  );

  const contentClasses = classNames(
    'flex-1',
    {
      'p-4': padding,
    },
    contentClassName
  );

  const headerClasses = classNames(
    'page-header flex items-center justify-between p-4 bg-white border-b border-neutral-200',
    headerClassName
  );

  // 渲染页面头部
  const renderHeader = () => {
    if (!title && !subtitle && !headerActions && !backButton) return null;

    return (
      <header className={headerClasses}>
        <div className="flex items-center">
          {backButton && (
            <button
              className="mr-3 p-1 rounded-full hover:bg-neutral-100"
              onClick={onBack}
              aria-label="返回"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <div>
            {title && <h1 className="text-xl font-semibold text-neutral-800">{title}</h1>}
            {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {headerActions && <div className="flex items-center">{headerActions}</div>}
      </header>
    );
  };

  // 渲染加载状态
  const renderLoading = () => {
    if (!loading) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  };

  return (
    <div className={pageClasses} {...props}>
      {showHeader !== false && renderHeader()}
      <main className={contentClasses}>
        {children}
      </main>
      {renderLoading()}
    </div>
  );
};

BasePage.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  headerActions: PropTypes.node,
  backButton: PropTypes.bool,
  onBack: PropTypes.func,
  loading: PropTypes.bool,
  padding: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  showHeader: PropTypes.bool,
  headerLeft: PropTypes.node,
};

export default BasePage;