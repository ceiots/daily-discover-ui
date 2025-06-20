import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';
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
import { colors, typography, spacing, radius, shadows, transitions } from '../../theme/tokens';

// 邮箱提示信息
const EmailInfo = styled.p`
  font-size: ${typography.fontSize.base}; /* 0.85rem */
  color: ${colors.textMain};
  margin-bottom: ${spacing[4]}; /* 16px */
  
  strong {
    color: ${colors.primary};
    font-weight: ${typography.fontWeight.semibold};
  }
`;

// 步骤指示器
const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${spacing[5]}; /* 20px */
`;

const Step = styled.div`
  width: ${spacing[2]}; /* 8px */
  height: ${spacing[2]}; /* 8px */
  border-radius: ${radius.full};
  background: ${props => props.$active ? colors.primary : colors.neutral[200]};
  margin: 0 ${spacing[1]}; /* 0 4px */
  transition: all ${transitions.normal};
`;

// 主页面组件 - 使用React.memo优化整体性能
const ForgotPasswordPage = React.memo(() => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 输入邮箱, 2: 输入验证码和新密码
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation hook

  // 倒计时效果
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsSendingCode(true);
    setLoading(true);
    setError('');
    try {
      const response = await authService.sendVerificationCode(email, 3); // 3 for reset password
      if (response && response.data.success) {
        toast.success('验证码已发送，请注意查收');
        setStep(2); // 进入下一步
        setCountdown(60);
      } else {
        setError(response.data.message || '发送验证码失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '发送验证码失败，请确认邮箱是否已注册');
    } finally {
      setIsSendingCode(false);
      setLoading(false);
    }
  }, [email]);

  // 重置密码
  const handleResetPassword = useCallback(async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    if (!password) {
      setError('请输入新密码');
      return;
    }
    setError('');

    try {
      setSubmitting(true);
      const response = await authService.resetPassword({ email, code, password });
      if (response && response.data.success) {
        toast.success('密码重置成功！即将跳转到登录页。');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || '密码重置失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '密码重置失败，请检查验证码或稍后再试');
    } finally {
      setSubmitting(false);
    }
  }, [email, code, password, confirmPassword, navigate]);

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
              <SubmitButton type="submit" disabled={isSendingCode || loading}>
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
