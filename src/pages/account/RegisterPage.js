import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config';
import { SocialLogin } from '../../theme/components/Form/components';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

// 颜色定义 - 中国传统色彩搭配
const PRIMARY_COLOR = '#5B47E8'; // 主色：靛青色
const SECONDARY_COLOR = '#E8614F'; // 辅助色：中国红
const TEXT_COLOR = '#2D3748'; // 文字主色
const BG_COLOR = '#F8FAFC'; // 背景色：浅灰色

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
  padding: 56px 16px 20px;
  position: relative;
  overflow-x: hidden;
`;

// 超简化的顶部导航 - 减少渲染复杂度
const MicroNavBar = styled.div`
  position: fixed;
  top: 0px; /* 位于顶部色条下方 */
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
  font-size: 1.2rem;
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
  gap: 18px;
  
  a {
    color: ${TEXT_COLOR};
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s, background-color 0.2s;
    padding: 6px 12px;
    border-radius: 8px;
    
    &:hover {
      color: ${PRIMARY_COLOR};
    }

    &.active {
      background-color: rgba(91, 71, 232, 0.1);
      color: ${PRIMARY_COLOR};
      font-weight: 600;
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
  font-size: 2rem;
  font-weight: 700;
  color: ${TEXT_COLOR};
  margin-bottom: 24px;
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
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${TEXT_COLOR};
  
  i {
    margin-right: 8px;
    color: ${PRIMARY_COLOR};
    font-size: 1.1rem;
  }
`;

// 输入框 - 无边框设计，更紧凑
const Input = styled.input`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 1rem;
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
    font-size: 0.9rem;
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
  height: 48px;
  padding: 0 16px;
  background: rgba(91, 71, 232, 0.08);
  color: ${PRIMARY_COLOR};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
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
  height: 48px;
  background: ${PRIMARY_COLOR};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
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
  margin: 24px 0;
  color: #A0AEC0;
  font-size: 0.9rem;
  
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
  font-size: 0.85rem;
  margin-top: 4px;
  padding-left: 4px;
`;

// 进度条 - 更紧凑
const ProgressBar = styled.div`
  height: 3px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  background: linear-gradient(to right, ${PRIMARY_COLOR}, #4A3CD9);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

// 底部链接 - 更紧凑
const BottomLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
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
