import React, { useState, useRef, useEffect } from 'react';
import './AiChatInterface.css';
import instance from '../../utils/axios';
import { useAuth } from '../../App';
import PropTypes from 'prop-types';

const AiChatInterface = ({ onLoadingChange, onRequestArticle, placeholder }) => {
  const { isLoggedIn } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [promptSuggestions, setPromptSuggestions] = useState([
    '推荐高效办公AI工具',
    '如何利用AI提升效率？',
    '帮我写篇关于AI的文章',
    '最新AI技术趋势'
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(placeholder || '今天想和AI聊点什么？');

  // 轮换显示不同的提示文本
  useEffect(() => {
    const placeholders = [
      '今天想和AI聊点什么？',
      'AI已就绪，请吩咐…',
      '告诉我你的好奇心，AI为你解答',
      '有什么可以帮到你？',
      '输入问题，探索AI的无限可能'
    ];
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setPlaceholderText(placeholders[currentIndex]);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    // 当用户输入时，取消选中的建议
    if (selectedSuggestion !== null) {
      setSelectedSuggestion(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    
    if (!userMessage) return;
    
    // 添加用户消息到对话列表
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    
    // 检查是否是文章生成请求
    if (userMessage.toLowerCase().includes('写篇') || 
        userMessage.toLowerCase().includes('写一篇') || 
        userMessage.toLowerCase().includes('生成一篇')) {
      // 通知父组件处理文章请求
      if (onRequestArticle) {
        onRequestArticle(userMessage);
      }
      return;
    }
    
    // 设置加载状态
    setIsTyping(true);
    if (onLoadingChange) {
      onLoadingChange(true, userMessage);
    }
    
    try {
      // 调用AI接口
      const response = await instance.post('/ai/chat', { message: userMessage });
      
      if (response.data && response.data.code === 200) {
        // 添加AI回复到对话列表
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.data }]);
      } else {
        // 处理错误响应
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '抱歉，我遇到了一些问题，请稍后再试。' 
        }]);
      }
    } catch (error) {
      console.error('AI请求失败:', error);
      // 添加错误消息
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '网络连接出现问题，请检查您的网络并重试。' 
      }]);
    } finally {
      // 结束加载状态
      setIsTyping(false);
      if (onLoadingChange) {
        onLoadingChange(false, userMessage);
      }
    }
  };

  const handleSuggestionClick = (suggestion, index) => {
    setInputValue(suggestion);
    setSelectedSuggestion(index);
    inputRef.current.focus();
  };

  const handleVoiceInput = () => {
    // 切换语音输入状态
    setIsListening(prev => !prev);
    
    if (!isListening) {
      // 开始语音输入动画
      setIsAnimating(true);
      
      // 模拟语音识别 (实际项目中应使用Web Speech API)
      setTimeout(() => {
        setIsAnimating(false);
        setIsListening(false);
        setInputValue(prev => prev + "我想了解最新的AI技术应用");
      }, 3000);
    } else {
      // 停止语音输入
      setIsAnimating(false);
    }
  };

  return (
    <div className="ai-chat-interface">
      {/* 消息历史区域 */}
      {messages.length > 0 && (
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className={`${msg.role}-avatar`}>
                {msg.role === 'user' ? (
                  <i className="fas fa-user"></i>
                ) : (
                  <i className="fas fa-robot"></i>
                )}
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant-message">
              <div className="assistant-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholderText}
            className="chat-input"
          />
          
          <button 
            type="button" 
            className={`voice-input-btn ${isListening ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleVoiceInput}
          >
            <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
            {isAnimating && (
              <div className="voice-waves">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </button>
          
          <button 
            type="submit" 
            className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
            disabled={!inputValue.trim()}
          >
            <div className="send-icon-wrapper">
              <i className="fas fa-paper-plane"></i>
            </div>
          </button>
        </div>
        
        {/* 提示建议 */}
        {/* {messages.length === 0 && (
          <div className="prompt-suggestions">
            {promptSuggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`suggestion-chip ${selectedSuggestion === index ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion, index)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )} */}
      </form>
    </div>
  );
};

AiChatInterface.propTypes = {
  onLoadingChange: PropTypes.func,
  onRequestArticle: PropTypes.func,
  placeholder: PropTypes.string
};

AiChatInterface.defaultProps = {
  placeholder: '今天想和AI聊点什么？'
};

export default AiChatInterface; 