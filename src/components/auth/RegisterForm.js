import React from 'react';
import styled from 'styled-components';
import { useRegisterPage } from '../../pages/account/useRegisterPage';

const InputWrapper = styled.div`
  margin-bottom: 16px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const VerificationCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
    <form onSubmit={handleSubmit}>
      <InputWrapper>
        <Label htmlFor="username">用户名</Label>
        <Input 
          type="text" 
          id="username" 
          name="username"
          value={formData.username}
          onChange={handleChange}
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
            required
            style={{ flex: 1 }}
          />
          <button 
            type="button" 
            onClick={handleSendCode} 
            disabled={isSendingCode || countdown > 0}
            style={{ padding: '10px 15px', flexShrink: 0 }}
          >
            {isSendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s` : '发送验证码')}
          </button>
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
          required
        />
      </InputWrapper>
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? '注册中...' : '注册'}
      </SubmitButton>
    </form>
  );
}

export default RegisterForm; 