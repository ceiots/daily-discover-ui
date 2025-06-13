import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../utils/axios";
import { BasePage, Form } from "../../theme";
import { useTheme } from "../../theme";
import "../../styles/toast.css";
import PropTypes from "prop-types";

const RegisterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // 定义以 #d85916 为主色调的简洁配色方案
  const colors = {
    primary: "#5B47E8",      // 主色，用于按钮、高亮元素，保持不变
    primaryHover: "#4a39d1", // 主色悬停状态，新增，颜色稍深
    background: "#f8f9fa",   // 浅灰色背景，更柔和且现代
    white: "#FFFFFF",        // 白色，卡片/输入框背景，保持不变
    border: "#e7e7e7",       // 极浅灰色边框，增加柔和感
    textMain: "#2c2c2c",     // 深灰色主文字，与背景形成高对比度，更清晰
    textSub: "#6b6b6b",      // 中灰色次要文字，有层次感
    error: "#ff4d4f",        // 更鲜艳的红色错误提示，更醒目
    success: "#52c41a",      // 新增成功提示色，用于成功反馈
    info: "#1890ff"          // 新增信息提示色，用于信息反馈
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    nickname: "",
    email: "",
    deviceId: "web",
    deviceType: 5,
    deviceModel: "browser",
    osVersion: navigator.userAgent,
    appVersion: "1.0.0",
    code: "",
    codeType: 1
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 页面加载动画
  useEffect(() => {
    setAnimateCard(true);
  }, []);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.mobile) {
      newErrors.phoneNumber = "请输入手机号";
    } else if (!Form.validators.isValidPhoneNumber(formData.mobile)) {
      newErrors.phoneNumber = "请输入正确的手机号格式";
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (formData.password.length < 8) {
      newErrors.password = "密码长度至少为8个字符";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "密码必须包含至少一个数字";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "密码必须包含至少一个小写字母";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    if (!agreeToTerms) {
      newErrors.terms = "请阅读并同意用户协议和隐私政策";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await instance.post("/users/register", formData);
      if (response.data.code === 200) {
        showToast("注册成功");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(response.data.message || "注册失败");
      }
    } catch (error) {
      console.error("注册错误:", error);
      showToast(error.response?.data?.message || "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCode = () => {
    if (!formData.mobile) {
      setErrors({...errors, phoneNumber: "请先输入手机号"});
      return;
    }
    
    if (!Form.validators.isValidPhoneNumber(formData.mobile)) {
      setErrors({...errors, phoneNumber: "请输入正确的手机号格式"});
      return;
    }
    
    // 这里添加获取验证码逻辑
    showToast("验证码已发送");
    setCountdown(60);
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
    <BasePage padding={false} showHeader={false} style={{ backgroundColor: colors.background }}>
      <Form.PageContainer style={{ backgroundColor: colors.background }}>
        <Form.Frame style={{
          opacity: animateCard ? 1 : 0,
          transform: animateCard ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease-out",
          position: 'relative',
          backgroundColor: colors.white,
          boxShadow: '0 6px 16px rgba(108, 92, 231, 0.08)',
          borderRadius: '10px',
          overflow: 'hidden',
          maxWidth: '380px',
          margin: '0 auto'
        }}>
          {/* 顶部装饰 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: colors.primary,
            zIndex: 1
          }} />
          
          <Form.Container style={{ position: 'relative', zIndex: 3, padding: '24px 22px' }}>
            <Form.Title style={{
              color: colors.textMain,
              fontWeight: '600',
              fontSize: '20px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              注册账号
            </Form.Title>
            
            <form onSubmit={handleSubmit}>
              <Form.Group style={{ marginBottom: '14px' }}>
                <Form.Label style={{ 
                  color: colors.textMain, 
                  fontWeight: '500', 
                  fontSize: '13px',
                  marginBottom: '6px' 
                }}>
                  请输入手机号码
                </Form.Label>
                <Form.Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="请输入手机号码"
                  $error={!!errors.phoneNumber}
                  style={{
                    borderRadius: '6px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.white,
                    color: colors.textMain,
                    padding: '10px 14px',
                    fontSize: '13px',
                    height: '38px'
                  }}
                />
                {errors.phoneNumber && <Form.ErrorMessage style={{ fontSize: '12px' }}>{errors.phoneNumber}</Form.ErrorMessage>}
              </Form.Group>
              
              <Form.Group style={{ marginBottom: '14px' }}>
                <Form.Label style={{ 
                  color: colors.textMain, 
                  fontWeight: '500', 
                  fontSize: '13px',
                  marginBottom: '6px' 
                }}>
                  请输入验证码
                </Form.Label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Form.Input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="请输入验证码"
                    style={{ 
                      flex: 1,
                      borderRadius: '6px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.white,
                      color: colors.textMain,
                      padding: '10px 14px',
                      fontSize: '13px',
                      height: '38px'
                    }}
                  />
                  <Form.CodeButton 
                    onClick={handleGetCode} 
                    disabled={countdown > 0}
                    style={{
                      borderRadius: '6px',
                      backgroundColor: colors.primary,
                      color: colors.white,
                      border: 'none',
                      fontWeight: '500',
                      padding: '0 12px',
                      fontSize: '12px',
                      minWidth: '100px',
                      height: '38px'
                    }}
                  >
                    {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                  </Form.CodeButton>
                </div>
              </Form.Group>
              
              <Form.Group style={{ marginBottom: '14px' }}>
                <Form.Label style={{ 
                  color: colors.textMain, 
                  fontWeight: '500', 
                  fontSize: '13px',
                  marginBottom: '6px' 
                }}>
                  请设置登录密码
                </Form.Label>
                <Form.InputGroup>
                  <Form.Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="请设置登录密码"
                    $error={!!errors.password}
                    style={{
                      borderRadius: '6px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.white,
                      color: colors.textMain,
                      padding: '10px 14px',
                      fontSize: '13px',
                      height: '38px'
                    }}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    style={{ color: colors.primary }}
                  >
                    <Form.EyeIcon closed={!showPassword} />
                  </button>
                </Form.InputGroup>
                {errors.password && <Form.ErrorMessage style={{ fontSize: '12px' }}>{errors.password}</Form.ErrorMessage>}
                <div style={{ fontSize: "11px", color: colors.textSub, margin: "3px 0 0 2px" }}>
                  • 密码长度至少为8个字符，且包含数字和字母
                </div>
              </Form.Group>
              
              <Form.Group style={{ marginBottom: '14px' }}>
                <Form.Label style={{ 
                  color: colors.textMain, 
                  fontWeight: '500', 
                  fontSize: '13px',
                  marginBottom: '6px' 
                }}>
                  确认密码
                </Form.Label>
                <Form.InputGroup>
                  <Form.Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="请再次输入密码"
                    $error={!!errors.confirmPassword}
                    style={{
                      borderRadius: '6px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.white,
                      color: colors.textMain,
                      padding: '10px 14px',
                      fontSize: '13px',
                      height: '38px'
                    }}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "隐藏密码" : "显示密码"}
                    style={{ color: colors.primary }}
                  >
                    <Form.EyeIcon closed={!showConfirmPassword} />
                  </button>
                </Form.InputGroup>
                {errors.confirmPassword && <Form.ErrorMessage style={{ fontSize: '12px' }}>{errors.confirmPassword}</Form.ErrorMessage>}
              </Form.Group>
              
              <Form.CheckboxContainer style={{ marginTop: '12px' }}>
                <Form.Checkbox
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  style={{ accentColor: colors.primary }}
                />
                <Form.CheckboxLabel htmlFor="agreeToTerms" style={{ fontSize: '12px', color: colors.textSub }}>
                  我已阅读并同意<Link to="/terms" style={{ color: colors.primary, fontWeight: '500' }}>《用户协议》</Link> 和<Link to="/privacy" style={{ color: colors.primary, fontWeight: '500' }}>《隐私政策》</Link>
                </Form.CheckboxLabel>
              </Form.CheckboxContainer>
              {errors.terms && <Form.ErrorMessage style={{ fontSize: '12px' }}>{errors.terms}</Form.ErrorMessage>}
              
              <Form.SubmitButton 
                type="submit" 
                disabled={loading}
                style={{
                  marginTop: '20px',
                  backgroundColor: colors.primary,
                  borderRadius: '6px',
                  padding: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: colors.white,
                  border: 'none',
                  width: '100%',
                  boxShadow: 'none',
                  height: '40px'
                }}
              >
                {loading && <Form.Loader />}
                注册
              </Form.SubmitButton>
            </form>
            
            <Form.BottomLink style={{ 
              marginTop: '16px', 
              fontSize: '12px', 
              color: colors.textSub,
              textAlign: 'center' 
            }}>
              已有账号?<Link to="/login" style={{ color: colors.primary, fontWeight: '500', marginLeft: '4px' }}>立即登录</Link>
            </Form.BottomLink>
            
            <Form.FooterText style={{ 
              marginTop: '14px',
              fontSize: '11px',
              color: colors.textSub,
              textAlign: 'center',
              opacity: 0.8
            }}>
              Copyright © {Form.getCurrentYear()} All Rights Reserved
            </Form.FooterText>
          </Form.Container>
        </Form.Frame>
        
        <div id="toast" className="toast-message"></div>
      </Form.PageContainer>
    </BasePage>
  );
};

export default RegisterPage;
