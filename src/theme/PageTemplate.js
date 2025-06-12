import React from "react";
import PropTypes from "prop-types";
import { BasePage } from "./components";
import { useTheme } from "./ThemeProvider";
import unifiedTheme from "./unified";

/**
 * 统一页面模板组件
 * 提供统一的页面布局和样式，可以被其他页面引用并扩展
 * 采用窄边框扁平化设计
 */
const PageTemplate = ({
  children,
  title,
  subtitle,
  showHeader = true,
  showBackButton = false,
  onBack,
  headerActions,
  backgroundStyle = "default", // default, gradient, pattern
  padding = true,
  animation = true,
  className,
  contentClassName,
}) => {
  const theme = useTheme();

  // 页面背景样式
  const getBackgroundStyle = () => {
    switch (backgroundStyle) {
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${theme.colors.neutral[50]} 0%, ${theme.colors.neutral[100]} 100%)`,
        };
      case "pattern":
        return {
          background: theme.colors.neutral[50],
          position: "relative",
          backgroundImage: `radial-gradient(${theme.colors.neutral[200]} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: 0.8,
        };
      default:
        return {
          backgroundColor: theme.colors.neutral[50],
        };
    }
  };

  // 内容容器样式
  const contentStyle = {
    padding: padding ? "1.5rem" : "0",
    transition: "all 0.2s ease",
    ...(animation ? {
      animation: "fadeIn 0.4s ease forwards",
    } : {}),
  };

  // 页面头部样式
  const pageHeaderStyle = {
    marginBottom: padding ? "1rem" : "0",
    ...(showHeader ? {} : { display: "none" }),
  };

  // 卡片容器样式
  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: theme.styles.elevation.small,
    border: `1px solid ${theme.colors.neutral[200]}`,
    overflow: "hidden",
    margin: "0 auto",
  };

  return (
    <BasePage 
      padding={padding} 
      showHeader={showHeader}
      title={title}
      subtitle={subtitle}
      backButton={showBackButton}
      onBack={onBack}
      headerActions={headerActions}
      className={className}
      contentClassName={contentClassName}
    >
      <div style={getBackgroundStyle()} className="page-container min-h-screen">
        {showHeader && (
          <div style={pageHeaderStyle} className="page-header-content">
            {title && <h1 className="text-2xl font-semibold">{title}</h1>}
            {subtitle && <p className="text-neutral-600 mt-1">{subtitle}</p>}
          </div>
        )}
        <div style={contentStyle} className="page-content">
          {children}
        </div>
        
        {/* CSS 动画 */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInUp {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.4s ease forwards;
          }
          
          .animate-slide-up {
            animation: slideInUp 0.4s ease forwards;
          }
          
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
        `}</style>
      </div>
    </BasePage>
  );
};

PageTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showHeader: PropTypes.bool,
  showBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  headerActions: PropTypes.node,
  backgroundStyle: PropTypes.oneOf(["default", "gradient", "pattern"]),
  padding: PropTypes.bool,
  animation: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
};

export default PageTemplate; 