import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';
import { FormContainer, FormFrame, FormInput, FormCodeButton, FormSubmitButton, FormErrorMessage } from '../../theme/components/Form';
import { Helmet } from 'react-helmet-async';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 输入邮箱, 2: 输入验证码和新密码
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    setError('');
    try {
      const response = await authService.sendVerificationCode(email, 3); // 3 for reset password
      if (response && response.success) {
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
      }
    } catch (err) {
      setError(err.response?.data?.message || '发送验证码失败，请确认邮箱是否已注册');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    setError('');

    try {
      setSubmitting(true);
      const response = await authService.resetPassword({ email, code, password });
      if (response && response.success) {
        toast.success('密码重置成功！即将跳转到登录页。');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || '密码重置失败，请检查验证码或稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormFrame title="重置密码">
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 && (
          <div>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的注册邮箱"
              required
            />
            <FormSubmitButton onClick={handleSendCode} disabled={loading}>
              {loading ? '发送中...' : '发送验证码'}
            </FormSubmitButton>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <p>验证码已发送到: {email}</p>
            <div className="form-group-inline">
              <FormInput
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="邮箱验证码"
                required
                className="code-input"
              />
              <FormCodeButton
                type="button"
                onClick={handleSendCode}
                disabled={loading || countdown > 0}
              >
                {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
              </FormCodeButton>
            </div>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入新密码"
              required
            />
            <FormInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="确认新密码"
              required
            />
            <FormSubmitButton 
              type="submit" 
              disabled={loading}
              style={{ marginBottom: '10px' }}
            >
              {loading ? '重置中...' : '重置密码'}
            </FormSubmitButton>
          </form>
        )}

        <div className="form-footer">
          <Link to="/login">返回登录</Link>
        </div>
      </FormFrame>
    </FormContainer>
  );
};

export default ForgotPasswordPage;
