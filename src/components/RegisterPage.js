import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false); // 添加协议同意状态
  const [errors, setErrors] = useState({}); // 添加错误状态

  // 验证手机号格式
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 提交注册
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


    // 验证用户协议
    if (!agreeToTerms) {
      newErrors.terms = "请阅读并同意用户协议和隐私政策";
    }
    
    // 如果有错误，显示错误信息并返回
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await instance.post(
        "/user/register",
        formData
      );
      if (response.data === "注册成功") {
        alert("注册成功");
        navigate("/login");
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert("注册失败，请稍后重试");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // 密码检验规则提示信息
const passwordRules = [
  "密码长度至少为8个字符, 包含数字和字母"
];

  return (
    <div className="relative mx-auto bg-white">
      <div className="relative overflow-hidden">
        <img
          src="https://ai-public.mastergo.com/ai/img_res/324091066d8ec34bedee07d709744310.jpg"
          className="w-full h-full object-cover"
          alt="背景图"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl font-medium mb-2">每日发现</h1>
          <p className="text-sm opacity-90">发现生活中的美好时刻</p>
        </div>
      </div>

      <div className=" bg-white rounded-xl shadow-lg p-5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="请输入手机号"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
              <i className="fas fa-mobile-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

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
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
                  setFormData({ ...formData, confirmPassword: e.target.value })
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
            className="w-full !rounded-button py-3 bg-primary text-white font-medium hover:bg-primary/90"
          >
            立即注册
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreement"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className={`w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary ${
                errors.terms ? "border-red-500" : ""
              }`}
            />
            <div className="text-sm text-gray-600">
              注册即表示同意
              <a href="#" className="text-primary hover:underline">
                用户协议
              </a>
              和
              <a href="#" className="text-primary hover:underline">
                隐私政策
              </a>
            </div>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
          )}
        </form>

        <div className="mt-2 text-center">
          <span className="text-gray-600">已有账号？</span>
          <a
            href="#"
            className="text-primary hover:underline"
            onClick={handleLogin}
          >
            立即登录
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
