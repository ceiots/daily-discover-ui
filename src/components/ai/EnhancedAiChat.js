import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './EnhancedAiChat.css';
import instance from '../../utils/axios';
import { useAuth } from '../../App';
import { getImage } from '../DailyAiApp';

// AI头像默认数据URL - 使用紫色渐变的AI图标
const AI_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5MzMzZWEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTM1LDkwIEMxMzUsNzAgMTIwLDU1IDEwMCw1NSBDODAsNTUgNjUsNzAgNjUsOTAgQzY1LDEwMCA3MCwxMDkgNzgsMTE0IEw3OCwxMzAgQzc4LDEzNSA4MiwxNDAgOTAsMTQwIEwxMTAsMTQwIEMxMTgsMTQwIDEyMiwxMzUgMTIyLDEzMCBMMTIyLDExNCBDMTMwLDEwOSAxMzUsMTAwIDEzNSw5MCBaIE05MCwxMjAgTDExMCwxMjAgTDExMCwxMzAgTDkwLDEzMCBaIE03OSwxMTEgQzc0LDEwNyA3MCwxMDAgNzAsOTAgQzcwLDcyIDg0LDYwIDEwMCw2MCBDMTE2LDYwIDEzMCw3MiAxMzAsOTAgQzEzMCwxMDAgMTI2LDEwNyAxMjEsMTExIEwxMjEsOTUgQzEyMSw4NCAxMTIsNzUgMTAwLDc1IEM4OCw3NSA3OSw4NCA3OSw5NSBaIE05Nyw3NSBDOTcsNzcgOTgsNzggMTAwLDc4IEMxMDIsNzggMTAzLDc3IDEwMyw3NSBDMTAzLDczIDEwMiw3MiAxMDAsNzIgQzk4LDcyIDk3LDczIDk3LDc1IFogTTEwNSw5NiBDMTA1LDk4IDEwNyw5OSAxMDksOTkgQzExMSw5OSAxMTMsOTggMTEzLDk2IEMxMTMsOTQgMTExLDkzIDEwOSw5MyBDMTA3LDkzIDEwNSw5NCAxMDUsOTYgWiBNODcsOTYgQzg3LDk4IDg5LDk5IDkxLDk5IEM5Myw5OSA5NSw5OCA5NSw5NiBDOTUsOTQgOTMsOTMgOTEsOTMgQzg5LDkzIDg3LDk0IDg3LDk2IFoiLz48L3N2Zz4=';

