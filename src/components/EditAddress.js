import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../utils/axios";

const EditAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, currentAddress } = location.state;

  const [address, setAddress] = useState(currentAddress);

  const handleSubmit = async () => {
    try {
      const response = await instance.post('/orderAddr/update', address);
      if (response.data.code === 200) {
        navigate(-1); // 返回上一页
      } else {
        alert('地址更新失败: ' + response.data.message);
      }
    } catch (error) {
      console.error('地址更新请求失败:', error);
      alert('地址更新请求失败，请稍后重试');
    }
  };

  return (
    <div className="bg-white p-4">
      <h2 className="text-lg font-medium mb-4">编辑地址</h2>
      <input
        type="text"
        placeholder="姓名"
        value={address.name}
        onChange={(e) => setAddress({ ...address, name: e.target.value })}
        className="border border-gray-300 p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="电话"
        value={address.phone}
        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        className="border border-gray-300 p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="地址"
        value={address.address}
        onChange={(e) => setAddress({ ...address, address: e.target.value })}
        className="border border-gray-300 p-2 mb-4 w-full"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        保存地址
      </button>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 ml-2 border border-gray-300 rounded"
      >
        取消
      </button>
    </div>
  );
};

export default EditAddress;