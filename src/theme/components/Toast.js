import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Toast = ({ message, visible, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-2 rounded-lg shadow-lg text-base animate-fade-in">
      {message}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;