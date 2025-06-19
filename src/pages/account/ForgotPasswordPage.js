import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';
import { 
  FormContainer, 
  FormWrapper, 
  FormTitle,
  FormInput, 
  SubmitButton, 
  VerificationCodeInput,
  ErrorMessage,
  AlternateAuthAction
} from '../../theme';
import { Helmet } from 'react-helmet-async';

const ForgotPasswordPage = () => {
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

  const handleSendCode = async () => {
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
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.data.message || '发送验证码失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '发送验证码失败，请确认邮箱是否已注册');
    } finally {
      setIsSendingCode(false);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
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
  };

  return (
    <FormContainer>
      <Helmet>
        <title>重置密码 - 每日发现</title>
      </Helmet>
      <FormWrapper>
        <FormTitle>重置密码</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
            <FormInput
              label="注册邮箱"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的注册邮箱"
              required
            />
            <SubmitButton type="submit" disabled={isSendingCode || loading}>
              {isSendingCode ? '发送中...' : '发送验证码'}
            </SubmitButton>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <p>验证码已发送到: <strong>{email}</strong></p>
            <VerificationCodeInput
              label="验证码"
              id="code"
              error={error}
              onSendCode={handleSendCode}
              isSending={isSendingCode || countdown > 0}
              inputProps={{
                value: code,
                onChange: (e) => setCode(e.target.value),
                placeholder: "邮箱验证码",
                required: true
              }}
            />
            <FormInput
              label="新密码"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入新密码"
              required
            />
            <FormInput
              label="确认新密码"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="确认新密码"
              required
            />
            <SubmitButton 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? '重置中...' : '重置密码'}
            </SubmitButton>
          </form>
        )}

        <AlternateAuthAction text="记起密码了？" linkText="返回登录" to="/login" />
      </FormWrapper>
    </FormContainer>
  );
};

export default ForgotPasswordPage;
