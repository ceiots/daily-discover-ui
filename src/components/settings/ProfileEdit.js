import React, { useState, useEffect } from 'react';
import { BasePage, Button, Card } from '../../theme';
import { useNavigate } from 'react-router-dom';
import instance from '../../services/http/instance';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 获取用户资料
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('未登录');
          return;
        }
        const response = await instance.get(`/user/info?userId=${userId}`);
        if (response.data) {
          setNickname(response.data.nickname || '');
          setGender(response.data.gender || '');
          setAvatar(response.data.avatar || '');
        }
      } catch (err) {
        setError('获取资料失败');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('未登录');
        return;
      }
      const payload = {
        id: userId,
        nickname,
        gender,
        avatar
      };
      const response = await instance.post('/user/update', payload);
      if (response.data) {
        setSuccess('资料已保存');
        setTimeout(() => {
          setSuccess('');
          navigate('/settings');
        }, 1500);
      }
    } catch (err) {
      setError('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage
      title="编辑资料"
      showHeader={true}
      headerLeft={<button className="btn" onClick={() => navigate('/settings')}><i className="fas fa-arrow-left"></i></button>}
      headerTitle="编辑资料"
      loading={loading}
      error={error}
    >
      <Card>
        <div className="mb-4">
          <label className="form-label">昵称</label>
          <input className="form-control" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="请输入昵称" />
        </div>
        <div className="mb-4">
          <label className="form-label">性别</label>
          <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">保密</option>
          </select>
        </div>
        {success && <div className="text-success mb-3">{success}</div>}
        <Button block variant="primary" onClick={handleSave}>保存</Button>
      </Card>
    </BasePage>
  );
};

export default ProfileEdit;