import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '../useTheme';

// 主题颜色变量
const THEME_COLOR = '#5B47E8';
const THEME_COLOR_LIGHT = '#F0EDFF';
const THEME_COLOR_DARK = '#4A3BD9';

// 表单容器
export const FormContainer = styled.div`
  padding: 0 28px;
  flex: 1;
  overflow-y: auto;
  width: 100%;
  max-width: 100%;
  position: relative;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

// 表单标题
export const FormTitle = styled.h1`
  color: #333;
  margin: 0 0 24px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 3px;
    background-color: ${props => props.accentColor || THEME_COLOR};
    border-radius: 1.5px;
  }
`;

// 表单分组
export const FormGroup = styled.div`
  margin-bottom: 14px;
  position: relative;
`;

// 表单标签
export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 3px;
  color: #333;
  letter-spacing: -0.2px;
`;

// 表单输入框
export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  font-size: 13px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
  background-color: #ffffff;
  color: #222;
  
  &:focus {
    border-color: ${props => props.accentColor || THEME_COLOR};
    box-shadow: 0 0 0 2px ${props => props.accentColor ? `${props.accentColor}20` : `${THEME_COLOR}20`};
    background-color: #fff;
  }
  
  ${props => props.$error && `
    border-color: #ff4d4f;
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.08);
    background-color: #fffafa;
  `};

  &::placeholder {
    color: #999;
    font-size: 12px;
  }
`;

// 输入框组（用于密码输入等）
export const InputGroup = styled.div`
  position: relative;
  
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 15px;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
`;

// 错误信息
export const ErrorMessage = styled.div`
  font-size: 11px;
  color: #ff4d4f;
  margin-top: 3px;
  margin-left: 2px;
`;

// 框架容器（用于登录注册等页面）
export const FormFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  min-height: 580px;
  max-height: 85vh;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(91, 71, 232, 0.08), 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
  border: 1px solid rgba(91, 71, 232, 0.06);
  backdrop-filter: blur(8px);
  
  @media (max-width: 480px) {
    max-width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
`;

// 页面容器（渐变背景等）
export const FormPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: linear-gradient(135deg, #F4F4FC 0%, #ECEAFF 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(91, 71, 232, 0.08) 0%, rgba(91, 71, 232, 0) 70%);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5%;
    left: -5%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(91, 71, 232, 0.06) 0%, rgba(91, 71, 232, 0) 70%);
    z-index: 0;
  }
`;

// 复选框容器
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  margin-top: 3px;
`;

// 复选框
export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin-right: 7px;
  margin-top: 1px;
  accent-color: ${props => props.accentColor || THEME_COLOR};
  cursor: pointer;
  position: relative;
  
  &:checked {
    background-color: ${props => props.accentColor || THEME_COLOR};
    border-color: ${props => props.accentColor || THEME_COLOR};
  }
`;

// 复选框标签
export const CheckboxLabel = styled.label`
  font-size: 11px;
  color: #333;
  line-height: 1.5;
  
  a {
    color: ${props => props.linkColor || THEME_COLOR};
    text-decoration: none;
    font-weight: 500;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: ${props => props.linkColor || THEME_COLOR};
      transition: width 0.3s ease;
    }
    
    &:hover:after {
      width: 100%;
    }
  }
`;

// 底部链接
export const BottomLink = styled.div`
  text-align: center;
  margin: 18px 0;
  font-size: 12px;
  color: #333;
  
  a {
    color: ${props => props.linkColor || THEME_COLOR};
    text-decoration: none;
    font-weight: 500;
    margin-left: 3px;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: ${props => props.linkColor || THEME_COLOR};
      transition: width 0.3s ease;
    }
    
    &:hover:after {
      width: 100%;
    }
  }
