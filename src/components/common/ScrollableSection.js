import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../theme";
import "./ScrollableSection.css";

/**
 * ScrollableSection - A reusable component for horizontally scrollable content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be scrolled
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.titleIcon - Icon to display before title
 * @param {React.ReactNode} props.actionButton - Optional button to display next to title
 * @param {string} props.className - Additional CSS class
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
    <div className={`scrollable-section ${className}`}>
      <div className="scrollable-header">
        <h3 style={{ fontSize: theme.fontSize["2xl"] }}>
          {titleIcon && <span className="scrollable-icon">{titleIcon}</span>}
          {title}
          {actionButton && <span className="scrollable-action">{actionButton}</span>}
        </h3>
        <div className="scroll-controls">
          <button
            className="scroll-control-btn"
            onClick={() => handleScroll("left")}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="scroll-control-btn"
            onClick={() => handleScroll("right")}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className="scrollable-content" ref={scrollRef}>
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