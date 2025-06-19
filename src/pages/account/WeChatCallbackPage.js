import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

const WeChatCallbackPage = () => {
  const [message, setMessage] = useState('正在通过微信登录，请稍候...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // 可用于验证请求的有效性

    if (code) {
      authService.loginByThirdParty('wechat', code)
        .then(response => {
          if (response && response.success) {
            // 假设登录成功返回的数据在 response.data.data 中，且包含 token 和 user 信息
            const { token, ...userInfo } = response.data.data;
            
            if (token) {
              localStorage.setItem('userToken', token);
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              setMessage('登录成功，正在跳转...');
              navigate('/'); // 登录成功，跳转到首页
            } else {
              throw new Error('无效的响应数据');
            }
          } else {
            throw new Error('登录失败');
          }
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || '微信登录失败，请重试。';
          setMessage(`登录出错: ${errorMessage} 将在5秒后返回登录页。`);
          setTimeout(() => navigate('/login'), 5000);
        });
    } else {
      setMessage('无效的回调请求，缺少授权码。将在5秒后返回登录页。');
      setTimeout(() => navigate('/login'), 5000);
    }
  }, [location, navigate]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default WeChatCallbackPage; 