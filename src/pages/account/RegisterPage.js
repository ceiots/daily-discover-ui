import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config';
import { SocialLogin, AlternateAuthAction } from '../../theme/components/Form/components';
import * as S from '../../theme/components/Form/styles';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

// 增强UI样式的组件
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 20px 8px 100px 8px;
`;

const TopColorBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #4f46e5;
  z-index: 100;
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const RegisterHeader = styled.div`
  padding: 20px 16px;
  background-color: #4f46e5;
  color: white;
  text-align: center;
`;

const RegisterTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
`;

const RegisterDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 8px;
  margin-bottom: 0;
`;

const StepsIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const Step = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 4px;
  background: white;
  opacity: ${props => props.$active ? 1 : 0.5};
  transition: all 0.3s ease;
`;

const RegisterForm = styled.form`
  padding: 8px 8px 16px 8px;
`;

const InputGroup = styled(S.FormGroup)`
  margin-bottom: 10px;
  &:last-of-type {
    margin-bottom: 18px;
  }
`;

const StyledLabel = styled(S.Label)`
  font-size: 0.92rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  line-height: 1.2;
  i {
    margin-right: 6px;
    color: #4f46e5;
    font-size: 1rem;
  }
`;

const StyledInput = styled(S.Input)`
  height: 38px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 0 10px;
  font-size: 1rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79,70,229,0.08);
  }
  &::placeholder {
    color: #bdbdbd;
    font-size: 0.98rem;
  }
`;

const VerificationCodeWrapper = styled(S.VerificationCodeWrapper)`
  position: relative;
`;

const SendCodeButton = styled(S.SendCodeButton)`
  height: 38px;
  border-radius: 0 8px 8px 0;
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
  min-width: 90px;
  font-size: 0.98rem;
  box-shadow: 0 1px 4px rgba(79,70,229,0.08);
  &:hover:not(:disabled) {
    background-color: #4338ca;
  }
  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
  }
`;

const RegisterButton = styled(S.StyledFormButton)`
  height: 54px;
  border-radius: 12px;
  font-size: 1.08rem;
  font-weight: 700;
  background-color: #4f46e5;
  color: #fff;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(79,70,229,0.10);
  letter-spacing: 0.01em;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  &:hover:not(:disabled) {
    background-color: #4338ca;
    box-shadow: 0 4px 16px rgba(79,70,229,0.13);
    transform: translateY(-1px) scale(1.01);
  }
  &:active:not(:disabled) {
    transform: translateY(1px) scale(0.99);
  }
  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
  }
`;

const RegisterDivider = styled(S.Divider)`
  margin: 20px 0;
  font-size: 0.875rem;
  color: #6b7280;
  
  &:before, &:after {
    background: #e5e7eb;
  }
`;

const SecurityNote = styled.div`
  margin-top: 20px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #4b5563;
  display: flex;
  align-items: flex-start;
  
  i {
    margin-right: 8px;
    color: #4f46e5;
    font-size: 1rem;
    margin-top: 2px;
  }
`;

