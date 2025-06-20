import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import {
  PageWrapper,
  MicroNavBar,
  Logo,
  NavLinks,
  AuthCard,
  FormTitle,
  Form,
  InputGroup,
  Label,
  Input,
  VerificationGroup,
  CodeButton,
  SubmitButton,
  ErrorMessage,
  BottomLink
} from '../../theme/components/AuthLayoutComponents';
import { colors, typography, spacing, transitions, radius } from '../../theme/tokens';
import { useForgotPasswordPage } from './useForgotPasswordPage';

// 邮箱提示信息
const EmailInfo = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.textMain};
  margin-bottom: ${spacing[4]};
  
  strong {
    color: ${colors.primary};
    font-weight: ${typography.fontWeight.semibold};
  }
`;

// 步骤指示器
const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${spacing[5]};
`;

const Step = styled.div`
  width: ${spacing[2]};
  height: ${spacing[2]};
  border-radius: ${radius.full};
  background: ${props => props.$active ? colors.primary : colors.neutral[200]};
  margin: 0 ${spacing[1]};
  transition: all ${transitions.normal};
`;

// 主页面组件 - 使用React.memo优化整体性能
const ForgotPasswordPage = React.memo(() => {
  const location = useLocation();
  const {
    email, setEmail,
    code, setCode,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    step,
    error,
    isSendingCode,
    countdown,
    submitting,
    handleSendCode,
    handleResetPassword,
  } = useForgotPasswordPage();

  return (
    <>
      <Helmet>
        <title>重置密码 - Daily Discover</title>
        <meta name="description" content="重置您的Daily Discover账户密码。" />
      </Helmet>
      <PageWrapper>
        <MicroNavBar>
          <Logo>Daily <span>Discover</span></Logo>
          <NavLinks>
            <Link to="/daily" className={location.pathname === '/daily' ? 'active' : ''}>每日</Link>
            <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''}>发现</Link>
          </NavLinks>
        </MicroNavBar>
        
        <AuthCard>
          <FormTitle>重置密码</FormTitle>
          <StepIndicator>
            <Step $active={step === 1} />
            <Step $active={step === 2} />
          </StepIndicator>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {step === 1 && (
            <Form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} noValidate>
              <InputGroup>
                <Label htmlFor="email"><i className="fas fa-envelope"></i>注册邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的注册邮箱"
                  required
                />
              </InputGroup>
              <SubmitButton type="submit" disabled={isSendingCode}>
                {isSendingCode ? '发送中...' : '发送验证码'}
              </SubmitButton>
              <BottomLink>
                记起密码了？<Link to="/login">返回登录</Link>
              </BottomLink>
            </Form>
          )}

          {step === 2 && (
            <Form onSubmit={handleResetPassword} noValidate>
              <EmailInfo>验证码已发送到: <strong>{email}</strong></EmailInfo>
              
              <InputGroup>
                <Label htmlFor="code"><i className="fas fa-key"></i>验证码</Label>
                <VerificationGroup>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="请输入邮箱验证码"
                    required
                  />
                  <CodeButton 
                    type="button" 
                    onClick={handleSendCode} 
                    disabled={isSendingCode || countdown > 0}
                  >
                    {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '重新发送'}
                  </CodeButton>
                </VerificationGroup>
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="password"><i className="fas fa-lock"></i>新密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入新密码"
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="confirmPassword"><i className="fas fa-check-double"></i>确认新密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="确认新密码"
                  required
                />
              </InputGroup>
              
              <SubmitButton 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? '重置中...' : '重置密码'}
              </SubmitButton>
              
              <BottomLink>
                记起密码了？<Link to="/login">返回登录</Link>
              </BottomLink>
            </Form>
          )}
        </AuthCard>
      </PageWrapper>
    </>
  );
});

// 添加 displayName 用于性能监控
ForgotPasswordPage.displayName = 'ForgotPasswordPage';

export default ForgotPasswordPage;
