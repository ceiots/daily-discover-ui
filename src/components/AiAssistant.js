import React, { useState, useEffect, useRef } from 'react';
import './AiAssistant.css';
import PropTypes from 'prop-types';
AiAssistant.propTypes = {
    userInfo: PropTypes.shape({
      name: PropTypes.string,
      // 其他需要的属性
    })
  };

const AiAssistant = ({ userInfo }) => {
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiTopics, setAiTopics] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  
  const chatEndRef = useRef(null);

  // 加载初始数据
  useEffect(() => {
    // 设置AI建议
    setAiSuggestion({
      title: "AI助手建议",
      content: "根据您最近的兴趣，我推荐您可以了解「数字极简主义」，这是一种帮助人们减少数字干扰、提高专注力的生活理念。",
      icon: "lightbulb"
    });
    
    // 加载热门话题
    setAiTopics([
      { id: 1, text: "数字极简主义", icon: "mobile-alt" },
      { id: 2, text: "每日冥想技巧", icon: "brain" },
      { id: 3, text: "健康饮食新趋势", icon: "apple-alt" },
      { id: 4, text: "高效工作法", icon: "briefcase" },
      { id: 5, text: "睡眠质量提升", icon: "moon" },
      { id: 6, text: "减压放松方法", icon: "spa" },
      { id: 7, text: "居家健身计划", icon: "dumbbell" },
    ]);
  }, []);

  // 确保聊天窗口滚动到最新消息
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory]);

  const handleAiChatToggle = () => {
    setShowAiChat(prev => !prev);
    if (!showAiChat && aiChatHistory.length === 0) {
      // 添加默认欢迎消息
      setAiChatHistory([
        { type: 'ai', message: '你好！我是你的AI助手，有什么我可以帮助你的吗？' }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // 添加用户消息到聊天历史
    setAiChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    
    // 保存当前用户消息
    const currentMessage = userMessage;
    
    // 清空输入框
    setUserMessage('');
    
    // 显示AI正在输入的状态
    setIsTyping(true);
    
    // 根据关键词生成更智能的回复
    setTimeout(() => {
      let aiResponse = generateAiResponse(currentMessage);
      
      // 添加AI回复到聊天历史
      setAiChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  // 处理话题点击 - 优化功能实现一键代入热门词
  const handleTopicClick = (topic) => {
    // 设置搜索词到输入框
    setUserMessage(topic.text);
    
    // 如果聊天框没有打开，则自动打开
    if (!showAiChat) {
      setShowAiChat(true);
      // 如果是首次打开，添加欢迎消息
      if (aiChatHistory.length === 0) {
        setAiChatHistory([
          { type: 'ai', message: '你好！我是你的AI助手，有什么我可以帮助你的吗？' }
        ]);
      }
    }
    
    // 直接发送消息，无需用户再点击发送按钮
    setAiChatHistory(prev => [...prev, { type: 'user', message: topic.text }]);
    setIsTyping(true);
    
    // 生成AI回复
    setTimeout(() => {
      let aiResponse = generateAiResponse(topic.text);
      setAiChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
      setIsTyping(false);
    }, 1000);
    
    // 添加视觉反馈
    const topicElements = document.querySelectorAll('.ai-topic-bubble');
    topicElements.forEach(el => {
      if (el.textContent.includes(topic.text)) {
        el.classList.add('topic-selected');
        setTimeout(() => {
          el.classList.remove('topic-selected');
        }, 500);
      }
    });
  };

  // 生成AI回复的辅助函数
  const generateAiResponse = (message) => {
    // 根据关键词生成更智能的回复
    if (message.includes("数字极简主义")) {
      return "数字极简主义是一种减少数字干扰的生活方式，研究表明它能提高专注力40%，每天节省约1.5小时的时间。要开始实践，可以从设置手机免打扰、整理应用和限制社交媒体使用时间开始。";
    } else if (message.includes("冥想")) {
      return "每天进行10-15分钟的冥想可以显著降低压力水平，提高注意力，改善睡眠质量。我可以推荐一些适合初学者的冥想技巧和应用，你想了解哪方面的信息？";
    } else if (message.includes("健康饮食") || message.includes("饮食")) {
      return "植物性饮食是2023年的主要趋势之一，研究表明它可以减少30%的慢性疾病风险。均衡的饮食结构应包括多样化的蔬果、全谷物、优质蛋白和健康脂肪，每天喝足够的水也很重要。";
    } else if (message.includes("高效工作") || message.includes("效率")) {
      return "高效工作的关键包括：番茄工作法（25分钟专注工作+5分钟休息）、批处理类似任务、减少多任务处理、设定明确目标和优先级，以及创建无干扰的工作环境。";
    } else if (message.includes("睡眠") || message.includes("失眠")) {
      return "提升睡眠质量的技巧：坚持规律的睡眠时间表、睡前1小时避免电子屏幕、创建舒适的睡眠环境（温度18-20℃、黑暗、安静）、睡前放松活动如阅读或冥想，以及白天适度运动。";
    } else if (message.includes("减压") || message.includes("压力") || message.includes("放松")) {
      return "有效的减压方法包括：深呼吸练习（4秒吸气-7秒屏息-8秒呼气）、规律运动、与朋友交流、适当休息、大自然疗愈和限制咖啡因摄入。持续的高压可能导致多种健康问题，建议及时寻求专业帮助。";
    } else if (message.includes("健身") || message.includes("运动")) {
      return "居家健身不需要复杂器材，高效的计划应包括：每周3-5次锻炼、结合有氧和力量训练、专注大肌群复合动作（如深蹲、俯卧撑）、合理休息和充分水分摄入。科学表明每周150分钟中等强度运动可显著改善健康。";
    } else {
      // 随机通用回复
      const responses = [
        "这是个很好的问题！根据最新研究，" + message + "相关的领域有很多新发现。您想了解哪方面的具体内容？",
        "关于" + message + "，有几个关键点值得注意：首先，它与我们的日常习惯密切相关；其次，小的改变可以带来显著效果；最后，坚持是最重要的。您需要更详细的建议吗？",
        "我找到了一些关于" + message + "的实用信息。研究表明，70%的人通过调整日常习惯获得了明显改善。您想了解如何开始吗？",
        "关于" + message + "，专家建议从小目标开始，逐步建立长期习惯。这种方法的成功率提高了约60%。我可以提供一个简单的入门计划。",
        "很高兴您对" + message + "感兴趣！这是近期热门话题，对提升生活质量有显著帮助。您是想了解理论知识还是实践方法？"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-suggestion-card">
        <div className="ai-suggestion-header">
          <i className="fas fa-lightbulb"></i>
          <h3>AI助手建议</h3>
        </div>
        <div className="ai-suggestion-content">
          {aiSuggestion?.content || "根据您最近的兴趣，我推荐您可以了解「数字极简主义」，这是一种帮助人们减少数字干扰、提高专注力的生活理念。"}
        </div>
        <button className="ai-chat-button" onClick={handleAiChatToggle}>
          <i className="fas fa-comments"></i> {showAiChat ? '关闭对话' : '开始对话'}
        </button>
        
        {/* 热门话题整合到AI助手卡片中 */}
        <div className="ai-topics-wrapper">
          <div className="ai-topics-label">
            <i className="fas fa-fire"></i>猜你想了解
          </div>
          <div className="ai-topics-scroll">
            {aiTopics.map(topic => (
              <div 
                key={topic.id} 
                className={`ai-topic-bubble`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic.icon && <i className={`fas fa-${topic.icon}`}></i>}
                {topic.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* AI聊天窗口 */}
      {showAiChat && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="chat-title">
              <i className="fas fa-robot"></i>
              <span>AI助手</span>
            </div>
            <button className="close-chat-btn" onClick={handleAiChatToggle}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="ai-chat-messages">
            {aiChatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.type}-message`}>
                <div className="message-bubble">
                  {chat.type === 'ai' && <i className="fas fa-robot message-icon"></i>}
                  <span className="message-text">{chat.message}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message ai-message">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="ai-chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="输入问题..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-message-btn" onClick={handleSendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant; 