`;

// 提交按钮
export const SubmitButton = styled.button`
  width: 100%;
  border-radius: 8px;
  padding: 11px 20px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  cursor: pointer;
  outline: none;
  border: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.gradient || `linear-gradient(135deg, ${THEME_COLOR} 0%, ${THEME_COLOR_DARK} 100%)`};
  color: #fff;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(91, 71, 232, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%);
    transition: all 0.5s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(91, 71, 232, 0.25);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(91, 71, 232, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// 加载动画
export const Loader = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// 底部文本
export const FooterText = styled.div`
  text-align: center;
  margin-bottom: 14px;
  font-size: 10px;
  color: #666;
  opacity: 0.9;
`;

// App Logo 组件
export const AppLogo = styled.div`
  text-align: center;
  margin-bottom: 16px;
  
  img {
    height: 36px;
    width: auto;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(91, 71, 232, 0.1);
  }
  
  .app-name {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  }
`;

// 品牌文本
export const BrandText = styled.div`
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-bottom: 16px;
  letter-spacing: -0.2px;
  font-style: italic;
`;

// 通知消息
export const ToastMessage = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(38, 38, 38, 0.9);
  color: #fff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  
  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-10px);
  }
`;

// 自定义验证码按钮组件
export const CodeButton = ({ onClick, children, style, disabled, ...props }) => {
  const theme = useTheme();
  const accentColor = theme?.palette?.primary?.main || THEME_COLOR;
  
  return (
    <button
      type="button"
      style={{
        padding: '0 12px',
        height: '42px',
        borderRadius: '8px',
        border: `1px solid ${accentColor}`,
        backgroundColor: 'white',
        color: accentColor,
        fontWeight: '500',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        boxShadow: '0 0 0 0 rgba(91, 71, 232, 0.1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#f9f8ff';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(91, 71, 232, 0.15)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.boxShadow = '0 0 0 0 rgba(91, 71, 232, 0.1)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

CodeButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.object,
  disabled: PropTypes.bool
};

// 眼睛图标组件
export const EyeIcon = ({ closed }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {closed ? (
      <>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 1L23 23M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.49 18.49 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
      </>
    )}
  </svg>
);

EyeIcon.propTypes = {
  closed: PropTypes.bool
};

// 品牌Logo组件
export const BrandLogo = ({ size = 60 }) => (
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <img 
      src="https://dailydiscover.top/media/logo/logo.png"
      alt="每日发现"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(91, 71, 232, 0.15)',
        objectFit: 'cover',
        display: 'inline-block'
      }}
    />
    <div style={{ 
      marginTop: '8px', 
      fontWeight: 600, 
      fontSize: '16px', 
      color: '#333',
      letterSpacing: '-0.2px'
    }}>
      每日发现
    </div>
    <div style={{ 
      fontSize: '11px', 
      color: '#555',
      marginTop: '2px',
      letterSpacing: '0.5px'
    }}>
      Daily Discover
    </div>
  </div>
);

BrandLogo.propTypes = {
  size: PropTypes.number
};

// 验证工具函数
export const validators = {
  // 手机号验证
  isValidPhoneNumber: (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },
  
  // 密码强度验证
  isStrongPassword: (password) => {
    if (!password || password.length < 8) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    return true;
  },
  
  // 邮箱验证
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// 获取当前年份
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// 导出Form组件
const Form = {
  Container: FormContainer,
  Title: FormTitle,
  Group: FormGroup,
  Label: Label,
  Input: Input,
  InputGroup: InputGroup,
  ErrorMessage: ErrorMessage,
  Frame: FormFrame,
  PageContainer: FormPageContainer,
  CheckboxContainer: CheckboxContainer,
  Checkbox: Checkbox,
  CheckboxLabel: CheckboxLabel,
  BottomLink: BottomLink,
  SubmitButton: SubmitButton,
  Loader: Loader,
  FooterText: FooterText,
  ToastMessage: ToastMessage,
  CodeButton: CodeButton,
  EyeIcon: EyeIcon,
  BrandLogo: BrandLogo,
  AppLogo: AppLogo,
  BrandText: BrandText,
  validators: validators,
  getCurrentYear: getCurrentYear
};

export default Form;
