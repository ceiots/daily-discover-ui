import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLoginPage } from '../../pages/account/useLoginPage';

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
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
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
    background-color: #4936d8;
  }
`;

const FormFooter = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: #5B47E8;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

function LoginForm() {
  const { isLoading, formData, handleChange, handleSubmit } = useLoginPage();

  return (
    <form onSubmit={handleSubmit}>
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
      <FormFooter>
        没有账户？<StyledLink to="/register">立即注册</StyledLink>
      </FormFooter>
    </form>
  );
}

export default LoginForm; 