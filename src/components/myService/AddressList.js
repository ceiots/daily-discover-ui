import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../services/http/instance";
import { useAuth } from "../../hooks/useAuth";
import { BasePage } from "../../theme";
import { FaMapMarkerAlt, FaEdit, FaTrashAlt, FaCheckCircle, FaTimes, FaChevronRight } from "react-icons/fa";

const AddressList = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // 地址编辑相关状态
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    id: null,
    userId: null,
    name: "",
    phone: "",
    address: "",
    isDefault: true,
    province: "",
    city: "",
    district: "",
  });
  const [errors, setErrors] = useState({});
  
  // 省市区选择相关状态
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("province");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // 获取地址列表
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userInfo || !userInfo.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await instance.get(`/address/getAllByUserId?userId=${userInfo.id}`);
        // 确保addresses始终是数组
        let addrList = response.data.data;
        if (!addrList || !Array.isArray(addrList)) {
          addrList = [];
          console.warn("地址列表数据格式不正确，已转换为空数组");
        }
        setAddresses(addrList);
        // 如果有默认地址，则选中
        const defaultAddress = addrList.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (error) {
        console.error("获取地址列表失败:", error);
        setAddresses([]);  // 确保错误时也设置为空数组
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userInfo]);

  // 获取省份列表
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await instance.get("/regions/provinces");
        setProvinces(response.data);
      } catch (error) {
        console.error("获取省份列表失败:", error);
      }
    };

    fetchProvinces();
  }, []);

  // 选择省份后获取城市
  const handleProvinceChange = async (provinceCode) => {
    try {
      const response = await instance.get(
        `/regions/cities?provinceCode=${provinceCode}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("获取城市列表失败:", error);
    }
  };

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 编辑地址 - 打开弹窗
  const handleEdit = (address) => {
    setCurrentAddress(address);
    setShowAddressModal(true);
    
    // 如果有省市区信息，预先设置选中状态
    if (address.province) {
      const province = provinces.find(p => p.name === address.province);
      if (province) {
        setSelectedProvince(province);
        handleProvinceChange(province.code);
      }
    }
  };

  // 新增地址 - 打开弹窗
  const handleAddNew = () => {
    setCurrentAddress({
      id: null,
      userId: userInfo.id,
      name: "",
      phone: "",
      address: "",
      isDefault: true,
      province: "",
      city: "",
      district: "",
    });
    setShowAddressModal(true);
    setErrors({});
  };

  // 关闭地址编辑弹窗
  const handleCloseModal = () => {
    setShowAddressModal(false);
    setShowRegionPicker(false);
    setErrors({});
  };

  // 删除地址
  const handleDelete = async (addressId) => {
    if (window.confirm("确认删除这个地址吗？")) {
      try {
        const response = await instance.delete(`/address/delete/${addressId}`);
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
      const response = await instance.post(`/address/setDefault`, null, { 
        params: { userId: userInfo.id, userAddressId: addressId }
      });
      
      if (response.data.code === 200) {
        // 重新获取地址列表
        const refreshResponse = await instance.get(`/address/getAllByUserId?userId=${userInfo.id}`);
        let addrList = refreshResponse.data.data;
        if (!addrList || !Array.isArray(addrList)) {
          addrList = [];
          console.warn("地址列表数据格式不正确，已转换为空数组");
        }
        setAddresses(addrList);
      } else {
        alert("设置默认地址失败: " + response.data.message);
      }
    } catch (error) {
      console.error("设置默认地址失败:", error);
      alert("设置默认地址请求失败，请稍后重试");
    }
  };

  // 选择地址
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };
  
  // 打开地区选择器
  const openRegionPicker = () => {
    setShowRegionPicker(true);

    if (currentAddress.province) {
      const province = provinces.find((p) => p.name === currentAddress.province);
      if (province) {
        setSelectedProvince(province);
        setActiveTab("city");
        handleProvinceChange(province.code);

        if (currentAddress.city) {
          const city = cities.find((c) => c.name === currentAddress.city);
          if (city) {
            setSelectedCity(city);
            setActiveTab("district");
          }
        }
      }
    }
  };

  // 选择省份
  const selectProvince = (province) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    setDistricts([]);
    setCurrentAddress(prev => ({
      ...prev,
      province: province.name,
      city: "",
      district: ""
    }));
    setActiveTab("city");
    handleProvinceChange(province.code);
  };

  // 选择城市
  const selectCity = (city) => {
    setSelectedCity(city);
    setDistricts([]);
    setCurrentAddress(prev => ({
      ...prev,
      city: city.name,
      district: ""
    }));
    setActiveTab("district");
    // 获取区县列表
    const fetchDistricts = async () => {
      try {
        const response = await instance.get(
          `/regions/districts?cityCode=${city.code}`
        );
        setDistricts(response.data);
      } catch (error) {
        console.error("获取区县列表失败:", error);
      }
    };
    fetchDistricts();
  };

  // 选择区县
  const selectDistrict = (district) => {
    setCurrentAddress({
      ...currentAddress,
      province: selectedProvince.name,
      city: selectedCity.name,
      district: district.name,
    });
    setShowRegionPicker(false);
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    if (!currentAddress.name.trim()) newErrors.name = "请输入收货人姓名";
    if (!currentAddress.phone.trim()) newErrors.phone = "请输入联系电话";
    if (!/^1[3-9]\d{9}$/.test(currentAddress.phone))
      newErrors.phone = "请输入正确的手机号码";
    if (!currentAddress.address.trim()) newErrors.address = "请输入详细地址";
    if (!currentAddress.province) newErrors.region = "请选择所在地区";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交地址表单
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = currentAddress.id ? "/address/update" : "/address/save";

      const addrData = {
        id: currentAddress.id,
        userId: currentAddress.userId,
        name: currentAddress.name,
        phone: currentAddress.phone,
        address: currentAddress.address,
        province: currentAddress.province,
        city: currentAddress.city,
        district: currentAddress.district,
        isDefault: currentAddress.isDefault ? 1 : 0,
      };
      
     
      const response = await instance.post(endpoint, addrData);
      if (response.data.code === 200) {
        // 重新获取地址列表
        const refreshResponse = await instance.get(`/address/getAllByUserId?userId=${userInfo.id}`);
        let addrList = refreshResponse.data.data;
        if (!addrList || !Array.isArray(addrList)) {
          addrList = [];
          console.warn("地址列表数据格式不正确，已转换为空数组");
        }
        setAddresses(addrList);
        setShowAddressModal(false);
      } else {
        alert("地址保存失败: " + response.data.message);
      }
    } catch (error) {
      console.error("地址保存请求失败:", error);
      alert("地址保存请求失败，请稍后重试");
    }
  };

  // 处理是否设为默认地址
  const toggleDefaultAddress = () => {
    setCurrentAddress({ ...currentAddress, isDefault: !currentAddress.isDefault });
  };

  
  return (
    <BasePage
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle="收货地址"
      backgroundColor="default"
    >
      {/* 主内容区 */}
      <main className="pt-5 pb-5 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7467f0]"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-4">
              <FaMapMarkerAlt className="text-4xl mx-auto" />
            </div>
            <p className="text-gray-500">暂无收货地址</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`bg-white rounded-lg p-4 border ${selectedAddressId === address.id ? 'border-[#7467f0]' : 'border-gray-200'}`}
                onClick={() => handleSelectAddress(address.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{address.name}</span>
                      <span className="ml-2 text-gray-600">{address.phone}</span>
                      {address.isDefault && (
                        <span className="ml-2 text-xs text-white bg-[#7467f0] px-2 py-0.5 rounded-full">
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
                    <FaEdit />
                  </button>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                  <button 
                    className="text-sm text-gray-600 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address.id);
                    }}
                  >
                    <FaTrashAlt className="mr-1" /> 删除
                  </button>
                  
                  {!address.isDefault && (
                    <button 
                      className="text-sm text-[#7467f0] flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address.id);
                      }}
                    >
                      <FaCheckCircle className="mr-1" /> 设为默认
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 底部添加按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 max-w-[375px] mx-auto">
        <button
          onClick={handleAddNew}
          className="w-full py-3 bg-[#7467f0] text-white rounded-full font-medium"
        >
          新增收货地址
        </button>
      </div>
      
      {/* 地址编辑弹窗 */}
      {showAddressModal && !showRegionPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {currentAddress.id ? "编辑地址" : "新增地址"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500">
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-gray-500 mb-1">收货人</label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  value={currentAddress.name}
                  onChange={(e) =>
                    setCurrentAddress({ ...currentAddress, name: e.target.value })
                  }
                  className={`border ${errors.name ? "border-red-500" : "border-gray-300"} p-2.5 rounded-lg w-full`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  手机号码
                </label>
                <input
                  type="tel"
                  placeholder="请输入手机号码"
                  value={currentAddress.phone}
                  onChange={(e) =>
                    setCurrentAddress({ ...currentAddress, phone: e.target.value })
                  }
                  className={`border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } p-2.5 rounded-lg w-full text-sm`}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  所在地区
                </label>
                <div
                  className={`flex items-center justify-between border ${
                    errors.region ? "border-red-500" : "border-gray-300"
                  } p-2.5 rounded-lg`}
                  onClick={openRegionPicker}
                >
                  <input
                    type="text"
                    placeholder="选择省/市/区"
                    value={`${currentAddress.province || ""} ${currentAddress.city || ""} ${
                      currentAddress.district || ""
                    }`.trim()}
                    className="flex-1 outline-none text-sm"
                    readOnly
                  />
                  <FaChevronRight className="text-gray-400" />
                </div>
                {errors.region && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.region}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  详细地址
                </label>
                <textarea
                  placeholder="请输入详细地址，如街道、门牌号等"
                  value={currentAddress.address}
                  onChange={(e) =>
                    setCurrentAddress({ ...currentAddress, address: e.target.value })
                  }
                  className={`border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } p-2.5 rounded-lg w-full h-16 text-sm`}
                />
                {errors.address && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.address}
                  </span>
                )}
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-xs text-gray-600">设为默认收货地址</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentAddress.isDefault}
                    onChange={toggleDefaultAddress}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-10 h-5 rounded-full peer ${
                      currentAddress.isDefault ? "bg-[#7467f0]" : "bg-gray-200"
                    } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}
                  ></div>
                </label>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-[#7467f0] text-white rounded-full text-sm font-medium"
              >
                保存地址
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 地区选择弹窗 */}
      {showAddressModal && showRegionPicker && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <button 
              onClick={() => setShowRegionPicker(false)} 
              className="text-gray-500"
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-medium">选择地区</h3>
            <div className="w-6"></div>
          </div>
          
          <div>
            {/* 选项卡 */}
            <div className="flex border-b text-xs">
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "province"
                    ? "text-[#7467f0] border-b-2 border-[#7467f0]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("province")}
              >
                {selectedProvince ? selectedProvince.name : "请选择省份"}
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "city"
                    ? "text-[#7467f0] border-b-2 border-[#7467f0]"
                    : "text-gray-500"
                } ${!selectedProvince ? "opacity-50" : ""}`}
                onClick={() => selectedProvince && setActiveTab("city")}
                disabled={!selectedProvince}
              >
                {selectedCity ? selectedCity.name : "请选择城市"}
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "district"
                    ? "text-[#7467f0] border-b-2 border-[#7467f0]"
                    : "text-gray-500"
                } ${!selectedCity ? "opacity-50" : ""}`}
                onClick={() => selectedCity && setActiveTab("district")}
                disabled={!selectedCity}
              >
                {currentAddress.district || "请选择区县"}
              </button>
            </div>

            {/* 列表区域 */}
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {activeTab === "province" &&
                provinces.map((province) => (
                  <div
                    key={province.code}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      selectedProvince?.code === province.code
                        ? "text-[#7467f0] font-medium"
                        : ""
                    }`}
                    onClick={() => selectProvince(province)}
                  >
                    {province.name}
                  </div>
                ))}

              {activeTab === "city" &&
                cities.map((city) => (
                  <div
                    key={city.code}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      selectedCity?.code === city.code
                        ? "text-[#7467f0] font-medium"
                        : ""
                    }`}
                    onClick={() => selectCity(city)}
                  >
                    {city.name}
                  </div>
                ))}

              {activeTab === "district" &&
                districts.map((district) => (
                  <div
                    key={district.code}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      currentAddress.district === district.name
                        ? "text-[#7467f0] font-medium"
                        : ""
                    }`}
                    onClick={() => selectDistrict(district)}
                  >
                    {district.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default AddressList; 