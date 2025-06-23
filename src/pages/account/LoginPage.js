import React from 'react';
import { Helmet } from 'react-helmet';
import LoginForm from '../../components/auth/LoginForm';
import Header from '../../theme/components/common/Header';
import { 
  AuthPageContainer, 
  AuthContentWrapper,
  Title, 
  Subtitle,
  Footer,
  AuthLink
} from '../../theme/components/auth/AuthComponents';

const LoginPage = () => {
  return (
    <AuthPageContainer>
      <Helmet>
        <title>登录 - Daily Discover</title>
        <meta name="description" content="登录您的Daily Discover账户，开启您的个性化体验" />
      </Helmet>
      
      <Header title="登录" onBack={null} variant="primary" />
      
      <AuthContentWrapper>
        <Title>欢迎回来</Title>
        <Subtitle>请登录您的账户以继续</Subtitle>
        
        <LoginForm />
        
        <Footer>
          还没有账户？ <AuthLink to="/register">立即注册</AuthLink>
        </Footer>
      </AuthContentWrapper>
    </AuthPageContainer>
  );
};

export default LoginPage; 