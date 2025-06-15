import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import instance from '../../services/http/instance';
import './MyShopPage.css';

const ShopCreationPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    shopName: '',
    shopLogo: null,
    shopDescription: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [shop, setShop] = useState(null);

  // 图片大小限制 (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 检查用户是否已有店铺
  useEffect(() => {
    const checkUserShop = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await instance.get('/shop/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.code === 200 && response.data.data) {
          setHasShop(true);
          setShop(response.data.data);

          // 如果已有店铺，设置表单数据为当前店铺信息
          setFormData({
            shopName: response.data.data.shopName || '',
            shopLogo: null,
            shopDescription: response.data.data.shopDescription || '',
            contactPhone: response.data.data.contactPhone || '',
            contactEmail: response.data.data.contactEmail || ''
          });

          // 设置预览图
          if (response.data.data.shopLogo) {
            setPreviewLogo(response.data.data.shopLogo);
          }
        }
      } catch (error) {
        console.error('获取店铺信息失败：', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      checkUserShop();
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      setErrors({
        ...errors,
        logo: `图片大小不能超过5MB，当前大小: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      });
      return;
    }

    // 清除错误
    const newErrors = {...errors};
    delete newErrors.logo;
    setErrors(newErrors);

    setFormData({
      ...formData,
      shopLogo: file
    });

    // 创建本地预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shopName.trim()) {
      newErrors.shopName = '请输入店铺名称';
    }

    // 验证手机号格式（如果有填写）
    if (formData.contactPhone && !/^1[3-9]\d{9}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = '请输入有效的手机号码';
    }

    // 验证邮箱格式（如果有填写）
    if (formData.contactEmail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contactEmail)) {
      newErrors.contactEmail = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        // 先上传图片（如果有）
        let logoUrl = null;
        if (formData.shopLogo) {
          try {
            // 创建一个单独的FormData只包含图片
            const logoFormData = new FormData();
            logoFormData.append('file', formData.shopLogo);

            // 上传图片到店铺logo上传接口
            const logoResponse = await instance.post('/shop/upload-logo', logoFormData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
              timeout: 30000 // 30秒超时
            });

            if (logoResponse.data && logoResponse.data.code === 200) {
              // 获取上传后的图片URL
              logoUrl = logoResponse.data.data;
            } else {
              throw new Error(logoResponse.data?.message || '图片上传失败');
            }
          } catch (uploadError) {
            console.error('Logo上传失败:', uploadError);
            setErrors({ general: '店铺Logo上传失败，请稍后重试' });
            setLoading(false);
            return;
          }
        }

        // 创建不包含图片的FormData对象
        const shopData = new FormData();
        shopData.append('shopName', formData.shopName);
        shopData.append('shopDescription', formData.shopDescription || '');
        shopData.append('contactPhone', formData.contactPhone || '');
        shopData.append('contactEmail', formData.contactEmail || '');

        // 如果有上传成功的图片URL，使用URL而不是文件
        if (logoUrl) {
          shopData.append('shopLogoUrl', logoUrl); // 后端需要支持通过URL接收图片
        }

        // 根据是否已有店铺决定是创建还是更新
        const endpoint = hasShop ? `/shop/${shop.id}` : '/shop';
        const method = hasShop ? 'put' : 'post';

        try {
          const response = await instance({
            method,
            url: endpoint,
            data: shopData,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            timeout: 15000 // 15秒超时
          });

          if (response.data && response.data.code === 200) {
            // 根据跳转来源决定跳转目标
            const redirectURL = localStorage.getItem('shopRedirect') || '/my-service';
            localStorage.removeItem('shopRedirect');
            navigate(redirectURL);
          } else {
            setErrors({ general: response.data?.message || '操作失败' });
          }
        } catch (error) {
          console.error('API请求失败:', error);

          let errorMessage = '保存店铺数据失败，请稍后重试';

          // 检查是否为文件大小超限制错误
          if (error.response && error.response.status === 413) {
            errorMessage = '请求数据过大，请减少输入内容或使用较小的图片';
          }

          setErrors({ general: errorMessage });
        }
      } catch (error) {
        console.error('表单提交失败:', error);
        setErrors({ general: '表单处理失败，请检查输入并重试' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="shop-creation-page pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">{hasShop ? '编辑店铺' : '创建店铺'}</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-16 px-4 pb-6">
        {/* 错误提示 */}
        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {errors.general}
          </div>
        )}

        {/* 表单区域 */}
        <div className="space-y-4">
          {/* 店铺Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2 overflow-hidden relative">
              {previewLogo ? (
                <img src={previewLogo} alt="店铺Logo" className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-store text-gray-400 text-3xl"></i>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleLogoUpload}
              />
            </div>
            <p className="text-sm text-gray-500">点击上传店铺Logo</p>
            {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
            <p className="text-xs text-gray-400 mt-1">建议上传不超过5MB的图片</p>
          </div>

          {/* 店铺名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">店铺名称 <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              placeholder="请输入店铺名称"
              className={`w-full p-3 border ${errors.shopName ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
            />
            {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
          </div>

          {/* 店铺简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">店铺简介</label>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleInputChange}
              placeholder="介绍一下你的店铺..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm min-h-[100px]"
            ></textarea>
          </div>

          {/* 联系电话 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="请输入联系电话"
              className={`w-full p-3 border ${errors.contactPhone ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
            />
            {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
          </div>

          {/* 联系邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="请输入联系邮箱"
              className={`w-full p-3 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
            />
            {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 max-w-[375px] mx-auto">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-primary rounded-lg text-sm font-medium text-white"
          disabled={loading}
        >
          {loading ? '保存中...' : (hasShop ? '保存修改' : '创建店铺')}
        </button>
      </div>
    </div>
  );
};

export default ShopCreationPage;