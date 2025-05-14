import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import instance from '../utils/axios';
import PropTypes from 'prop-types';
import './MyContentPage.css';

const MyContentPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1); // 1-已发布，0-草稿

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 获取内容数据
  useEffect(() => {
    const fetchContents = async () => {
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
    };
    
    if (isLoggedIn) {
      fetchContents();
    }
  }, [activeTab, isLoggedIn, navigate]);

  // 内容项组件
  const ContentItem = ({ content }) => {
    const { id, title, images, viewCount, likeCount, commentCount, createdAt } = content;
    const imageList = Array.isArray(images) ? images : [];
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return (
      <div 
        className="content-item bg-white p-3 rounded-lg mb-3 shadow-sm"
        onClick={() => navigate(`/content/${id}`)}
      >
        <div className="flex">
          <div className={`flex-1 ${imageList.length > 0 ? 'mr-3' : ''}`}>
            <h3 className="text-base font-medium line-clamp-2">{title}</h3>
            {content.content && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{content.content}</p>
            )}
            <div className="flex items-center text-xs text-gray-400 mt-2">
              <span>{formatDate(createdAt)}</span>
              <span className="mx-2">·</span>
              <span>{viewCount || 0} 浏览</span>
              <span className="mx-2">·</span>
              <span>{likeCount || 0} 点赞</span>
              <span className="mx-2">·</span>
              <span>{commentCount || 0} 评论</span>
            </div>
          </div>
          {imageList.length > 0 && (
            <div className="w-20 h-20">
              <img 
                src={imageList[0]} 
                alt={title} 
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 添加PropTypes验证
  ContentItem.propTypes = {
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
    <div className="my-content-page pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/profile')} 
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
      <div className="content-list pt-24 px-4">
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
          contents.map(content => (
            <ContentItem key={content.id} content={content} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyContentPage; 