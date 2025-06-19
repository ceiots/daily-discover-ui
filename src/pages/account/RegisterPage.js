import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config'; // 假设你的微信AppId在一个配置文件中
import { 
  FormContainer, 
  FormFrame, 
  FormGroup, 
  FormInput, 
  FormInputGroup, 
  FormCodeButton, 
  FormSubmitButton, 
  FormErrorMessage 
} from '../../theme/components/Form';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

// 使用styled-components创建必要的样式组件
const PageTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMain};
  font-weight: 600;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  span {
    padding: 0 10px;
    color: ${({ theme }) => theme.colors.textSub};
    font-size: 12px;
  }
`;

const WeChatButton = styled(FormSubmitButton)`
  background-color: #07C160;
  
  &:hover:not(:disabled) {
    background-color: #06AD56;
  }
`;

const LoginLink = styled.p`
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
    nickname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 处理倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('请输入邮箱');
      return;
    }
    setError('');
    try {
      setSendingCode(true);
      const response = await authService.sendVerificationCode(formData.email, 2); // 2 for register
      if (response && response.success) {
        toast.success('验证码已发送，请查收！');
        setCountdown(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || '发送验证码失败，请稍后再试');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 表单验证
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      if (response && response.success) {
        toast.success('注册成功！即将跳转到登录页...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || '注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleWeChatLogin = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/wechat-callback`);
    const state = 'wechat_register_state'; // 用于防止CSRF攻击，应为随机字符串
    const wechatAuthUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    window.location.href = wechatAuthUrl;
  };

  return (
    <FormContainer>
      <FormFrame>
        <form onSubmit={handleSubmit}>
          <PageTitle>创建新账户</PageTitle>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
          
          <FormGroup>
            <FormInput
              type="text"
              name="username"
              placeholder="用户名"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormInput
              type="password"
              name="password"
              placeholder="密码"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormInput
              type="password"
              name="confirmPassword"
              placeholder="确认密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormInput
              type="text"
              name="nickname"
              placeholder="昵称"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormInput
              type="email"
              name="email"
              placeholder="电子邮箱"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormInputGroup>
            <FormInput
              type="text"
              name="code"
              placeholder="验证码"
              value={formData.code}
              onChange={handleChange}
              required
            />
            <FormCodeButton 
              type="button" 
              onClick={handleSendCode}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
            </FormCodeButton>
          </FormInputGroup>
          
          <FormSubmitButton 
            type="submit" 
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </FormSubmitButton>
          
          <Divider>
            <span>或</span>
          </Divider>

          <WeChatButton
            type="button"
            onClick={handleWeChatLogin}
          >
            使用微信注册
          </WeChatButton>

          <LoginLink>
            已有账户? <Link to="/login">立即登录</Link>
          </LoginLink>
        </form>
      </FormFrame>
    </FormContainer>
  );
};

export default RegisterPage;
