import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import instance from '../../utils/axios';
import { BasePage, useTheme } from '../../theme';
import PropTypes from 'prop-types'; 
const PaymentPasswordSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // 从支付页面跳转过来的支付信息
  const { returnTo, orderNo, paymentAmount, paymentMethod } = location.state || {};
  
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
          // 但如果是从支付页面跳转来的，直接进入设置阶段
          if (returnTo === '/payment') {
            setStep('set');
          } else {
            setStep(response.data.data.hasPaymentPassword ? 'verify' : 'set');
          }
        }
      } catch (error) {
        console.error('检查支付密码状态失败:', error);
        setError('获取支付密码状态失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    checkPaymentPassword();
  }, [returnTo]);

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
      
      // 根据不同情况选择不同的API路径和参数
      let apiPath = '/user/payment-password/update';
      let payload = {};
      
      // 如果是首次设置支付密码，使用简化的API
      if (!hasPaymentPassword) {
        apiPath = '/user/payment-password/set';
        payload = { password: newPassword };
      } else {
        // 否则是更新密码，需要提供更多信息
        payload = { 
          currentPassword, 
          newPassword, 
          verificationCode 
        };
      }
      
      const response = await instance.post(apiPath, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setSuccess('支付密码设置成功');
        setTimeout(() => {
          // 如果是从支付页面过来的，设置成功后返回支付页面
          if (returnTo === '/payment' && orderNo && paymentAmount && paymentMethod) {
            navigate('/payment-password', {
              state: {
                orderNo,
                paymentAmount,
                paymentMethod
              }
            });
          } else {
            navigate('/settings');
          }
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

  // 密码点显示组件
  const PasswordDots = ({ value, length = 6 }) => {
    const dots = [];
    for (let i = 0; i < length; i++) {
      dots.push(
        <div 
          key={i}
          className="w-10 h-10 border-2 rounded-full flex items-center justify-center mx-1"
          style={{ 
            borderColor: i < value.length 
              ? theme.colors.primary.main 
              : theme.colors.neutral[300]
          }}
        >
          {i < value.length && (
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: theme.colors.primary.main }}
            ></div>
          )}
        </div>
      );
    }
    
    
PasswordDots.propTypes = {
  value: PropTypes.string.isRequired,
  length: PropTypes.number
};

NumberPad.propTypes = {
  onNumberPress: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

    return (
      <div className="flex justify-center my-6">
        {dots}
      </div>
    );
  };

  // 数字键盘组件
  const NumberPad = ({ onNumberPress, onDelete, value }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'delete'];
    
    const handleNumberPress = (num) => {
      if (value.length < 6) {
        onNumberPress(num);
      }
    };
    
    return (
      <div className="grid grid-cols-3 gap-4 mt-6">
        {numbers.map((num, index) => {
          if (num === null) {
            return <div key={index}></div>;
          }
          
          if (num === 'delete') {
            return (
              <button
                key={index}
                onClick={onDelete}
                className="h-14 flex items-center justify-center border rounded-lg"
                type="button"
                style={{
                  borderColor: theme.colors.neutral[300],
                  transition: theme.transition.normal
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </button>
            );
          }
          
          return (
            <button
              key={index}
              onClick={() => handleNumberPress(num)}
              className="h-14 border rounded-lg text-xl font-semibold"
              type="button"
              style={{
                borderColor: theme.colors.neutral[300],
                transition: theme.transition.normal,
                color: theme.colors.neutral[800]
              }}
            >
              {num}
            </button>
          );
        })}
      </div>
    );
  };

  // 渲染验证步骤
  const renderVerifyStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">验证当前支付密码</h3>
        <p className="text-gray-500 text-sm mt-2">请输入您当前的支付密码进行验证</p>
      </div>
      
      <PasswordDots value={currentPassword} />
      
      <NumberPad 
        onNumberPress={(num) => setCurrentPassword(prev => prev + num)}
        onDelete={() => setCurrentPassword(prev => prev.slice(0, -1))}
        value={currentPassword}
      />
      
      <div className="flex items-center justify-between mt-6">
        <div 
          className="text-sm cursor-pointer"
          onClick={() => setStep('reset')}
          style={{ color: theme.colors.primary.main }}
        >
          忘记支付密码？
        </div>
      </div>
      
      <button
        className="w-full py-3 rounded-lg mt-4"
        onClick={handleVerifyPassword}
        disabled={loading || currentPassword.length !== 6}
        style={{
          backgroundColor: loading || currentPassword.length !== 6 
            ? theme.colors.neutral[300] 
            : theme.colors.primary.main,
          color: theme.colors.neutral[0]
        }}
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
          style={{ borderColor: theme.colors.neutral[300] }}
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded"
          onClick={handleSendVerificationCode}
          disabled={!canSendCode}
          style={{
            backgroundColor: canSendCode ? theme.colors.primary.main : theme.colors.neutral[200],
            color: canSendCode ? theme.colors.neutral[0] : theme.colors.neutral[500]
          }}
        >
          {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
        </button>
      </div>
      
      <button
        className="w-full py-3 rounded-lg"
        onClick={() => setStep('set')}
        disabled={loading || !verificationCode}
        style={{
          backgroundColor: loading || !verificationCode 
            ? theme.colors.neutral[300] 
            : theme.colors.primary.main,
          color: theme.colors.neutral[0]
        }}
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
      
      <PasswordDots value={newPassword} />
      
      <NumberPad 
        onNumberPress={(num) => setNewPassword(prev => prev + num)}
        onDelete={() => setNewPassword(prev => prev.slice(0, -1))}
        value={newPassword}
      />
      
      <button
        className="w-full py-3 rounded-lg mt-6"
        onClick={handleSetPassword}
        disabled={loading || newPassword.length !== 6}
        style={{
          backgroundColor: loading || newPassword.length !== 6 
            ? theme.colors.neutral[300] 
            : theme.colors.primary.main,
          color: theme.colors.neutral[0]
        }}
      >
        {loading ? '处理中...' : '下一步'}
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
      
      <PasswordDots value={confirmPassword} />
      
      <NumberPad 
        onNumberPress={(num) => setConfirmPassword(prev => prev + num)}
        onDelete={() => setConfirmPassword(prev => prev.slice(0, -1))}
        value={confirmPassword}
      />
      
      <button
        className="w-full py-3 rounded-lg mt-6"
        onClick={handleConfirmPassword}
        disabled={loading || confirmPassword.length !== 6}
        style={{
          backgroundColor: loading || confirmPassword.length !== 6 
            ? theme.colors.neutral[300] 
            : theme.colors.primary.main,
          color: theme.colors.neutral[0]
        }}
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
    <BasePage
      title="支付密码"
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={() => navigate("/my-service")}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle="支付密码"
      backgroundColor="default"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="p-3 rounded-lg mb-4" style={{ 
            backgroundColor: `${theme.colors.error}10`, 
            color: theme.colors.error 
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 rounded-lg mb-4" style={{ 
            backgroundColor: `${theme.colors.success}10`, 
            color: theme.colors.success 
          }}>
            {success}
          </div>
        )}
        
        {renderStepContent()}
      </div>
    </BasePage>
  );
};


export default PaymentPasswordSetting;