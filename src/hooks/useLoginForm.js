import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Hook to manage the logic for the login form.
 * Encapsulates form state, validation, and submission logic.
 */
export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, status, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  // Redirect if user is already logged in or after successful login
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      toast.success('Login successful!');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Handle login errors
  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(`Login failed: ${error}`);
    }
  }, [status, error]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
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
    login({
      username: formData.username,
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