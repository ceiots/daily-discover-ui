import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../utils/axios";
import { BasePage, Form } from "../../theme";
import { useTheme } from "../../theme";
import "../../styles/toast.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
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

  // 页面加载动画
  useEffect(() => {
    setAnimateCard(true);
  }, []);

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
          transition: "all 0.5s ease-out"
        }}>
          <Form.Container>
            <Form.Title>注册账号</Form.Title>
            
            <form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>请输入手机号码</Form.Label>
                <Form.Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="请输入手机号码"
                  $error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && <Form.ErrorMessage>{errors.phoneNumber}</Form.ErrorMessage>}
              </Form.Group>
              
              <Form.Group>
                <Form.Label>请输入验证码</Form.Label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Form.Input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="请输入验证码"
                    style={{ flex: 1 }}
                  />
                  <Form.CodeButton onClick={handleGetCode}>
                    获取验证码
                  </Form.CodeButton>
                </div>
              </Form.Group>
              
              <Form.Group>
                <Form.Label>请设置登录密码</Form.Label>
                <Form.InputGroup>
                  <Form.Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="请设置登录密码"
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
              
              <Form.CheckboxContainer>
                <Form.Checkbox
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                />
                <Form.CheckboxLabel htmlFor="agreeToTerms">
                  我已阅读并同意<Link to="/terms">《用户协议》</Link> 和<Link to="/privacy">《隐私政策》</Link>
                </Form.CheckboxLabel>
              </Form.CheckboxContainer>
              {errors.terms && <Form.ErrorMessage>{errors.terms}</Form.ErrorMessage>}
              
              <Form.SubmitButton type="submit" disabled={loading}>
                {loading && <Form.Loader />}
                注册
              </Form.SubmitButton>
            </form>
            
            <Form.BottomLink>
              已有账号?<Link to="/login">立即登录</Link>
            </Form.BottomLink>
            
            <Form.FooterText>
              Copyright © 2024 All Rights Reserved
            </Form.FooterText>
          </Form.Container>
        </Form.Frame>
        
        <div id="toast" className="toast-message"></div>
      </Form.PageContainer>
    </BasePage>
  );
};

export default RegisterPage;
