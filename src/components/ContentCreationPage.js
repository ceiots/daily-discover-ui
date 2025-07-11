import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentCreationPage.css';
import instance from "../services/http/instance";

const ContentCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: []
  });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('editor'); // editor or preview
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 预设标签列表
  const preset_tags = ['旅行', '美食', '生活', '时尚', '运动', '科技', '教育', '健康', '音乐', '宠物'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [];
      
      // 显示上传中状态
      setIsSubmitting(true);
      
      try {
        // 获取token
        const token = localStorage.getItem('token');
        if (!token) {
          alert('未登录，请先登录');
          navigate('/login');
          return;
        }
        
        // 分批上传图片，避免请求体过大
        const BATCH_SIZE = 1; // 每次只上传1张图片
        
        // 分批处理图片上传
        for (let i = 0; i < files.length; i += BATCH_SIZE) {
          const batch = files.slice(i, i + BATCH_SIZE);
          const formData = new FormData();
          
          // 添加当前批次的图片到formData
          batch.forEach(file => {
            formData.append('file', file);
          });
          
          // 发送当前批次的上传请求
          const response = await instance.post('/content/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.code === 200) {
            // 处理成功上传的图片
            if (response.data.data.urls && response.data.data.urls.length > 0) {
              // 将所有成功上传的图片URL添加到图片列表
              response.data.data.urls.forEach(url => {
                newImages.push({
                  id: Date.now() + Math.random(),
                  url: url,
                  remoteUrl: url
                });
              });
            } else if (response.data.data.url) {
              // 兼容旧版API，处理单个URL
              newImages.push({
                id: Date.now() + Math.random(),
                url: response.data.data.url,
                remoteUrl: response.data.data.url
              });
            }
          } else {
            console.error(`批次 ${i + 1} 上传失败:`, response.data.message);
          }
        }
        
        if (newImages.length === 0) {
          throw new Error('所有图片上传失败');
        } else if (newImages.length < files.length) {
          alert(`部分图片上传成功，${files.length - newImages.length}张图片上传失败`);
        }
      } catch (error) {
        console.error('图片上传失败:', error);
        
        // 显示错误消息
        const errorMsg = error.response?.data?.message || error.message || '上传失败，请稍后重试';
        alert(`图片上传失败: ${errorMsg}`);
      } finally {
        // 取消上传中状态
        setIsSubmitting(false);
        
        // 只有成功上传的图片才会添加到列表中
        if (newImages.length > 0) {
          setFormData({
            ...formData,
            images: [...formData.images, ...newImages]
          });
        }
      }
    }
  };

  const removeImage = (id) => {
    setFormData({
      ...formData,
      images: formData.images.filter(image => image.id !== id)
    });
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addNewTag = () => {
    const tag = prompt('请输入新标签名称');
    if (tag && tag.trim() && !preset_tags.includes(tag) && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setSelectedTags([...selectedTags, tag]);
    }
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

  const handleSubmit = async () => {
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // 获取token
        const token = localStorage.getItem('token');
        if (!token) {
          alert('未登录，请先登录');
          navigate('/login');
          return;
        }
        
        // 构建请求数据
        const contentDto = {
          title: formData.title,
          content: formData.content,
          images: formData.images.map(img => img.remoteUrl || img.url),
          tags: selectedTags,
          status: 1 // 已发布状态
        };
        
        // 发送请求
        const response = await instance.post('/content/save', contentDto, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.code === 200) {
          alert('内容发布成功！');
          navigate('/');
        } else {
          alert(`发布失败: ${response.data.message || '未知错误'}`);
        }
      } catch (error) {
        console.error('发布内容失败:', error);
        alert(`发布失败: ${error.response?.data?.message || error.message || '未知错误'}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDraft = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        // 获取token
        const token = localStorage.getItem('token');
        if (!token) {
          alert('未登录，请先登录');
          navigate('/login');
          return;
        }
        
        // 构建请求数据
        const contentDto = {
          title: formData.title || '无标题草稿',
          content: formData.content,
          images: formData.images.map(img => img.remoteUrl || img.url),
          tags: selectedTags,
          status: 0 // 草稿状态
        };
        
        // 发送请求
        const response = await instance.post('/content/draft', contentDto, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.code === 200) {
          alert('草稿保存成功！');
        } else {
          alert(`保存失败: ${response.data.message || '未知错误'}`);
        }
      } catch (error) {
        console.error('保存草稿失败:', error);
        alert(`保存失败: ${error.response?.data?.message || error.message || '未知错误'}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="content-creation-container pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/')} 
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
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
                <label className={`w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer ${isSubmitting ? 'opacity-50' : 'bg-gray-50'}`}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-gray-400 mb-1"></i>
                      <span className="text-xs text-gray-500">上传中...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus text-gray-400 mb-1"></i>
                      <span className="text-xs text-gray-500">添加图片</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={formData.images.length >= 9 || isSubmitting}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">最多可上传9张图片</p>
            </div>

            {/* 标签选择 */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">添加标签</p>
              <div className="flex flex-wrap gap-2">
                {preset_tags.map(tag => (
                  <button 
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs ${selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
                {tags.map(tag => (
                  <button 
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs ${selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
                <button 
                  className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary"
                  onClick={addNewTag}
                >
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

            {selectedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {tag}
                  </span>
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
            disabled={isSubmitting}
            className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : '保存草稿'}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-primary rounded-full text-sm font-medium text-white disabled:opacity-50"
          >
            {isSubmitting ? '发布中...' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreationPage;
