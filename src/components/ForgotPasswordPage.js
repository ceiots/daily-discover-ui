import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import "./ForgotPasswordPage.css"; // 引入样式文件

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const passwordRules = ["密码长度至少为8个字符, 包含数字和字母"];
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetVerificationCode = async () => {
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setErrors({ ...errors, phoneNumber: "请输入正确的手机号" });
      return;
    }

    try {
      const response = await instance.post(
        "/user/reset-password-code",
        {
          phoneNumber: formData.phoneNumber,
        }
      );
      setIsVerificationCodeSent(true);
      setCountdown(60);
    } catch (error) {
      alert(error.response?.data?.message || "获取验证码失败");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "请输入手机号";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "请输入正确的手机号格式";
    }

    if (!formData.verificationCode) {
      newErrors.verificationCode = "请输入验证码";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "请输入密码";
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

    try {
      const response = await instance.post(
        "/user/reset-password",
        formData
      );
      if (response.data === "密码重置成功") {
        alert("密码重置成功，请重新登录");
        navigate("/login");
      } else {
        alert(response.data.message || "重置密码失败");
      }
    } catch (error) {
      alert("重置密码失败，请稍后重试");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="forgot-password-container relative bg-white mx-auto pb-16">
      <div className="bg-image flex flex-col items-center justify-center text-white">
        <div className="header-title mb-0.5">每日发现</div>
        <div className="header-subtitle opacity-80">发现生活中的美好时刻</div>
      </div>
      <div className="px-4 mt-4">
        <h1 className="page-title mb-4">找回密码</h1>
        <div className="space-y-2.5">
          <div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="请输入手机号码"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full h-10 pr-12 rounded-lg bg-white/50 border-none text-sm"
            />
            {errors.phoneNumber && (
              <p className="error-message">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="flex space-x-1.5">
            <input
              type="text"
              placeholder="请输入验证码"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className={`forgot-input flex-1 bg-gray-50 text-sm border-none ${
                errors.verificationCode ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={handleGetVerificationCode}
              disabled={countdown > 0}
              className={`forgot-button w-20 bg-primary text-white rounded-md ${
                countdown > 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
              } transition-colors`}
            >
              {countdown > 0 ? `${countdown}秒` : "获取验证码"}
            </button>
          </div>
          {errors.verificationCode && (
            <p className="error-message">{errors.verificationCode}</p>
          )}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="请设置密码"
              name="newPassword"
              className="w-full h-10 pr-12 rounded-lg bg-white/50 border-none text-sm"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
            <button 
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <i className={`${showNewPassword ? "ri-eye-off-line" : "ri-eye-line"} text-xs`}></i>
            </button>
            {errors.newPassword && (
              <p className="error-message">{errors.newPassword}</p>
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
              placeholder="请再次输入密码"
              name="confirmPassword"
              className="w-full h-10 pr-12 rounded-lg bg-white/50 border-none text-sm"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button 
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`${showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"} text-xs`}></i>
            </button>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="forgot-button w-full bg-primary text-white font-medium rounded-md mt-4"
            onClick={handleSubmit}
          >
            提交
          </button>
          <div className="flex justify-between mt-2 mb-6">
            <a
              href="#"
              className="link-text text-gray-500"
              onClick={handleLogin}
            >
              返回登录
            </a>
            <div className="space-x-2">
              <a href="#" className="link-text text-gray-500">
                用户协议
              </a>
              <a href="#" className="link-text text-gray-500">
                隐私政策
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* 底部导航栏 */}
      <div className="fixed bottom-0 w-full max-w-[375px] h-12 bg-white border-t flex justify-around items-center">
        <a href="#" className="flex flex-col items-center text-primary">
          <i className="ri-compass-line text-sm"></i>
          <span className="nav-text mt-0.5">发现</span>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-400">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center -mt-3">
            <i className="ri-add-line text-lg text-white"></i>
          </div>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-400">
          <i className="ri-calendar-line text-sm"></i>
          <span className="nav-text mt-0.5">日历</span>
        </a>
      </div>
      <div
        id="toast"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-2.5 py-1 rounded-md text-xs hidden"
      ></div>
    </div>
  );
};

export default ForgotPasswordPage;