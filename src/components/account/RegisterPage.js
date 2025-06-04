import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";
import "./RegisterPage.css"; // 引入样式文件
import NavBar from "../../theme/components/NavBar"; // 引入NavBar组件
import { BasePage, Button } from "../../theme";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "请输入手机号";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
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

    try {
      const response = await instance.post("/user/register", formData);
      if (response.data === "注册成功") {
        showToast("注册成功");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(response.data);
      }
    } catch (error) {
      showToast("注册失败，请稍后重试");
    }
  };

  const handleLogin = () => {
    navigate("/login");
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

  const passwordRules = ["密码长度至少为8个字符, 包含数字和字母"];

  return (
    <BasePage showHeader className="auth-page">
      <div className="form-section">
        <h1 className="form-title">注册</h1>
        <p className="form-subtitle">每日发现</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="relative mb-3">
            <input
              type="tel"
              className="theme-input pr-10"
              placeholder="请输入手机号码"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
            <div className="input-icon right">
              <i className="ri-smartphone-line text-sm"></i>
            </div>
            {errors.phoneNumber && (
              <p className="error-message">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="theme-input pr-10"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="input-icon-btn right"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <i className={`ri-${showPassword ? "eye-off" : "eye"}-line text-sm`} />
            </button>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
            {passwordRules.map((rule, index) => (
              <p key={index} className="rule-text">- {rule}</p>
            ))}
          </div>

          <div className="relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="theme-input pr-10"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              className="input-icon-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              <i className={`ri-${showConfirmPassword ? "eye-off" : "eye"}-line text-sm`} />
            </button>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center mt-2 mb-2">
            <input
              type="checkbox"
              id="agreement"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className={`w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary ${
                errors.terms ? "border-red-500" : ""
              }`}
            />
            <label htmlFor="agreement" className="ml-1.5 agreement-text">
              注册即表示同意
              <a href="#" className="theme-link">用户协议</a>
              和
              <a href="#" className="theme-link">隐私政策</a>
            </label>
          </div>
          {errors.terms && (
            <p className="error-message">{errors.terms}</p>
          )}
          <Button variant="primary" block type="submit">立即注册</Button>
        </form>
        <div className="text-center mt-4">
          <span className="login-text text-gray-600">已有账号？</span>
          <a href="#" className="theme-link ml-1" onClick={handleLogin}>立即登录</a>
        </div>
      </div>
    </BasePage>
  );
};

export default RegisterPage;