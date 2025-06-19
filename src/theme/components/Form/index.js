import React from 'react';
import styled from 'styled-components';

// 表单容器 - 居中显示表单
export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`;

// 表单框架 - 提供白色背景和阴影
export const FormFrame = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// 表单组 - 为每个输入字段提供间距
export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

// 表单输入框 - 统一的输入样式
export const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

// 表单输入组 - 用于验证码等组合输入
export const FormInputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

// 验证码按钮 - 用于发送验证码
export const FormCodeButton = styled.button`
  padding: 0 15px;
  height: 42px;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.disabled : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

// 提交按钮 - 用于表单提交
export const FormSubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.disabled : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

// 错误消息 - 显示表单错误
export const FormErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.errorBg};
  border-radius: 4px;
  border-left: 4px solid ${({ theme }) => theme.colors.error};
`;

// 成功消息 - 显示表单成功提示
export const FormSuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-size: 14px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.successBg};
  border-radius: 4px;
  border-left: 4px solid ${({ theme }) => theme.colors.success};
`;

// 表单标签 - 用于输入字段的标签
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMain};
`;

// 表单复选框容器
export const FormCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

// 表单复选框
export const FormCheckbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

// 表单复选框标签
export const FormCheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSub};
  cursor: pointer;
`;

// 导出所有组件
export default {
  FormContainer,
  FormFrame,
  FormGroup,
  FormInput,
  FormInputGroup,
  FormCodeButton,
  FormSubmitButton,
  FormErrorMessage,
  FormSuccessMessage,
  FormLabel,
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel
};