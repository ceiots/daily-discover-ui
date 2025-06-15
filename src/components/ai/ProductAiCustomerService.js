import React, { useState, useEffect, useRef } from "react";
import "./ProductAiCustomerService.css";
import instance from "../../services/http/instance";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";

/**
 * 商品AI客服组件
 * 提供针对特定商品的AI客服咨询功能
 */
const ProductAiCustomerService = ({
    productId,
    productName,
    isOpen,
    onClose,
    initialMessages = [],
    categoryId = null
}) => {
    const { userInfo } = useAuth();
    const [chatMessages, setChatMessages] = useState(initialMessages);
    const [messageInput, setMessageInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [commonQuestions, setCommonQuestions] = useState([]);
    const messagesEndRef = useRef(null);

    // 初始化会话
    useEffect(() => {
        if (isOpen) {
            initSession();
            scrollToBottom();
        }
    }, [isOpen]);

    // 滚动到底部
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isTyping]);

    // 初始化会话
    const initSession = async () => {
        try {
            // 创建或获取会话ID
            let currentSessionId = sessionId;
            if (!currentSessionId) {
                if (userInfo && userInfo.id) {
                    const response = await instance.post("/ai-customer-service/create-session", {
                        userId: userInfo.id,
                        productId: productId
                    });
                    if (response.data && response.data.code === 200) {
                        currentSessionId = response.data.data;
                    }
                } else {
                    // 游客会话
                    currentSessionId = `guest-product-${productId}-${Date.now()}`;
                }
                setSessionId(currentSessionId);
            }

            // 如果有会话ID，加载历史消息
            if (currentSessionId && chatMessages.length === 0) {
                loadChatHistory(currentSessionId);
            }

            // 获取常见问题
            fetchCommonQuestions();

            // 如果没有任何消息，添加欢迎消息
            if (chatMessages.length === 0) {
                setChatMessages([
                    {
                        id: Date.now(),
                        content: `您好，我是${productName || "商品"}的AI智能客服助手，有什么可以帮您解答的问题吗？`,
                        sender: 'ai',
                        time: new Date().toLocaleTimeString()
                    }
                ]);
            }
        } catch (error) {
            console.error("初始化会话失败:", error);
        }
    };

    // 加载常见问题
    const fetchCommonQuestions = async () => {
        try {
            const response = await instance.get(`/ai-customer-service/common-questions`, {
                params: {
                    productId: productId,
                    categoryId: categoryId
                }
            });
            if (response.data && response.data.code === 200) {
                setCommonQuestions(response.data.data || []);
            }
        } catch (error) {
            console.error("获取常见问题失败:", error);
        }
    };


    // 加载聊天历史
    const loadChatHistory = async (sid) => {
        try {
            const response = await instance.get(`/ai-customer-service/chat-history`, {
                params: {
                    sessionId: sid
                }
            });
            if (response.data && response.data.code === 200) {
                const history = response.data.data.map(item => ({
                    id: item.id,
                    content: item.message,
                    sender: item.type,
                    time: new Date(item.timestamp).toLocaleTimeString()
                }));
                setChatMessages(history);
            }
        } catch (error) {
            console.error("加载聊天历史失败:", error);
        }
    };

    // 发送消息
    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;

        // 用户消息
        const userMessage = {
            id: Date.now(),
            content: messageInput,
            sender: 'user',
            time: new Date().toLocaleTimeString()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setMessageInput("");
        setIsTyping(true);

        try {
            // 保存用户消息到后端
            if (userInfo && userInfo.id) {
                await instance.post("/ai-customer-service/save-message", {
                    sessionId: sessionId,
                    message: messageInput,
                    type: "user",
                    productId: productId
                });
            }

            // 先查询是否有预设答案
            const quickResponse = await instance.get(`/ai-customer-service/quick-answer`, {
                params: {
                    productId: productId,
                    query: messageInput
                }
            });

            // 如果有预设答案，直接显示
            if (quickResponse.data?.code === 200 && quickResponse.data?.data) {
                const aiMessage = {
                    id: Date.now() + 1,
                    content: quickResponse.data.data,
                    sender: 'ai',
                    time: new Date().toLocaleTimeString()
                };

                setChatMessages(prev => [...prev, aiMessage]);
                setIsTyping(false);

                // 保存AI回复
                if (userInfo && userInfo.id) {
                    await instance.post("/ai-customer-service/save-message", {
                        sessionId: sessionId,
                        message: quickResponse.data.data,
                        type: "ai",
                        productId: productId
                    });
                }
                return;
            }

            // 使用流式响应
            const eventSource = new EventSource(
                `/ai-customer-service/stream-generate?sessionId=${sessionId}&prompt=${encodeURIComponent(messageInput)}&productId=${productId}`
            );

            let streamedContent = "";

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    streamedContent += data.content;

                    // 实时更新UI上的流式内容
                    const streamingMsg = {
                        id: Date.now() + 1,
                        content: streamedContent,
                        sender: 'ai',
                        time: new Date().toLocaleTimeString(),
                        isStreaming: true
                    };

                    setChatMessages(prev => {
                        // 如果已经有一个流式消息，替换它
                        const filtered = prev.filter(msg => !msg.isStreaming);
                        return [...filtered, streamingMsg];
                    });
                } catch (error) {
                    console.error("流式响应解析错误:", error);
                }
            };

            eventSource.onerror = () => {
                eventSource.close();
                setIsTyping(false);

                // 如果内容为空，显示错误消息
                if (!streamedContent) {
                    const errorMessage = {
                        id: Date.now() + 1,
                        content: "抱歉，AI客服暂时无法回复，请稍后再试。",
                        sender: 'ai',
                        time: new Date().toLocaleTimeString()
                    };

                    setChatMessages(prev => {
                        // 移除所有流式消息
                        const filtered = prev.filter(msg => !msg.isStreaming);
                        return [...filtered, errorMessage];
                    });
                } else {
                    // 最终的流式消息，移除isStreaming标记
                    const finalMessage = {
                        id: Date.now() + 1,
                        content: streamedContent,
                        sender: 'ai',
                        time: new Date().toLocaleTimeString()
                    };

                    setChatMessages(prev => {
                        // 移除所有流式消息
                        const filtered = prev.filter(msg => !msg.isStreaming);
                        return [...filtered, finalMessage];
                    });
                }
            };
        } catch (error) {
            console.error("获取AI回复失败:", error);

            // 添加错误提示
            const errorMessage = {
                id: Date.now() + 1,
                content: "抱歉，AI客服暂时无法回复，请稍后再试。",
                sender: 'ai',
                time: new Date().toLocaleTimeString()
            };

            setChatMessages(prev => [...prev, errorMessage]);
            setIsTyping(false);
        }
    };

    // 渲染常见问题按钮
    const renderCommonQuestions = () => (
        <div className="common-questions-container">
            <h4 className="common-questions-title">常见问题</h4>
            <div className="common-questions-list">
                {commonQuestions.map((question, index) => (
                    <button
                        key={index}
                        className="common-question-button"
                        onClick={() => {
                            setMessageInput(question);
                            handleSendMessage();
                        }}
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );


    // 滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 处理输入变化
    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
    };

    // 处理按键按下
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 如果不是打开状态，不渲染组件
    if (!isOpen) return null;

    return (
        <div className="product-ai-cs-container">
            <div className="product-ai-cs-panel">
                <div className="product-ai-cs-header">
                    <div className="product-ai-cs-title">
                        <i className="fas fa-robot"></i>
                        <h3>AI智能客服</h3>
                    </div>
                    <button onClick={onClose} className="product-ai-cs-close">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="product-ai-cs-messages">
                    {chatMessages.length > 0 ? (
                        chatMessages.map(msg => (
                            <div
                                key={msg.id}
                                className={`product-ai-cs-message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
                            >
                                <div className={`message-avatar ${msg.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                                    <i className={`fas ${msg.sender === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                                </div>
                                <div className="message-bubble">
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">{msg.time}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-chat">
                            <p>开始您的咨询...</p>
                        </div>
                    )}

                    {/* 显示正在输入状态 */}
                    {isTyping && (
                        <div className="product-ai-cs-message ai-message">
                            <div className="message-avatar ai-avatar">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div className="message-bubble typing">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 滚动到底部的引用点 */}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* 渲染常见问题，如果有问题时显示 */}
                {commonQuestions.length > 0 && renderCommonQuestions()}

                <div className="product-ai-cs-input">
                    <textarea
                        placeholder="请输入您的问题..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isTyping}
                        className={`send-button ${!messageInput.trim() || isTyping ? 'disabled' : ''}`}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>

                <div className="product-ai-cs-footer">
                    <p>AI智能客服 - 为您提供24小时不间断服务</p>
                </div>
            </div>
        </div>
    );
};

ProductAiCustomerService.propTypes = {
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productName: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialMessages: PropTypes.array,
    categoryId: PropTypes.number
};

export default ProductAiCustomerService;