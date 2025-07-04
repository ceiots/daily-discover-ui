import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { sendVerificationCode } from '../../services/api/authService';
import { registerUser } from '../../store/slices/authSlice';

export const useRegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: ''
    });

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSendCode = useCallback(async () => {
        if (!formData.email) {
            toast.error('请输入邮箱地址！');
            return;
        }
        setIsSendingCode(true);
        try {
            await sendVerificationCode({ email: formData.email, type: 'REGISTER' });
            toast.success('验证码已发送，请注意查收！');
            setCountdown(60);
        } catch (error) {
            const errorMessage = error.response?.data?.message || '验证码发送失败。';
            toast.error(errorMessage);
        } finally {
            setIsSendingCode(false);
        }
    }, [formData.email]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('两次输入的密码不一致！');
            return;
        }
        setIsLoading(true);
        try {
            const resultAction = await dispatch(registerUser(formData));

            if (registerUser.fulfilled.match(resultAction)) {
                toast.success('注册成功！正在跳转到登录页...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const errorMessage = resultAction.payload || '注册失败，请稍后重试。';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('注册错误:', error);
            const errorMessage = error.message || '注册失败，请稍后重试。';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [formData, dispatch, navigate]);

    return {
        isLoading,
        isSendingCode,
        countdown,
        formData,
        handleChange,
        handleSubmit,
        handleSendCode
    };
};
