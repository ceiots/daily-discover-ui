import React from 'react';
import styled from 'styled-components';
import { theme } from '../../tokens';
import { UI_COLORS, UI_SIZES, UI_BORDERS, UI_SHADOWS, UI_ANIMATIONS } from '../../styles/uiConstants';
import PropTypes from 'prop-types';

/**
 * 表单容器 - 居中展示表单
 */
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 54px);
  padding: ${theme.spacing[2]};
  background-color: #f8f8fb;
`;

/**
 * 表单框架 - 提供白色背景和阴影
 */
export const FormFrame = styled.div`
  width: 100%;
  max-width: 340px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  padding: 20px 16px;
  margin-bottom: 12px;
`;

/**
 * 表单组 - 用于组织表单控件
 */
export const FormGroup = styled.div`
  margin-bottom: 14px;
`;

/**
 * 表单标签
 */
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #4B5563;
`;

/**
 * 输入框
 */
export const FormInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid ${props => props.$error ? UI_COLORS.ERROR : UI_COLORS.BORDER_LIGHT};
  border-radius: 6px;
  font-size: 13px;
  color: ${UI_COLORS.TEXT_DARK};
  background-color: white;
  transition: ${UI_ANIMATIONS.FAST};
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? UI_COLORS.ERROR : UI_COLORS.PRIMARY};
    box-shadow: ${props => props.$error 
      ? `0 0 0 2px ${UI_COLORS.ERROR}20` 
      : `0 0 0 2px ${UI_COLORS.PRIMARY_SHADOW}`};
  }
  
  &::placeholder {
    color: #9ca3af;
    font-size: 12px;
  }
  
  &.input-focus-effect:focus {
    border-color: ${UI_COLORS.PRIMARY};
    box-shadow: 0 0 0 2px ${UI_COLORS.PRIMARY_SHADOW};
  }
`;

/**
 * 输入框组 - 用于组合输入框和按钮
 */
export const FormInputGroup = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * 表单验证码按钮
 */
export const FormCodeButton = styled.button`
  flex-shrink: 0;
  height: 40px;
  min-width: 100px;
  background-color: ${props => props.disabled ? '#F0F0F0' : 'white'};
  color: ${props => props.disabled ? '#AAAAAA' : UI_COLORS.TEXT_MEDIUM};
  border: 1px solid ${props => props.disabled ? '#E0E0E0' : UI_COLORS.BORDER_LIGHT};
  border-radius: ${UI_BORDERS.RADIUS_MEDIUM};
  padding: 0 12px;
  margin-left: 10px;
  font-size: ${UI_SIZES.FONT_SMALL};
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: ${UI_ANIMATIONS.FAST};
  position: relative;
  overflow: hidden;
  
  /* 优化的发光效果，更柔和，与主题协调 */
  &.code-button-active {
    color: ${UI_COLORS.PRIMARY};
    border-color: ${UI_COLORS.PRIMARY_LIGHT};
    background-color: ${UI_COLORS.PRIMARY_LIGHT}10;
    
    &:hover {
      background-color: ${UI_COLORS.PRIMARY_LIGHT}30;
      box-shadow: 0 0 8px ${UI_COLORS.PRIMARY_SHADOW};
    }
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 0 5px ${UI_COLORS.PRIMARY_SHADOW};
    }
    
    /* 微妙的光晕效果 */
    &::after {
      content: '';
      position: absolute;
      top: -10%;
      left: -10%;
      right: -10%;
      bottom: -10%;
      background: radial-gradient(
        circle at center,
        ${UI_COLORS.PRIMARY_LIGHT}40 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
      pointer-events: none;
    }
    
    &:hover::after {
      opacity: 0.7;
    }
  }
`;

/**
 * 提交按钮
 */
export const FormSubmitButton = styled.button`
  width: 100%;
  height: 42px;
  background-color: ${props => props.disabled ? '#e0e0e0' : UI_COLORS.PRIMARY};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: ${UI_ANIMATIONS.FAST};
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    background-color: ${UI_COLORS.PRIMARY_HOVER};
    box-shadow: ${UI_SHADOWS.BUTTON};
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: ${UI_SHADOWS.BUTTON_ACTIVE};
  }
  
  &.submit-button {
    margin-top: 12px;
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        to right,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      transform: skewX(-25deg);
      transition: all 0.75s ease;
    }
    
    &:hover::after {
      left: 150%;
    }
  }
`;

/**
 * 错误消息
 */
export const FormErrorMessage = styled.div`
  color: ${UI_COLORS.ERROR};
  font-size: 11px;
  margin-top: 4px;
`;

/**
 * 复选框容器
 */
export const FormCheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  position: relative;
`;

/**
 * 复选框
 */
export const FormCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  
  &:checked + label::before {
    background-color: ${UI_COLORS.PRIMARY};
    border-color: ${UI_COLORS.PRIMARY};
  }
  
  &:checked + label::after {
    opacity: 1;
  }
  
  &.custom-checkbox + label::before {
    width: 16px;
    height: 16px;
    border-radius: 3px;
  }
  
  &.custom-checkbox + label::after {
    top: 2.5px;
    left: 5.5px;
    width: 5px;
    height: 10px;
    border-width: 0 2px 2px 0;
  }
`;

/**
 * 复选框标签
 */
export const FormCheckboxLabel = styled.label`
  font-size: 12px;
  color: #4B5563;
  margin-left: 24px;
  line-height: 1.4;
  position: relative;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -24px;
    width: 18px;
    height: 18px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: white;
    transition: all 0.2s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: -18px;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::before {
    border-color: ${UI_COLORS.PRIMARY};
  }
`;

/**
 * 表单底部链接
 */
export const FormBottomLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #6B7280;
  
  a {
    color: ${UI_COLORS.PRIMARY};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * 表单页脚文本
 */
export const FormFooterText = styled.div`
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 8px;
`;

/**
 * 表单页面容器
 */
export const FormPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.neutral[100]};
`;

/**
 * 品牌Logo
 */
export const FormBrandLogo = styled.div`
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '60px'};
  margin: 0 auto ${theme.spacing[4]};
  border-radius: 50%;
  background-color: ${theme.colors.primary[100]};
  background-image: url('/logo.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

/**
 * 表单标题
 */
export const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
`;

/**
 * 眼睛图标 - 用于显示/隐藏密码
 * @param {Object} props - 组件属性
 * @param {boolean} props.closed - 是否显示闭眼状态
 */
export const FormEyeIcon = ({ closed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {closed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

FormEyeIcon.propTypes = {
  closed: PropTypes.bool
};

// 为了兼容旧代码，添加别名
export const Label = FormLabel;
export const Input = FormInput;
export const InputGroup = FormInputGroup;
export const SubmitButton = FormSubmitButton;
export const ErrorMessage = FormErrorMessage;
export const BrandLogo = FormBrandLogo;
export const PageContainer = FormPageContainer;
export const Title = FormTitle;
export const CheckboxContainer = FormCheckboxContainer;
export const Checkbox = FormCheckbox; 
export const CheckboxLabel = FormCheckboxLabel;
export const BottomLink = FormBottomLink;
export const FooterText = FormFooterText;
export const CodeButton = FormCodeButton;
export const EyeIcon = FormEyeIcon; 