import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getVideoList } from '../VideoService';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './VideoList.css';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('所有');
  const categoriesScrollRef = useRef(null);
  const videosScrollRef = useRef(null);
  
  // 获取视频列表
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const data = await getVideoList();
        setVideos(data);
        setError(null);
      } catch (err) {
        setError('获取视频列表失败');
        console.error('获取视频列表失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // 从视频数组中提取所有分类
  const categories = ['所有', ...new Set(videos.map(video => video.category))];
  
  // 根据当前分类过滤视频
  const filteredVideos = currentCategory === '所有' 
    ? videos 
    : videos.filter(video => video.category === currentCategory);
  
  // 处理视频点击，打开视频播放器
  const handleVideoClick = (video) => {
    console.log('选择播放视频:', video.title, video.videoUrl);
    setSelectedVideo(video);
  };
  
  // 关闭视频播放器
  const handleCloseVideo = () => {
    console.log('关闭视频播放器');
    setSelectedVideo(null);
  };
  
  // 水平滚动处理
  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // 视频预加载处理 - 优化视频播放问题
  const handleVideoPreload = (videoId) => {
    // 安全地设置视频预加载
    try {
      const videoElement = document.getElementById(`video-preview-${videoId}`);
      if (videoElement) {
        videoElement.preload = 'metadata';
      }
    } catch (err) {
      console.error('视频预加载失败:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="video-list-loading">
        <div className="video-loading-spinner"></div>
        <p>正在加载视频...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="video-list-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    );
  }
  
  return (
    <div className="video-list-container">
      {/* 分类选择器 */}
      <div className="content-module-container video-module-container">
        <div className="content-module-header">
          <div className="module-title">
            <i className="fas fa-video"></i> 热门视频
          </div>
        </div>
        
      
        {/* 视频水平滚动列表 */}
        <div className="horizontal-scroll-container video-scroll-container" ref={videosScrollRef}>
        {filteredVideos.map(video => (
            <div key={video.id} className="video-card" onClick={() => handleVideoClick(video)}>
            <div className="video-card-cover-container">
              <img src={video.cover} alt={video.title} className="video-card-cover" />
              <div className="video-duration">{video.duration}</div>
              <div className="video-play-button">
                <i className="fas fa-play"></i>
              </div>
            </div>
            <div className="video-card-info">
              <h4 className="video-card-title">{video.title}</h4>
              <div className="video-card-creator">{video.creator}</div>
              <div className="video-card-views">
                <i className="fas fa-eye"></i> {video.viewCount}
              </div>
              <div className="ai-video-summary">
                <i className="fas fa-magic"></i> {video.aiSummary}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
      
      {/* 无视频提示 */}
      {filteredVideos.length === 0 && (
        <div className="no-videos-message">
          <p>当前分类没有视频</p>
        </div>
      )}
      
      {/* 视频播放器 */}
      {selectedVideo && (
        <VideoPlayer
          key={selectedVideo.id}
          videoSrc={selectedVideo.videoUrl}
          title={selectedVideo.title}
          creator={selectedVideo.creator}
          onClose={handleCloseVideo}
        />
      )}
    </div>
  );
};

export default VideoList; 