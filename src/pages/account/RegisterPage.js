import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
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
  ErrorMessage,
  ProgressBar,
  ProgressIndicator,
  BottomLink,
} from '../../theme/components/AuthLayoutComponents';
import { useRegisterPage } from './useRegisterPage'; // 引入新的Hook

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
}) => {
  return (
    <Form onSubmit={handleSubmit} noValidate>
      {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
      
      <InputGroup>
        <Label htmlFor="username"><i className="fas fa-user"></i>用户名</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="4-16位字母、数字或下划线"
          required
          aria-invalid={!!errors.username}
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
          aria-invalid={!!errors.nickname}
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
          aria-invalid={!!errors.password}
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
          aria-invalid={!!errors.confirmPassword}
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
            aria-invalid={!!errors.email}
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
          aria-invalid={!!errors.code}
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
  const location = useLocation();
  const {
    formData,
    errors,
    loading,
    sendingCode,
    countdown,
    handleChange,
    handleSendCode,
    handleSubmit,
  } = useRegisterPage();

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
          />
        </AuthCard>
      </PageWrapper>
    </>
  );
});

// 添加 displayName 用于性能监控
RegisterPage.displayName = 'RegisterPage';

export default RegisterPage;
