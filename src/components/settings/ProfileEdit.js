import React, { useState } from 'react';
import { BasePage, Button, Card } from '../../theme';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    // 这里应调用后端API保存资料
    setSuccess('资料已保存');
    setTimeout(() => {
      setSuccess('');
      navigate('/settings');
    }, 1500);
  };

  return (
    <BasePage
      title="编辑资料"
      showHeader={true}
      headerLeft={<button className="btn" onClick={() => navigate('/settings')}><i className="fas fa-arrow-left"></i></button>}
      headerTitle="编辑资料"
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
        <div className="mb-4">
          <label className="form-label">头像</label>
          <input className="form-control" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="头像图片URL" />
        </div>
        {success && <div className="text-success mb-3">{success}</div>}
        <Button block variant="primary" onClick={handleSave}>保存</Button>
      </Card>
    </BasePage>
  );
};

export default ProfileEdit;
