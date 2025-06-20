import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config'; // 假设你的微信AppId在一个配置文件中
import toast from 'react-hot-toast';
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

// 分隔线 - 更紧凑
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #A0AEC0;
  font-size: 0.8rem;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.07);
  }
  
  span {
    padding: 0 12px;
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
  
  button {
    color: ${PRIMARY_COLOR};
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 忘记密码链接
const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-bottom: 16px;
  font-size: 0.8rem;
  
  a {
    color: ${PRIMARY_COLOR};
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 微信登录按钮 - 更紧凑
const WeChatButton = styled.button`
  width: 100%;
  height: 44px;
  background: #07C160;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #06AD56;
    box-shadow: 0 3px 8px rgba(7, 193, 96, 0.15);
  }
  
  &::before {
    content: '\f1d7';
    font-family: 'Font Awesome 5 Brands';
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

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
      <TopColorBar />
      <PageWrapper key={location.pathname}>
        <MicroNavBar>
          <Logo>Daily <span>Discover</span></Logo>
          <NavLinks>
            <Link to="/daily">每日</Link>
            <Link to="/discover">发现</Link>
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
