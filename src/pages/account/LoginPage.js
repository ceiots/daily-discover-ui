import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../theme/components/AuthLayout';
import {
  Form,
  InputGroup,
  Label,
  Input,
  SubmitButton,
  Divider,
  ErrorMessage,
  BottomLink,
  ForgotPasswordLink
} from '../../theme/components/AuthLayoutComponents';
import { useLoginPage } from './useLoginPage'; // 引入Hook

// 主页面组件 - 使用React.memo优化整体性能
const LoginPage = React.memo(() => {
  const { 
    formData, 
    error, 
    loading, 
    handleChange, 
    handleSubmit 
  } = useLoginPage();

  return (
    <AuthLayout
      title="登录"
      description="登录Daily Discover，探索更多精彩内容。"
      formTitle="登录您的账户"
    >
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
            
            {/* 微信登录按钮暂时注释，因为缺少 handleWeChatLogin 逻辑 */}
            {/* <WeChatButton type="button" onClick={handleWeChatLogin}>
              使用微信登录
            </WeChatButton> */}
            
            <BottomLink>
              还没有账户？<Link to="/register">立即注册</Link>
            </BottomLink>
          </Form>
    </AuthLayout>
  );
});

// 添加 displayName 用于性能监控
LoginPage.displayName = 'LoginPage';

export default LoginPage;
