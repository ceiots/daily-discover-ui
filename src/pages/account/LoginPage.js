import React from 'react';
import { Helmet } from 'react-helmet';
import LoginForm from '../../components/auth/LoginForm';
import { 
  AuthPageContainer, 
  AuthContentWrapper,
  LogoContainer,
  Logo,
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
      
      <AuthContentWrapper>
        <LogoContainer>
          <Logo />
          <Title>登录</Title>
          <Subtitle>欢迎回来，请登录您的账户</Subtitle>
        </LogoContainer>
        
        <LoginForm />
        
        <Footer>
          还没有账户？ <AuthLink to="/register">立即注册</AuthLink>
        </Footer>
      </AuthContentWrapper>
    </AuthPageContainer>
  );
};

export default LoginPage; 