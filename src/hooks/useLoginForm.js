import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../services/api/authService';

/**
 * Hook to manage the logic for the login form.
 * Encapsulates form state, validation, and submission logic.
 */
export const useLoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordShown(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('请输入邮箱和密码');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await login({ email, password });
      toast.success('登录成功');
      navigate('/daily'); // 登录成功后导航到主页
    } catch (error) {
      toast.error(error.response?.data?.message || '登录失败，请检查您的凭据');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, navigate]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    email,
    password,
    isLoading,
    passwordShown,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
    handleCancel
  };
}; 

export default useLoginForm; 