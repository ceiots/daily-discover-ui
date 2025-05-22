import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './H5GamePage.css';
import { useAuth } from '../../App';
import { getImage } from '../DailyAiApp'; // 导入图片处理函数
import NavBar from '../NavBar';

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
    navigate(-1);
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
  
  const renderContent = () => {
    // 渲染加载中状态
    if (loading) {
      return (
        <div className="h5-game-content">
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
        <div className="h5-game-content">
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
              
              <button className="start-button" onClick={startGame}>
                开始探索
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // 渲染游戏场景
    if (currentScene === 'living_room' || currentScene === 'office') {
      const currentSceneData = gameData.scenes.find(scene => scene.id === currentScene);
      
      return (
        <div className="h5-game-content">
          <div className="scene-section">
            <div className="scene-header">
              <h2>{currentSceneData.name}</h2>
              <p>{currentSceneData.description}</p>
              
              <div className="scene-progress">
                <span>已发现: {discoveredItems.length}/{gameData.items.length}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{width: `${(discoveredItems.length / gameData.items.length) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="scene-container">
              <img 
                src={getImage(currentSceneData.backgroundUrl)} 
                alt={currentSceneData.name} 
                className="scene-background"
              />
              
              {gameData.items.map(item => (
                <div
                  key={item.id}
                  className={`item-hotspot ${item.found ? 'found' : ''}`}
                  style={{
                    left: `${item.position.x}%`,
                    top: `${item.position.y}%`
                  }}
                  onClick={() => discoverItem(item)}
                >
                  <div className="hotspot-indicator">
                    <i className="fas fa-plus"></i>
                  </div>
                  {item.found && (
                    <div className="hotspot-label">
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="scene-selector">
              {gameData.scenes.map(scene => (
                <button
                  key={scene.id}
                  className={`scene-button ${currentScene === scene.id ? 'active' : ''}`}
                  onClick={() => switchScene(scene.id)}
                >
                  {scene.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // 渲染物品详情页面
    if (currentScene.startsWith('item_')) {
      const itemId = currentScene.replace('item_', '');
      const item = gameData.items.find(i => i.id === itemId);
      
      return (
        <div className="h5-game-content">
          <div className="item-detail-section">
            <div className="item-image-container">
              <img 
                src={getImage(item.imageUrl)} 
                alt={item.name} 
                className="item-detail-image" 
              />
            </div>
            
            <div className="item-detail-content">
              <h2>{item.name}</h2>
              <p className="item-description">{item.description}</p>
              
              <div className="item-actions">
                <button 
                  className="back-to-scene-button"
                  onClick={() => switchScene(currentScene === 'item_item4' ? 'living_room' : 'living_room')}
                >
                  <i className="fas fa-arrow-left"></i>
                  返回场景
                </button>
                
                <button className="view-product-button">
                  查看商品详情
                  <i className="fas fa-external-link-alt"></i>
                </button>
              </div>
            </div>
          </div>
          
          {isGameComplete() && (
            <div className="completion-banner">
              <div className="completion-content">
                <i className="fas fa-trophy"></i>
                <h3>恭喜完成探索!</h3>
                <p>您已发现所有隐藏商品</p>
                <button className="restart-button" onClick={restartGame}>
                  重新开始
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };
  
  return (
    <div className="h5-game-main-container">
      <div className="h5-game-container">
        <div className="h5-game-header">
          <button className="back-button" onClick={goBackHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>{gameData.title}</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        
        {renderContent()}
      </div>
      <NavBar />
    </div>
  );
};

export default H5GamePage; 