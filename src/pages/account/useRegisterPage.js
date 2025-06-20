import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

export const useRegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 倒计时效果
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 表单变更处理
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 当用户开始输入时，清除对应的错误信息
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    // 清除总的表单错误
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: null }));
    }
  }, [errors]);

  // 验证码发送
  const handleSendCode = useCallback(async () => {
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '发送前请输入有效的邮箱地址' }));
      toast.error('请输入有效的邮箱地址');
      return;
    }
    setSendingCode(true);
    setErrors(prev => ({ ...prev, email: null })); // 清除旧的邮箱错误
    try {
      // 注册场景下，type为2
      const response = await authService.sendVerificationCode(formData.email, 2); 
      toast.success('验证码已发送，请查收！');
      setCountdown(60);
    } catch (err) {
      let errorMessage = '发送验证码失败';
      if (err.response) {
        // 后端返回了响应，但状态码表示错误
        errorMessage = err.response.data?.message || `服务器错误: ${err.response.status}`;
      } else if (err.request) {
        // 请求已发出，但没有收到响应（例如，网络中断或超时）
        if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
          errorMessage = '网络连接超时，请检查网络或稍后再试。';
        } else {
          errorMessage = '网络错误，请检查您的网络连接。';
        }
      } else {
        // 在设置请求时发生了一些事情，触发了一个错误
        errorMessage = `请求配置错误: ${err.message}`;
      }
      setErrors(prev => ({ ...prev, form: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setSendingCode(false);
    }
  }, [formData.email]);

  // 表单提交
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // 前端基础验证
    const newErrors = {};
    if (!formData.username) newErrors.username = '请输入用户名';
    if (!formData.password) newErrors.password = '请输入密码';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '两次输入的密码不一致';
    if (!formData.email) newErrors.email = '请输入电子邮箱';
    if (!formData.code) newErrors.code = '请输入验证码';
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setLoading(true);
    setErrors({}); // 清空之前的错误
    try {
      // 调用注册服务
      await authService.register(formData);
      toast.success('注册成功！即将跳转到登录页...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || '注册失败，请稍后再试';
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  return {
    formData,
    errors,
    loading,
    sendingCode,
    countdown,
    handleChange,
    handleSendCode,
    handleSubmit
  };
}; 