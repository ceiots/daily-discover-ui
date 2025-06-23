import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPageContainer = styled.div`
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

const RegisterPage = () => {
  return (
    <RegisterPageContainer>
      <Helmet>
        <title>注册 - Daily Discover</title>
        <meta name="description" content="创建您的Daily Discover账户，开始您的个性化探索之旅" />
      </Helmet>
      <FormWrapper>
        <h1>创建您的账户</h1>
        <RegisterForm />
      </FormWrapper>
    </RegisterPageContainer>
  );
};

export default RegisterPage; 