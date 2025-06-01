import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';
import './VideoPlayer.css';

const VideoPlayer = ({ videoSrc, title, onClose, creator = '未知创作者' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHls, setIsHls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [playAttempts, setPlayAttempts] = useState(0);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const hlsRef = useRef(null);
  
  // 播放/暂停切换
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // 使用Promise处理播放请求
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.error('播放失败:', err);
            // 如果是自动播放策略阻止，显示播放按钮
            setIsPlaying(false);
            
            // 如果尝试次数少于3次，尝试静音播放
            if (playAttempts < 3) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => {
                setIsPlaying(true);
                // 显示提示用户点击取消静音
                alert('视频已静音播放，点击音量按钮取消静音');
              }).catch(e => {
                console.error('静音播放也失败:', e);
              });
              setPlayAttempts(prev => prev + 1);
            }
          });
        }
      }
    }
  };
  
  // 进度条拖动
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  // 音量调整
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };
  
  // 切换静音
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume || 1);
      }
    }
  };
  
  // 全屏切换
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (playerRef.current && playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current && playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current && playerRef.current.msRequestFullscreen) {
        playerRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };
  
  // 更新播放时间
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // 获取视频时长
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };
  
  // 自动隐藏控制栏
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // 格式化时间
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // 视频加载错误处理
  const handleVideoError = (e) => {
    console.error('视频加载错误:', e);
    setLoadError('视频加载失败，请稍后再试');
    setIsLoading(false);
  };
  
  // 视频加载中
  const handleWaiting = () => {
    setIsLoading(true);
  };
  
  // 视频可以播放
  const handleCanPlay = () => {
    setIsLoading(false);
    setLoadError(null);
  };
  
  // 视频播放结束
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };
  
  // 判断是否为HLS格式并初始化
  useEffect(() => {
    // 清理之前的HLS实例
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    if (videoSrc && videoRef.current) {
      // 检查是否支持HLS
      const isHlsSource = videoSrc.includes('.m3u8');
      setIsHls(isHlsSource);
      
      if (isHlsSource && Hls.isSupported()) {
        console.log('使用HLS播放器播放:', videoSrc);
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1, // 自动选择最佳质量
          capLevelToPlayerSize: true, // 根据播放器大小调整质量
          debug: false
        });
        
        hlsRef.current = hls;
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
            // 准备好后尝试播放
            try {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsPlaying(true);
              }).catch(err => {
                console.error('自动播放失败:', err);
                setIsPlaying(false);
              });
            }
          } catch (error) {
            console.error('播放出错:', error);
          }
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS 错误:', data);
          // 尝试恢复
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('网络错误，尝试恢复...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('媒体错误，尝试恢复...');
                hls.recoverMediaError();
                break;
              default:
                // 无法恢复的错误
                console.error('无法恢复的HLS错误');
                setLoadError('视频加载失败，请稍后再试');
                setIsLoading(false);
                break;
            }
          }
        });
      } else if (isHlsSource && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // 原生支持HLS (Safari)
        console.log('使用原生HLS支持播放:', videoSrc);
        videoRef.current.src = videoSrc;
      } else {
        // 普通视频
        console.log('使用标准视频播放器播放:', videoSrc);
        videoRef.current.src = videoSrc;
        // 尝试自动播放
        try {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch(err => {
              console.error('自动播放失败:', err);
              setIsPlaying(false);
            });
          }
        } catch (error) {
          console.error('播放出错:', error);
        }
      }
    }
    
    // 清理函数
    return () => {
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (error) {
          console.error('HLS销毁错误:', error);
        }
        hlsRef.current = null;
      }
      
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [videoSrc]);
  
  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  // 安全关闭播放器
  const handleSafeClose = () => {
    // 停止视频播放
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      } catch (error) {
        console.error('停止视频播放错误:', error);
      }
    }
    
    // 销毁HLS实例
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
        hlsRef.current = null;
      } catch (error) {
        console.error('HLS销毁错误:', error);
      }
    }
    
    // 调用关闭回调
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div className="video-player-overlay" onClick={handleSafeClose}>
      <div 
        className="video-player-container" 
        ref={playerRef}
        onClick={e => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        <div className="video-player-header">
          <div className="video-player-title">{title}</div>
          <button className="video-player-close" onClick={handleSafeClose}>×</button>
        </div>
        
        <div className="video-player-wrapper">
          <video
            ref={videoRef}
            className="video-element"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            onWaiting={handleWaiting}
            onCanPlay={handleCanPlay}
            onEnded={handleEnded}
            playsInline
            crossOrigin="anonymous"
          />
          
          {isLoading && (
            <div className="video-loading">
              <div className="video-loading-spinner"></div>
              <div className="video-loading-text">加载中...</div>
            </div>
          )}
          
          {loadError && (
            <div className="video-error">
              <div className="video-error-icon">⚠️</div>
              <div className="video-error-text">{loadError}</div>
              <button className="video-error-retry" onClick={() => window.location.reload()}>重试</button>
            </div>
          )}
          
          {!isPlaying && !isLoading && !loadError && (
            <div className="video-play-overlay" onClick={togglePlay}>
              <div className="video-big-play-button">
                <i className="fas fa-play"></i>
              </div>
            </div>
          )}
          
          <div className={`video-controls ${showControls ? 'show' : ''}`}>
            <div className="video-progress">
              <input 
                type="range"
                className="video-progress-bar"
                value={currentTime}
                min="0"
                max={duration || 0}
                step="0.1"
                onChange={handleProgressChange}
              />
            </div>
            
            <div className="video-controls-bottom">
              <div className="video-controls-left">
                <button className="video-control-button" onClick={togglePlay}>
                  {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                </button>
                
                <div className="video-volume-control">
                  <button className="video-control-button" onClick={toggleMute}>
                    {volume === 0 ? <i className="fas fa-volume-mute"></i> : <i className="fas fa-volume-up"></i>}
                  </button>
                  <input 
                    type="range"
                    className="video-volume-slider"
                    value={volume}
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={handleVolumeChange}
                  />
                </div>
                
                <div className="video-time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="video-controls-right">
                <button className="video-control-button" onClick={toggleFullScreen}>
                  {isFullScreen ? <i className="fas fa-compress"></i> : <i className="fas fa-expand"></i>}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="video-info">
          <div className="video-creator">{creator}</div>
        </div>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  creator: PropTypes.string
};

export default VideoPlayer; 