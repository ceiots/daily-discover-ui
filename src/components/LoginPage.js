import React, { useState } from 'react';
import { useAuth } from '../App'; // 导入自定义钩子
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import './LoginPage.css'; // 创建一个新的 CSS 文件来存放样式

const LoginPage = () => {
  const { setIsLoggedIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 使用 useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加验证逻辑
    // 假设验证成功后，设置登录状态
    setIsLoggedIn(true);
    navigate('/Calendar'); // 登录后跳转到 Discover 页面
  };

  return (
    <div className="relative w-[375px] min-h-[762px] mx-auto bg-white">
      <div className="relative h-[240px] overflow-hidden">
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

      <div className="absolute top-[200px] left-0 right-0 bottom-0 rounded-t-[24px] bg-white px-6 pt-8 pb-6">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="请输入手机号码"
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-md text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="请输入密码"
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-md text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="w-full h-12 bg-primary text-white text-center rounded-md" onClick={handleSubmit}>
          登录
        </button>

        <div className="flex justify-between items-center mt-4 text-sm">
          <a href="#" className="text-gray-500">忘记密码？</a>
          <a href="#" className="text-primary">立即注册</a>
        </div>

        <div className="mt-8">
          <p className="text-center text-gray-400 text-sm mb-6">其他登录方式</p>
          <div className="flex justify-center gap-8">
            <button className="w-12 h-12 rounded-full bg-[#07C160] flex items-center justify-center">
              <i className="fab fa-weixin text-white text-xl"></i>
            </button>
            <button className="w-12 h-12 rounded-full bg-[#12B7F5] flex items-center justify-center">
              <i className="fab fa-qq text-white text-xl"></i>
            </button>
            <button className="w-12 h-12 rounded-full bg-[#FF6B6B] flex items-center justify-center">
              <i className="fas fa-mobile-alt text-white text-xl"></i>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          登录即表示同意
          <a href="#" className="text-primary">用户协议</a>
          和
          <a href="#" className="text-primary">隐私政策</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 