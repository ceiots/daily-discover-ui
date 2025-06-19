import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { wechatAppId } from '../../config';
import { SocialLogin, AlternateAuthAction } from '../../theme/components/Form/components';
import * as S from '../../theme/components/Form/styles';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

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

  return (
    <>
      <Helmet>
        <title>创建新账户 - 每日发现</title>
      </Helmet>
      <S.HeaderBar>
        <S.HeaderTitle>创建新账户</S.HeaderTitle>
      </S.HeaderBar>
      <S.FormContainer>
        <S.FormWrapper>
          <form onSubmit={handleSubmit} noValidate>
            {/* <S.FormTitle>创建新账户</S.FormTitle> */}
            
            {errors.form && <S.ErrorMessage style={{ textAlign: 'center', marginBottom: '16px' }}>{errors.form}</S.ErrorMessage>}

            <S.FormGroup>
              <S.Label htmlFor="username">用户名</S.Label>
              <S.Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="4-16位字母、数字或下划线" required />
              {errors.username && <S.ErrorMessage>{errors.username}</S.ErrorMessage>}
            </S.FormGroup>

            <S.FormGroup>
              <S.Label htmlFor="nickname">昵称</S.Label>
              <S.Input id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="给自己取个好听的名字吧" required />
              {errors.nickname && <S.ErrorMessage>{errors.nickname}</S.ErrorMessage>}
            </S.FormGroup>

            <S.FormGroup>
              <S.Label htmlFor="password">密码</S.Label>
              <S.Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="8-20位，包含大小写字母和数字" required />
              {errors.password && <S.ErrorMessage>{errors.password}</S.ErrorMessage>}
            </S.FormGroup>
            
            <S.FormGroup>
              <S.Label htmlFor="confirmPassword">确认密码</S.Label>
              <S.Input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="请再次输入密码" required />
              {errors.confirmPassword && <S.ErrorMessage>{errors.confirmPassword}</S.ErrorMessage>}
            </S.FormGroup>

            <S.FormGroup>
               <S.Label htmlFor="email">电子邮箱</S.Label>
               <S.VerificationCodeWrapper>
                  <S.Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="用于接收验证码" required />
                  <S.SendCodeButton type="button" onClick={handleSendCode} disabled={sendingCode || countdown > 0}>
                    {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </S.SendCodeButton>
               </S.VerificationCodeWrapper>
               {errors.email && <S.ErrorMessage>{errors.email}</S.ErrorMessage>}
            </S.FormGroup>

            <S.FormGroup>
              <S.Label htmlFor="code">验证码</S.Label>
              <S.Input id="code" name="code" value={formData.code} onChange={handleChange} placeholder="请输入邮箱验证码" required />
              {errors.code && <S.ErrorMessage>{errors.code}</S.ErrorMessage>}
            </S.FormGroup>
            
            <S.StyledFormButton type="submit" disabled={loading}>
              {loading ? '注册中...' : '立即注册'}
            </S.StyledFormButton>
            
            <S.Divider>或</S.Divider>

            {/* <SocialLogin onWeChatLogin={handleWeChatLogin}/> */}

            <AlternateAuthAction
              text="已有账户?"
              linkText="立即登录"
              to="/login"
            />
          </form>
        </S.FormWrapper>
      </S.FormContainer>
    </>
  );
};

export default RegisterPage;
