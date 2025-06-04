import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App'; // 导入自定义钩子
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import instance from '../../utils/axios';
import NavBar from '../../theme/components/NavBar'; // 引入NavBar组件
import { BasePage, Button } from '../../theme';

const LoginPage = () => {
  const { refreshUserInfo } = useAuth(); // 替换 setIsLoggedIn, setUserInfo
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
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
    navigate('/register');
  };

  return (
    <BasePage showHeader={true}  className="login-page">
      <div className="form-section">
        <div className="login-form-container">
          <h1 className="text-2xl font-bold text-center mb-2">登录</h1>
          <p className="text-center text-neutral-500 mb-6">每日发现</p>
          {errorMsg && <div className="error-message mb-2">{errorMsg}</div>}
          <input
            type="tel"
            className="theme-input"
            placeholder="请输入手机号"
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              className="theme-input pr-10"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{ background: 'none', border: 'none' }}
            >
              <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line text-gray-400`} />
            </button>
          </div>
          <Button
            variant="primary"
            block
            loading={loading}
            onClick={handleSubmit}
          >
            登录
          </Button>
          <div className="flex justify-between items-center text-xs mt-2 mb-2 w-full">
            <a href="#" className="text-gray-500" onClick={handleForgotPassword}>
              忘记密码？
            </a>
            <a href="#" className="text-primary" onClick={handleRegister}>
              立即注册
            </a>
          </div>
          <div className="text-center text-xs text-gray-500 w-full">
            登录即表示同意
            <a href="#" className="text-primary"> 《用户协议》 </a>
            和
            <a href="#" className="text-primary"> 《隐私政策》 </a>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default LoginPage;
