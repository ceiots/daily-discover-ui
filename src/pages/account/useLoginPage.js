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
      const response = await authService.login(formData);
      // 后端返回的结构是 Result<UserVO>，其 data 才是 UserVO
      // 而 authService 已经处理了 response，直接返回了 response.data
      // 所以这里的 response 就是 Result 对象
      if (response && response.success) {
        toast.success('登录成功！');
        const { token, ...userInfo } = response.data;

        if (token) {
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          // 触发一个全局事件，通知其他组件（如App.js或NavBar）用户信息已更新
          const event = new CustomEvent('userLoggedIn', { detail: userInfo });
          window.dispatchEvent(event);
          navigate('/'); // 登录成功，跳转到首页
        } else {
           setError('登录失败，无效的响应数据');
        }
      } else {
        // 如果后端返回 success: false，也应该显示错误信息
        setError(response.message || '登录失败，请检查您的用户名和密码');
      }
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查您的用户名和密码');
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
