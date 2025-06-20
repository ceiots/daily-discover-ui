import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config';
import { SocialLogin } from '../../theme/components/Form/components';
import toast from 'react-hot-toast';
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
  Divider,
  ErrorMessage,
  ProgressBar,
  ProgressIndicator,
  BottomLink,
  WeChatButton
} from '../../theme/components/AuthLayoutComponents';
import { colors, typography, spacing, radius, shadows, transitions } from '../../theme/tokens';

// 使用 React.memo 优化表单组件
const RegisterForm = ({ 
  formData, 
  errors, 
  loading, 
  sendingCode, 
  countdown, 
  formProgress,
  handleChange, 
  handleSendCode, 
  handleSubmit,
  handleWeChatLogin
}) => {
  return (
    <Form onSubmit={handleSubmit} noValidate>
      {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
      
      <ProgressBar>
        <ProgressIndicator $progress={(formProgress / 5) * 100} />
      </ProgressBar>

      <InputGroup>
        <Label htmlFor="username"><i className="fas fa-user"></i>用户名</Label>
        <Input 
          id="username" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          placeholder="4-16位字母、数字或下划线" 
          required 
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="nickname"><i className="fas fa-smile"></i>昵称</Label>
        <Input 
          id="nickname" 
          name="nickname" 
          value={formData.nickname} 
          onChange={handleChange} 
          placeholder="给自己取个好听的名字吧" 
          required 
        />
        {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="password"><i className="fas fa-lock"></i>密码</Label>
        <Input 
          id="password" 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="8-20位，包含大小写字母和数字" 
          required 
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </InputGroup>
      
      <InputGroup>
        <Label htmlFor="confirmPassword"><i className="fas fa-check-double"></i>确认密码</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          placeholder="请再次输入密码" 
          required 
        />
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="email"><i className="fas fa-envelope"></i>电子邮箱</Label>
        <VerificationGroup>
          <Input 
            id="email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="用于接收验证码" 
            required 
          />
          <CodeButton 
            type="button" 
            onClick={handleSendCode} 
            disabled={sendingCode || countdown > 0}
          >
            {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '发送验证码'}
          </CodeButton>
        </VerificationGroup>
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="code"><i className="fas fa-key"></i>验证码</Label>
        <Input 
          id="code" 
          name="code" 
          value={formData.code} 
          onChange={handleChange} 
          placeholder="请输入邮箱验证码" 
          required 
        />
        {errors.code && <ErrorMessage>{errors.code}</ErrorMessage>}
      </InputGroup>
      
      <SubmitButton type="submit" disabled={loading}>
        {loading ? '注册中...' : '立即注册'}
      </SubmitButton>
      
      <BottomLink>
        已有账户？<Link to="/login">立即登录</Link>
      </BottomLink>
    </Form>
  );
};

// 添加 displayName
RegisterForm.displayName = 'RegisterForm';

// 主页面组件 - 使用React.memo优化整体性能
const RegisterPage = React.memo(() => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // 倒计时效果 - 使用useEffect优化
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 表单变更处理 - 使用useCallback优化
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  // 表单验证 - 使用useCallback优化
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.username) newErrors.username = '请输入用户名';
    if (!formData.password) newErrors.password = '请输入密码';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '两次输入的密码不一致';
    if (!formData.email) newErrors.email = '请输入电子邮箱';
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) newErrors.email = '邮箱格式不正确';
    if (!formData.code) newErrors.code = '请输入验证码';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 发送验证码 - 使用useCallback优化
  const handleSendCode = useCallback(async () => {
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '发送前请输入有效的邮箱地址' }));
      return;
    }
    setSendingCode(true);
    try {
      await authService.sendVerificationCode(formData.email, 2); // 2 for register
      toast.success('验证码已发送，请查收！');
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  }, [formData.email]);

  // 表单提交 - 使用useCallback优化
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.register(formData);
      toast.success('注册成功！即将跳转到登录页...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || '注册失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, navigate]);

  // 微信登录 - 使用useCallback优化
  const handleWeChatLogin = useCallback(() => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/wechat`);
    window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
  }, []);

  // 表单进度计算 - 使用useMemo优化
  const formProgress = useMemo(() => {
    let count = 0;
    if (formData.username) count++;
    if (formData.nickname) count++;
    if (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword) count++;
    if (formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) count++;
    if (formData.code) count++;
    return count;
  }, [formData]);

  return (
    <>
      <Helmet>
        <title>创建新账户 - Daily Discover</title>
        <meta name="description" content="加入Daily Discover，开始您的新旅程。" />
      </Helmet>
      <PageWrapper key={location.pathname}>
        <MicroNavBar>
          <Logo>Daily <span>Discover</span></Logo>
          <NavLinks>
            <Link to="/daily" className={location.pathname === '/daily' ? 'active' : ''}>每日</Link>
            <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''}>发现</Link>
          </NavLinks>
        </MicroNavBar>
        
        <AuthCard>
          <FormTitle>创建新账户</FormTitle>
          <RegisterForm
            formData={formData}
            errors={errors}
            loading={loading}
            sendingCode={sendingCode}
            countdown={countdown}
            formProgress={formProgress}
            handleChange={handleChange}
            handleSendCode={handleSendCode}
            handleSubmit={handleSubmit}
            handleWeChatLogin={handleWeChatLogin}
          />
        </AuthCard>
      </PageWrapper>
    </>
  );
});

// 添加 displayName 用于性能监控
RegisterPage.displayName = 'RegisterPage';

export default RegisterPage;
