import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser } from '../../store/slices/authSlice';

export const useLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const from = location.state?.from?.pathname || '/';

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const resultAction = await dispatch(loginUser(formData));
            
            if (loginUser.fulfilled.match(resultAction)) {
                toast.success('登录成功！');
                navigate(from, { replace: true });
            } else {
                const errorMessage = resultAction.payload || '登录失败，请检查您的凭据。';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('登录错误:', error);
            const errorMessage = error.message || '登录失败，请稍后重试。';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [formData, dispatch, navigate, from]);

    return {
        isLoading,
        formData,
        handleChange,
        handleSubmit,
    };
};
