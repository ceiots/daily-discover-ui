import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import instance from '../services/http/instance';
import PropTypes from 'prop-types';
import '../components/MyContentPage.css';
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
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 truncate">{content.title}</h3>
          <p className="text-gray-500 text-sm mb-2 truncate">
            {formatDate(content.createTime)}
          </p>
          <p className="text-gray-700 text-sm mb-2 line-clamp-2">
            {content.content.substring(0, 100)}
            {content.content.length > 100 ? '...' : ''}
          </p>
          
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {content.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {imageList.length > 0 && (
            <div className="content-images-grid mt-2">
              {imageList.slice(0, 3).map((img, index) => (
                <div key={index} className="content-image-container">
                  <img 
                    src={img} 
                    alt={`内容图片${index + 1}`} 
                    className="content-image object-cover w-full h-full rounded"
                  />
                </div>
              ))}
              {imageList.length > 3 && (
                <div className="content-image-container more-images flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-600">+{imageList.length - 3}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="content-card-footer border-t border-gray-100 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-gray-500 text-sm">
              <i className="fas fa-eye mr-1"></i> {content.viewCount || 0}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <i className="fas fa-heart mr-1"></i> {content.likeCount || 0}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <i className="fas fa-comment mr-1"></i> {content.commentCount || 0}
            </span>
          </div>
          
          <button 
            className="text-red-500 hover:text-red-700 text-sm"
            onClick={(e) => handleDeleteContent(content.id, e)}
          >
            <i className="fas fa-trash"></i> 删除
          </button>
        </div>
      </div>
    );
  };
  
  ContentCard.propTypes = {
    content: PropTypes.object.isRequired
  };

  // 内容详情对话框
  const ContentDetailDialog = () => {
    if (!isDetailOpen || !selectedContent) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-medium">内容详情</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsDetailOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            {isEditMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标题
                  </label>
                  <input
                    type="text"
                    value={editedContent.title || ''}
                    onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内容
                  </label>
                  <textarea
                    value={editedContent.content || ''}
                    onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
                    rows={10}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标签 (用逗号分隔)
                  </label>
                  <input
                    type="text"
                    value={(editedContent.tags || []).join(', ')}
                    onChange={(e) => setEditedContent({
                      ...editedContent, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-4">{selectedContent.title}</h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{formatDate(selectedContent.createTime)}</span>
                  <span>浏览: {selectedContent.viewCount || 0}</span>
                  <span>点赞: {selectedContent.likeCount || 0}</span>
                </div>
                
                {selectedContent.tags && selectedContent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedContent.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedContent.content}
                  </ReactMarkdown>
                </div>
                
                {selectedContent.images && selectedContent.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">图片</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedContent.images.map((img, index) => (
                        <div key={index} className="aspect-w-16 aspect-h-9">
                          <img 
                            src={img} 
                            alt={`内容图片${index + 1}`} 
                            className="object-cover w-full h-full rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-end space-x-2">
            {isEditMode ? (
              <>
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => setIsEditMode(false)}
                >
                  取消
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => setIsDetailOpen(false)}
                >
                  关闭
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleEditClick}
                >
                  编辑
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-content-page bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">我的内容</h1>
        
        <div className="tabs flex border-b mb-6">
          <button 
            className={`tab-btn py-2 px-4 font-medium ${activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(1)}
          >
            已发布
          </button>
          <button 
            className={`tab-btn py-2 px-4 font-medium ${activeTab === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(0)}
          >
            草稿
          </button>
        </div>
        
        {loading && contents.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无内容</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate('/creation')}
            >
              创建新内容
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
        
        {/* 创建新内容按钮 */}
        <div className="fixed right-6 bottom-6">
          <button 
            className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
            onClick={() => navigate('/creation')}
          >
            <i className="fas fa-plus text-xl"></i>
          </button>
        </div>
        
        {/* 内容详情对话框 */}
        <ContentDetailDialog />
      </div>
    </div>
  );
};

export default MyContentPage;