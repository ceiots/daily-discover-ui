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
  const [hlsLevel, setHlsLevel] = useState(-1); // 当前HLS质量级别
  const [hlsLevels, setHlsLevels] = useState([]); // 可用的HLS质量级别
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const hlsRef = useRef(null);
  const bufferCheckIntervalRef = useRef(null);
  
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
  
  // 切换HLS质量
  const switchHlsQuality = (level) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setHlsLevel(level);
    }
  };
  
  // 检查并处理缓冲状态
  const checkBuffer = () => {
    if (!videoRef.current || !hlsRef.current) return;
    
    const video = videoRef.current;
    
    // 获取当前缓冲区范围
    const buffered = video.buffered;
    let bufferedEnd = 0;
    
    if (buffered.length > 0) {
      bufferedEnd = buffered.end(buffered.length - 1);
    }
    
    // 计算缓冲区与当前播放位置的差距
    const bufferGap = bufferedEnd - video.currentTime;
    
    // 如果缓冲不足，降低质量
    if (bufferGap < 3 && hlsRef.current.currentLevel > 0) {
      console.log('缓冲不足，降低视频质量');
      hlsRef.current.currentLevel = hlsRef.current.currentLevel - 1;
      setHlsLevel(hlsRef.current.currentLevel);
    }
    
    // 如果缓冲充足，可以考虑提高质量
    if (bufferGap > 15 && 
        hlsRef.current.currentLevel < hlsRef.current.levels.length - 1 &&
        hlsRef.current.autoLevelEnabled === false) {
      console.log('缓冲充足，提高视频质量');
      hlsRef.current.currentLevel = hlsRef.current.currentLevel + 1;
      setHlsLevel(hlsRef.current.currentLevel);
    }
  };
  
  // 判断是否为HLS格式并初始化
  useEffect(() => {
    // 清理之前的HLS实例和缓冲检查
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (bufferCheckIntervalRef.current) {
      clearInterval(bufferCheckIntervalRef.current);
      bufferCheckIntervalRef.current = null;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    if (videoSrc && videoRef.current) {
      // 检查是否支持HLS
      const isHlsSource = videoSrc.includes('.m3u8');
      setIsHls(isHlsSource);
      
      if (isHlsSource && Hls.isSupported()) {
        console.log('使用HLS播放器播放:', videoSrc);
        
        // 优化的HLS配置
        const hls = new Hls({
          // 基本配置
          maxBufferLength: 60, // 增加最大缓冲长度（秒）
          maxMaxBufferLength: 120, // 增加最大最大缓冲长度（秒）
          maxBufferSize: 60 * 1000 * 1000, // 最大缓冲大小（字节）约60MB
          maxBufferHole: 0.5, // 允许的最大缓冲区空洞（秒）
          highBufferWatchdogPeriod: 5, // 高缓冲区监视周期（秒）
          
          // 自适应比特率相关
          startLevel: -1, // 自动选择初始质量
          abrEwmaDefaultEstimate: 500000, // 默认带宽估计（比特/秒）
          abrEwmaFastLive: 3, // 直播流快速EWMA系数
          abrEwmaSlowLive: 9, // 直播流慢速EWMA系数
          
          // 加载策略
          fragLoadingRetryDelay: 500, // 片段加载重试延迟（毫秒）
          manifestLoadingTimeOut: 10000, // 清单加载超时（毫秒）
          manifestLoadingMaxRetry: 4, // 清单加载最大重试次数
          fragLoadingMaxRetry: 6, // 片段加载最大重试次数
          
          // 错误恢复
          enableWorker: true, // 启用Web Worker
          testBandwidth: true, // 测试带宽
          
          // 调试
          debug: false,
          
          // 性能优化
          lowLatencyMode: false, // 低延迟模式（可能会增加卡顿）
          backBufferLength: 90, // 后向缓冲长度（秒）
          
          // 针对缓冲区空洞的特殊处理
          stretchShortVideoTrack: true, // 拉伸短视频轨道
          maxSeekHole: 2, // 最大寻找空洞（秒）
          maxStarvationDelay: 4, // 最大饥饿延迟（秒）
        });
        
        hlsRef.current = hls;
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        
        // 设置缓冲检查间隔
        bufferCheckIntervalRef.current = setInterval(checkBuffer, 5000);
        
        // 监听清单解析事件
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          setIsLoading(false);
          console.log('HLS清单已解析，可用质量级别:', data.levels.length);
          
          // 保存可用的质量级别
          setHlsLevels(data.levels.map((level, index) => ({
            index,
            bitrate: level.bitrate,
            width: level.width,
            height: level.height,
            name: `${level.height}p`
          })));
          
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
        
        // 监听级别切换事件
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          console.log('HLS质量级别已切换到:', data.level);
          setHlsLevel(data.level);
        });
        
        // 监听片段加载事件
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          console.log('已加载片段:', data.frag.sn, '持续时间:', data.frag.duration);
        });
        
        // 监听缓冲区追加事件
        hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
          console.log('已追加缓冲区:', data.type);
        });
        
        // 错误处理
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS 错误:', data);
          
          // 处理缓冲区空洞错误
          if (data.details === 'bufferSeekOverHole') {
            console.log('检测到缓冲区空洞，尝试修复...');
            // 这种错误通常不是致命的，HLS.js会自动处理
            return;
          }
          
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
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            // 非致命媒体错误，尝试恢复
            console.log('非致命媒体错误，尝试恢复...');
            hls.recoverMediaError();
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
      
      if (bufferCheckIntervalRef.current) {
        clearInterval(bufferCheckIntervalRef.current);
        bufferCheckIntervalRef.current = null;
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
    
    // 清除缓冲区检查
    if (bufferCheckIntervalRef.current) {
      clearInterval(bufferCheckIntervalRef.current);
      bufferCheckIntervalRef.current = null;
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
                {isHls && hlsLevels.length > 0 && (
                  <div className="video-quality-control">
                    <button className="video-control-button video-quality-button">
                      <i className="fas fa-cog"></i>
                      <span className="quality-label">{hlsLevel === -1 ? '自动' : hlsLevels[hlsLevel]?.name || '自动'}</span>
                    </button>
                    <div className="video-quality-menu">
                      <div 
                        className={`video-quality-option ${hlsLevel === -1 ? 'active' : ''}`} 
                        onClick={() => switchHlsQuality(-1)}
                      >
                        自动
                      </div>
                      {hlsLevels.map((level) => (
                        <div 
                          key={level.index}
                          className={`video-quality-option ${hlsLevel === level.index ? 'active' : ''}`}
                          onClick={() => switchHlsQuality(level.index)}
                        >
                          {level.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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