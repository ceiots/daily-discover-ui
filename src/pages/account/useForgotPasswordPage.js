import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';

export const useForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 输入邮箱, 2: 输入验证码和新密码
  const [error, setError] = useState('');
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
    setError('');
    try {
      console.log('发送验证码请求开始，邮箱:', email);
      // 重置密码场景下，type为3
      const response = await authService.sendVerificationCode(email, 3);
      console.log('发送验证码响应:', response);
      
      if (response && response.success) {
        toast.success('验证码已发送，请注意查收');
        setStep(2); // 进入下一步
        setCountdown(60);
      } else {
        console.error('发送验证码失败，后端返回失败状态:', response);
        setError(response.message || '发送验证码失败');
      }
    } catch (err) {
      console.error('发送验证码请求异常:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('请求超时，请检查网络连接或稍后再试');
      } else if (!err.response) {
        setError('网络连接错误，请检查您的网络设置');
      } else {
        setError(err.response?.data?.message || '发送验证码失败，请确认邮箱是否已注册');
      }
    } finally {
      setIsSendingCode(false);
    }
  }, [email]);

  // 重置密码
  const handleResetPassword = useCallback(async (e) => {
    e.preventDefault();
    if (!password) {
      setError('请输入新密码');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    setError('');

    setSubmitting(true);
    try {
      console.log('重置密码请求开始，邮箱:', email);
      const response = await authService.resetPassword({ email, code, password });
      console.log('重置密码响应:', response);
      
      if (response && response.success) {
        toast.success('密码重置成功！即将跳转到登录页。');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        console.error('重置密码失败，后端返回失败状态:', response);
        setError(response.message || '密码重置失败');
      }
    } catch (err) {
      console.error('重置密码请求异常:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('请求超时，请检查网络连接或稍后再试');
      } else if (!err.response) {
        setError('网络连接错误，请检查您的网络设置');
      } else {
        setError(err.response?.data?.message || '密码重置失败，请检查验证码或稍后再试');
      }
    } finally {
      setSubmitting(false);
    }
  }, [email, code, password, confirmPassword, navigate]);
  
  return {
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
  };
}; 