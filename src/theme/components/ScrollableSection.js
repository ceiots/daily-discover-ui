import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTheme } from "./ThemeProvider";
import "./ScrollableSection.css";

/**
 * ScrollableSection - 优化版简洁高级UI/UX设计
 * 用于横向滚动内容的可复用组件
 */
const ScrollableSection = ({
  children,
  title,
  titleIcon,
  actionButton,
  className = "",
}) => {
  const theme = useTheme();
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`theme-scrollable-section ${className}`}>
      <div className="theme-scrollable-header">
        <h3 className="text-h3">
          {titleIcon && <span className="theme-scrollable-icon">{titleIcon}</span>}
          {title}
          {actionButton && <span className="theme-scrollable-action">{actionButton}</span>}
        </h3>
        <div className="theme-scroll-controls">
          <button
            className="theme-scroll-control-btn"
            onClick={() => handleScroll("left")}
            aria-label="向左滚动"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="theme-scroll-control-btn"
            onClick={() => handleScroll("right")}
            aria-label="向右滚动"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className="theme-scrollable-content" ref={scrollRef}>
        {children}
      </div>
    </div>
  );
};

ScrollableSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  titleIcon: PropTypes.node,
  actionButton: PropTypes.node,
  className: PropTypes.string,
};

export default ScrollableSection;
