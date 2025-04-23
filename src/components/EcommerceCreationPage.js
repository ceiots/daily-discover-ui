import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcommerceCreationPage.css';

const EcommerceCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [],
    details: [],
    specifications: [],
    purchaseNotices: []
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic'); // basic, details, specs, notices

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // 在实际应用中，这里应该上传图片到服务器并获取URL
      // 这里仅做本地预览示例
      const newImages = files.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file
      }));
      
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
    }
  };

  const removeImage = (id) => {
    setFormData({
      ...formData,
      images: formData.images.filter(image => image.id !== id)
    });
  };

  // 添加商品详情
  const addDetail = (type) => {
    const newDetail = {
      id: Date.now(),
      type,
      content: type === 'text' ? '' : null,
      sort: formData.details.length
    };
    setFormData({
      ...formData,
      details: [...formData.details, newDetail]
    });
  };

  // 更新商品详情
  const updateDetail = (id, content) => {
    setFormData({
      ...formData,
      details: formData.details.map(detail => 
        detail.id === id ? { ...detail, content } : detail
      )
    });
  };

  // 删除商品详情
  const removeDetail = (id) => {
    setFormData({
      ...formData,
      details: formData.details.filter(detail => detail.id !== id)
    });
  };

  // 添加规格
  const addSpecification = () => {
    const newSpec = {
      id: Date.now(),
      name: '',
      options: ['']
    };
    setFormData({
      ...formData,
      specifications: [...formData.specifications, newSpec]
    });
  };

  // 更新规格名称
  const updateSpecName = (id, name) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map(spec => 
        spec.id === id ? { ...spec, name } : spec
      )
    });
  };

  // 添加规格选项
  const addSpecOption = (specId) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map(spec => 
        spec.id === specId ? { ...spec, options: [...spec.options, ''] } : spec
      )
    });
  };

  // 更新规格选项
  const updateSpecOption = (specId, index, value) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map(spec => 
        spec.id === specId ? { 
          ...spec, 
          options: spec.options.map((opt, i) => i === index ? value : opt) 
        } : spec
      )
    });
  };

  // 删除规格选项
  const removeSpecOption = (specId, index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map(spec => 
        spec.id === specId ? { 
          ...spec, 
          options: spec.options.filter((_, i) => i !== index) 
        } : spec
      )
    });
  };

  // 删除规格
  const removeSpecification = (id) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter(spec => spec.id !== id)
    });
  };

  // 添加购买须知
  const addPurchaseNotice = () => {
    const newNotice = {
      id: Date.now(),
      title: '',
      content: ''
    };
    setFormData({
      ...formData,
      purchaseNotices: [...formData.purchaseNotices, newNotice]
    });
  };

  // 更新购买须知
  const updatePurchaseNotice = (id, field, value) => {
    setFormData({
      ...formData,
      purchaseNotices: formData.purchaseNotices.map(notice => 
        notice.id === id ? { ...notice, [field]: value } : notice
      )
    });
  };

  // 删除购买须知
  const removePurchaseNotice = (id) => {
    setFormData({
      ...formData,
      purchaseNotices: formData.purchaseNotices.filter(notice => notice.id !== id)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '请输入商品标题';
    }
    if (!formData.price.trim()) {
      newErrors.price = '请输入商品价格';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = '请输入有效的价格';
    }
    if (formData.images.length === 0) {
      newErrors.images = '请上传至少一张商品图片';
    }
    if (!formData.category) {
      newErrors.category = '请选择商品分类';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // 在实际应用中，这里应该提交表单数据到服务器
      console.log('提交的数据:', formData);
      alert('商品创建成功！');
      navigate('/');
    }
  };

  const handleDraft = () => {
    // 保存草稿逻辑
    console.log('保存草稿:', formData);
    alert('草稿已保存！');
  };

  // 商品分类选项
  const categories = [
    { id: 1, name: '服装' },
    { id: 2, name: '电子产品' },
    { id: 3, name: '家居' },
    { id: 4, name: '美妆' },
    { id: 5, name: '食品' },
    { id: 6, name: '母婴' },
    { id: 7, name: '运动' },
    { id: 8, name: '图书' }
  ];

  return (
    <div className="ecommerce-creation-container pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/creation')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">电商创建</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="fixed top-12 left-0 right-0 bg-white z-10 max-w-[375px] mx-auto border-b overflow-x-auto">
        <div className="flex whitespace-nowrap">
          <button 
            className={`px-4 py-3 text-center text-sm font-medium ${activeTab === 'basic' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basic')}
          >
            基本信息
          </button>
          <button 
            className={`px-4 py-3 text-center text-sm font-medium ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            商品详情
          </button>
          <button 
            className={`px-4 py-3 text-center text-sm font-medium ${activeTab === 'specs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('specs')}
          >
            规格参数
          </button>
          <button 
            className={`px-4 py-3 text-center text-sm font-medium ${activeTab === 'notices' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('notices')}
          >
            购买须知
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-24 px-4">
        {/* 基本信息 */}
        {activeTab === 'basic' && (
          <div className="basic-info">
            {/* 商品标题 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">商品标题</label>
              <input
                type="text"
                name="title"
                placeholder="请输入商品标题"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* 商品价格 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">商品价格</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                    <input
                      type="text"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full p-3 pl-8 border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm`}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                    <input
                      type="text"
                      name="originalPrice"
                      placeholder="原价（选填）"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-8 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 商品分类 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">商品分类</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm bg-white`}
              >
                <option value="">请选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* 商品图片 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">商品图片</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.images.map(image => (
                  <div key={image.id} className="relative w-24 h-24">
                    <img src={image.url} alt="" className="w-full h-full object-cover rounded" />
                    <button 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => removeImage(image.id)}
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50">
                  <i className="fas fa-plus text-gray-400 mb-1"></i>
                  <span className="text-xs text-gray-500">添加图片</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">建议上传尺寸800x800像素以上的图片</p>
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            </div>
          </div>
        )}

        {/* 商品详情 */}
        {activeTab === 'details' && (
          <div className="product-details">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium">商品详情</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => addDetail('text')}
                  className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                >
                  <i className="fas fa-font text-xs mr-1"></i>
                  添加文字
                </button>
                <button 
                  onClick={() => addDetail('image')}
                  className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                >
                  <i className="fas fa-image text-xs mr-1"></i>
                  添加图片
                </button>
              </div>
            </div>

            {formData.details.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">点击上方按钮添加商品详情</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.details.map((detail, index) => (
                  <div key={detail.id} className="p-3 bg-gray-50 rounded-lg relative">
                    <button 
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => removeDetail(detail.id)}
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                    
                    {detail.type === 'text' ? (
                      <textarea
                        placeholder="请输入详情文字描述"
                        value={detail.content || ''}
                        onChange={(e) => updateDetail(detail.id, e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded text-sm min-h-[80px]"
                      ></textarea>
                    ) : (
                      <div>
                        {detail.content ? (
                          <div className="relative">
                            <img src={detail.content} alt="" className="w-full rounded" />
                            <button 
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              onClick={() => updateDetail(detail.id, null)}
                            >
                              <i className="fas fa-times text-xs"></i>
                            </button>
                          </div>
                        ) : (
                          <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-white">
                            <i className="fas fa-cloud-upload-alt text-gray-400 mb-1"></i>
                            <span className="text-xs text-gray-500">上传详情图片</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const url = URL.createObjectURL(file);
                                  updateDetail(detail.id, url);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 规格参数 */}
        {activeTab === 'specs' && (
          <div className="specifications">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium">规格参数</h3>
              <button 
                onClick={addSpecification}
                className="px-3 py-1 bg-primary/10 rounded text-xs text-primary flex items-center"
              >
                <i className="fas fa-plus text-xs mr-1"></i>
                添加规格
              </button>
            </div>

            {formData.specifications.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">点击上方按钮添加商品规格</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div key={spec.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        placeholder="规格名称，如颜色、尺寸等"
                        value={spec.name}
                        onChange={(e) => updateSpecName(spec.id, e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded text-sm"
                      />
                      <button 
                        className="ml-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeSpecification(spec.id)}
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      {spec.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
                          <input
                            type="text"
                            placeholder={`选项${optIndex + 1}`}
                            value={option}
                            onChange={(e) => updateSpecOption(spec.id, optIndex, e.target.value)}
                            className="flex-1 p-2 border border-gray-200 rounded text-sm"
                          />
                          {spec.options.length > 1 && (
                            <button 
                              className="ml-2 text-gray-400 hover:text-red-500"
                              onClick={() => removeSpecOption(spec.id, optIndex)}
                            >
                              <i className="fas fa-times text-xs"></i>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => addSpecOption(spec.id)}
                      className="mt-2 px-3 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                    >
                      <i className="fas fa-plus text-xs mr-1"></i>
                      添加选项
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 购买须知 */}
        {activeTab === 'notices' && (
          <div className="purchase-notices">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium">购买须知</h3>
              <button 
                onClick={addPurchaseNotice}
                className="px-3 py-1 bg-primary/10 rounded text-xs text-primary flex items-center"
              >
                <i className="fas fa-plus text-xs mr-1"></i>
                添加须知
              </button>
            </div>

            {formData.purchaseNotices.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">点击上方按钮添加购买须知</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.purchaseNotices.map((notice, index) => (
                  <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        placeholder="须知标题，如退换政策、发货说明等"
                        value={notice.title}
                        onChange={(e) => updatePurchaseNotice(notice.id, 'title', e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded text-sm"
                      />
                      <button 
                        className="ml-2 text-gray-400 hover:text-red-500"
                        onClick={() => removePurchaseNotice(notice.id)}
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                    
                    <textarea
                      placeholder="须知内容详情"
                      value={notice.content}
                      onChange={(e) => updatePurchaseNotice(notice.id, 'content', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded text-sm min-h-[80px] mt-2"
                    ></textarea>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 max-w-[375px] mx-auto">
        <div className="flex gap-3">
          <button 
            onClick={handleDraft}
            className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700"
          >
            保存草稿
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-primary rounded-full text-sm font-medium text-white"
          >
            发布商品
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcommerceCreationPage;
