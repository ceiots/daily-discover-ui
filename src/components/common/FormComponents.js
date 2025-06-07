import React from "react";
import PropTypes from 'prop-types';
import "./FormComponents.css";

// 输入框组件
export const Input = ({ 
  type = "text", 
  name, 
  placeholder, 
  value, 
  onChange, 
  error, 
  fullWidth, 
  size = "default",
  prefix,
  min,
  max,
  className = "",
  ...props 
}) => {
  const sizeClass = size === "small" ? "form-input-sm" : "form-input";
  
  // 处理普通Input
  if (type !== "textarea") {
    return (
      <div className={`input-wrapper ${fullWidth ? 'w-full' : ''}`}>
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className={`${sizeClass} ${error ? 'input-error' : ''} ${prefix ? 'pl-6' : ''} ${className}`}
          min={min}
          max={max}
          {...props}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
  
  // 如果是textarea类型
  return <TextArea placeholder={placeholder} value={value} onChange={onChange} {...props} />;
};

// 文本域组件
class TextArea extends React.Component {
  render() {
    const { placeholder, value, onChange, rows = 3, className = "", ...props } = this.props;
    return (
      <textarea
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className={`form-textarea ${className}`}
        rows={rows}
        {...props}
      />
    );
  }
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  rows: PropTypes.number,
  className: PropTypes.string
};

// 为了保持兼容性
Input.TextArea = TextArea;

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  size: PropTypes.string,
  prefix: PropTypes.node,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

// 选择框组件
export const Select = ({ 
  value, 
  onChange, 
  placeholder, 
  children, 
  fullWidth, 
  error,
  className = "",
  ...props 
}) => {
  return (
    <div className={`select-wrapper ${fullWidth ? 'w-full' : ''}`}>
      <select
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'select-error' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

// 标题组件
class Title extends React.Component {
  render() {
    const { level = 1, children, className = "", ...props } = this.props;
    const TagName = `h${level}`;
    return (
      <TagName className={`title title-${level} ${className}`} {...props}>
        {children}
      </TagName>
    );
  }
}

Title.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string
};

// 文本组件
class Text extends React.Component {
  render() {
    const { type = "default", children, className = "", ...props } = this.props;
    return (
      <span className={`text text-${type} ${className}`} {...props}>
        {children}
      </span>
    );
  }
}

Text.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

// 排版组件
export const Typography = {
  Title,
  Text
};

export default {
  Input,
  Select,
  Typography
}; 