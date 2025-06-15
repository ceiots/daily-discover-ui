import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import instance from '../../services/http/instance';
import PropTypes from 'prop-types';
import './MyContentPage.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MyContentPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1); // 1-已发布，0-草稿
  const [selectedContent, setSelectedContent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 获取内容数据
  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await instance.get(`/content/list?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setContents(response.data.data || []);
      } else {
        setError(response.data?.message || '获取内容失败');
      }
    } catch (error) {
      console.error('获取内容列表失败：', error);
      setError('获取内容列表失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  }, [activeTab, navigate]);

  // 组件加载时获取内容
  useEffect(() => {    
    if (isLoggedIn) {
      fetchContents();
    }
  }, [activeTab, isLoggedIn, fetchContents]);

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 处理内容点击事件
  const handleContentClick = (content) => {
    setSelectedContent(content);
    setEditedContent({
      title: content.title,
      content: content.content,
      tags: content.tags
    });
    setIsDetailOpen(true);
    setIsEditMode(false);
  };

  // 处理编辑按钮点击
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!selectedContent || !editedContent.title) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const contentDto = {
        id: selectedContent.id,
        title: editedContent.title,
        content: editedContent.content,
        images: selectedContent.images,
        tags: editedContent.tags || selectedContent.tags,
        status: activeTab
      };
      
      const response = await instance.post('/content/save', contentDto, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        // 更新列表
        const updatedContents = contents.map(item => 
          item.id === selectedContent.id 
            ? { 
                ...item, 
                title: editedContent.title, 
                content: editedContent.content,
                tags: editedContent.tags || item.tags
              } 
            : item
        );
        
        setContents(updatedContents);
        setSelectedContent({
          ...selectedContent,
          title: editedContent.title,
          content: editedContent.content,
          tags: editedContent.tags || selectedContent.tags
        });
        setIsEditMode(false);
        setIsDetailOpen(false);
        
        // 重新加载内容列表
        fetchContents();
      } else {
        setError(response.data?.message || '保存失败');
      }
    } catch (error) {
      console.error('保存内容失败：', error);
      setError('保存内容失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除内容
  const handleDeleteContent = async (id, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    if (!window.confirm('确定要删除该内容吗？')) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await instance.delete(`/content/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setContents(contents.filter(item => item.id !== id));
        if (selectedContent?.id === id) {
          setIsDetailOpen(false);
        }
      } else {
        setError(response.data?.message || '删除失败');
      }
    } catch (error) {
      console.error('删除内容失败：', error);
      setError('删除内容失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 内容卡片组件
  const ContentCard = ({ content }) => {
    const imageList = Array.isArray(content.images) ? content.images : [];
    
    return (
      <div 
        className="content-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={() => handleContentClick(content)}
      >
        {imageList.length > 0 && (
          <div className="image-container">
            <img 
              src={imageList[0]} 
              alt={content.title} 
              className="w-full h-full object-cover"
            />
            {activeTab === 0 && (
              <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                草稿
              </div>
            )}
          </div>
        )}
        <div className="card-content">
          <h3 className="card-title line-clamp-2">{content.title}</h3>
          {content.content && (
            <p className="card-description text-gray-500 line-clamp-2">{content.content}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatDate(content.createdAt)}</span>
            <div className="flex items-center space-x-2">
              <span className="flex items-center">
                <i className="ri-eye-line mr-1"></i>
                {content.viewCount || 0}
              </span>
              <button
                className="flex items-center text-red-500 hover:text-red-700"
                onClick={(e) => handleDeleteContent(content.id, e)}
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 内容详情对话框
  const ContentDetailDialog = () => {
    if (!selectedContent) return null;
    
    const imageList = Array.isArray(selectedContent.images) ? selectedContent.images : [];
    const tagList = Array.isArray(selectedContent.tags) ? selectedContent.tags : [];
    
    return (
      <div className={`content-detail-dialog ${isDetailOpen ? 'open' : ''}`}>
        <div className="dialog-overlay" onClick={() => setIsDetailOpen(false)}></div>
        <div className="dialog-content">
          <div className="dialog-header">
            <h2>{isEditMode ? '编辑内容' : '内容详情'}</h2>
            <div className="dialog-actions">
              {!isEditMode && (
                <button 
                  className="edit-button"
                  onClick={handleEditClick}
                >
                  <i className="ri-edit-line mr-1"></i>
                  编辑
                </button>
              )}
              <button 
                className="close-button"
                onClick={() => setIsDetailOpen(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
          
          <div className="dialog-body">
            {isEditMode ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>标题</label>
                  <input 
                    type="text"
                    value={editedContent.title || ''} 
                    onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>内容（支持Markdown语法）</label>
                  <textarea 
                    value={editedContent.content || ''} 
                    onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
                    className="form-textarea"
                    rows={12}
                    placeholder="支持Markdown语法，如# 标题，**粗体**，*斜体*，[链接](url)等"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>标签</label>
                  <input 
                    type="text"
                    value={Array.isArray(editedContent.tags) ? editedContent.tags.join(', ') : ''} 
                    onChange={(e) => setEditedContent({
                      ...editedContent, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="form-input"
                    placeholder="用逗号分隔多个标签"
                  />
                </div>
                <div className="form-buttons">
                  <button 
                    className="cancel-button"
                    onClick={() => setIsEditMode(false)}
                  >
                    取消
                  </button>
                  <button 
                    className="save-button"
                    onClick={handleSaveEdit}
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <div className="detail-content">
                <h1 className="detail-title">{selectedContent.title}</h1>
                
                <div className="detail-meta">
                  <div className="detail-date">
                    <i className="ri-calendar-line mr-1"></i>
                    {formatDate(selectedContent.createdAt)}
                  </div>
                  <div className="detail-stats">
                    <span><i className="ri-eye-line mr-1"></i>{selectedContent.viewCount || 0}</span>
                    <span><i className="ri-heart-line mr-1"></i>{selectedContent.likeCount || 0}</span>
                    <span><i className="ri-message-2-line mr-1"></i>{selectedContent.commentCount || 0}</span>
                  </div>
                </div>
                
                {tagList.length > 0 && (
                  <div className="detail-tags">
                    {tagList.map((tag, index) => (
                      <span key={index} className="detail-tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                {imageList.length > 0 && (
                  <div className="detail-images">
                    {imageList.map((image, index) => (
                      <img key={index} src={image} alt="" className="detail-image" />
                    ))}
                  </div>
                )}
                
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedContent.content || ''}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Props验证
  ContentCard.propTypes = {
    content: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      content: PropTypes.string,
      images: PropTypes.array,
      viewCount: PropTypes.number,
      likeCount: PropTypes.number,
      commentCount: PropTypes.number,
      createdAt: PropTypes.string
    }).isRequired
  };

  return (
    <div className="my-content-page">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/my-service')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">我的内容</h1>
          <button 
            onClick={() => navigate('/content-creation')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* 内容类型切换 */}
      <div className="fixed top-12 left-0 right-0 bg-white z-10 max-w-[375px] mx-auto border-b">
        <div className="flex">
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab(1)}
          >
            已发布
          </button>
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 0 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab(0)}
          >
            草稿箱
          </button>
        </div>
      </div>

      {/* 内容列表 */}
      <div className="content-list">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <i className="fas fa-spinner fa-spin text-primary mr-2"></i>
            <span>加载中...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : contents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 1 ? '暂无已发布内容' : '暂无草稿内容'}
            <div className="mt-2">
              <button 
                onClick={() => navigate('/content-creation')} 
                className="px-4 py-2 bg-primary text-white rounded-full text-sm"
              >
                去创作
              </button>
            </div>
          </div>
        ) : (
          <div className="content-grid">
            {contents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </div>
      
      {/* 内容详情对话框 */}
      <ContentDetailDialog />
    </div>
  );
};

export default MyContentPage; 