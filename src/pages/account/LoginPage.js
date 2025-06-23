import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import LoginForm from '../../components/auth/LoginForm';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

const FormWrapper = styled.div`
  padding: 40px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;

  h1 {
    margin-bottom: 24px;
    color: #333;
    font-size: 24px;
  }
`;

const LoginPage = () => {
  return (
    <LoginPageContainer>
      <Helmet>
        <title>登录 - Daily Discover</title>
        <meta name="description" content="登录您的Daily Discover账户，开启您的个性化体验" />
      </Helmet>
      <FormWrapper>
        <h1>登录到您的账户</h1>
        <LoginForm />
      </FormWrapper>
    </LoginPageContainer>
  );
};

export default LoginPage; 