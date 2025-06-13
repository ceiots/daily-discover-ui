import React from 'react';
import styled from 'styled-components';
import { theme } from '../../tokens';
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
  padding: ${theme.spacing[4]};
  background-color: #f8f8fb;
`;

/**
 * 表单框架 - 提供白色背景和阴影
 */
export const FormFrame = styled.div`
  width: 100%;
  max-width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 24px 20px;
  margin-bottom: 16px;
`;

/**
 * 表单组 - 用于组织表单控件
 */
export const FormGroup = styled.div`
  margin-bottom: 18px;
`;

/**
 * 表单标签
 */
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

/**
 * 输入框
 */
export const FormInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid ${props => props.$error ? theme.colors.error : '#e7e7e7'};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: white;
  color: #2c2c2c;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? theme.colors.error : theme.colors.primary};
    box-shadow: ${props => props.$error 
      ? `0 0 0 2px rgba(255, 77, 79, 0.1)`
      : `0 0 0 2px rgba(91, 71, 232, 0.1)`};
  }
  
  &::placeholder {
    color: #bbb;
  }
`;

/**
 * 输入框组 - 水平排列输入框和按钮
 */
export const FormInputGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  
  ${FormInput} {
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
`;

/**
 * 验证码按钮
 */
export const FormCodeButton = styled.button`
  height: 44px;
  padding: 0 12px;
  min-width: 108px;
  border: none;
  border-radius: 0 8px 8px 0;
  background-color: ${props => props.disabled ? '#e0e0e0' : theme.colors.primary};
  color: ${props => props.disabled ? '#999' : 'white'};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
  }
  
  &:active:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
    transform: scale(0.98);
  }
`;

/**
 * 提交按钮
 */
export const FormSubmitButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 24px;
  margin-bottom: 12px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.disabled ? '#e0e0e0' : theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
  }
  
  &:active:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
    transform: scale(0.98);
  }
`;

/**
 * 错误消息
 */
export const FormErrorMessage = styled.div`
  margin-top: 6px;
  color: ${theme.colors.error};
  font-size: 12px;
`;

/**
 * 复选框容器
 */
export const FormCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  margin-top: 12px;
`;

/**
 * 复选框
 */
export const FormCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primary};
  cursor: pointer;
`;

/**
 * 复选框标签
 */
export const FormCheckboxLabel = styled.label`
  font-size: 13px;
  color: #666;
  cursor: pointer;
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * 底部链接
 */
export const FormBottomLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  font-size: 14px;
  
  a {
    color: ${theme.colors.primary};
    margin-left: 4px;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * 底部文本
 */
export const FormFooterText = styled.div`
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 12px;
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