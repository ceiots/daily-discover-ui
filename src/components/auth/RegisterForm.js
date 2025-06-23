import React from 'react';
import styled from 'styled-components';
import { useRegisterPage } from '../../pages/account/useRegisterPage';

const FormContainer = styled.form`
  padding-top: 16px;
`;

const InputWrapper = styled.div`
  margin-bottom: 16px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #5B47E8;
    outline: none;
  }
`;

const VerificationCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CodeButton = styled.button`
  padding: 12px 15px;
  background-color: ${props => props.disabled ? '#ccc' : '#5B47E8'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.3s;
  
  &:hover:not(:disabled) {
    background-color: #4936D8;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #5B47E8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #4936D8;
  }
`;

function RegisterForm() {
  const { 
    isLoading, 
    isSendingCode, 
    countdown, 
    formData, 
    handleChange, 
    handleSubmit, 
    handleSendCode 
  } = useRegisterPage();

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputWrapper>
        <Label htmlFor="username">用户名</Label>
        <Input 
          type="text" 
          id="username" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="请输入您的用户名"
          required 
        />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="email">邮箱</Label>
        <Input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder="请输入您的邮箱"
          required
        />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="code">验证码</Label>
        <VerificationCodeWrapper>
          <Input 
            type="text" 
            id="code" 
            name="code" 
            value={formData.code}
            onChange={handleChange}
            placeholder="请输入验证码"
            required
            style={{ flex: 1 }}
          />
          <CodeButton 
            type="button" 
            onClick={handleSendCode} 
            disabled={isSendingCode || countdown > 0}
          >
            {isSendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s` : '发送验证码')}
          </CodeButton>
        </VerificationCodeWrapper>
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="password">密码</Label>
        <Input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
          placeholder="请设置密码（至少8位）"
          required
        />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="confirmPassword">确认密码</Label>
        <Input 
          type="password" 
          id="confirmPassword" 
          name="confirmPassword" 
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="请再次输入密码"
          required
        />
      </InputWrapper>
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? '注册中...' : '注册'}
      </SubmitButton>
    </FormContainer>
  );
}

export default RegisterForm; 