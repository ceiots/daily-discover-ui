import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";
import "./RegisterPage.css"; // 引入样式文件
import { BasePage, Button } from "../../theme";

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

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.mobile) {
      newErrors.phoneNumber = "请输入手机号";
    } else if (!isValidPhoneNumber(formData.mobile)) {
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
    <BasePage className="bg-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">注册</h1>
          <p className="text-gray-500 mt-1">每日发现，探索精彩</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">手机号</label>
            <div className="relative">
              <input
                type="tel"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.phoneNumber ? 'border-error-DEFAULT' : 'border-gray-300'
                }`}
                placeholder="请输入手机号码"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="ri-smartphone-line"></i>
              </div>
            </div>
            {errors.phoneNumber && (
              <p className="text-error-DEFAULT text-xs">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">用户名</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.username ? 'border-error-DEFAULT' : 'border-gray-300'
                }`}
                placeholder="请输入用户名"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            {errors.username && (
              <p className="text-error-DEFAULT text-xs">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">昵称</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.nickname ? 'border-error-DEFAULT' : 'border-gray-300'
                }`}
                placeholder="请输入昵称"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
              />
            </div>
            {errors.nickname && (
              <p className="text-error-DEFAULT text-xs">{errors.nickname}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.password ? 'border-error-DEFAULT' : 'border-gray-300'
                }`}
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={`ri-${showPassword ? "eye-off" : "eye"}-line`} />
              </button>
            </div>
            {errors.password && (
              <p className="text-error-DEFAULT text-xs">{errors.password}</p>
            )}
            {passwordRules.map((rule, index) => (
              <p key={index} className="text-gray-500 text-xs">- {rule}</p>
            ))}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">确认密码</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.confirmPassword ? 'border-error-DEFAULT' : 'border-gray-300'
                }`}
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                <i className={`ri-${showConfirmPassword ? "eye-off" : "eye"}-line`} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-error-DEFAULT text-xs">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreement"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className={`w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 ${
                  errors.terms ? 'border-error-DEFAULT' : ''
                }`}
              />
              <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                注册即表示同意
                <a href="#" className="text-primary-500 hover:underline mx-1">用户协议</a>
                和
                <a href="#" className="text-primary-500 hover:underline ml-1">隐私政策</a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-error-DEFAULT text-xs mt-1">{errors.terms}</p>
            )}
          </div>

          <Button 
            type="primary" 
            block 
            loading={loading}
            className="mt-6"
          >
            立即注册
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">已有账号？</span>
          <button 
            className="text-primary-500 text-sm ml-1 hover:underline"
            onClick={handleLogin}
            type="button"
          >
            立即登录
          </button>
        </div>

        {/* Toast 消息 */}
        <div 
          id="toast" 
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full opacity-0 transition-opacity duration-300"
        ></div>
      </div>
    </BasePage>
  );
};

export default RegisterPage;