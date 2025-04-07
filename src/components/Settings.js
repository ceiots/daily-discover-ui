import React, { useState } from 'react';
import { useAuth } from '../App';
import instance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    const userId = localStorage.getItem('userId');
    try {
      const response = await instance.post('/user/change-password', {
        oldPassword,
        newPassword,
        confirmPassword
      }, {
        headers: {
          userId: userId
        }
      });
      setSuccess('密码修改成功');
      setError('');
      // 清空输入框
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // 3秒后隐藏修改密码表单
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(error.response?.data || '修改密码失败');
    }
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await instance.post('/user/logout', null, {
        headers: {
          userId: userId
        }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userInfo');
      refreshUserInfo();
      navigate('/');
      window.location.reload(); // 强制刷新页面
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* 添加返回按钮 */}
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <i className="ri-arrow-left-s-line text-xl mr-2"></i>
            <span>返回</span>
          </button>
        </div>
        
        <h2 className="text-lg font-medium mb-4">设置</h2>
        
        {/* 修改密码部分 */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            <span className="text-base">修改密码</span>
            <i className={`ri-arrow-${showChangePassword ? 'up' : 'down'}-s-line`}></i>
          </div>
          
          {showChangePassword && (
            <div className="mt-4 space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="请输入旧密码"
                  className="w-full p-2 border rounded"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="请输入新密码"
                  className="w-full p-2 border rounded"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="请确认新密码"
                  className="w-full p-2 border rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
              <button
                className="w-full bg-primary text-white py-2 rounded"
                onClick={handleChangePassword}
              >
                确认修改
              </button>
            </div>
          )}
        </div>

        {/* 退出登录按钮 */}
        <div className="border-t pt-4">
          <button
            className="w-full bg-red-500 text-white py-2 rounded"
            onClick={handleLogout}
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;