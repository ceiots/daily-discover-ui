import React, { useState, useEffect } from 'react';
import './WaitingInteractionCard.css';
import { getImage } from '../DailyAiApp';

const WaitingInteractionCard = ({ userQuery, onClose, onInteraction }) => {
  const [cardType, setCardType] = useState('info'); // info, product, game
  const [cardContent, setCardContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // 根据用户查询智能匹配卡片类型和内容
  useEffect(() => {
    // 延迟显示卡片，给用户一种"思考"的感觉
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // 分析用户查询，决定显示什么类型的卡片
    const query = userQuery.toLowerCase();
    let selectedType = 'info'; // 默认显示信息卡片
    let selectedContent = null;

    // 根据关键词匹配卡片类型
    if (query.includes('买') || query.includes('推荐') || query.includes('产品') || 
        query.includes('设备') || query.includes('价格') || query.includes('手机') || 
        query.includes('电脑')) {
      selectedType = 'product';
    } else if (query.includes('游戏') || query.includes('娱乐') || query.includes('玩') || 
               query.includes('互动') || query.includes('测试') || query.includes('挑战')) {
      selectedType = 'game';
    }

    // 根据类型生成内容
    switch (selectedType) {
      case 'product':
        selectedContent = generateProductCard(query);
        break;
      case 'game':
        selectedContent = generateGameCard(query);
        break;
      default:
        selectedContent = generateInfoCard(query);
    }

    setCardType(selectedType);
    setCardContent(selectedContent);

    return () => clearTimeout(showTimer);
  }, [userQuery]);

  // 生成信息卡片内容
  const generateInfoCard = (query) => {
    const infoCards = [
      {
        title: 'AI小贴士',
        content: '提问AI时，尝试详细描述您的需求和背景，能够获得更精准的回答。',
        icon: 'lightbulb',
        action: '了解更多技巧',
        image: 'theme1'
      },
      {
        title: '你知道吗？',
        content: 'AI绘画的提示词越详细，生成的图像质量就越高，可以包含风格、光照、构图等细节。',
        icon: 'palette',
        action: '查看AI绘画指南',
        image: null
      },
      {
        title: '行业速递',
        content: '最新研究表明，AI已能够以前所未有的精度预测蛋白质结构，这将加速新药研发。',
        icon: 'microscope',
        action: '阅读相关研究',
        image: null
      }
    ];

    // 根据查询内容选择最相关的卡片
    if (query.includes('效率') || query.includes('工作') || query.includes('提升')) {
      return {
        title: '效率提升',
        content: 'AI助手可以帮助您自动化重复性任务，提高工作效率达30%以上。',
        icon: 'clock',
        action: '探索效率工具',
        image: null
      };
    }

    if (query.includes('学习') || query.includes('教育') || query.includes('知识')) {
      return {
        title: '学习助手',
        content: '个性化学习路径可以根据您的学习风格和进度自动调整，提高学习效果。',
        icon: 'graduation-cap',
        action: '探索学习方法',
        image: null
      };
    }

    // 随机选择一个通用信息卡片
    return infoCards[Math.floor(Math.random() * infoCards.length)];
  };

  // 生成产品卡片内容
  const generateProductCard = (query) => {
    // 根据查询关键词匹配产品
    if (query.includes('手机') || query.includes('智能手机')) {
      return {
        title: '智能手机推荐',
        content: '最新旗舰手机对比评测，助您找到最适合的选择。',
        price: '￥3999起',
        discount: '限时8.5折',
        icon: 'mobile-alt',
        action: '查看详情',
        image: 'product1'
      };
    }

    if (query.includes('耳机') || query.includes('音频') || query.includes('听')) {
      return {
        title: '无线降噪耳机',
        content: '沉浸式音频体验，智能降噪技术让您专注于内容。',
        price: '￥899',
        discount: '新品上市',
        icon: 'headphones',
        action: '了解更多',
        image: 'product3'
      };
    }

    if (query.includes('电脑') || query.includes('笔记本') || query.includes('办公')) {
      return {
        title: '轻薄笔记本',
        content: '强劲性能，轻薄便携，满足您的工作与创作需求。',
        price: '￥6299',
        discount: '赠品优惠',
        icon: 'laptop',
        action: '查看详情',
        image: 'product4'
      };
    }

    // 默认产品卡片
    return {
      title: 'AI智能设备推荐',
      content: '根据您的兴趣，这些智能设备可能适合您。',
      price: '￥多款价格',
      discount: '专属优惠',
      icon: 'shopping-bag',
      action: '浏览更多',
      image: 'product2'
    };
  };

  // 生成游戏/互动卡片内容
  const generateGameCard = (query) => {
    const games = [
      {
        title: 'AI知识问答',
        content: '测试您对AI技术的了解程度，挑战高分！',
        level: '初级',
        reward: '获得AI徽章',
        icon: 'brain',
        action: '开始挑战',
        image: null
      },
      {
        title: '图像识别游戏',
        content: '猜猜这是AI生成的图像还是真实照片？',
        level: '中级',
        reward: '准确率徽章',
        icon: 'image',
        action: '开始游戏',
        image: null
      },
      {
        title: '能量收集挑战',
        content: '在限定时间内收集尽可能多的能量球',
        level: '休闲',
        reward: '积分奖励',
        icon: 'bolt',
        action: '立即开始',
        image: null
      }
    ];

    // 随机选择一个游戏卡片
    return games[Math.floor(Math.random() * games.length)];
  };

  // 处理卡片交互
  const handleCardAction = () => {
    if (onInteraction) {
      onInteraction({
        type: cardType,
        content: cardContent,
        action: 'click',
        timestamp: new Date().toISOString()
      });
    }
  };

  if (!cardContent || !isVisible) return null;

  return (
    <div className={`waiting-card ${cardType} ${isVisible ? 'visible' : ''}`}>
      <div className="card-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </div>
      
      <div className="card-content-wrapper">
        {cardContent.image && (
          <div className="card-image">
            <img src={getImage(cardContent.image)} alt={cardContent.title} />
          </div>
        )}
        
        <div className="card-content">
          <div className="card-header">
            <div className="card-icon">
              <i className={`fas fa-${cardContent.icon}`}></i>
            </div>
            <h3 className="card-title">{cardContent.title}</h3>
          </div>
          
          <p className="card-description">{cardContent.content}</p>
          
          {cardType === 'product' && (
            <div className="product-details">
              <div className="product-price">{cardContent.price}</div>
              <div className="product-discount">{cardContent.discount}</div>
            </div>
          )}
          
          {cardType === 'game' && (
            <div className="game-details">
              <div className="game-level">
                <i className="fas fa-signal"></i> {cardContent.level}
              </div>
              <div className="game-reward">
                <i className="fas fa-gift"></i> {cardContent.reward}
              </div>
            </div>
          )}
          
          <button className="card-action-btn" onClick={handleCardAction}>
            {cardContent.action}
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <div className="waiting-indicator">
        <span>AI正在思考中</span>
        <div className="waiting-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default WaitingInteractionCard; 