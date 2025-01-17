import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [errors, setErrors] = useState({}); // 添加错误状态
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 密码检验规则提示信息
  const passwordRules = ["密码长度至少为8个字符, 包含数字和字母"];
  // 验证手机号格式
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
      setCountdown(60); // 开始60秒倒计时
    } catch (error) {
      alert(error.response?.data?.message || "获取验证码失败");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 重置错误
    const newErrors = {};

    // 验证手机号
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "请输入手机号";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "请输入正确的手机号格式";
    }

    if (!formData.verificationCode) {
      newErrors.verificationCode = "请输入验证码";
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (formData.password.length < 8) {
      newErrors.password = "密码长度至少为8个字符";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "密码必须包含至少一个数字";
      /* } else if (!/[A-Z]/.test(formData.password)) {
               newErrors.password = "密码必须包含至少一个大写字母"; */
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "密码必须包含至少一个小写字母";
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    // 如果有错误，显示错误信息并返回
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
    <div className="relative bg-white">
      <div className="relative overflow-hidden">
        <img src="/background.jpg" alt="背景图" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl font-medium mb-2">每日发现</h1>
          <p className="text-sm opacity-90">发现生活中的美好时刻</p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-2">
          <h2 className="text-l font-bold text-gray-800 text-center mb-2">
            找回密码
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="请输入手机号"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 h-12 bg-gray-50 rounded-lg border-none text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  className={`flex-1 px-4 h-11 bg-gray-50 rounded-lg border-none text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors ${
                    errors.verificationCode ? "border-red-500" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={handleGetVerificationCode}
                  disabled={countdown > 0}
                  className={`h-11 px-3 bg-primary text-white rounded-button whitespace-nowrap ${
                    countdown > 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary/90"
                  } transition-colors`}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                </button>
              </div>
              {errors.verificationCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.verificationCode}
                </p>
              )}

              <div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="请设置密码"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                  {/* 显示密码检验规则 */}
                  {passwordRules.map((rule, index) => (
                    <p key={index} className="text-xs text-gray-500 mt-1">
                      - {rule}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="再次设置密码"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-8 bg-primary text-white rounded-button hover:bg-primary/90 transition-colors"
              >
                提交
              </button>

              <div className="flex justify-between items-center mt-4 text-sm">
                <a
                  className="text-gray-500 hover:text-primary transition-colors"
                  onClick={handleLogin}
                >
                  返回登录
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    用户协议
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    隐私政策
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
