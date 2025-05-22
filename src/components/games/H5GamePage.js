import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './H5GamePage.css';
import { useAuth } from '../../App';
import { getImage } from '../DailyAiApp'; // 导入图片处理函数

const H5GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState('intro');
  const [discoveredItems, setDiscoveredItems] = useState([]);
  const [gameData, setGameData] = useState({
    title: '发现之旅',
    theme: '智能生活',
    description: '沉浸式探索商品世界，在互动场景中寻找和了解每日推荐商品',
    items: [
      {
        id: 'item1',
        name: '智能手表',
        description: '支持心率监测、睡眠分析等多项健康功能',
        position: { x: 30, y: 45 },
        imageUrl: 'product2',
        found: false
      },
      {
        id: 'item2',
        name: '无线耳机',
        description: '降噪效果出色，音质清晰，续航持久',
        position: { x: 65, y: 25 },
        imageUrl: 'product3',
        found: false
      },
      {
        id: 'item3',
        name: '智能台灯',
        description: '自动调节亮度，保护视力，支持语音控制',
        position: { x: 75, y: 65 },
        imageUrl: 'product1',
        found: false
      },
      {
        id: 'item4',
        name: '便携充电宝',
        description: '大容量、快充、轻薄便携',
        position: { x: 15, y: 75 },
        imageUrl: 'product4',
        found: false
      }
    ],
    scenes: [
      {
        id: 'living_room',
        name: '智能客厅',
        description: '现代智能家居生活的中心',
        backgroundUrl: 'theme1'
      },
      {
        id: 'office',
        name: '智能办公',
        description: '提高效率的智能办公环境',
        backgroundUrl: 'theme1'
      }
    ]
  });
  
  // 初始化游戏数据
  useEffect(() => {
    const loadGameData = async () => {
      setLoading(true);
      try {
        // 实际项目中应该从API获取游戏数据
        // const response = await fetch(`/api/h5games/${gameId}`);
        // const data = await response.json();
        // setGameData(data);
        
        // 模拟API加载延迟
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('加载游戏数据失败:', error);
        setLoading(false);
      }
    };
    
    loadGameData();
  }, [gameId]);
  
  // 开始游戏
  const startGame = () => {
    setCurrentScene('living_room');
  };
  
  // 切换场景
  const switchScene = (sceneId) => {
    setCurrentScene(sceneId);
  };
  
  // 发现物品
  const discoverItem = (item) => {
    if (discoveredItems.find(i => i.id === item.id)) return;
    
    setDiscoveredItems(prev => [...prev, item]);
    // 更新物品状态
    setGameData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === item.id ? {...i, found: true} : i)
    }));
    
    // 显示物品详情
    showItemDetails(item);
  };
  
  // 显示物品详情
  const showItemDetails = (item) => {
    setCurrentScene(`item_${item.id}`);
  };
  
  // 返回主页
  const goBackHome = () => {
    navigate('/');
  };
  
  // 检查游戏是否完成
  const isGameComplete = () => {
    return gameData.items.every(item => 
      discoveredItems.some(i => i.id === item.id)
    );
  };
  
  // 重新开始游戏
  const restartGame = () => {
    setDiscoveredItems([]);
    setGameData(prev => ({
      ...prev,
      items: prev.items.map(i => ({...i, found: false}))
    }));
    setCurrentScene('intro');
  };
  
  // 渲染加载中状态
  if (loading) {
    return (
      <div className="h5-game-container">
        <div className="h5-game-header">
          <button className="back-button" onClick={goBackHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>加载中...</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>正在加载游戏资源...</p>
        </div>
      </div>
    );
  }
  
  // 渲染介绍页面
  if (currentScene === 'intro') {
    return (
      <div className="h5-game-container">
        <div className="h5-game-header">
          <button className="back-button" onClick={goBackHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>{gameData.title}</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        
        <div className="intro-section">
          <div className="intro-image-container">
            <img 
              src={getImage('theme1')} 
              alt={gameData.title}
              className="intro-image" 
            />
            <div className="intro-overlay">
              <div className="intro-icon">
                <i className="fas fa-compass"></i>
              </div>
            </div>
          </div>
          
          <div className="intro-content">
            <h2>欢迎参加{gameData.title}</h2>
            <p className="intro-theme">今日主题: <span>{gameData.theme}</span></p>
            <p className="intro-description">{gameData.description}</p>
            
            <div className="instructions-section">
              <h3>游戏规则</h3>
              <ul className="instructions-list">
                <li>在场景中寻找隐藏的推荐商品</li>
                <li>点击商品了解详情</li>
                <li>发现所有商品即可完成挑战</li>
                <li>尝试以最短时间内找到所有商品</li>
              </ul>
            </div>
            
            <div className="info-section">
              <div className="info-item">
                <i className="fas fa-search"></i>
                <span>需要发现 {gameData.items.length} 个物品</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>预计用时 3-5 分钟</span>
              </div>
            </div>
            
            <button className="start-button" onClick={startGame}>
              开始探索
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 检查是否是物品详情页面
  const isItemDetailScene = currentScene.startsWith('item_');
  
  // 如果是物品详情页面，获取物品ID和物品数据
  let currentItem = null;
  if (isItemDetailScene) {
    const itemId = currentScene.split('_')[1];
    currentItem = gameData.items.find(item => item.id === itemId);
  }
  
  // 渲染完成页面
  if (currentScene === 'complete') {
    return (
      <div className="h5-game-container">
        <div className="h5-game-header">
          <button className="back-button" onClick={goBackHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>{gameData.title}</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        
        <div className="complete-section">
          <div className="complete-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <h2>探索完成！</h2>
          <p className="complete-message">恭喜您发现了所有{gameData.items.length}个推荐物品</p>
          
          <div className="discovered-items">
            <h3>已发现物品</h3>
            <div className="items-grid">
              {discoveredItems.map(item => (
                <div key={item.id} className="discovered-item" onClick={() => showItemDetails(item)}>
                  <div className="discovered-item-image">
                    <img src={getImage(item.imageUrl)} alt={item.name} />
                  </div>
                  <div className="discovered-item-name">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="complete-actions">
            <button className="restart-button" onClick={restartGame}>
              <i className="fas fa-redo"></i>
              重新探索
            </button>
            <button className="home-button" onClick={goBackHome}>
              <i className="fas fa-home"></i>
              返回主页
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染物品详情页面
  if (isItemDetailScene && currentItem) {
    return (
      <div className="h5-game-container">
        <div className="h5-game-header">
          <button className="back-button" onClick={() => switchScene(currentItem.sceneId || 'living_room')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>物品详情</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        
        <div className="item-detail-section">
          <div className="item-image-container">
            <img src={getImage(currentItem.imageUrl)} alt={currentItem.name} className="item-detail-image" />
          </div>
          
          <div className="item-info">
            <h2 className="item-name">{currentItem.name}</h2>
            <p className="item-description">{currentItem.description}</p>
            
            <div className="item-features">
              <h3>特点与亮点</h3>
              <ul className="features-list">
                <li>功能齐全，使用便捷</li>
                <li>品质可靠，经久耐用</li>
                <li>设计时尚，外观精美</li>
                <li>性价比高，值得购买</li>
              </ul>
            </div>
            
            <div className="item-actions">
              <button className="detail-button">
                <i className="fas fa-info-circle"></i>
                查看详情
              </button>
              <button className="add-cart-button">
                <i className="fas fa-shopping-cart"></i>
                加入购物车
              </button>
            </div>
          </div>
          
          <div className="continue-section">
            <button className="continue-button" onClick={() => {
              // 如果所有物品都被发现，导航到完成页面
              if (isGameComplete()) {
                setCurrentScene('complete');
              } else {
                // 否则回到探索场景
                switchScene(currentItem.sceneId || 'living_room');
              }
            }}>
              {isGameComplete() ? '查看结果' : '继续探索'}
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染游戏场景
  return (
    <div className="h5-game-container">
      <div className="h5-game-header">
        <button className="back-button" onClick={goBackHome}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>{gameData.title}</h1>
        <div className="progress-display">
          <span>{discoveredItems.length}/{gameData.items.length}</span>
        </div>
      </div>
      
      <div className="game-scene">
        {/* 场景背景 */}
        <div className="scene-background">
          <img src={getImage('theme1')} alt="场景背景" />
        </div>
        
        {/* 场景中的物品 */}
        <div className="scene-items">
          {gameData.items.map(item => {
            // 检查物品是否属于当前场景
            const sceneMatch = !item.sceneId || item.sceneId === currentScene;
            if (!sceneMatch) return null;
            
            return (
              <div 
                key={item.id} 
                className={`scene-item ${item.found ? 'found' : 'hidden'}`}
                style={{ 
                  left: `${item.position.x}%`, 
                  top: `${item.position.y}%`
                }}
                onClick={() => discoverItem(item)}
              >
                <div className="item-hotspot">
                  <div className="pulse-dot"></div>
                  <div className="item-icon">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                {item.found && (
                  <div className="item-preview">
                    <img src={getImage(item.imageUrl)} alt={item.name} />
                    <div className="item-name-tooltip">{item.name}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* 场景切换导航 */}
        <div className="scene-navigation">
          {gameData.scenes.map(scene => (
            <button 
              key={scene.id}
              className={`scene-nav-button ${currentScene === scene.id ? 'active' : ''}`}
              onClick={() => switchScene(scene.id)}
            >
              {scene.name}
            </button>
          ))}
        </div>
        
        {/* 提示按钮 */}
        <div className="hint-button">
          <i className="fas fa-lightbulb"></i>
        </div>
        
        {/* 已发现物品预览 */}
        <div className="discovered-preview">
          <div className="discovered-title">
            已发现: {discoveredItems.length}/{gameData.items.length}
          </div>
          <div className="discovered-thumbs">
            {discoveredItems.map(item => (
              <div key={item.id} className="discovered-thumb" onClick={() => showItemDetails(item)}>
                <img src={getImage(item.imageUrl)} alt={item.name} />
              </div>
            ))}
            {Array(gameData.items.length - discoveredItems.length).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="discovered-thumb empty">
                <i className="fas fa-question"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default H5GamePage; 