import React, { useState, useEffect, useRef } from "react";
import "./AiAssistant.css";
import PropTypes from "prop-types";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { API_BASE_URL } from "../config";
// 导入 GitHub 风格 Markdown 支持
import remarkGfm from 'remark-gfm';
// 导入语法高亮
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const AiAssistant = ({ userInfo }) => {
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiTopics, setAiTopics] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [quickReads, setQuickReads] = useState([]);
  const [selectedReadItem, setSelectedReadItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  // 添加复制状态
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);
  // 添加调试模式开关
  const DEBUG_MODE = false; // 设置为true开启详细日志
  // 添加设备标识符，用于跟踪用户会话
  const [deviceId, setDeviceId] = useState("");

  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const recommendationTimerRef = useRef(null);
  const eventSourceRef = useRef(null);
  // 添加复制状态定时器引用
  const copyTimerRef = useRef(null);
  // 添加流式响应控制器引用
  const abortControllerRef = useRef(null);
  // 添加轮播组件引用
  const sliderRef = useRef(null);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "10px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipeToSlide: true,
    arrows: false,
    dots: false,
    focusOnSelect: true, // 点击选中
    waitForAnimate: false, // 不等待动画完成就响应用户操作
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "10px",
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "10px",
          slidesToShow: 3
        }
      }
    ],
    // 轮播初始化完成后的回调函数
    onInit: () => {
      console.log("轮播初始化完成");
    },
    // 轮播内容变化后的回调函数
    afterChange: (current) => {
      //console.log("当前滚动到索引:", current);
    }
  };


  // 创建代码块组件
  const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    return (
      <div className="code-block-wrapper">
        <div className="code-header">
          <span className="code-language">{language || 'text'}</span>
          <button className="code-copy-button" onClick={handleCopy}>
            {copied ? <i className="fas fa-check" /> : <i className="fas fa-copy" />}
          </button>
        </div>
        <SyntaxHighlighter language={language || 'text'} style={tomorrow}>
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  // 添加PropTypes验证
  CodeBlock.propTypes = {
    language: PropTypes.string,
    code: PropTypes.string.isRequired
  };

  // 预处理内容，将特殊标签转换为HTML
  const preprocessContent = (content) => {
    try {
      if (!content) return "";
      if (typeof content !== 'string') {
        console.warn("preprocessContent: 内容不是字符串类型", content);
        return String(content || "");
      }

    // 移除event:message前缀
      if (content.includes("event:message")) {
        content = content.replace(/event:message\w*/g, "");
    }

      // 处理已关闭的思考标签对
      content = content.replace(
      /<think>([\s\S]*?)<\/think>/g,
        '<div class="ai-think-content"><div class="ai-think-body">$1</div></div>'
      );

      // 处理尚未关闭的思考标签（流式响应中的情况）
      const openThinkTagIndex = content.lastIndexOf('<think>');
      if (openThinkTagIndex !== -1 && content.indexOf('</think>', openThinkTagIndex) === -1) {
        const beforeThink = content.substring(0, openThinkTagIndex);
        const thinkContent = content.substring(openThinkTagIndex + 7); // 7 是 <think> 的长度
        
        content = beforeThink + 
                  '<div class="ai-think-content"><div class="ai-think-body">' + 
                  thinkContent + 
                  '</div></div>';
      }

      return content;
    } catch (error) {
      console.error("预处理内容出错:", error);
      return content;
    }
  };

  // 使用 ReactMarkdown 渲染消息内容
  const renderMessageContent = (message, index) => {
    if (!message || message.trim() === '') return null;
    
    try {
      // 预处理内容
      const preprocessed = preprocessContent(message);
      
      return (
        <div className="ai-message-content-wrapper">
          <ReactMarkdown
            className="ai-markdown-content"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                if (!children) return <code className={className} {...props}></code>;
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock 
                    language={match[1]} 
                    code={String(children || "").replace(/\n$/, '')}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // 自定义处理器用于思考内容
              p({node, children, ...props}) {
                // 检查children是否存在并且有toString方法
                if (!children || typeof children.toString !== 'function') {
                  return <p {...props}>{children || ""}</p>;
                }
                
                const content = children.toString();
                // 不再需要检测:::think格式，直接渲染段落
                return <p {...props}>{children}</p>;
              }
            }}
          >
            {preprocessed}
          </ReactMarkdown>
          
          {/* 复制按钮 */}
          <div className="ai-copy-button-container">
            <button 
              className="ai-copy-button"
              onClick={() => copyToClipboard(message.replace(/<think>([\s\S]*?)<\/think>/g, '思考过程：$1'), index)}
              title="复制全部内容"
            >
              {copiedMessageIndex === index ? (
                <><i className="fas fa-check"></i> 已复制</>
              ) : (
                <><i className="fas fa-copy"></i> 复制全部</>
              )}
            </button>
          </div>
        </div>
      );
    } catch (error) {
      console.error("渲染消息内容出错:", error);
      // 发生错误时返回原始文本
      return <div className="ai-message-content-wrapper">{message}</div>;
    }
  };

  // 添加复制功能
  const copyToClipboard = (message, index) => {
    // 清除之前的复制状态定时器
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    
    // 创建临时文本区域
    const textArea = document.createElement("textarea");
    
    // 提取纯文本内容，移除HTML标签
    let plainText = message;
    // 如果是HTML内容，移除标签
    if (message.includes("<") && message.includes(">")) {
      plainText = message.replace(/<[^>]*>?/gm, '');
    }
    
    textArea.value = plainText;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      // 执行复制命令
      document.execCommand("copy");
      // 设置复制成功状态
      setCopiedMessageIndex(index);
      
      // 2秒后重置复制状态
      copyTimerRef.current = setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 2000);
      
    } catch (err) {
      console.error("复制失败:", err);
    }
    
    // 移除临时文本区域
    document.body.removeChild(textArea);
  };

  // 主要useEffect - 整合多个初始化和监听逻辑
  useEffect(() => {
    // 生成或获取设备ID
    initDeviceId();

    // 初始化
    if (aiChatHistory.length === 0) {
      createNewSession();
    }

    // 设置默认推荐话题
    setFallbackSuggestedTopics();

    // 加载快速阅读内容
    loadQuickReads();

    // 加载聊天历史
    loadChatHistory();
    
    // 添加页面刷新/关闭时的事件监听，取消所有正在进行的请求
    const handleBeforeUnload = (event) => {
      console.log("页面即将刷新或关闭，取消所有请求");
      
      // 确保中止所有正在进行的请求
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
          console.log("已中止当前请求");
        } catch (e) {
          console.error("中止请求时出错:", e);
        }
      }
      
      // 标记当前会话ID为过期
      if (currentSessionId) {
        try {
          // 使用同步方式标记会话过期，确保在页面关闭前完成
          markSessionExpired(currentSessionId);
          console.log("已标记会话为过期:", currentSessionId);
          
          // 使用同步XMLHttpRequest发送会话过期通知
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${API_BASE_URL}/ai/mark-session-expired`, false); // 同步请求
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("X-Session-ID", currentSessionId);
          xhr.setRequestHeader("X-Device-ID", deviceId);
          xhr.send(JSON.stringify({ sessionId: currentSessionId }));
          console.log("已同步发送会话过期通知");
        } catch (e) {
          console.error("标记会话过期时出错:", e);
        }
      }
      
      // 返回undefined，不阻止页面关闭/刷新
      return undefined;
    };
  
    // 添加CSS样式来防止水平滚动
    const style = document.createElement("style");
    style.innerHTML = ``;
    document.head.appendChild(style);

    // 注册页面卸载事件监听器
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 添加事件委托，处理代码块复制按钮点击
    const handleCodeCopyClick = (e) => {
      // 检查点击的是否是代码复制按钮
      if (e.target.closest('.code-copy-button')) {
        const codeBlock = e.target.closest('.code-block');
        if (codeBlock) {
          const codeElement = codeBlock.querySelector('code');
          if (codeElement) {
            copyToClipboard(codeElement.textContent, 'code-block');
          }
        }
      }
    };

    // 添加事件监听
    document.addEventListener('click', handleCodeCopyClick);
    
    // 清理函数
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      
      if (recommendationTimerRef.current) {
        clearTimeout(recommendationTimerRef.current);
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      document.head.removeChild(style);
      document.removeEventListener('click', handleCodeCopyClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);  // 空依赖数组，只在组件挂载时执行一次
  
  // 监听当前推荐内容变化，设置自动关闭定时器
  useEffect(() => {
    if (currentRecommendation) {
      recommendationTimerRef.current = setTimeout(() => {
        setCurrentRecommendation(null);
      }, 60000);
    }
  }, [currentRecommendation]);
  
  
  // 监听suggestedTopics变化，初始化和更新后重新初始化轮播
  useEffect(() => {
    if (suggestedTopics.length > 0) {
      // 确保DOM元素已经渲染
      setTimeout(() => {
        // 优先使用ref访问轮播组件
        if (sliderRef.current) {
          try {
            console.log("使用ref刷新suggestedTopics变化后的轮播");
            // 重新播放轮播
            sliderRef.current.slickPlay();
            // 回到第一个话题
            sliderRef.current.slickGoTo(0);
            return;
          } catch (error) {
            console.error("使用ref刷新轮播失败:", error);
          }
        }
        
        // 备用方式：通过DOM查找轮播组件
        const slider = document.querySelector('.slick-slider');
        if (slider) {
          // 获取所有轮播项
          const items = slider.querySelectorAll('.slick-slide');
          if (items.length > 0) {
            // 重新初始化轮播组件
            try {
              // 如果使用的是react-slick库提供的刷新方法
              if (slider.slick) {
                slider.slick.refresh();
                slider.slick.slickGoTo(0);
              }
              console.log("话题轮播已重新初始化");
            } catch (error) {
              console.error("重新初始化话题轮播失败:", error);
            }
          }
        }
      }, 100); // 短暂延迟，确保DOM已更新
    }
  }, [suggestedTopics]);

  // 初始化设备ID - 用于标识用户设备
  const initDeviceId = () => {
    let deviceIdFromStorage = localStorage.getItem('daily_discover_device_id');
    
    if (!deviceIdFromStorage) {
      // 生成新的设备ID
      deviceIdFromStorage = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('daily_discover_device_id', deviceIdFromStorage);
    }
    
    setDeviceId(deviceIdFromStorage);
  };
  
  // 标记会话为过期
  const markSessionExpired = (sessionId) => {
    try {
      if (!sessionId) return;
      
      console.log("标记会话为过期:", sessionId);
      
      // 保存到本地存储，表示该会话已过期
      const expiredSessions = JSON.parse(localStorage.getItem('expired_sessions') || '[]');
      if (!expiredSessions.includes(sessionId)) {
        expiredSessions.push(sessionId);
        localStorage.setItem('expired_sessions', JSON.stringify(expiredSessions));
        
        // 尝试通过API通知后端会话已过期
        try {
          // 使用fetch的keepalive选项，确保请求在页面关闭后仍能完成
          fetch(`${API_BASE_URL}/ai/mark-session-expired`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-ID': sessionId,
              'X-Device-ID': deviceId
            },
            body: JSON.stringify({ sessionId, deviceId }),
            keepalive: true
          }).catch(e => {
            console.log("发送会话过期通知时出错 (可忽略):", e);
            
            // 备用方案：使用sendBeacon
            if (navigator.sendBeacon) {
              const data = JSON.stringify({ sessionId, deviceId });
              const success = navigator.sendBeacon(
                `${API_BASE_URL}/ai/mark-session-expired`, 
                new Blob([data], { type: 'application/json' })
              );
              console.log("使用sendBeacon发送会话过期通知:", success ? "成功" : "失败");
            }
          });
        } catch (apiError) {
          console.log("尝试通知后端会话过期时出错 (可忽略):", apiError);
        }
      }
    } catch (error) {
      console.error("标记会话过期失败:", error);
    }
  };

  // 创建新会话
  const createNewSession = () => {
    // 清理过期会话
    cleanupExpiredSessions();
    
    // 生成新的会话ID，包含设备ID前缀
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    // 格式: deviceId_timestamp_random
    const sessionId = `${deviceId}_${timestamp}_${random}`;
    
    setCurrentSessionId(sessionId);
    
    // 在本地存储中标记为活跃会话
    try {
      const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
      if (!activeSessions.includes(sessionId)) {
        // 限制最大保存的活跃会话数
        if (activeSessions.length > 5) {
          activeSessions.shift(); // 移除最老的会话
        }
        activeSessions.push(sessionId);
        localStorage.setItem('active_sessions', JSON.stringify(activeSessions));
      }
    } catch (error) {
      console.error("保存活跃会话失败:", error);
    }
    
    return sessionId;
  };
  
  // 清理过期会话
  const cleanupExpiredSessions = () => {
    try {
      // 从活跃会话中移除过期会话
      const expiredSessions = JSON.parse(localStorage.getItem('expired_sessions') || '[]');
      const activeSessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
      
      const newActiveSessions = activeSessions.filter(
        sessionId => !expiredSessions.includes(sessionId)
      );
      
      localStorage.setItem('active_sessions', JSON.stringify(newActiveSessions));
      
      // 最多保留20个过期会话记录
      if (expiredSessions.length > 20) {
        const trimmedExpiredSessions = expiredSessions.slice(-20);
        localStorage.setItem('expired_sessions', JSON.stringify(trimmedExpiredSessions));
      }
    } catch (error) {
      console.error("清理过期会话失败:", error);
    }
  };

  // 加载快速阅读内容
  const loadQuickReads = async () => {
    try {
      // 这里可以替换为实际的API调用，例如从后端获取推荐阅读内容
      const response = await instance.get("/ai/daily");
      if (response.data && response.data.data) {
        // 处理返回的数据
        // 暂时使用现有数据
        setDefaultQuickReads();
      } else {
        setDefaultQuickReads();
      }
    } catch (error) {
      console.error("加载快速阅读内容失败:", error);
      setDefaultQuickReads();
    }
  };

  // 设置默认快速阅读内容
  const setDefaultQuickReads = () => {
    setQuickReads([
      {
        id: 1,
        title: "数字极简主义入门指南",
        summary: "了解如何在信息爆炸的时代保持专注和平静",
        content:
          "在当今数字化时代，我们被信息和通知不断轰炸，数字极简主义提供了一种方法，帮助我们减少干扰，专注于真正重要的事物。从整理手机应用开始，删除不必要的软件，关闭非关键通知，每天设置特定时间检查邮件和社交媒体，而不是随时响应。为重要的活动和思考预留无屏幕时间，比如阅读实体书籍、户外活动或与朋友面对面交流。",
        icon: "mobile-alt",
        image:
          "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 2,
        title: "5分钟冥想技巧",
        summary: "即使在忙碌的日程中也能快速放松的方法",
        content:
          "短时冥想也能带来显著益处。找个安静的地方，坐直或平躺，闭上眼睛。专注于呼吸，数4秒吸气，停留2秒，再6秒呼气。注意力会自然游走，只需温和地将其拉回呼吸上，不要自我批评。可以使用身体扫描法，从脚趾开始关注并放松每个身体部位。仅需5分钟，每天坚持，就能逐渐提高专注力和减轻压力。",
        icon: "brain",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 3,
        title: "健康饮食小窍门",
        summary: "简单易行的饮食习惯改善方法",
        content:
          "健康饮食不必过于复杂。首先，增加蔬果摄入，每餐让一半盘子是蔬菜。选择全谷物而非精制谷物，如糙米代替白米。添加健康蛋白质来源如豆类、坚果、鱼类。减少加工食品摄入，尤其是含糖饮料和零食。培养规律进餐习惯，避免边看屏幕边吃饭，这有助于控制食量并提高进食满足感。最重要的是，饮食变化应当是可持续的小改变，而非极端节食。",
        icon: "apple-alt",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 4,
        title: "高效工作的关键策略",
        summary: "如何在更少的时间内完成更多任务",
        content:
          "高效工作不是关于更努力工作，而是关于更聪明地工作。研究表明，人类大脑无法真正高效地多任务处理，相反，我们应该采用时间块工作法。每天安排2-3个90分钟的深度工作时段，期间关闭所有通知和干扰。在这些时间块之间安排短暂休息，让大脑恢复。此外，使用二八法则识别那些能带来80%结果的20%关键任务，优先处理它们。对于重复性任务，尽可能自动化或委托他人完成。",
        icon: "briefcase",
        image:
          "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 5,
        title: "改善睡眠的科学方法",
        summary: "如何获得更深度、更有益的睡眠",
        content:
          "良好的睡眠不仅关乎时长，更关乎质量。保持规律的睡眠时间表是关键，即使在周末也应尽量按时作息。睡前两小时避免摄入咖啡因和酒精，这些物质会干扰睡眠质量。创造理想的睡眠环境：温度保持在18-20℃，确保房间足够黑暗和安静。睡前一小时避免使用电子设备，蓝光会抑制褪黑激素分泌。可以尝试睡前放松仪式，如冥想、深呼吸练习或读一本轻松的书。如果20分钟内无法入睡，起床做些放松活动再回到床上。",
        icon: "moon",
        image:
          "https://images.unsplash.com/photo-1520206183501-b80df61043c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 6,
        title: "减压方法与心理韧性",
        summary: "应对日常压力的实用技巧",
        content:
          "慢性压力会对身心健康造成严重影响，但我们可以通过多种方法来有效管理。深呼吸练习是最简单有效的减压方法之一，特别是4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒。每天练习冥想15分钟可以显著降低压力激素皮质醇的水平。规律运动能释放内啡肽，这种天然的快乐激素有助于对抗压力。保持社交联系也至关重要，与朋友分享感受可以减轻负担。学会识别并接受无法改变的事物，专注于你能控制的方面。如果压力持续影响你的生活质量，不要犹豫寻求专业心理健康帮助。",
        icon: "spa",
        image:
          "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 7,
        title: "有效的居家健身计划",
        summary: "不需要昂贵器材的全身锻炼方案",
        content:
          "高效的居家健身不需要花哨的器材。一个全面的居家计划应包括：1) 力量训练：利用自身体重进行俯卧撑、深蹲、箭步蹲和平板支撑等基础动作，每周3-4次，重点锻炼大肌群。2) 有氧训练：原地高抬腿、开合跳或快速健走，每次20-30分钟。3) 灵活性训练：包括动态和静态拉伸，每周至少2-3次，每次15分钟。为保持动力，设定具体、可测量的目标，追踪你的进步。保持训练多样性以避免倦怠，记住运动强度比时长更重要。最后，给身体充分恢复时间，避免过度训练导致的伤害。",
        icon: "dumbbell",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ]);
  };


  // 根据用户输入更新推荐话题
  const updateSuggestedTopics = async (userInput) => {
    try {
      console.log("获取推荐话题，输入:", userInput);
      
      // 调用后端API获取推荐话题
      const response = await instance.post("/ai/get-suggestions", { userInput }, {
        timeout: 5 * 60 * 1000, // 5分钟超时（单位：毫秒）
      });
      
      if (response.data && response.data.code === 200 && response.data.data && response.data.data.length > 0) {
        // 更新推荐话题
        setSuggestedTopics(response.data.data);
        console.log("获取AI推荐话题成功:", response.data.data);
        
        // 重新初始化轮播组件
        initializeSlider();
      } 
    } catch (error) {
      console.error("获取AI推荐话题出错:", error);
      // 使用备用话题
      setFallbackSuggestedTopics();
    }
  };
  
  // 初始化轮播组件
  const initializeSlider = () => {
    // 使用setTimeout确保DOM已经更新
    setTimeout(() => {
      try {
        // 首先尝试使用ref引用
        if (sliderRef.current) {
          // 使用ref直接访问slick方法
          console.log("使用ref刷新轮播");
          sliderRef.current.slickGoTo(0);
          sliderRef.current.slickPlay();
          return;
        }
        
        // 备用方法：获取轮播容器
        const sliderElement = document.querySelector('.slick-slider');
        if (sliderElement && typeof sliderElement.slick !== 'undefined') {
          // 重新初始化轮播
          sliderElement.slick.refresh();
          console.log("话题轮播已手动刷新");
          
          // 滚动到第一个话题
          sliderElement.slick.slickGoTo(0);
        } else {
          console.log("轮播组件未找到或未初始化");
        }
      } catch (error) {
        console.error("手动刷新轮播失败:", error);
      }
    }, 300);  // 给DOM更新留出足够的时间
  };
  
  // 设置备用推荐话题
  const setFallbackSuggestedTopics = () => {
    const fallbackTopics = [
      { id: "fb-1", text: "今日热点新闻", icon: "newspaper" },
      { id: "fb-2", text: "健康生活指南", icon: "heartbeat" },
      { id: "fb-3", text: "美食推荐", icon: "utensils" },
      { id: "fb-4", text: "数字生活技巧", icon: "mobile-alt" }
    ];
    
    setSuggestedTopics(fallbackTopics);
    
    // 初始化轮播
    initializeSlider();
  };

  // 实现Ollama流式请求
  const fetchStreamResponse = async (message, sessionId) => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    // 检查会话是否已过期
    const isSessionExpired = checkSessionExpired(sessionId);
    if (isSessionExpired) {
      console.log("当前会话已过期，创建新会话");
      const newSessionId = createNewSession();
      // 等待一小段时间确保会话创建完成
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 准备发送到Ollama的数据
    const requestData = {
      model: "Qwen3:4b", // 或其他可用模型
      prompt: message,
      stream: true,
      sessionId: sessionId, // 添加会话ID
      deviceId: deviceId           // 添加设备ID
    };

    console.log(`发送请求: sessionId=${sessionId}, deviceId=${deviceId}`);

    // 向Ollama API发送请求
    console.log("发送请求时间: " + new Date().toLocaleTimeString());
    
    // 使用try-catch包装fetch请求
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/ai/ollama/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 添加防缓存头
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          // 添加会话和设备标识头
          'X-Session-ID': sessionId,
          'X-Device-ID': deviceId
        },
        body: JSON.stringify(requestData),
        signal: signal
      });
    } catch (fetchError) {
      // 处理网络错误
      if (fetchError.name === 'AbortError') {
        console.log("请求被中止");
        return null;
      }
      throw fetchError;
    }
    
    console.log("收到首次响应时间: " + new Date().toLocaleTimeString());

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    // 克隆响应以避免"Cannot pipe a locked stream"错误
    const responseClone = response.clone();

    // 简化流处理逻辑
    const reader = responseClone.body.getReader();
    const decoder = new TextDecoder();
    
    // 用于存储完整的响应
    let streamedResponse = "";
    let startTime = Date.now();

    // 重置流式消息状态
    setCurrentStreamingMessage("");
    
    // 读取流
    let done = false;
    while (!done) {
      // 每次读取前检查会话是否仍然有效
      if (checkSessionExpired(sessionId)) {
        console.log("检测到会话已过期，中断流式接收");
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        break;
      }
      
      // 使用try-catch包装reader.read()
      let readResult;
      try {
        readResult = await reader.read();
      } catch (readError) {
        if (readError.name === 'AbortError') {
          console.log("读取流被中止");
          break;
        }
        throw readError;
      }
      
      const { value, done: doneReading } = readResult;
      done = doneReading;
      
      if (done) {
        console.log(`流式响应完成，耗时 ${Date.now() - startTime}ms`);
        break;
      }
          
      const chunk = decoder.decode(value, { stream: true });
          
      // 直接添加到响应文本，后端已经处理好了文本内容
      console.log("流式响应内容: " + chunk);  
      streamedResponse += chunk;
      // 更新UI显示
      setCurrentStreamingMessage(streamedResponse);
    }
    
    // 流式响应完成，将完整响应添加到聊天历史
    if (streamedResponse) {
      console.log("完整响应内容: ", streamedResponse.substring(0, 100) + "...");
      setAiChatHistory(prev => [
        ...prev,
        { type: "ai", message: streamedResponse }
      ]);
    }
    
    // 清除流式消息
    setCurrentStreamingMessage("");
    
    // 确保AbortController被清理
    abortControllerRef.current = null;
    
    return streamedResponse;
  };
  
  // 检查会话是否已过期
  const checkSessionExpired = (sessionId) => {
    try {
      if (!sessionId) return true;
      
      const expiredSessions = JSON.parse(localStorage.getItem('expired_sessions') || '[]');
      return expiredSessions.includes(sessionId);
    } catch (error) {
      console.error("检查会话状态失败:", error);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    // 1. 终止上一个流
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      markSessionExpired(currentSessionId);
    }
    // 2. 生成新sessionId
    const newSessionId = createNewSession();
    setCurrentSessionId(newSessionId);
    // 3. 先将用户输入加入聊天历史
    setAiChatHistory((prev) => [
      ...prev,
      { type: "user", message: userMessage }
    ]);
    setIsTyping(true);
    setIsLoading(true);
    // 4. 随机选择一条推荐内容显示
    if (quickReads.length > 0) {
      const randomRecommendation = quickReads[Math.floor(Math.random() * quickReads.length)];
      setCurrentRecommendation(randomRecommendation);
    }
    // 5. 滚动到底部
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    // 6. 自动展开聊天区域
    setIsExpanded(true);
    // 7. 发起新流式请求
    const response = await fetchStreamResponse(userMessage, newSessionId);
    // 8. 获取完流式响应后，更新推荐话题
    if (response) {
      updateSuggestedTopics(userMessage);
    }
    setUserMessage("");
    setIsTyping(false);
    setIsLoading(false);
  };

  const handleCancelStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      markSessionExpired(currentSessionId);
    }
    setIsTyping(false);
    setIsLoading(false);
    setCurrentStreamingMessage("");
  };

  window.addEventListener('beforeunload', () => {
    handleCancelStreaming();
  });

  // 处理话题点击 - 直接发送到AI
  const handleTopicClick = async (topic) => {
    // 设置消息并发送
    setUserMessage(topic.text);

    // 直接发送到AI
    setAiChatHistory((prev) => [
      ...prev,
      { type: "user", message: topic.text },
    ]);
    setIsTyping(true);
    setIsLoading(true);

    // 随机选择一条推荐内容显示
    const randomRecommendation =
      quickReads[Math.floor(Math.random() * quickReads.length)];
    setCurrentRecommendation(randomRecommendation);


    // 滚动到最新消息位置
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    // 自动展开聊天区域
    setIsExpanded(true);

    // 调用Ollama API获取流式响应
    const response = await fetchStreamResponse(topic.text, currentSessionId);
    
    // 只有在获取完流式响应后，才更新推荐话题
    if (response) {
      updateSuggestedTopics(topic.text);
    }

    // 添加视觉反馈
    const topicElements = document.querySelectorAll(".ai-suggestion-chip");
    topicElements.forEach((el) => {
      if (el.textContent.includes(topic.text)) {
        el.classList.add("topic-selected");
        setTimeout(() => {
          el.classList.remove("topic-selected");
        }, 500);
      }
    });
  };

  // 处理推荐内容点击
  const handleRecommendationClick = (recommendation) => {
    setSelectedReadItem(recommendation);
  };

  // 关闭推荐内容详情
  const handleCloseReadDetail = () => {
    setSelectedReadItem(null);
  };

  // 关闭当前推荐
  const handleCloseRecommendation = () => {
    setCurrentRecommendation(null);
    if (recommendationTimerRef.current) {
      clearTimeout(recommendationTimerRef.current);
    }
  };

  // 加载历史聊天记录
  const loadChatHistory = async () => {
    try {
      const response = await instance.get("/ai/chat-history", {
        params: {
          pageNum: page,
          pageSize: pageSize,
        },
      });
      if (response.data && response.data.code === 200 && response.data.data) {
        setChatHistory(response.data.data);
      }
    } catch (error) {
      console.error("加载聊天历史失败:", error);
    }
  };

  // 处理历史记录加载更多
  const handleLoadMoreHistory = () => {
    setPage((prevPage) => prevPage + 1);
    loadChatHistory();
  };

  // 清空聊天历史
  const handleClearHistory = async () => {
    try {
      const response = await instance.post("/ai/clear-chat-history");

      if (response.data && response.data.code === 200) {
        // 清空本地聊天历史
        setChatHistory([]);
        // 创建新会话
        createNewSession();
      }
    } catch (error) {
      console.error("清空聊天历史失败:", error);
    }
  };

  // 切换历史面板显示
  const toggleHistoryPanel = () => {
    setShowHistoryPanel(!showHistoryPanel);
    if (showFavoritesPanel) {
      setShowFavoritesPanel(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* 主要AI卡片区域 */}
      <div className="ai-card blue-theme">
       
        {/* 卡片头部 */}
        <div className="ai-card-header">
          <div className="ai-header-left">
            <i className="fas fa-robot"></i>
            <h3>AI智能助手</h3>
          </div>
          <div className="ai-header-actions">
            <button 
              className="ai-header-btn"
              onClick={toggleHistoryPanel}
              aria-label="历史记录"
              title="查看历史记录"
            >
              <i className="fas fa-history"></i>
            </button>
            <button
              className="ai-expand-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "收起" : "展开"}
            >
              <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
            </button>
          </div>
        </div>

        {/* 输入框区域 - 始终显示 */}
        <div className="ai-input-area">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="问我任何问题..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            ref={messageInputRef}
            className="ai-message-input"
            disabled={isLoading}
          />
          <button
            className="ai-send-button"
            onClick={handleSendMessage}
            aria-label="发送"
            disabled={isLoading}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
          {(isLoading || isTyping || (currentStreamingMessage && currentStreamingMessage.trim() !== '')) && (
            <button
              className="ai-cancel-button"
              onClick={handleCancelStreaming}
              aria-label="取消"
              style={{ marginLeft: 8 }}
            >
              <i className="fas fa-times"></i> 取消
            </button>
          )}
        </div>

        {/* 猜你想了解 - 始终显示 */}
        <div className="ai-suggestions">
          <div className="ai-suggestions-label">
            <i className="fas fa-lightbulb"></i>
            <span>猜你想了解</span>
          </div>
          <Slider {...settings} ref={sliderRef}>
            {suggestedTopics.map((topic) => (
              <button
                key={topic.id}
                className="ai-suggestion-chip"
                onClick={() => handleTopicClick(topic)}
                disabled={isLoading}
              >
                {topic.icon && <i className={`fas fa-${topic.icon}`}></i>}
                {topic.text}
              </button>
            ))}
          </Slider>
        </div>

        {/* 聊天历史区域 - 可折叠 */}
        {isExpanded && (
          <div className="ai-chat-history">
            {aiChatHistory.map((chat, index) => (
              <div
                key={index}
                className={`ai-chat-message ${chat.type}-message`}
              >
                <div className="ai-chat-bubble">
                  {/* {chat.type === "ai" && (
                    <i className="fas fa-robot ai-icon"></i>
                  )}
                  {chat.type === "user" && (
                    <i className="fas fa-user ai-icon"></i>
                  )} */}
                  <div className="ai-chat-text">
                    {chat.type === "ai"
                      ? renderMessageContent(chat.message, index)
                      : chat.message}
                  </div>
                </div>
              </div>
            ))}

            {/* 滚动到最新消息的锚点 */}
            <div ref={chatEndRef}></div>

            {/* 正在流式生成的消息 */}
            {currentStreamingMessage && currentStreamingMessage.trim() !== '' && (
              <div className="ai-chat-message ai-message">
                <div className="ai-chat-bubble">
                  <div className="ai-chat-text">
                    {(() => {
                      try {
                        return renderMessageContent(currentStreamingMessage, 'streaming');
                      } catch (error) {
                        console.error("渲染流式消息出错:", error);
                        return <div>{currentStreamingMessage}</div>;
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* 输入指示器 */}
            {isTyping && !currentStreamingMessage && (
              <div className="ai-chat-message ai-message">
                <div className="ai-chat-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 当前推荐内容 - 插入在聊天历史区域后面 */}
      {currentRecommendation && (
        <div className="ai-recommendation-card">
          <div className="ai-recommendation-header">
            <div className="ai-recommendation-title">
              <i className="fas fa-book-reader"></i>
              <span>AI推荐阅读</span>
            </div>
            <button
              className="ai-recommendation-close"
              onClick={handleCloseRecommendation}
              aria-label="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div
            className="ai-recommendation-content"
            onClick={() => handleRecommendationClick(currentRecommendation)}
          >
            <div className="ai-recommendation-image-container">
              <img
                src={currentRecommendation.image}
                alt={currentRecommendation.title}
                className="ai-recommendation-image"
              />
              <div className="ai-recommendation-overlay">
                <i className="fas fa-search-plus"></i>
              </div>
            </div>
            <div className="ai-recommendation-info">
              <h4>{currentRecommendation.title}</h4>
              <p>{currentRecommendation.summary}</p>
              <div className="ai-recommendation-action">
                点击查看详情
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 选中的阅读项详情浮框 */}
      {selectedReadItem && (
        <div className="ai-read-detail-overlay" onClick={handleCloseReadDetail}>
          <div className="ai-read-detail" onClick={(e) => e.stopPropagation()}>
            <div className="ai-read-detail-header">
              <div className="ai-read-detail-title">
                <i className={`fas fa-${selectedReadItem.icon}`}></i>
                <h3>{selectedReadItem.title}</h3>
              </div>
              <button
                className="ai-read-detail-close"
                onClick={handleCloseReadDetail}
                aria-label="关闭"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="ai-read-detail-content">
              {selectedReadItem.image && (
                <div className="ai-read-detail-image-container">
                  <img
                    src={selectedReadItem.image}
                    alt={selectedReadItem.title}
                    className="ai-read-detail-image"
                  />
                </div>
              )}
              <p>{selectedReadItem.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* 历史记录面板 */}
      {showHistoryPanel && (
        <div className="ai-panel history-panel">
          <div className="ai-panel-header">
            <h3>历史记录</h3>
            <div className="ai-panel-actions">
              <button
                onClick={handleClearHistory}
                className="ai-panel-action-btn"
                title="清空历史"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              <button onClick={toggleHistoryPanel} className="ai-panel-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div className="ai-panel-content">
            {chatHistory.length > 0 ? (
              <div className="ai-history-list">
                {chatHistory.map((item, index) => (
                  <div key={index} className={`ai-history-item ${item.type}`}>
                    <div className="ai-history-meta">
                      <span className="ai-history-time">{item.timestamp}</span>
                      <span className="ai-history-type">
                        {item.type === "user" ? "我" : "AI"}
                      </span>
                    </div>
                    <div className="ai-history-message">{item.message}</div>
                  </div>
                ))}
                <button
                  className="ai-load-more"
                  onClick={handleLoadMoreHistory}
                >
                  加载更多
                </button>
              </div>
            ) : (
              <div className="ai-empty-state">
                <i className="fas fa-history"></i>
                <p>暂无历史记录</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes定义
AiAssistant.propTypes = {
  userInfo: PropTypes.shape({
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default AiAssistant;
