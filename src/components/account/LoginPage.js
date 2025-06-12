import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';
import { BasePage, Form } from '../../theme';
import "../../styles/toast.css";

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
    } else if (!Form.validators.isValidPhoneNumber(formData.mobile)) {
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

  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  };

  return (
    <BasePage padding={false} showHeader={false}>
      <Form.PageContainer>
        <Form.Frame style={{
          opacity: animateCard ? 1 : 0,
          transform: animateCard ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.4s ease-out"
        }}>
          <Form.Container>
            <Form.BrandLogo size={65} />
            <Form.Title>登录账号</Form.Title>
            
            <form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>手机号</Form.Label>
                <Form.Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="请输入手机号"
                  $error={!!errors.mobile}
                />
                {errors.mobile && <Form.ErrorMessage>{errors.mobile}</Form.ErrorMessage>}
              </Form.Group>
              
              <Form.Group>
                <Form.Label>密码</Form.Label>
                <Form.InputGroup>
                  <Form.Input
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
                    <Form.EyeIcon closed={!showPassword} />
                  </button>
                </Form.InputGroup>
                {errors.password && <Form.ErrorMessage>{errors.password}</Form.ErrorMessage>}
              </Form.Group>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Form.CheckboxContainer style={{ margin: 0 }}>
                  <Form.Checkbox
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <Form.CheckboxLabel htmlFor="rememberMe" style={{ fontSize: '12px' }}>
                    记住我
                  </Form.CheckboxLabel>
                </Form.CheckboxContainer>
                
                <Link to="/forgot-password" style={{
                  fontSize: '12px',
                  color: '#5B47E8',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}>
                  忘记密码?
                </Link>
              </div>
              
              <Form.SubmitButton type="submit" disabled={loading}>
                {loading && <Form.Loader />}
                登录
              </Form.SubmitButton>
            </form>
            
            <Form.BottomLink>
              还没有账号?<Link to="/register">立即注册</Link>
            </Form.BottomLink>
            
            <Form.BrandText>
              畅享发现生活中的每一份惊喜
            </Form.BrandText>
            
            <Form.FooterText>
              Copyright © {Form.getCurrentYear()} All Rights Reserved
            </Form.FooterText>
          </Form.Container>
        </Form.Frame>
        
        <div id="toast" className="toast-message"></div>
      </Form.PageContainer>
    </BasePage>
  );
};

export default LoginPage;
