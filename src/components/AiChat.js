import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import NavBar from './NavBar';
import './AiChat.css';

const AiChat = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [suggestions, setSuggestions] = useState([
    '今天有什么好玩的活动推荐？',
    '帮我推荐几本值得阅读的书籍',
    '如何提高工作效率？',
    '今日热门话题是什么？'
  ]);

  // 初始化聊天
  useEffect(() => {
    // 添加欢迎消息
    setMessages([
      {
        type: 'ai',
        content: '你好！我是你的AI助手，有什么我可以帮助你的吗？',
        time: new Date().toISOString()
      }
    ]);
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 添加用户消息
    const newUserMessage = {
      type: 'user',
      content: inputMessage,
      time: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponses = [
        "我理解你的问题，让我来帮助你解决。根据我的分析，这个问题可以从多个角度思考...",
        "这是个很好的问题！我找到了一些相关信息，希望对你有帮助。首先，我们需要考虑...",
        "根据最新数据，我可以给你提供以下信息和建议...",
        "我建议你可以尝试这个方法：首先，明确你的目标；其次，制定具体计划；最后，坚持执行并调整...",
        "很高兴能帮到你！这个问题的答案是多方面的，让我为你梳理一下关键点..."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAiMessage = {
        type: 'ai',
        content: randomResponse,
        time: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      setIsTyping(false);
      
      // 更新建议问题
      setSuggestions([
        '能详细解释一下你刚才的回答吗？',
        '有没有相关的实际案例？',
        '还有其他解决方案吗？',
        '这方面有什么最新研究吗？'
      ]);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <i className="fas fa-robot"></i>
          <h1>AI智能助手</h1>
        </div>
        <p className="ai-chat-subtitle">随时为你解答问题，提供智能帮助</p>
      </div>

      <div className="ai-chat-messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}-message`}>
            {message.type === 'ai' && (
              <div className="message-avatar ai-avatar">
                <i className="fas fa-robot"></i>
              </div>
            )}
            <div className="message-bubble">
              <div className="message-content">{message.content}</div>
              <div className="message-time">{formatTime(message.time)}</div>
            </div>
            {message.type === 'user' && (
              <div className="message-avatar user-avatar">
                {userInfo?.nickname?.charAt(0) || '我'}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message ai-message">
            <div className="message-avatar ai-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-suggestions">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index} 
            className="suggestion-button"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="ai-chat-input-container">
        <input
          type="text"
          className="ai-chat-input"
          placeholder="输入你的问题..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="ai-chat-send-button"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>

      <NavBar />
    </div>
  );
};

export default AiChat; 