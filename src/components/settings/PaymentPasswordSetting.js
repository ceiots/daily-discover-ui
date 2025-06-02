import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';

const PaymentPasswordSetting = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [hasPaymentPassword, setHasPaymentPassword] = useState(false);
  const [step, setStep] = useState('verify'); // verify, set, confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 密码输入
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 验证码计时器
  const [countdown, setCountdown] = useState(0);
  const [canSendCode, setCanSendCode] = useState(true);

  // 检查用户是否已设置支付密码
  useEffect(() => {
    const checkPaymentPassword = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await instance.get('/user/payment-password/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.code === 200) {
          setHasPaymentPassword(response.data.data.hasPaymentPassword);
          // 如果已有支付密码，初始步骤为验证，否则为设置
          setStep(response.data.data.hasPaymentPassword ? 'verify' : 'set');
        }
      } catch (error) {
        console.error('检查支付密码状态失败:', error);
        setError('获取支付密码状态失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    checkPaymentPassword();
  }, []);

  // 发送验证码
  const handleSendVerificationCode = async () => {
    if (!canSendCode) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await instance.post('/user/payment-password/send-code', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setSuccess('验证码已发送到您的手机');
        setCountdown(60);
        setCanSendCode(false);
        
        // 倒计时
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanSendCode(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.data?.message || '发送验证码失败');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setError('发送验证码失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 验证当前支付密码
  const handleVerifyPassword = async () => {
    if (!currentPassword) {
      setError('请输入当前支付密码');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await instance.post('/user/payment-password/verify', {
        paymentPassword: currentPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setStep('set');
        setCurrentPassword('');
        setError('');
      } else {
        setError(response.data?.message || '支付密码验证失败');
      }
    } catch (error) {
      console.error('验证支付密码失败:', error);
      setError('验证支付密码失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 设置新支付密码
  const handleSetPassword = () => {
    if (newPassword.length !== 6) {
      setError('支付密码必须为6位数字');
      return;
    }
    
    setStep('confirm');
    setError('');
  };

  // 确认新支付密码
  const handleConfirmPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = hasPaymentPassword 
        ? { 
            currentPassword, 
            newPassword, 
            verificationCode 
          } 
        : { 
            newPassword, 
            verificationCode 
          };
      
      const response = await instance.post('/user/payment-password/update', payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setSuccess('支付密码设置成功');
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } else {
        setError(response.data?.message || '设置支付密码失败');
        setStep('set');
      }
    } catch (error) {
      console.error('设置支付密码失败:', error);
      setError('设置支付密码失败，请稍后再试');
      setStep('set');
    } finally {
      setLoading(false);
    }
  };

  // 渲染验证步骤
  const renderVerifyStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">验证当前支付密码</h3>
        <p className="text-gray-500 text-sm mt-2">请输入您当前的支付密码进行验证</p>
      </div>
      
      <div className="mb-4">
        <input
          type="password"
          maxLength={6}
          placeholder="请输入当前支付密码"
          className="w-full p-3 border rounded-lg text-center text-lg"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div 
          className="text-primary text-sm cursor-pointer"
          onClick={() => setStep('reset')}
        >
          忘记支付密码？
        </div>
      </div>
      
      <button
        className="w-full bg-primary text-white py-3 rounded-lg"
        onClick={handleVerifyPassword}
        disabled={loading}
      >
        {loading ? '验证中...' : '下一步'}
      </button>
    </div>
  );

  // 渲染重置步骤
  const renderResetStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">重置支付密码</h3>
        <p className="text-gray-500 text-sm mt-2">请先获取手机验证码</p>
      </div>
      
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="请输入验证码"
          className="w-full p-3 border rounded-lg"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
        <button
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded ${
            canSendCode ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}
          onClick={handleSendVerificationCode}
          disabled={!canSendCode}
        >
          {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
        </button>
      </div>
      
      <button
        className="w-full bg-primary text-white py-3 rounded-lg"
        onClick={() => setStep('set')}
        disabled={loading || !verificationCode}
      >
        下一步
      </button>
    </div>
  );

  // 渲染设置步骤
  const renderSetStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">{hasPaymentPassword ? '设置新支付密码' : '设置支付密码'}</h3>
        <p className="text-gray-500 text-sm mt-2">请设置6位数字支付密码</p>
      </div>
      
      <div className="mb-4">
        <input
          type="password"
          maxLength={6}
          placeholder="请输入6位数字密码"
          className="w-full p-3 border rounded-lg text-center text-lg"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
      </div>
      
      <button
        className="w-full bg-primary text-white py-3 rounded-lg"
        onClick={handleSetPassword}
        disabled={loading || newPassword.length !== 6}
      >
        下一步
      </button>
    </div>
  );

  // 渲染确认步骤
  const renderConfirmStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">确认支付密码</h3>
        <p className="text-gray-500 text-sm mt-2">请再次输入6位数字支付密码</p>
      </div>
      
      <div className="mb-4">
        <input
          type="password"
          maxLength={6}
          placeholder="请再次输入6位数字密码"
          className="w-full p-3 border rounded-lg text-center text-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
      </div>
      
      <button
        className="w-full bg-primary text-white py-3 rounded-lg"
        onClick={handleConfirmPassword}
        disabled={loading || confirmPassword.length !== 6}
      >
        {loading ? '提交中...' : '确认'}
      </button>
    </div>
  );

  // 根据当前步骤渲染不同内容
  const renderStepContent = () => {
    switch (step) {
      case 'verify':
        return renderVerifyStep();
      case 'reset':
        return renderResetStep();
      case 'set':
        return renderSetStep();
      case 'confirm':
        return renderConfirmStep();
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* 顶部导航 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center mb-2">
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <i className="ri-arrow-left-s-line text-xl mr-2"></i>
            <span>返回</span>
          </button>
        </div>
        <h2 className="text-lg font-medium">支付密码</h2>
      </div>
      
      {/* 主要内容 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-500 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        
        {renderStepContent()}
      </div>
    </div>
  );
};

export default PaymentPasswordSetting; 