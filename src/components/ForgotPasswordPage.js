import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../config';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: ""
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGetVerificationCode = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/reset-password-code`, {
        phoneNumber: formData.phoneNumber
      });
      alert(response.data);
    } catch (error) {
      alert("获取验证码失败，请稍后重试");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert("两次输入的密码不一致");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/reset-password`, formData);
      if (response.data === "密码重置成功") {
        alert("密码重置成功，请重新登录");
        navigate("/login");
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert("重置密码失败，请稍后重试");
    }
  };

  return (
    <div className="relative min-h-[762px] mx-auto bg-white">
      <div className="relative h-[240px] overflow-hidden">
        <img
          src="https://ai-public.mastergo.com/ai/img_res/324091066d8ec34bedee07d709744310.jpg"
          className="w-full h-full object-cover"
          alt="背景图"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl font-medium mb-2">重置密码</h1>
          <p className="text-sm opacity-90">找回您的账号密码</p>
        </div>
      </div>

      <div className="absolute top-[200px] left-0 right-0 bottom-0 rounded-t-[24px] bg-white px-6 pt-8 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">手机号码</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="flex-1 h-12 px-4 bg-gray-50 border-none rounded-md text-sm"
                placeholder="请输入手机号码"
              />
              <button
                type="button"
                onClick={handleGetVerificationCode}
                className="px-4 bg-primary text-white rounded-md whitespace-nowrap"
              >
                获取验证码
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">验证码</label>
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-md text-sm"
              placeholder="请输入验证码"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">新密码</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-md text-sm"
              placeholder="请输入新密码"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">确认新密码</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-md text-sm"
              placeholder="请再次输入新密码"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-primary text-white text-center rounded-md mt-6"
          >
            重置密码
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary text-sm"
            >
              返回登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 