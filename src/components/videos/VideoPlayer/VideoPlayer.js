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
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
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
        videoRef.current.src = videoSrc;
      } else {
        // 尝试直接播放
        videoRef.current.src = videoSrc;
      }
    }
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoSrc]);
  
  // 监听全屏状态变化
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
  
  // 清理
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);
  
  return (
    <div className="video-player-overlay">
      <div className="video-player-container" ref={playerRef} onMouseMove={handleMouseMove}>
        <video
          ref={videoRef}
          className="video-player"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onEnded={handleEnded}
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          // HLS不在此设置src
          {...(!isHls && { src: videoSrc })}
        />
        
        <button className="video-close-btn" onClick={onClose}>
          <span>×</span>
        </button>
        
        {/* 加载状态 */}
        {isLoading && (
          <div className="video-loading">
            <div className="video-loading-spinner"></div>
            <p>视频加载中...</p>
          </div>
        )}
        
        {/* 错误状态 */}
        {loadError && (
          <div className="video-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{loadError}</p>
            <button onClick={() => window.location.reload()}>重试</button>
          </div>
        )}
        
        {/* 大播放按钮 */}
        {!isPlaying && !isLoading && !loadError && (
          <div className="video-play-overlay" onClick={togglePlay}>
            <button className="video-play-big">▶</button>
          </div>
        )}
        
        <div className={`video-info ${showControls ? '' : 'hidden'}`}>
          <h2 className="video-title">{title}</h2>
          <p className="video-creator">by {creator}</p>
        </div>
        
        <div className={`video-controls ${showControls ? '' : 'hidden'}`}>
          <button className="video-control-btn play-pause" onClick={togglePlay}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          
          <div className="video-progress-container">
            <span className="video-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="video-progress"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              style={{
                background: `linear-gradient(to right, #3498db ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.3) ${(currentTime / duration) * 100}%)`
              }}
            />
            <span className="video-time">{formatTime(duration)}</span>
          </div>
          
          <div className="video-right-controls">
            <div className="video-volume-container">
              <button className="video-control-btn volume" onClick={toggleMute}>
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                className="video-volume"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(to right, #3498db ${volume * 100}%, rgba(255, 255, 255, 0.3) ${volume * 100}%)`
                }}
              />
            </div>
            
            <button className="video-control-btn fullscreen" onClick={toggleFullScreen}>
              {isFullScreen ? '⤓' : '⤢'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creator: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default VideoPlayer; 