const EnhancedAiChat = ({ onRequestArticle }) => {
  const { isLoggedIn, userInfo } = useAuth();
  const [messages, setMessages] = useState([
    { type: 'ai', text: '您好！我是您的AI助手，可以为您推荐商品、回答问题或创建内容。有什么可以帮您的？' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognition = useRef(null);

  // 快捷提问选项
  const quickQuestions = [
    "推荐今日好物",
    "热门数码产品",
    "如何选择智能家居",
    "帮我写篇产品文章"
  ];

  // 自动滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始化语音识别
  const initSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition.current = new SpeechRecognition();
    speechRecognition.current.lang = 'zh-CN';
    speechRecognition.current.continuous = false;
    speechRecognition.current.interimResults = false;

    speechRecognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };

    speechRecognition.current.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      setIsVoiceActive(false);
    };

    speechRecognition.current.onend = () => {
      setIsVoiceActive(false);
    };
  };

  // 处理语音输入切换
  const toggleVoiceInput = () => {
    if (!speechRecognition.current) {
      initSpeechRecognition();
    }

    if (isVoiceActive) {
      speechRecognition.current.stop();
    } else {
      try {
        speechRecognition.current.start();
        setIsVoiceActive(true);
      } catch (error) {
        console.error('启动语音识别失败:', error);
      }
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    // 添加用户消息到聊天记录
    const userMessage = { type: 'user', text: userInput };
    setMessages([...messages, userMessage]);
    
    // 清空输入框并设置加载状态
    setUserInput('');
    setIsLoading(true);

    try {
      // 检查是否登录
      if (!isLoggedIn) {
        setMessages(prev => [...prev, { type: 'ai', text: '请先登录后再使用AI助手功能' }]);
        setIsLoading(false);
        return;
      }

      // 检查是否请求创建文章
      if (userInput.includes('写篇') || userInput.includes('创建文章') || userInput.includes('生成文章')) {
        onRequestArticle && onRequestArticle(userInput);
        setMessages(prev => [...prev, { type: 'ai', text: '好的，我可以帮您创建一篇文章。请稍等...' }]);
        setIsLoading(false);
        return;
      }

      // 发送请求到后端
      const response = await instance.post('/ai/chat', { prompt: userInput });
      if (response.data && response.data.data) {
        const aiText = response.data.data;
        setMessages(prev => [...prev, { type: 'ai', text: aiText }]);
      } else {
        setMessages(prev => [...prev, { type: 'ai', text: '抱歉，我无法处理您的请求，请稍后再试' }]);
      }
    } catch (error) {
      console.error('AI请求失败:', error);
      setMessages(prev => [...prev, { type: 'ai', text: '连接AI服务出错，请稍后再试' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理输入框键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 处理快捷问题点击
  const handleQuickQuestion = (question) => {
    setUserInput(question);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  // 处理图片上传
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 实际项目中这里应该上传图片到服务器并获取URL
        const userMessage = { type: 'user', text: '上传了一张图片', isImage: true };
        setMessages([...messages, userMessage]);
        
        // 模拟AI响应
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: '我看到您上传了一张图片。这似乎是一张商品图片，需要我为您分析或推荐类似商品吗？' 
          }]);
        }, 1000);
      }
    };
    input.click();
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImage('avatar');
  };

  return (
    <div className="ai-chat-card" style={{ marginBottom: '10px', padding: '10px' }}>
      <div className="ai-chat-header" style={{ padding: '10px 12px' }}>
        <div className="ai-info">
          <div className="ai-avatar">
            <img src={getImage('avatar')} alt="AI助手" onError={handleImageError} />
          </div>
          <div>
            <h3 className="ai-name">智能助手</h3>
            <p className="ai-description">随时为您提供帮助</p>
          </div>
        </div>
      </div>
      
      <div className="ai-chat-body" style={{ maxHeight: '220px', padding: '10px' }}>
        <div className="chat-messages" ref={messagesEndRef} style={{ padding: '5px 0' }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-message ${message.type} ${message.isImage ? 'image-message' : ''}`}
            >
              {message.type === 'ai' && (
                <div className="assistant-message">
                  <div className="message-content">{message.text}</div>
                </div>
              )}
              {message.type === 'user' && (
                <div className="user-message">
                  <div className="message-content">{message.text}</div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="loading-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="ai-chat-footer" style={{ padding: '8px 10px' }}>
        <div className="quick-questions" style={{ marginBottom: '8px' }}>
          <button 
            className="quick-question"
            onClick={() => handleQuickQuestion("推荐今日热门商品")}
          >
            今日热门
          </button>
          <button 
            className="quick-question"
            onClick={() => handleQuickQuestion("推荐性价比最高的商品")}
          >
            性价比推荐
          </button>
          <button 
            className="quick-question"
            onClick={() => handleQuickQuestion("帮我写篇商品评测文章")}
          >
            生成文章
          </button>
        </div>
        
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="输入您的问题..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="voice-input-btn"
            onClick={toggleVoiceInput}
            style={{ backgroundColor: isVoiceActive ? '#7269ef' : '' }}
          >
            <i className={`fas ${isVoiceActive ? 'fa-stop' : 'fa-microphone'}`}></i>
          </button>
          <button className="image-input-btn" onClick={handleImageUpload}>
            <i className="fas fa-image"></i>
          </button>
          <button 
            className="send-btn" 
            onClick={sendMessage}
            disabled={isLoading || !userInput.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

EnhancedAiChat.propTypes = {
  onRequestArticle: PropTypes.func.isRequired
};

export default EnhancedAiChat; 