import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../../services/http/instance';
import { BasePage } from '../../theme';
import styled from 'styled-components';
import { UI_COLORS, UI_SIZES } from '../../theme/styles/uiConstants';
import validators from '../../utils/validators';
import {
  FormContainer,
  FormFrame,
  FormGroup,
  FormLabel,
  FormInput,
  FormSubmitButton,
  FormErrorMessage,
  FormInputGroup,
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel,
  FormBottomLink,
  FormFooterText,
  FormTitle,
  FormBrandLogo,
  FormEyeIcon,
  SimpleToast,
  showToast
} from '../../theme/components';

const LoginPage = () => {
  const { refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  const [animateCard, setAnimateCard] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // 页面加载动画
  useEffect(() => {
    setAnimateCard(true);
    
    // 检查本地存储的登录信息
    const savedPhone = localStorage.getItem('rememberedPhone');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedPhone && savedPassword) {
      setFormData({
        mobile: savedPhone,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};

    if (!formData.mobile) {
      newErrors.mobile = "请输入手机号";
    } else if (!validators.isValidPhoneNumber(formData.mobile)) {
      newErrors.mobile = "请输入正确的手机号格式";
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const user = {
        username: formData.mobile,
        password: formData.password,
        deviceId: "web",
        deviceType: 5,
        deviceModel: "browser",
        osVersion: navigator.userAgent,
        appVersion: "1.0.0"
      };
      
      const response = await instance.post('/users/login', user);

      if (response.data.code === 200 && response.data.message === '登录成功') {
        // 记住登录信息
        if (rememberMe) {
          localStorage.setItem('rememberedPhone', formData.mobile);
          localStorage.setItem('rememberedPassword', formData.password);
        } else {
          localStorage.removeItem('rememberedPhone');
          localStorage.removeItem('rememberedPassword');
        }
        
        // 清除旧数据
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userInfo');
        
        // 保存新数据
        const userId = response.data.userInfo.id;
        const token = response.data.token;
        
        if (!userId || !token) {
          throw new Error('服务器返回的用户ID或令牌无效');
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
        
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 触发登录状态变更事件
        const loginEvent = new Event('loginStateChanged');
        window.dispatchEvent(loginEvent);
        
        try {
          await refreshUserInfo();
        } catch (refreshError) {
          console.error('刷新用户信息失败:', refreshError);
        }
        
        // 检查重定向URL
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectUrl');
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      } else {
        showToast(response.data.message || '登录失败，请检查账号密码');
      }
    } catch (error) {
      console.error('登录时出错:', error);
      showToast(error.response?.data?.message || '登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage padding={false} showHeader={false}>
      <LoginContainer>
        <FormFrame style={{
          opacity: animateCard ? 1 : 0,
          transform: animateCard ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.4s ease-out"
        }}>
          <LoginFormContainer>
            <FormBrandLogo size={65} />
            <FormTitle>登录账号</FormTitle>
            
            <form onSubmit={handleSubmit}>
              <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>手机号</FormLabel>
                <FormInput style={{ fontSize: UI_SIZES.FONT_MEDIUM, padding: UI_SIZES.INPUT_SPACING }}
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="请输入手机号"
                  $error={!!errors.mobile}
                />
                {errors.mobile && <FormErrorMessage style={{ color: UI_COLORS.ERROR }}>{errors.mobile}</FormErrorMessage>}
              </FormGroup>
              
              <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>密码</FormLabel>
                <FormInputGroup style={{ display: 'flex', gap: '10px' }}>
                  <FormInput style={{ fontSize: UI_SIZES.FONT_MEDIUM, padding: UI_SIZES.INPUT_SPACING }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="请输入密码"
                    $error={!!errors.password}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    <FormEyeIcon closed={!showPassword} />
                  </button>
                </FormInputGroup>
                {errors.password && <FormErrorMessage style={{ color: UI_COLORS.ERROR }}>{errors.password}</FormErrorMessage>}
              </FormGroup>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <FormCheckboxContainer style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                  <FormCheckbox
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <FormCheckboxLabel htmlFor="rememberMe" style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>
                    记住我
                  </FormCheckboxLabel>
                </FormCheckboxContainer>
                
                <Link to="/forgot-password" style={{
                  fontSize: UI_SIZES.FONT_SMALL,
                  color: UI_COLORS.PRIMARY,
                  textDecoration: 'none',
                  fontWeight: '500',
                }}>
                  忘记密码?
                </Link>
              </div>
              
              <FormSubmitButton type="submit" disabled={loading} style={{ backgroundColor: UI_COLORS.PRIMARY, padding: UI_SIZES.BUTTON_PADDING }}>
                {loading ? '登录中...' : '登录'}
              </FormSubmitButton>
            </form>
            
            <FormBottomLink style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>
              还没有账号?<Link to="/register">立即注册</Link>
            </FormBottomLink>
            
            <FormFooterText style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_TINY }}>
              Copyright © {new Date().getFullYear()} All Rights Reserved
            </FormFooterText>
          </LoginFormContainer>
        </FormFrame>
      </LoginContainer>
    </BasePage>
  );
};

export default LoginPage;

const LoginContainer = styled(FormContainer)``;
const LoginFormContainer = styled.div``;
