import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../../utils/axios";
import { BasePage } from "../../theme";

const EditAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, currentAddress } = location.state || {
    userId: null,
    currentAddress: null,
  };

  const [address, setAddress] = useState(
    currentAddress || {
      id: null,
      userId: userId,
      name: "",
      phone: "",
      address: "",
      // 修改这里，将 isDefault 默认设置为 true
      isDefault: true,
      province: "",
      city: "",
      district: "",
      detailAddress: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("province");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // 获取省份列表，直接从后端获取
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

  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    if (!address.name.trim()) newErrors.name = "请输入收货人姓名";
    if (!address.phone.trim()) newErrors.phone = "请输入联系电话";
    if (!/^1[3-9]\d{9}$/.test(address.phone))
      newErrors.phone = "请输入正确的手机号码";
    if (!address.address.trim()) newErrors.address = "请输入详细地址";
    if (!address.province) newErrors.region = "请选择所在地区";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = address.id ? "/orderAddr/update" : "/orderAddr/save";

      const addrData = {
        orderAddrId: address.id,
        userId: address.userId,
        name: address.name,
        phone: address.phone,
        address: address.address,
        province: address.province,
        city: address.city,
        district: address.district,
        isDefault: address.isDefault ? 1 : 0,
      };

      const response = await instance.post(endpoint, addrData);
      if (response.data.code === 200) {
        navigate(-1); // 返回上一页
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
    setAddress({ ...address, isDefault: !address.isDefault });
  };

  // 处理返回
  const handleBack = () => {
    if (showRegionPicker) {
      setShowRegionPicker(false);
    } else {
      if (location.state && location.state.onBack) {
        location.state.onBack();
      }
      navigate(-1);
    }
  };

  // 打开地区选择器
  const openRegionPicker = () => {
    setShowRegionPicker(true);

    if (address.province) {
      const province = provinces.find((p) => p.name === address.province);
      if (province) {
        setSelectedProvince(province);
        setActiveTab("city");

        if (address.city) {
          const city = cities.find((c) => c.name === address.city);
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
    setActiveTab("city");
    handleProvinceChange(province.code);
  };

  // 选择城市
  const selectCity = (city) => {
    setSelectedCity(city);
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
    setAddress({
      ...address,
      province: selectedProvince.name,
      city: selectedCity.name,
      district: district.name,
    });
    setShowRegionPicker(false);
  };

  return (
    <BasePage
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={() => navigate("/profile")}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle={
        showRegionPicker ? "选择地区" : address.id ? "编辑地址" : "新增地址"
      }
      backgroundColor="#7467f0"
    >
      {/* 主内容区 */}
      {!showRegionPicker ? (
        <main className="pt-14 pb-20 px-4">
          <div className="bg-white rounded-lg mt-3">
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">收货人</label>
              <input
                type="text"
                placeholder="请输入姓名"
                value={address.name}
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
                className={`border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } p-2.5 rounded-lg w-full text-sm`}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">{errors.name}</span>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">
                手机号码
              </label>
              <input
                type="tel"
                placeholder="请输入手机号码"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
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

            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">
                所在地区
              </label>
              <div
                className={`flex items-center border ${
                  errors.region ? "border-red-500" : "border-gray-300"
                } p-2.5 rounded-lg`}
                onClick={openRegionPicker}
              >
                <input
                  type="text"
                  placeholder="选择省/市/区"
                  value={`${address.province || ""} ${address.city || ""} ${
                    address.district || ""
                  }`.trim()}
                  className="flex-1 outline-none text-sm"
                  readOnly
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              {errors.region && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.region}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">
                详细地址
              </label>
              <textarea
                placeholder="请输入详细地址，如街道、门牌号等"
                value={address.address}
                onChange={(e) =>
                  setAddress({ ...address, address: e.target.value })
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

            <div className="mt-3 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-600">设为默认收货地址</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={address.isDefault}
                  onChange={toggleDefaultAddress}
                  className="sr-only peer"
                />
                <div
                  className={`w-10 h-5 rounded-full peer ${
                    address.isDefault ? "bg-[#7467f0]" : "bg-gray-200"
                  } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}
                ></div>
              </label>
            </div>
          </div>
        </main>
      ) : (
        <main className="pt-14 pb-20 px-0">
          <div className="bg-white h-screen">
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
                {address.district || "请选择区县"}
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
                      address.district === district.name
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
        </main>
      )}
      {/* 底部保存按钮 */}
      {!showRegionPicker && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 shadow-md max-w-[375px] mx-auto">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#7467f0] text-white rounded-full text-sm font-medium"
          >
            保存地址
          </button>
        </div>
      )}
    </BasePage>
  );
};

export default EditAddress;
