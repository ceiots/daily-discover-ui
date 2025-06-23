import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

export const useLoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 表单变更处理
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除错误信息
    if (error) {
      setError('');
    }
  }, [error]);

  // 表单提交
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('登录请求开始，提交数据:', { username: formData.username });
      const response = await authService.login(formData);
      console.log('登录响应数据:', response);
      
      // 后端返回的结构是 Result<UserVO>，其 data 才是 UserVO
      if (response && response.success) {
        toast.success('登录成功！');
        const { token, ...userInfo } = response.data;

        if (token) {
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          // 触发一个全局事件，通知其他组件（如App.js或NavBar）用户信息已更新
          const event = new CustomEvent('userLoggedIn', { detail: userInfo });
          window.dispatchEvent(event);
          console.log('用户登录成功，即将跳转到首页');
          navigate('/'); // 登录成功，跳转到首页
        } else {
          console.error('登录响应中缺少token:', response);
          setError('登录失败，无效的响应数据');
        }
      } else {
        // 如果后端返回 success: false，也应该显示错误信息
        console.error('登录失败，后端返回失败状态:', response);
        setError(response.message || '登录失败，请检查您的用户名和密码');
      }
    } catch (err) {
      console.error('登录请求异常:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('登录请求超时，请检查网络连接或稍后再试');
      } else if (!err.response) {
        setError('网络连接错误，请检查您的网络设置');
      } else {
        setError(err.response?.data?.message || '登录失败，请检查您的用户名和密码');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  return {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit
  };
};