const StyledErrorMessage = styled(S.ErrorMessage)`
  font-size: 0.92rem;
  margin-top: 2px;
  color: #ef4444;
  line-height: 1.2;
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = '请输入用户名';
    if (!formData.password) newErrors.password = '请输入密码';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '两次输入的密码不一致';
    if (!formData.email) newErrors.email = '请输入电子邮箱';
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) newErrors.email = '邮箱格式不正确';
    if (!formData.code) newErrors.code = '请输入验证码';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setErrors({ ...errors, email: '发送前请输入有效的邮箱地址' });
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
  };

  const handleSubmit = async (e) => {
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
  };
  
  const handleWeChatLogin = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/wechat-callback`);
    const state = 'wechat_register_state';
    const wechatAuthUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    window.location.href = wechatAuthUrl;
  };

  // 表单填写进度指示器
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
        <title>创建新账户 - 每日发现</title>
      </Helmet>
      
      <TopColorBar />
      <RegisterContainer>
        <RegisterCard>
          <RegisterHeader>
            <RegisterTitle>创建新账户</RegisterTitle>
            <RegisterDescription>加入我们的社区，开启每日发现之旅</RegisterDescription>
            
            <StepsIndicator>
              <Step $active={true} />
              <Step $active={formProgress >= 2} />
              <Step $active={formProgress >= 3} />
              <Step $active={formProgress >= 4} />
              <Step $active={formProgress >= 5} />
            </StepsIndicator>
          </RegisterHeader>
          
          <RegisterForm onSubmit={handleSubmit} noValidate>
            {errors.form && <StyledErrorMessage>{errors.form}</StyledErrorMessage>}

            <InputGroup>
              <StyledLabel htmlFor="username"><i className="fas fa-user"></i>用户名</StyledLabel>
              <StyledInput 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="4-16位字母、数字或下划线" 
                required 
              />
              {errors.username && <StyledErrorMessage>{errors.username}</StyledErrorMessage>}
            </InputGroup>

            <InputGroup>
              <StyledLabel htmlFor="nickname"><i className="fas fa-smile"></i>昵称</StyledLabel>
              <StyledInput 
                id="nickname" 
                name="nickname" 
                value={formData.nickname} 
                onChange={handleChange} 
                placeholder="给自己取个好听的名字吧" 
                required 
              />
              {errors.nickname && <StyledErrorMessage>{errors.nickname}</StyledErrorMessage>}
            </InputGroup>

            <InputGroup>
              <StyledLabel htmlFor="password"><i className="fas fa-lock"></i>密码</StyledLabel>
              <StyledInput 
                id="password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="8-20位，包含大小写字母和数字" 
                required 
              />
              {errors.password && <StyledErrorMessage>{errors.password}</StyledErrorMessage>}
            </InputGroup>
            
            <InputGroup>
              <StyledLabel htmlFor="confirmPassword"><i className="fas fa-check-double"></i>确认密码</StyledLabel>
              <StyledInput 
                id="confirmPassword" 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="请再次输入密码" 
                required 
              />
              {errors.confirmPassword && <StyledErrorMessage>{errors.confirmPassword}</StyledErrorMessage>}
            </InputGroup>

            <InputGroup>
              <StyledLabel htmlFor="email"><i className="fas fa-envelope"></i>电子邮箱</StyledLabel>
              <VerificationCodeWrapper>
                <StyledInput 
                  id="email" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="用于接收验证码" 
                  required 
                />
                <SendCodeButton 
                  type="button" 
                  onClick={handleSendCode} 
                  disabled={sendingCode || countdown > 0}
                >
                  {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '发送验证码'}
                </SendCodeButton>
              </VerificationCodeWrapper>
              {errors.email && <StyledErrorMessage>{errors.email}</StyledErrorMessage>}
            </InputGroup>

            <InputGroup>
              <StyledLabel htmlFor="code"><i className="fas fa-key"></i>验证码</StyledLabel>
              <StyledInput 
                id="code" 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                placeholder="请输入邮箱验证码" 
                required 
              />
              {errors.code && <StyledErrorMessage>{errors.code}</StyledErrorMessage>}
            </InputGroup>
            
            <RegisterButton type="submit" disabled={loading}>
              {loading ? '注册中...' : '立即注册'}
            </RegisterButton>
            
            <SecurityNote>
              <i className="fas fa-shield-alt"></i>
              <div>
                我们重视您的隐私和数据安全。注册即表示您同意我们的服务条款和隐私政策。
              </div>
            </SecurityNote>
            
            <RegisterDivider>或</RegisterDivider>

            {/* <SocialLogin onWeChatLogin={handleWeChatLogin}/> */}

            <AlternateAuthAction
              text="已有账户?"
              linkText="立即登录"
              to="/login"
            />
          </RegisterForm>
        </RegisterCard>
      </RegisterContainer>
    </>
  );
};

export default RegisterPage;
