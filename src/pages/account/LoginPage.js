import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config'; // 假设你的微信AppId在一个配置文件中
import { 
  FormContainer, 
  FormWrapper, 
  FormTitle,
  FormInput, 
  SubmitButton, 
  ErrorMessage,
  SocialLogin,
  AlternateAuthAction,
  FormGroup
} from '../../theme';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
  };

  const handleWeChatLogin = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/wechat-callback`);
    const state = 'wechat_login_state'; // 用于防止CSRF攻击，应为随机字符串
    const wechatAuthUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    window.location.href = wechatAuthUrl;
  };

  return (
    <FormContainer>
      <Helmet>
        <title>登录 - 每日发现</title>
      </Helmet>
      <FormWrapper>
        <FormTitle>登录您的账户</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="用户名或邮箱"
            id="username"
            type="text"
            name="username"
            placeholder="请输入用户名或邮箱"
            value={formData.username}
            onChange={handleChange}
            required
            />
          
          <FormInput
            label="密码"
            id="password"
            type="password"
            name="password"
            placeholder="请输入密码"
            value={formData.password}
            onChange={handleChange}
            required
            />
          
           <FormGroup>
             <AlternateAuthAction text="" linkText="忘记密码?" to="/forgot-password" />
           </FormGroup>
          
          <SubmitButton 
            type="submit" 
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </SubmitButton>
          
          <SocialLogin />

          <AlternateAuthAction text="还没有账户?" linkText="立即注册" to="/register" />
        </form>
      </FormWrapper>
    </FormContainer>
  );
};

export default LoginPage;
