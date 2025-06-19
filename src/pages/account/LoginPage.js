import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config'; // 假设你的微信AppId在一个配置文件中
import { 
  FormContainer, 
  FormFrame, 
  FormGroup, 
  FormInput, 
  FormSubmitButton, 
  FormErrorMessage 
} from '../../theme/components/Form';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin } from '@fortawesome/free-brands-svg-icons';

// 使用styled-components创建必要的样式组件
const PageTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMain};
  font-weight: 600;
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px;
    
    &:hover {
      text-decoration: underline;
    }
  }
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

const RegisterLink = styled.p`
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
      if (response && response.success) {
        toast.success('登录成功！');
        const { token, ...userInfo } = response.data.data; 

        if (token) {
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
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
      <FormFrame>
        <form onSubmit={handleSubmit}>
          <PageTitle>登录您的账户</PageTitle>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
          
          <FormGroup>
            <FormInput
              type="text"
              name="username"
              placeholder="用户名或邮箱"
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
          
          <FormOptions>
            <Link to="/forgot-password">忘记密码?</Link>
          </FormOptions>
          
          <FormSubmitButton 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? '登录中...' : '登录'}
          </FormSubmitButton>
          
          <Divider>
            <span>或</span>
          </Divider>

          <WeChatButton
            type="button"
            onClick={handleWeChatLogin}
          >
            使用微信登录
          </WeChatButton>

          <RegisterLink>
            还没有账户? <Link to="/register">立即注册</Link>
          </RegisterLink>
        </form>
      </FormFrame>
    </FormContainer>
  );
};

export default LoginPage;
