import React, { useState, useEffect, useRef } from "react";
import "./AiAssistant.css";
import PropTypes from "prop-types";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { API_BASE_URL } from "../config";

const AiAssistant = ({ userInfo }) => {
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiTopics, setAiTopics] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const recommendationTimerRef = useRef(null);
  const eventSourceRef = useRef(null);

  // 处理响应数据的辅助函数 - 移动到组件级别
  const processResponseData = (data) => {
    if (!data) return "";

    let cleanData = data;

    // 移除event:message前缀
    if (cleanData.includes("event:message")) {
      cleanData = cleanData.replace(/event:message\w*/g, "");
    }

    // 处理<think>标签 - 不再移除，而是转换为特殊样式的元素
    cleanData = cleanData.replace(
      /<think>([\s\S]*?)<\/think>/g,
      '<div class="ai-think-content">$1</div>'
    );

    return cleanData;
  };

  // 推荐内容自动关闭定时器
  useEffect(() => {
    if (currentRecommendation) {
      recommendationTimerRef.current = setTimeout(() => {
        setCurrentRecommendation(null);
      }, 60000);
    }

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
      // 创建新会话
      createNewSession();

      // 加载快速问题
      loadQuickQuestions();
    }

    // 加载热门话题
    loadTopics();

    // 设置快速阅读内容
    loadQuickReads();

    // 加载聊天历史
    loadChatHistory();
  }, []);

  // 组件卸载时关闭EventSource连接
  useEffect(() => {
    // 添加CSS样式来防止水平滚动
    const style = document.createElement("style");
    style.innerHTML = `
      .ai-chat-text {
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        max-width: 100%;
      }
      .ai-chat-bubble {
        max-width: 100%;
        overflow: hidden;
      }
      .ai-markdown-content {
        width: 100%;
        overflow-x: hidden;
      }
      .ai-markdown-content pre, .ai-markdown-content code {
        white-space: pre-wrap;
        word-break: break-all;
        overflow-wrap: break-word;
        max-width: 100%;
      }
      .ai-chat-message {
        width: 100%;
        max-width: 100%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // 创建新会话
  const createNewSession = () => {
    const sessionId = `session_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    setCurrentSessionId(sessionId);
    return sessionId;
  };

  // 加载快速问题
  const loadQuickQuestions = async () => {
    try {
      const response = await instance.get("/ai/quick-questions");
      if (response.data && response.data.data) {
        const questionTopics = response.data.data.map((question, index) => ({
          id: `q-${index}`,
          text: question,
          icon: getIconForQuestion(question),
        }));
        setAiTopics(questionTopics);
        setSuggestedTopics(questionTopics.slice(0, 4));
      }
    } catch (error) {
      console.error("加载快速问题失败:", error);
      loadFallbackTopics();
    }
  };

  // 根据问题内容选择合适的图标
  const getIconForQuestion = (question) => {
    if (question.includes("推荐") || question.includes("好物")) return "gift";
    if (question.includes("热门")) return "fire";
    if (question.includes("品质") || question.includes("生活")) return "star";
    if (question.includes("厨房")) return "utensils";
    if (question.includes("送礼")) return "gift-card";
    if (question.includes("穿搭") || question.includes("衣")) return "tshirt";
    return "lightbulb";
  };

  // 加载备用话题（当API调用失败时）
  const loadFallbackTopics = () => {
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
  };

  // 加载话题数据
  const loadTopics = async () => {
    try {
      // 这里可以替换为实际的API调用
      loadFallbackTopics(); // 暂时使用备用数据
    } catch (error) {
      console.error("加载话题失败:", error);
      loadFallbackTopics();
    }
  };

  // 加载快速阅读内容
  const loadQuickReads = async () => {
    try {
      // 这里可以替换为实际的API调用，例如从后端获取推荐阅读内容
      const response = await instance.get("/ai/daily-discovery");
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

  // 使用SSE流式聊天
  const streamChatWithServer = (message) => {
    console.log("使用流式聊天，userInfo:", userInfo);

    // 检查用户是否已登录
    if (!userInfo?.id) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    // 关闭之前的连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 准备请求数据
    const requestData = {
      prompt: message,
      sessionId: currentSessionId,
    };

    // 显示打字指示器
    setIsTyping(true);

    // 使用EventSource建立SSE连接进行真正的流式接收
    try {
      // 创建查询参数
      const params = new URLSearchParams();
      params.append("prompt", message);

      // 如果有会话ID，添加到请求中
      if (currentSessionId) {
        params.append("sessionId", currentSessionId);
      }

      // 如果用户已登录，添加用户ID
      if (userInfo?.id) {
        params.append("userId", userInfo.id.toString());
      }

      // 创建EventSource连接
      const baseUrl = `${API_BASE_URL}/ai/chat/stream/sse`;
      const url = `${baseUrl}?${params.toString()}`;
      console.log("连接SSE:", url);

      // 显示连接中的提示
      setCurrentStreamingMessage("正在连接...");

      // 保存连接引用以便清理
      eventSourceRef.current = new EventSource(url);

      // 存储收到的所有文字
      let fullText = "";
      let hasStartedReceiving = false;

      // 调试日志：分析SSE流式接收机制
      console.log("调试: 前端创建了SSE连接，等待数据流...");

      // 监听info事件，获取会话信息
      eventSourceRef.current.addEventListener("info", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("收到会话信息:", data);

          // 更新会话ID
          if (data.sessionId) {
            setCurrentSessionId(data.sessionId);
          }

          // 显示连接状态
          setCurrentStreamingMessage("AI思考中...");

          // 调试日志
          console.log("调试: 收到info事件，建立了会话连接");
        } catch (e) {
          console.error("解析会话信息失败:", e);
        }
      });

      // 监听消息事件
      eventSourceRef.current.onmessage = (event) => {
        // 调试日志：记录每次接收到的数据
        console.log("调试: SSE数据块已接收，立即渲染到UI");
        console.log("调试: 数据块内容:", event.data);

        const data = event.data;

        // 清除连接中的提示
        if (!hasStartedReceiving) {
          hasStartedReceiving = true;
          setCurrentStreamingMessage("");
        }

        if (data) {
          try {
            // 尝试解析JSON
            const parsedData = JSON.parse(data);

            // 处理错误消息
            if (parsedData.error) {
              console.error("AI服务错误:", parsedData.error);
              setCurrentStreamingMessage(
                (prev) =>
                  prev + "\n\n⚠️ 连接AI服务出现问题: " + parsedData.error
              );
              return;
            }

            if (parsedData.data) {
              // 移除event:message前缀和<think>标签
              let cleanData = parsedData.data;

              // 处理清理数据
              cleanData = processResponseData(cleanData);

              // 添加到完整文本
              fullText += cleanData;

              // 立即渲染到UI：每当接收到数据块就立即更新UI
              setCurrentStreamingMessage((prev) => prev + cleanData);

              // 调试日志
              console.log("调试: 处理JSON数据并更新UI");
            }
          } catch (e) {
            // JSON解析失败，尝试作为纯文本处理
            console.log("以纯文本处理响应数据");

            // 处理清理数据
            let cleanData = processResponseData(data);

            // 添加到完整文本
            fullText += cleanData;

            // 直接显示新收到的文本
            setCurrentStreamingMessage((prev) => prev + cleanData);

            // 调试日志
            console.log("调试: 处理纯文本数据并更新UI");
          }
        }
      };

      // 监听错误
      eventSourceRef.current.onerror = (error) => {
        console.error("SSE连接错误:", error);

        // 关闭连接
        eventSourceRef.current.close();
        eventSourceRef.current = null;

        setIsTyping(false);
        setIsLoading(false);

        // 调试日志
        console.log("调试: SSE连接出错或关闭");

        // 处理错误情况
        if (!fullText) {
          // 如果没有收到任何文本，显示错误消息
          const errorMsg = "⚠️ 无法连接到AI服务，请检查网络连接或稍后再试。";
          setCurrentStreamingMessage(errorMsg);

          // 将错误消息添加到聊天历史
          setAiChatHistory((prev) => [
            ...prev,
            { type: "ai", message: errorMsg },
          ]);
          setCurrentStreamingMessage("");
        } else {
          // 如果已经有部分文本，则显示已接收的内容
          setAiChatHistory((prev) => [
            ...prev,
            { type: "ai", message: fullText },
          ]);
          setCurrentStreamingMessage("");
        }
      };

      // 监听连接打开
      eventSourceRef.current.onopen = () => {
        console.log("SSE连接已打开");
        setCurrentStreamingMessage("AI思考中...");

        // 调试日志
        console.log("调试: SSE连接已打开，等待数据流");
      };

      // 监听连接关闭或完成
      const checkComplete = (e) => {
        if (e.type === "complete" || e.data === "[DONE]") {
          console.log("SSE连接已完成");

          // 调试日志
          console.log("调试: 接收到完成事件，全部内容已接收完毕");

          // 关闭连接
          eventSourceRef.current.close();
          eventSourceRef.current = null;

          setIsTyping(false);
          setIsLoading(false);

          // 处理完成逻辑
          if (fullText && fullText.length > 0) {
            // 确保显示完整内容
            setCurrentStreamingMessage(fullText);

            // 短暂延迟后将内容添加到聊天历史，并清空当前流式消息
            setTimeout(() => {
              setAiChatHistory((prev) => [
                ...prev,
                { type: "ai", message: fullText },
              ]);
              setCurrentStreamingMessage("");
            }, 100);
          } else {
            // 如果没有收到任何内容，显示错误信息
            const errorMsg = "⚠️ AI服务没有返回任何内容，请稍后再试。";
            setAiChatHistory((prev) => [
              ...prev,
              { type: "ai", message: errorMsg },
            ]);
            setCurrentStreamingMessage("");
          }
        }
      };

      // 监听自定义complete事件
      eventSourceRef.current.addEventListener("complete", checkComplete);
      eventSourceRef.current.addEventListener("message", (e) => {
        if (e.data === "[DONE]") {
          checkComplete(e);
        }
      });
    } catch (error) {
      console.error("创建SSE连接失败:", error);
      setIsTyping(false);
      setIsLoading(false);

      // 处理连接错误
      const errorMsg = `⚠️ 创建AI连接失败: ${error.message}`;
      setAiChatHistory((prev) => [...prev, { type: "ai", message: errorMsg }]);
    }
  };

  const handleSendMessage = async () => {
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

    // 使用流式聊天
    streamChatWithServer(currentMessage);

    // 更新推荐话题
    updateSuggestedTopics(currentMessage);

    // 滚动到最新消息位置
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // 自动展开聊天区域
    setIsExpanded(true);

    // 聚焦输入框，方便继续输入
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

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

    // 随机选择一条推荐内容显示
    const randomRecommendation =
      quickReads[Math.floor(Math.random() * quickReads.length)];
    setCurrentRecommendation(randomRecommendation);

    // 使用流式聊天
    streamChatWithServer(topic.text);

    // 更新推荐话题
    updateSuggestedTopics(topic.text);

    // 滚动到最新消息位置
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

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

  const renderMessageContent = (message) => {
    if (!message) return '';
  
    let cleanedMessage = processResponseData(message);
    console.log('处理前的消息:', cleanedMessage);
  
   
  
    console.log('处理后的消息:', cleanedMessage);
  
    return (
      <div 
        className="ai-markdown-content" 
        dangerouslySetInnerHTML={{ __html: cleanedMessage }}
      />
    );
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
        {/* <div className="ai-card-header">
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
        </div> */}

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
                disabled={isLoading}
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
                <div className="ai-chat-bubble">
                  {/* {chat.type === "ai" && (
                    <i className="fas fa-robot ai-icon"></i>
                  )}
                  {chat.type === "user" && (
                    <i className="fas fa-user ai-icon"></i>
                  )} */}
                  <div className="ai-chat-text">
                    {chat.type === "ai"
                      ? renderMessageContent(chat.message)
                      : chat.message}
                  </div>
                </div>
              </div>
            ))}

            {/* 滚动到最新消息的锚点 */}
            <div ref={chatEndRef}></div>

            {/* 正在流式生成的消息 */}
            {currentStreamingMessage && (
              <div className="ai-chat-message ai-message">
                <div className="ai-chat-bubble">
                  <div className="ai-chat-text">
                    {renderMessageContent(currentStreamingMessage)}
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
