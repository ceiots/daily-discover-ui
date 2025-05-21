import React, { useState, useEffect } from 'react';
import { useAuth } from '../App'; // 导入自定义钩子
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import { Input } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './LoginPage.css'; // 创建一个新的 CSS 文件来存放样式
import instance from '../utils/axios';
import NavBar from './NavBar'; // 引入NavBar组件

const LoginPage = () => {
  const { refreshUserInfo } = useAuth(); // 替换 setIsLoggedIn, setUserInfo
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // 添加记住密码状态
  const [loading, setLoading] = useState(false); // 添加加载状态
  const [errorMsg, setErrorMsg] = useState(''); // 添加错误信息状态
  const [showPassword, setShowPassword] = useState(false); // 添加显示密码状态
  const navigate = useNavigate(); // 使用 useNavigate

  // 组件加载时检查本地存储的登录信息
  useEffect(() => {
    const savedPhone = localStorage.getItem('rememberedPhone');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedPhone && savedPassword) {
      setPhoneNumber(savedPhone);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const user = {
        phoneNumber: phoneNumber,
        password: password,
      };
      const response = await instance.post('/user/login', user);

      // 处理登录成功
      if (response.data.code === 200 && response.data.message === '登录成功') {
        // 先清除可能存在的旧数据
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        // 保存新数据
        const userId = response.data.userInfo.id;
        const token = response.data.token;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        
        // 设置请求头
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 保存用户信息
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
        
        console.log('登录成功，保存的用户ID:', userId);
        
        // 使用await等待refreshUserInfo完成
        await refreshUserInfo();
        
        // 导航到首页
        navigate('/');
      } else {
        setErrorMsg(
          response.data.message || response.data || '登录失败，请检查账号密码'
        );
      }
    } catch (error) {
      console.error('登录时出错:', error);
      setErrorMsg(error.response?.data?.message || '登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // 处理注册的函数
  const handleRegister = () => {
    navigate('/Register');
  };

  return (
    <div className="w-[375px] h-screen overflow-hidden mx-auto">
      <div className="relative w-full h-full bg-gray-100">
        <div className="absolute inset-0">
          <img
            src="https://public.readdy.ai/ai/img_res/9b7a0931512c6a31d9411ce057a66af7.jpg"
            className="w-full h-full object-cover"
            alt="背景"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
                   
        <div className="relative flex flex-col items-center justify-center min-h-screen px-6 vertical-center">
          <h1 className="text-xl font-bold text-white mb-2">每日发现</h1>
          <p className="text-white/90 text-sm mb-7">发现生活中的美好时刻</p>

          <div className="login-container w-full flex flex-col items-center">
            {errorMsg && (
              <div className="error-message mb-2 p-2 rounded-md text-sm">
                {errorMsg}
              </div>
            )}

            <div className="relative input-field mb-2 w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                <i className="ri-smartphone-line text-gray-400" />
              </div>
              <Input
                type="tel"
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/50 border-none text-sm"
                placeholder="请输入手机号"
                maxLength={11}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="relative input-field mb-4 w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                <i className="ri-lock-line text-gray-400" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                className="w-full h-10 pl-10 pr-12 rounded-lg bg-white/50 border-none text-sm"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`ri-${
                    showPassword ? "eye-off" : "eye"
                  }-line text-gray-400`}
                />
              </button>
            </div>

            <button
              className={`rounded-button w-full h-10 mb-2 flex items-center justify-center ${
                loading ? "opacity-70" : ""
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2">⟳</span> : "登录"}
            </button>

            <div className="flex justify-between items-center text-xs mb-2">
              <a
                href="#"
                className="text-gray-500"
                onClick={handleForgotPassword}
              >
                忘记密码？
              </a>
              <a href="#" className="text-primary" onClick={handleRegister}>
                立即注册
              </a>
            </div>

            <div className="text-center text-xs text-gray-500">
              登录即表示同意
              <a href="#" className="text-primary">
                {" "}
                《用户协议》{" "}
              </a>
              和
              <a href="#" className="text-primary">
                {" "}
                《隐私政策》{" "}
              </a>
            </div>
          </div>
        </div>

        {/* 使用统一的NavBar组件 */}
        <NavBar />
      </div>
    </div>
  );
};

export default LoginPage;
