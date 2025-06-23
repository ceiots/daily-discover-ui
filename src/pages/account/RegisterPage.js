import React from 'react';
import { Helmet } from 'react-helmet';
import RegisterForm from '../../components/auth/RegisterForm';
import Header from '../../theme/components/common/Header';
import { 
  AuthPageContainer, 
  AuthContentWrapper,
  Title, 
  Subtitle,
  Footer,
  AuthLink
} from '../../theme/components/auth/AuthComponents';

const RegisterPage = () => {
  return (
    <AuthPageContainer>
      <Helmet>
        <title>注册 - Daily Discover</title>
        <meta name="description" content="创建您的Daily Discover账户，开始您的个性化探索之旅" />
      </Helmet>
      
      <Header title="创建账户" onBack={null} variant="primary" />
      
      <AuthContentWrapper>
        <Title>加入我们</Title>
        <Subtitle>填写以下信息，开启您的探索之旅</Subtitle>
        
        <RegisterForm />
        
        <Footer>
          已有账户？ <AuthLink to="/login">立即登录</AuthLink>
        </Footer>
      </AuthContentWrapper>
    </AuthPageContainer>
  );
};

export default RegisterPage; 