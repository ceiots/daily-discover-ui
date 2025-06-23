import React from 'react';
import styled from 'styled-components';
import { useLoginPage } from '../../pages/account/useLoginPage';

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
  margin-top: 10px;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #4936D8;
  }
`;

function LoginForm() {
  const { isLoading, formData, handleChange, handleSubmit } = useLoginPage();

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputWrapper>
        <Label htmlFor="email">邮箱</Label>
        <Input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          required 
          placeholder="请输入您的邮箱"
        />
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
          placeholder="请输入您的密码"
        />
      </InputWrapper>
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? '登录中...' : '登录'}
      </SubmitButton>
    </FormContainer>
  );
}

export default LoginForm; 