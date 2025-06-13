import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../utils/axios";
import { BasePage, Form } from "../../theme";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [animateCard, setAnimateCard] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile: "",
    newPassword: "",
    confirmPassword: "",
    code: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: 手机验证, 2: 设置新密码

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

  const handleGetVerificationCode = async () => {
    if (!formData.mobile) {
      setErrors({ ...errors, mobile: "请输入手机号" });
      return;
    }
    
    if (!Form.validators.isValidPhoneNumber(formData.mobile)) {
      setErrors({ ...errors, mobile: "请输入正确的手机号格式" });
      return;
    }
    
    try {
      const response = await instance.post("/users/password/reset", {
        mobile: formData.mobile
      });
      
      if (response.data.code === 200) {
        showToast("验证码已发送，请查收短信");
        setCountdown(60);
      } else {
        showToast(response.data.message || "获取验证码失败");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "获取验证码失败，请稍后重试");
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.mobile) {
      newErrors.mobile = "请输入手机号";
    } else if (!Form.validators.isValidPhoneNumber(formData.mobile)) {
      newErrors.mobile = "请输入正确的手机号格式";
    }
    
    if (!formData.code) {
      newErrors.code = "请输入验证码";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 模拟验证成功，进入下一步
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "请输入新密码";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "密码长度至少为8个字符";
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "密码必须包含至少一个数字";
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = "密码必须包含至少一个小写字母";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await instance.post("/users/password/reset", {
        mobile: formData.mobile,
        code: formData.code,
        password: formData.newPassword
      });
      
      if (response.data.code === 200) {
        showToast("密码重置成功，请使用新密码登录");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showToast(response.data.message || "重置密码失败");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "重置密码失败，请稍后重试");
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
            <Form.BrandLogo />
            <Form.Title>{step === 1 ? "找回密码" : "设置新密码"}</Form.Title>
            
            {step === 1 ? (
              <form onSubmit={handleVerifyCode}>
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
                  <Form.Label>验证码</Form.Label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Form.Input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="请输入验证码"
                      style={{ flex: 1 }}
                      $error={!!errors.code}
                    />
                    <Form.CodeButton 
                      onClick={handleGetVerificationCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                    </Form.CodeButton>
                  </div>
                  {errors.code && <Form.ErrorMessage>{errors.code}</Form.ErrorMessage>}
                </Form.Group>
                
                <Form.SubmitButton type="submit">
                  下一步
                </Form.SubmitButton>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <Form.Group>
                  <Form.Label>设置新密码</Form.Label>
                  <Form.InputGroup>
                    <Form.Input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="请设置新密码"
                      $error={!!errors.newPassword}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "隐藏密码" : "显示密码"}
                    >
                      <Form.EyeIcon closed={!showNewPassword} />
                    </button>
                  </Form.InputGroup>
                  {errors.newPassword && <Form.ErrorMessage>{errors.newPassword}</Form.ErrorMessage>}
                  <div style={{ fontSize: "11px", color: "#333", margin: "3px 0 0 2px" }}>
                    • 密码长度至少为8个字符，且包含数字和字母
                  </div>
                </Form.Group>
                
                <Form.Group>
                  <Form.Label>确认密码</Form.Label>
                  <Form.InputGroup>
                    <Form.Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="请再次输入密码"
                      $error={!!errors.confirmPassword}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "隐藏密码" : "显示密码"}
                    >
                      <Form.EyeIcon closed={!showConfirmPassword} />
                    </button>
                  </Form.InputGroup>
                  {errors.confirmPassword && <Form.ErrorMessage>{errors.confirmPassword}</Form.ErrorMessage>}
                </Form.Group>
                
                <Form.SubmitButton type="submit" disabled={loading}>
                  {loading && <Form.Loader />}
                  重置密码
                </Form.SubmitButton>
                
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#5B47E8",
                      fontSize: "12px",
                      cursor: "pointer",
                      textDecoration: "underline"
                    }}
                  >
                    返回上一步
                  </button>
                </div>
              </form>
            )}
            
            <Form.BottomLink>
              <Link to="/login">返回登录</Link>
            </Form.BottomLink>
            
            <Form.BrandText>
              安全保障，轻松找回
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

export default ForgotPasswordPage;