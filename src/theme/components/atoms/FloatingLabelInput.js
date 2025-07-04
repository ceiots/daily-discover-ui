import React, { useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import tokens from '../../tokens';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${tokens.spacing.lg};
`;

const InputField = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.isFocused 
    ? tokens.colors.primary.main 
    : tokens.colors.border.main};
  padding: ${tokens.spacing.sm} 0;
  font-size: ${tokens.typography.fontSize.sm};
  font-family: ${tokens.typography.fontFamily};
  color: ${tokens.colors.text.primary};
  outline: none;
  transition: border-color ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut};

  &::placeholder {
    color: transparent;
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const Label = styled.label`
  position: absolute;
  left: 0;
  font-size: ${props => (props.isFloating 
    ? tokens.typography.fontSize.xs 
    : tokens.typography.fontSize.sm)};
  color: ${props => (props.isFocused 
    ? tokens.colors.primary.main 
    : tokens.colors.text.secondary)};
  transform: translateY(${props => (props.isFloating ? '-100%' : '0')});
  transition: all ${tokens.animation.duration.normal} ${tokens.animation.easing.easeOut};
  pointer-events: none;
  font-weight: ${tokens.typography.fontWeight.medium};
  font-family: ${tokens.typography.fontFamily};
`;

const FocusBorder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => (props.isFocused ? '100%' : '0')};
  height: 2px;
  background-color: ${tokens.colors.primary.main};
  transition: width ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut};
`;

const EndAdornment = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${tokens.colors.text.secondary};
  
  &:hover {
    color: ${tokens.colors.primary.main};
  }
`;

/**
 * 浮动标签输入框组件
 * 当输入框获得焦点或有内容时，标签会浮动到输入框上方
 */
const FloatingLabelInput = forwardRef(({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  endAdornment,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // 监听value变化，更新hasValue状态
  useEffect(() => {
    setHasValue(value !== undefined && value !== '');
  }, [value]);

  // 判断标签是否需要浮动
  const isFloating = isFocused || hasValue;

  // 处理获得焦点事件
  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  // 处理失去焦点事件
  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <InputContainer>
      <InputField
        id={id}
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        isFocused={isFocused}
        placeholder={label}
        {...props}
      />
      <Label 
        htmlFor={id} 
        isFloating={isFloating} 
        isFocused={isFocused}
      >
        {label}{required && '*'}
      </Label>
      <FocusBorder isFocused={isFocused} />
      {endAdornment && (
        <EndAdornment>{endAdornment}</EndAdornment>
      )}
    </InputContainer>
  );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';

export default FloatingLabelInput; 