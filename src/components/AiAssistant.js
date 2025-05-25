import React, { useState, useEffect, useRef } from "react";
import "./AiAssistant.css";
import PropTypes from "prop-types";

const AiAssistant = ({ userInfo }) => {
  const [userMessage, setUserMessage] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiTopics, setAiTopics] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null); // 当前推荐的内容`
  const [quickReads, setQuickReads] = useState([]);
  const [selectedReadItem, setSelectedReadItem] = useState(null); // 当前选中的阅读项

  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const recommendationTimerRef = useRef(null); // 定时器引用

  // 滚动到最新消息
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [aiChatHistory]);

  // 推荐内容自动关闭定时器
  useEffect(() => {
    if (currentRecommendation) {
      // 设置1分钟后自动关闭
      recommendationTimerRef.current = setTimeout(() => {
        setCurrentRecommendation(null);
      }, 60000); // 60秒 = 1分钟
    }

    // 清除定时器
    return () => {
      if (recommendationTimerRef.current) {
        clearTimeout(recommendationTimerRef.current);
      }
    };
  }, [currentRecommendation]);

  // 加载初始数据
  useEffect(() => {
    // 添加默认欢迎消息
    if (aiChatHistory.length === 0) {
      setAiChatHistory([
        {
          type: "ai",
          message: "你好！我是你的AI助手，有什么我可以帮助你的吗？",
        },
      ]);
    }

    // 加载热门话题
    const initialTopics = [
      { id: 1, text: "数字极简主义", icon: "mobile-alt" },
      { id: 2, text: "每日冥想技巧", icon: "brain" },
      { id: 3, text: "健康饮食新趋势", icon: "apple-alt" },
      { id: 4, text: "高效工作法", icon: "briefcase" },
      { id: 5, text: "睡眠质量提升", icon: "moon" },
      { id: 6, text: "减压放松方法", icon: "spa" },
      { id: 7, text: "居家健身计划", icon: "dumbbell" },
    ];

    setAiTopics(initialTopics);
    setSuggestedTopics(initialTopics.slice(0, 4));

    // 设置快速阅读内容
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
  }, []);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // 添加用户消息到聊天历史
    setAiChatHistory((prev) => [
      ...prev,
      { type: "user", message: userMessage },
    ]);

    // 保存当前用户消息
    const currentMessage = userMessage;

    // 清空输入框
    setUserMessage("");

    // 显示AI正在输入的状态
    setIsTyping(true);

    // 随机选择一条推荐内容显示
    const randomRecommendation =
      quickReads[Math.floor(Math.random() * quickReads.length)];
    setCurrentRecommendation(randomRecommendation);

    // 模拟API延迟
    setTimeout(() => {
      let aiResponse = generateAiResponse(currentMessage);

      // 添加AI回复到聊天历史
      setAiChatHistory((prev) => [
        ...prev,
        { type: "ai", message: aiResponse },
      ]);
      setIsTyping(false);

      // 更新推荐话题
      updateSuggestedTopics(currentMessage);

      // 滚动到最新消息位置
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }

    }, 1500);


    // 自动展开聊天区域
    setIsExpanded(true);

    // 聚焦输入框，方便继续输入
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // 处理话题点击 - 直接发送到AI
  const handleTopicClick = (topic) => {
    // 设置消息并发送
    setUserMessage(topic.text);

    // 直接发送到AI
    setAiChatHistory((prev) => [
      ...prev,
      { type: "user", message: topic.text },
    ]);
    setIsTyping(true);

    // 随机选择一条推荐内容显示
    const randomRecommendation =
      quickReads[Math.floor(Math.random() * quickReads.length)];
    setCurrentRecommendation(randomRecommendation);

    // 模拟API延迟
    setTimeout(() => {
      let aiResponse = generateAiResponse(topic.text);
      setAiChatHistory((prev) => [
        ...prev,
        { type: "ai", message: aiResponse },
      ]);
      setIsTyping(false);

      // 更新推荐话题
      updateSuggestedTopics(topic.text);

      // 滚动到最新消息位置
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }

    }, 1500);

    // 自动展开聊天区域
    setIsExpanded(true);

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

  // 根据用户输入更新推荐话题
  const updateSuggestedTopics = (userInput) => {
    // 这里可以接入真实AI接口进行兴趣预测
    // 简化版：根据关键词匹配
    const userInputLower = userInput.toLowerCase();
    let newSuggestions = [];

    // 健康相关
    if (
      userInputLower.includes("健康") ||
      userInputLower.includes("饮食") ||
      userInputLower.includes("营养")
    ) {
      newSuggestions.push(
        { id: 101, text: "地中海饮食的好处", icon: "utensils" },
        { id: 102, text: "每日营养摄入指南", icon: "apple-alt" },
        { id: 103, text: "减少加工食品的方法", icon: "carrot" }
      );
    }

    // 心理健康相关
    else if (
      userInputLower.includes("压力") ||
      userInputLower.includes("焦虑") ||
      userInputLower.includes("冥想")
    ) {
      newSuggestions.push(
        { id: 201, text: "压力管理的5个步骤", icon: "spa" },
        { id: 202, text: "冥想如何改变大脑", icon: "brain" },
        { id: 203, text: "工作日减压小习惯", icon: "heart" }
      );
    }

    // 工作效率相关
    else if (
      userInputLower.includes("效率") ||
      userInputLower.includes("工作") ||
      userInputLower.includes("专注")
    ) {
      newSuggestions.push(
        { id: 301, text: "番茄工作法详解", icon: "clock" },
        { id: 302, text: "如何减少工作干扰", icon: "ban" },
        { id: 303, text: "提高专注力的食物", icon: "apple-alt" }
      );
    }

    // 科技相关
    else if (
      userInputLower.includes("手机") ||
      userInputLower.includes("数字") ||
      userInputLower.includes("科技")
    ) {
      newSuggestions.push(
        { id: 401, text: "健康使用手机的方法", icon: "mobile-alt" },
        { id: 402, text: "数字断舍离实践指南", icon: "trash-alt" },
        { id: 403, text: "如何设置手机减少干扰", icon: "sliders-h" }
      );
    }

    // 如果没有特定匹配，随机生成一些相关话题
    if (newSuggestions.length === 0) {
      const randomTopics = aiTopics.sort(() => 0.5 - Math.random()).slice(0, 3);

      newSuggestions = randomTopics;

      // 添加一个与当前输入相关的话题
      if (userInputLower.length > 2) {
        newSuggestions.unshift({
          id: Math.floor(Math.random() * 1000) + 500,
          text: `深入了解${userInput}的方法`,
          icon: "search",
        });
      }
    }

    // 更新推荐话题
    setSuggestedTopics(newSuggestions.slice(0, 4));
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
    } else if (
      message.includes("减压") ||
      message.includes("压力") ||
      message.includes("放松")
    ) {
      return "有效的减压方法包括：深呼吸练习（4秒吸气-7秒屏息-8秒呼气）、规律运动、与朋友交流、适当休息、大自然疗愈和限制咖啡因摄入。持续的高压可能导致多种健康问题，建议及时寻求专业帮助。";
    } else if (message.includes("健身") || message.includes("运动")) {
      return "居家健身不需要复杂器材，高效的计划应包括：每周3-5次锻炼、结合有氧和力量训练、专注大肌群复合动作（如深蹲、俯卧撑）、合理休息和充分水分摄入。科学表明每周150分钟中等强度运动可显著改善健康。";
    } else {
      // 随机通用回复
      const responses = [
        "这是个很好的问题！根据最新研究，" +
          message +
          "相关的领域有很多新发现。您想了解哪方面的具体内容？",
        "关于" +
          message +
          "，有几个关键点值得注意：首先，它与我们的日常习惯密切相关；其次，小的改变可以带来显著效果；最后，坚持是最重要的。您需要更详细的建议吗？",
        "我找到了一些关于" +
          message +
          "的实用信息。研究表明，70%的人通过调整日常习惯获得了明显改善。您想了解如何开始吗？",
        "关于" +
          message +
          "，专家建议从小目标开始，逐步建立长期习惯。这种方法的成功率提高了约60%。我可以提供一个简单的入门计划。",
        "很高兴您对" +
          message +
          "感兴趣！这是近期热门话题，对提升生活质量有显著帮助。您是想了解理论知识还是实践方法？",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* 主要AI卡片区域 */}
      <div className="ai-card blue-theme">
        <div className="ai-card-header">
          <div className="ai-header-left">
            <i className="fas fa-robot"></i>
            <h3>AI智能助手</h3>
          </div>
          <button
            className="ai-expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "收起" : "展开"}
          >
            <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
          </button>
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
          />
          <button
            className="ai-send-button"
            onClick={handleSendMessage}
            aria-label="发送"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* 猜你想了解 - 始终显示 */}
        <div className="ai-suggestions">
          <div className="ai-suggestions-label">
            <i className="fas fa-lightbulb"></i>
            <span>猜你想了解</span>
          </div>
          <div className="ai-suggestions-list">
            {suggestedTopics.map((topic) => (
              <button
                key={topic.id}
                className="ai-suggestion-chip"
                onClick={() => handleTopicClick(topic)}
              >
                {topic.icon && <i className={`fas fa-${topic.icon}`}></i>}
                {topic.text}
              </button>
            ))}
          </div>
        </div>

        {/* 聊天历史区域 - 可折叠 */}
        {isExpanded && (
          <div className="ai-chat-history">
            {aiChatHistory.map((chat, index) => (
              <div
                key={index}
                className={`ai-chat-message ${chat.type}-message`}
              > 
                {/* 滚动到最新消息的锚点 */}
                <div ref={chatEndRef}></div>
                <div className="ai-chat-bubble">
                  {chat.type === "ai" && (
                    <i className="fas fa-robot ai-icon"></i>
                  )}
                  {chat.type === "user" && (
                    <i className="fas fa-user ai-icon"></i>
                  )}
                  <div className="ai-chat-text">{chat.message}</div>
                </div>
              </div>
            ))}

            

            {/* 输入指示器 */}
            {isTyping && (
              <div className="ai-chat-message ai-message">
                <div className="ai-chat-bubble typing">
                  <i className="fas fa-robot ai-icon"></i>
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
    </div>
  );
};

// PropTypes定义
AiAssistant.propTypes = {
  userInfo: PropTypes.shape({
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    // 其他用户信息属性
  }),
};

export default AiAssistant;
