import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Hook to manage the logic for the registration form.
 * Encapsulates form state, validation, and submission logic.
 * Follows the "Hook-First" principle from docs/04_FRONTEND.md.
 */
export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, status } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'succeeded') {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    }
    if (status === 'failed' && error) {
      toast.error(`Registration failed: ${error}`);
    }
  }, [status, error, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isLoading,
  };
}; 