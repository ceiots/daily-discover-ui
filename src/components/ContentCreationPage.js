import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentCreationPage.css';

const ContentCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('editor'); // editor or preview

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '请输入标题';
    }
    if (!formData.content.trim() && formData.images.length === 0) {
      newErrors.content = '请输入内容或上传图片';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // 在实际应用中，这里应该提交表单数据到服务器
      console.log('提交的数据:', formData);
      alert('内容创建成功！');
      navigate('/');
    }
  };

  const handleDraft = () => {
    // 保存草稿逻辑
    console.log('保存草稿:', formData);
    alert('草稿已保存！');
  };

  return (
    <div className="content-creation-container pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/creation')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">图文创作</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 编辑/预览切换标签 */}
      <div className="fixed top-12 left-0 right-0 bg-white z-10 max-w-[375px] mx-auto border-b">
        <div className="flex">
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'editor' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('editor')}
          >
            编辑
          </button>
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('preview')}
          >
            预览
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-24 px-4">
        {activeTab === 'editor' ? (
          <div className="editor-container">
            {/* 标题输入 */}
            <div className="mb-4">
              <input
                type="text"
                name="title"
                placeholder="请输入标题"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-200'} rounded-lg text-base`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* 内容输入 */}
            <div className="mb-4">
              <textarea
                name="content"
                placeholder="请输入正文内容..."
                value={formData.content}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.content ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm min-h-[200px]`}
              ></textarea>
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            </div>

            {/* 图片上传区域 */}
            <div className="mb-4">
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
              <p className="text-xs text-gray-500">最多可上传9张图片</p>
            </div>

            {/* 标签选择 */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">添加标签</p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  旅行
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  美食
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  生活
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  时尚
                </button>
                <button className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary">
                  <i className="fas fa-plus text-xs mr-1"></i>
                  添加
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="preview-container">
            {formData.title ? (
              <h1 className="text-xl font-bold mb-4">{formData.title}</h1>
            ) : (
              <div className="text-xl font-bold mb-4 text-gray-300">请输入标题</div>
            )}
            
            {formData.images.length > 0 && (
              <div className="mb-4">
                <div className={`grid ${formData.images.length === 1 ? '' : 'grid-cols-2'} gap-2`}>
                  {formData.images.map((image, index) => (
                    <img 
                      key={image.id} 
                      src={image.url} 
                      alt="" 
                      className={`w-full rounded-lg ${formData.images.length === 1 ? 'max-h-[200px] object-contain' : 'h-32 object-cover'}`} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {formData.content ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{formData.content}</div>
            ) : (
              <div className="text-sm text-gray-300">请输入正文内容...</div>
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
            发布
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreationPage;
