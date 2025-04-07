import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import { useAuth } from "../App";

const AddressList = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // 获取地址列表
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userInfo || !userInfo.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await instance.get(`/orderAddr/list/${userInfo.id}`);
        if (response.data.code === 200) {
          setAddresses(response.data.data || []);
          
          // 如果有默认地址，则选中
          const defaultAddress = response.data.data.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          }
        }
      } catch (error) {
        console.error("获取地址列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userInfo]);

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 编辑地址
  const handleEdit = (address) => {
    navigate("/edit-address", { 
      state: { 
        userId: userInfo.id, 
        currentAddress: address 
      } 
    });
  };

  // 新增地址
  const handleAddNew = () => {
    navigate("/edit-address", { 
      state: { 
        userId: userInfo.id, 
        currentAddress: null 
      } 
    });
  };

  // 删除地址
  const handleDelete = async (addressId) => {
    if (window.confirm("确认删除这个地址吗？")) {
      try {
        const response = await instance.delete(`/orderAddr/delete/${addressId}`);
        if (response.data.code === 200) {
          setAddresses(addresses.filter(addr => addr.id !== addressId));
        } else {
          alert("删除失败: " + response.data.message);
        }
      } catch (error) {
        console.error("删除地址失败:", error);
        alert("删除地址请求失败，请稍后重试");
      }
    }
  };

  // 设为默认地址
  const handleSetDefault = async (addressId) => {
    try {
      const response = await instance.post(`/orderAddr/setDefault`, { 
        userId: userInfo.id, 
        addressId 
      });
      
      if (response.data.code === 200) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })));
      } else {
        alert("设置默认地址失败: " + response.data.message);
      }
    } catch (error) {
      console.error("设置默认地址失败:", error);
      alert("设置默认地址请求失败，请稍后重试");
    }
  };

  // 选择地址
  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    // 如果是从订单页面跳转来的，选择后返回
    if (location.state && location.state.fromOrder) {
      const selectedAddress = addresses.find(addr => addr.id === addressId);
      navigate(-1, { state: { selectedAddress } });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-[375px] mx-auto bg-white min-h-screen relative">
        {/* 顶部导航栏 */}
        <nav className="fixed top-0 left-0 right-0 bg-[#7366ff] text-white p-4 flex items-center justify-between z-10">
          <button className="text-xl" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium tracking-wide">收货地址</h1>
          <div className="w-6"></div>
        </nav>

        {/* 主内容区 */}
        <main className="pt-16 pb-24 px-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7366ff]"></div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-map-marker-alt text-4xl"></i>
              </div>
              <p className="text-gray-500">暂无收货地址</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`bg-white rounded-lg p-4 border ${selectedAddressId === address.id ? 'border-[#7366ff]' : 'border-gray-200'}`}
                  onClick={() => handleSelectAddress(address.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{address.name}</span>
                        <span className="ml-2 text-gray-600">{address.phone}</span>
                        {address.isDefault && (
                          <span className="ml-2 text-xs text-white bg-[#7366ff] px-2 py-0.5 rounded-full">
                            默认
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 mt-2">
                        {`${address.province || ''} ${address.city || ''} ${address.district || ''} ${address.address}`}
                      </div>
                    </div>
                    <button 
                      className="text-gray-500 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                    <button 
                      className="text-sm text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address.id);
                      }}
                    >
                      <i className="fas fa-trash-alt mr-1"></i> 删除
                    </button>
                    
                    {!address.isDefault && (
                      <button 
                        className="text-sm text-[#7366ff]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address.id);
                        }}
                      >
                        <i className="fas fa-check-circle mr-1"></i> 设为默认
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* 底部添加按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
          <button
            onClick={handleAddNew}
            className="w-full py-3 bg-[#7366ff] text-white rounded-full font-medium"
          >
            新增收货地址
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressList; 