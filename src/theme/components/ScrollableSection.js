import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTheme } from "../ThemeProvider";
import "./ScrollableSection.css";

/**
 * ScrollableSection - A reusable component for horizontally scrollable content
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
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`theme-scrollable-section ${className}`}>
      <div className="theme-scrollable-header">
        <h3 style={{ fontSize: theme.fontSize["2xl"] }}>
          {titleIcon && <span className="theme-scrollable-icon">{titleIcon}</span>}
          {title}
          {actionButton && <span className="theme-scrollable-action">{actionButton}</span>}
        </h3>
        <div className="theme-scroll-controls">
          <button
            className="theme-scroll-control-btn"
            onClick={() => handleScroll("left")}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="theme-scroll-control-btn"
            onClick={() => handleScroll("right")}
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
