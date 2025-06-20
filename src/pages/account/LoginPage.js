import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config';
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
  SubmitButton,
  Divider,
  ErrorMessage,
  BottomLink,
  WeChatButton,
  ForgotPasswordLink
} from '../../theme/components/AuthLayoutComponents';
import { colors, typography, spacing, radius, shadows, transitions } from '../../theme/tokens';


// 主页面组件 - 使用React.memo优化整体性能
const LoginPage = React.memo(() => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 表单变更处理 - 使用useCallback优化
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // 表单提交 - 使用useCallback优化
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      if (response && response.data.success) {
        toast.success('登录成功！');
        const { token, ...userInfo } = response.data.data; 

        if (token) {
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          // 触发一个全局事件，通知其他组件（如App.js或NavBar）用户信息已更新
          const event = new CustomEvent('userLoggedIn', { detail: userInfo });
          window.dispatchEvent(event);
          navigate('/'); // 登录成功，跳转到首页
        } else {
           setError('登录失败，无效的响应');
        }
      } else {
        setError('登录失败，请检查您的用户名和密码');
      }
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查您的用户名和密码');
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  // 微信登录 - 使用useCallback优化
  const handleWeChatLogin = useCallback(() => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/wechat-callback`);
    const state = 'wechat_login_state'; // 用于防止CSRF攻击，应为随机字符串
    const wechatAuthUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    window.location.href = wechatAuthUrl;
  }, []);

  return (
    <>
      <Helmet>
        <title>登录 - Daily Discover</title>
        <meta name="description" content="登录Daily Discover，探索更多精彩内容。" />
      </Helmet>
      {/* <TopColorBar /> */}
      <PageWrapper key={location.pathname}>
        <MicroNavBar>
          <Logo>Daily <span>Discover</span></Logo>
          <NavLinks>
            <Link to="/daily" className={location.pathname === '/daily' ? 'active' : ''}>每日</Link>
            <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''}>发现</Link>
          </NavLinks>
        </MicroNavBar>
        
        <AuthCard>
          <FormTitle>登录您的账户</FormTitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit} noValidate>
            <InputGroup>
              <Label htmlFor="username"><i className="fas fa-user"></i>用户名或邮箱</Label>
              <Input 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="请输入用户名或邮箱" 
                required 
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="password"><i className="fas fa-lock"></i>密码</Label>
              <Input 
                id="password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="请输入密码" 
                required 
              />
            </InputGroup>
            
            <ForgotPasswordLink>
              <Link to="/forgot-password">忘记密码?</Link>
            </ForgotPasswordLink>
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </SubmitButton>
            
            <Divider><span>或</span></Divider>
            
            <WeChatButton type="button" onClick={handleWeChatLogin}>
              使用微信登录
            </WeChatButton>
            
            <BottomLink>
              还没有账户？<Link to="/register">立即注册</Link>
            </BottomLink>
          </Form>
        </AuthCard>
      </PageWrapper>
    </>
  );
});

// 添加 displayName 用于性能监控
LoginPage.displayName = 'LoginPage';

export default LoginPage;
