import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import tokens from '../../theme/tokens';
import useLoginForm from '../../hooks/useLoginForm';
import FloatingLabelInput from '../../theme/components/atoms/FloatingLabelInput';
import Button from '../../theme/components/atoms/Button';
import AuthTemplate from '../../theme/components/templates/AuthTemplate';

// 头部内容
const Header = styled.div`
  margin-top: ${tokens.spacing.xxl};
  margin-bottom: ${tokens.spacing.xl};
`;

// 欢迎标题
const WelcomeTitle = styled.h1`
  font-size: ${tokens.typography.fontSize.xxl};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${tokens.colors.text.primary};
  margin: 0;
  font-family: ${tokens.typography.fontFamily};
`;

// 欢迎副标题
const WelcomeSubtitle = styled.p`
  font-size: ${tokens.typography.fontSize.lg};
  color: ${tokens.colors.text.secondary};
  margin: ${tokens.spacing.md} 0 0 0;
  display: flex;
  align-items: center;
  font-weight: ${tokens.typography.fontWeight.medium};
  font-family: ${tokens.typography.fontFamily};
  letter-spacing: 0.2px;
`;

// 心形图标
const HeartIcon = styled.span`
  margin-left: ${tokens.spacing.sm};
  font-size: ${tokens.typography.fontSize.xl};
  color: ${tokens.colors.primary.main};
  font-weight: ${tokens.typography.fontWeight.regular};
`;

// 表单区域
const FormSection = styled.div`
  margin: auto 0;
  width: 100%;
`;

// 登录表单
const LoginForm = styled.form`
  width: 100%;
`;

// 按钮容器
const ButtonContainer = styled.div`
  margin-top: ${tokens.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

/**
 * 登录页面组件
 * 基于7.5节认证页面设计规范实现的精美登录界面
 */
const LoginPage = memo(() => {
  const {
    email,
    password,
    isLoading,
    passwordShown,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
    handleCancel
  } = useLoginForm();

  return (
    <AuthTemplate>
      <Helmet>
        <title>登录 - 每日发现</title>
        <meta name="description" content="登录您的每日发现账户，开启您的个性化体验" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Header>
        <WelcomeTitle>Login</WelcomeTitle>
        <WelcomeSubtitle>
          Good to see you
          <HeartIcon>♡</HeartIcon>
        </WelcomeSubtitle>
      </Header>

      <FormSection>
        <LoginForm onSubmit={handleSubmit}>
          <FloatingLabelInput 
            id="email"
            label="邮箱"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
          />
          
          <FloatingLabelInput 
            id="password"
            label="密码"
            type={passwordShown ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            required
            autoComplete="current-password"
            endAdornment={
              passwordShown ? (
                <FiEyeOff onClick={togglePasswordVisibility} />
              ) : (
                <FiEye onClick={togglePasswordVisibility} />
              )
            }
          />
          
          <ButtonContainer>
            <Button 
              type="submit"
              loading={isLoading}
              size="medium"
              block
            >
              登录
            </Button>
            
            <Button
              type="button"
              variant="text"
              onClick={handleCancel}
              style={{ marginTop: tokens.spacing.xl }}
            >
              取消
            </Button>
          </ButtonContainer>
        </LoginForm>
      </FormSection>
    </AuthTemplate>
  );
});

LoginPage.displayName = 'LoginPage';

export default LoginPage; 