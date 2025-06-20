import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

// 颜色定义 - 中国传统色彩搭配
const PRIMARY_COLOR = '#5B47E8'; // 主色：靛青色
const SECONDARY_COLOR = '#E8614F'; // 辅助色：中国红
const TEXT_COLOR = '#2D3748'; // 文字主色
const BG_COLOR = '#F8FAFC'; // 背景色：浅灰色

// 顶部主色背景条
const TopColorBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${PRIMARY_COLOR};
  z-index: 101;
`;

// 页面容器 - 使用更现代的背景设计
const PageWrapper = styled.div`
  background-color: ${BG_COLOR};
  background-image: 
    radial-gradient(circle at 90% 10%, rgba(91, 71, 232, 0.07), transparent 400px),
    radial-gradient(circle at 10% 90%, rgba(232, 97, 79, 0.05), transparent 300px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 80px 16px 20px;
  position: relative;
  overflow-x: hidden;
`;

// 超简化的顶部导航 - 减少渲染复杂度
const MicroNavBar = styled.div`
  position: fixed;
  top: 4px; /* 位于顶部色条下方 */
  left: 0;
  right: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

// 更紧凑的Logo
const Logo = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${TEXT_COLOR};
  letter-spacing: -0.3px;
  
  span {
    color: ${PRIMARY_COLOR};
  }
`;

// 更紧凑的导航链接
const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  
  a {
    color: ${TEXT_COLOR};
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: ${PRIMARY_COLOR};
    }
  }
`;

// 重新设计的表单卡片 - 无边框设计
const AuthCard = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 24px 16px;
  background: transparent;
`;

// 表单标题 - 更紧凑
const FormTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${TEXT_COLOR};
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: -0.5px;
`;

// 表单容器
const Form = styled.form`
  width: 100%;
`;

// 输入框组 - 更紧凑
const InputGroup = styled.div`
  margin-bottom: 14px;
  position: relative;
`;

// 标签 - 更小更紧凑
const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${TEXT_COLOR};
  
  i {
    margin-right: 6px;
    color: ${PRIMARY_COLOR};
    font-size: 0.9rem;
  }
`;

// 输入框 - 无边框设计，更紧凑
const Input = styled.input`
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 0.9rem;
  color: ${TEXT_COLOR};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 3px 8px rgba(91, 71, 232, 0.08);
  }
  
  &::placeholder {
    color: #A0AEC0;
    font-size: 0.8rem;
  }
`;

// 验证码输入框组
const VerificationGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// 验证码按钮 - 更紧凑
const CodeButton = styled.button`
  flex-shrink: 0;
  height: 44px;
  padding: 0 12px;
  background: rgba(91, 71, 232, 0.08);
  color: ${PRIMARY_COLOR};
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: rgba(91, 71, 232, 0.12);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 提交按钮 - 更紧凑
const SubmitButton = styled.button`
  width: 100%;
  height: 44px;
  background: ${PRIMARY_COLOR};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(91, 71, 232, 0.15);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

// 错误消息 - 更紧凑
const ErrorMessage = styled.div`
  color: ${SECONDARY_COLOR};
  font-size: 0.75rem;
  margin-top: 3px;
  padding-left: 4px;
  margin-bottom: 10px;
`;

// 底部链接 - 更紧凑
const BottomLink = styled.div`
  text-align: center;
  margin-top: 16px;
  font-size: 0.8rem;
  color: #718096;
  
  a {
    color: ${PRIMARY_COLOR};
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 邮箱提示信息
const EmailInfo = styled.p`
  font-size: 0.85rem;
  color: ${TEXT_COLOR};
  margin-bottom: 16px;
  
  strong {
    color: ${PRIMARY_COLOR};
    font-weight: 600;
  }
`;

// 步骤指示器
const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Step = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? PRIMARY_COLOR : 'rgba(0, 0, 0, 0.1)'};
  margin: 0 4px;
  transition: all 0.3s;
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
      <TopColorBar />
      <PageWrapper>
        <MicroNavBar>
          <Logo>Daily <span>Discover</span></Logo>
          <NavLinks>
            <Link to="/daily">每日</Link>
            <Link to="/discover">发现</Link>
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
