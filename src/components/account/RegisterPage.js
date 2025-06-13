import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../utils/axios";
import { BasePage } from "../../theme";
import TopBar from "../../theme/components/TopBar";
import styled from "styled-components";
import "./RegisterPage.css";
import {
  FormContainer,
  FormFrame,
  FormGroup,
  FormLabel,
  FormInput,
  FormSubmitButton,
  FormErrorMessage,
  FormInputGroup,
  FormCodeButton,
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel,
  FormBottomLink,
  FormFooterText,
  validators
} from "../../theme/components/Form";

// 定制样式组件
const RegisterContainer = styled.div`
  background-color: #f8f8fb;
  min-height: calc(100vh - 54px); // 54px是TopBar的高度
`;

const RegisterFormContainer = styled(FormContainer)`
  padding-top: 20px;
  background-color: transparent;
  min-height: auto;
`;

const PageTitle = styled.div`
  background-color: #5B47E8;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
`;

const Toast = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  
  &.show {
    opacity: 1;
    visibility: visible;
  }
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  
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
  const [countdown, setCountdown] = useState(0);

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
    } else if (!validators.isValidPhoneNumber(formData.mobile)) {
      newErrors.phoneNumber = "请输入正确的手机号格式";
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (!validators.isValidPassword(formData.password)) {
      newErrors.password = "密码长度至少为8个字符，且必须包含数字和字母";
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
    
    if (!validators.isValidPhoneNumber(formData.mobile)) {
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
    <BasePage padding={false} showHeader={false}>
      <PageTitle>注册账号</PageTitle>
      <RegisterContainer>
        <RegisterFormContainer>
          <FormFrame>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>请输入手机号码</FormLabel>
                <FormInput
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="请输入手机号码"
                  $error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>请输入验证码</FormLabel>
                <FormInputGroup>
                  <FormInput
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="请输入验证码"
                    className="input-focus-effect"
                  />
                  <FormCodeButton 
                    type="button"
                    onClick={handleGetCode} 
                    disabled={countdown > 0}
                    className={countdown > 0 ? "" : "code-button-active"}
                  >
                    {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                  </FormCodeButton>
                </FormInputGroup>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>请设置登录密码</FormLabel>
                <FormInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请设置登录密码"
                  $error={!!errors.password}
                  className="input-focus-effect"
                />
                {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>确认密码</FormLabel>
                <FormInput
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="请再次输入密码"
                  $error={!!errors.confirmPassword}
                  className="input-focus-effect"
                />
                {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>}
              </FormGroup>
              
              <FormCheckboxContainer>
                <FormCheckbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="custom-checkbox"
                />
                <FormCheckboxLabel htmlFor="agreeToTerms">
                  我已阅读并同意 <Link to="/terms">《用户协议》</Link> 和 <Link to="/privacy">《隐私政策》</Link>
                </FormCheckboxLabel>
              </FormCheckboxContainer>
              {errors.terms && <FormErrorMessage>{errors.terms}</FormErrorMessage>}
              
              <FormSubmitButton
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "注册中..." : "注册"}
              </FormSubmitButton>

              <FormBottomLink>
                已有账号？<Link to="/login">立即登录</Link>
              </FormBottomLink>
            </form>
          </FormFrame>
          
          <FormFooterText>
            Daily Discover &copy; {new Date().getFullYear()} All Rights Reserved
          </FormFooterText>
        </RegisterFormContainer>
      </RegisterContainer>
      
      <Toast id="toast" className="toast" />
    </BasePage>
  );
};

export default RegisterPage;
