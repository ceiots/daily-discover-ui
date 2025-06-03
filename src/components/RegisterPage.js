import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import "./RegisterPage.css"; // 引入样式文件
import NavBar from "../theme/components/NavBar"; // 引入NavBar组件

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
    <div className="register-container bg-white mx-auto relative">
      <div className="register-header relative w-full overflow-hidden">
        <img
          src="https://public.readdy.ai/ai/img_res/7be0c9e399e64a75088d1913e4b14927.jpg"
          className="w-full h-full object-cover"
          alt="banner"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="register-header-title mb-0.5">每日发现</h1>
          <p className="register-header-subtitle opacity-90">发现生活中的美好时刻</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-16">
        <div className="space-y-2.5">
          <div className="relative">
            <input
              type="tel"
              maxLength="11"
              pattern="\d{11}"
              className="register-input w-full"
              placeholder="请输入手机号码"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
              <i className="ri-smartphone-line text-sm"></i>
            </div>
            {errors.phoneNumber && (
              <p className="error-message">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="register-input w-full"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"} text-sm`}></i>
            </button>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
            {passwordRules.map((rule, index) => (
              <p key={index} className="rule-text">
                - {rule}
              </p>
            ))}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="register-input w-full"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`${showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"} text-sm`}></i>
            </button>
            {errors.confirmPassword && (
              <p className="error-message">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            className="register-button w-full bg-primary text-white mt-4"
            onClick={handleSubmit}
          >
            立即注册
          </button>
          
          <div className="flex items-center mt-2">
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
              <a href="#" className="text-primary">
                用户协议
              </a>
              和
              <a href="#" className="text-primary">
                隐私政策
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="error-message">{errors.terms}</p>
          )}
          
          <div className="text-center mt-2">
            <span className="login-text text-gray-600">已有账号？</span>
            <a href="#" className="login-text text-primary ml-1" onClick={handleLogin}>
              立即登录
            </a>
          </div>
        </div>
      </div>

      {/* 使用统一的NavBar组件 */}
      <NavBar />

      <div
        id="toast"
        className="toast fixed top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white"
      ></div>
    </div>
  );
};

export default RegisterPage;