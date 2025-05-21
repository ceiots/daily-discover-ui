import React, { useState, useEffect } from 'react';
import './DailyAiApp.css';
import instance from '../utils/axios';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

const DailyAiApp = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('您好！我可以为您推荐今日精选商品，或者回答您的问题。');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationReasons, setRecommendationReasons] = useState([]);
  const [dailyTheme, setDailyTheme] = useState({
    title: '智能生活',
    description: '科技让生活更便捷，精选高品质智能家居产品，提升您的生活质量'
  });
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  
  // 格式化日期显示
  const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth()+1}月${currentDate.getDate()}日`;
  
  // 获取星期几
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = `星期${weekdays[currentDate.getDay()]}`;
  
  // 在组件加载时获取推荐数据
  useEffect(() => {
    fetchDailyDiscovery();
  }, []);
  
  // 获取每日发现推荐
  const fetchDailyDiscovery = async () => {
    setLoadingRecommendations(true);
    try {
      const response = await instance.get('/api/ai/daily-discovery');
      if (response.data && response.data.code === 200) {
        const data = response.data.data;
        setRecommendations(data.products || []);
        setRecommendationReasons(data.reasons || []);
        if (data.theme) {
          setDailyTheme({
            title: data.theme,
            description: data.themeDescription || ''
          });
        }
      } else {
        console.error('获取推荐失败:', response.data);
        // 使用默认数据
        setRecommendations([
          {
            id: 1,
            title: '智能水杯',
            imageUrl: 'https://ai-public.mastergo.com/ai/img_res/478a3d09562a8d8b1689ea48cf980c23.jpg',
            price: 199.00,
            description: '温度提醒'
          },
          {
            id: 2,
            title: '人体工学椅',
            imageUrl: 'https://ai-public.mastergo.com/ai/img_res/b1b51e2a101e7ef64265265c4cb99301.jpg',
            price: 1299.00,
            description: '舒适办公'
          },
          {
            id: 3,
            title: '护眼台灯',
            imageUrl: 'https://ai-public.mastergo.com/ai/img_res/63f98702070617620481ac6ea8dff875.jpg',
            price: 68.00,
            description: '智能调光'
          }
        ]);
        setRecommendationReasons([
          "基于您的浏览历史，我们认为这款商品会符合您的品味",
          "这是本周最受欢迎的智能产品之一，已有多位用户好评",
          "这款产品兼具美观和实用性，是提升生活品质的不二之选"
        ]);
      }
    } catch (error) {
      console.error('获取每日发现推荐失败:', error);
      // 使用默认数据
      setRecommendations([
        {
          id: 1,
          title: '智能水杯',
          imageUrl: 'https://ai-public.mastergo.com/ai/img_res/478a3d09562a8d8b1689ea48cf980c23.jpg',
          price: 199.00,
          description: '温度提醒'
        },
        {
          id: 2,
          title: '人体工学椅',
          imageUrl: 'https://ai-public.mastergo.com/ai/img_res/b1b51e2a101e7ef64265265c4cb99301.jpg',
          price: 1299.00,
          description: '舒适办公'
        },
        {
          id: 3,
          title: '护眼台灯',
          imageUrl: 'https://ai-public.mastergo.com/ai/img_res/63f98702070617620481ac6ea8dff875.jpg',
          price: 68.00,
          description: '智能调光'
        }
      ]);
      setRecommendationReasons([
        "基于您的浏览历史，我们认为这款商品会符合您的品味",
        "这是本周最受欢迎的智能产品之一，已有多位用户好评",
        "这款产品兼具美观和实用性，是提升生活品质的不二之选"
      ]);
    } finally {
      setLoadingRecommendations(false);
    }
  };
  
  // 处理AI助手响应
  const handleAIRequest = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      const prompt = `${userInput}`;
      
      // 检查是否登录
      if (!isLoggedIn) {
        setAiResponse('请先登录后再使用AI助手功能');
        setIsLoading(false);
        return;
      }
      
      const response = await instance.post('/api/ai/chat', { prompt });
      if (response.data && response.data.data) {
        setAiResponse(response.data.data);
      } else {
        setAiResponse('抱歉，我无法处理您的请求，请稍后再试');
      }
    } catch (error) {
      console.error('AI请求失败:', error);
      setAiResponse('连接AI服务出错，请稍后再试');
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };
  
  // 快捷问题点击处理
  const handleQuickQuestion = (question) => {
    setUserInput(question);
    // 等待UI更新后发送请求
    setTimeout(() => {
      handleAIRequest();
    }, 100);
  };

  // 刷新推荐
  const handleRefreshRecommendations = () => {
    fetchDailyDiscovery();
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <header className="bg-primary text-white p-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">每日发现 AI</h1>
            <p className="text-xs">{formattedDate} {weekday}</p>
          </div>
          <div className="flex items-center">
            <i className="fas fa-user-circle text-xl mr-2"></i>
            <span className="text-sm">{isLoggedIn && userInfo ? userInfo.nickname || '用户' : '未登录'}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-auto">
        {/* AI助手区域 */}
        <section className="mb-6 bg-gradient-to-r from-primary to-indigo-500 rounded-lg p-4 text-white">
          <div className="flex items-start">
            <img src="https://ai-public.mastergo.com/ai/img_res/a5bb22994e55aad0f1dd10d5e239240a.jpg" alt="AI助手" className="w-12 h-12 rounded-full mr-3"/>
            <div className="flex-grow">
              <h2 className="text-base font-semibold mb-2">智能助手</h2>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg mb-3">
                <p className="text-sm">{aiResponse}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button 
                  className="bg-white bg-opacity-20 text-xs py-1 px-3 rounded-full"
                  onClick={() => handleQuickQuestion('今日有什么好物推荐？')}>
                    推荐好物
                </button>
                <button 
                  className="bg-white bg-opacity-20 text-xs py-1 px-3 rounded-full"
                  onClick={() => handleQuickQuestion('这周最热门的智能产品是什么？')}>
                    热门产品
                </button>
                <button 
                  className="bg-white bg-opacity-20 text-xs py-1 px-3 rounded-full" 
                  onClick={() => handleQuickQuestion('有哪些提高生活品质的好物？')}>
                    提升生活
                </button>
              </div>
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="输入您的问题..." 
                  className="flex-grow text-sm p-2 rounded-l-full bg-white bg-opacity-20 border-none focus:outline-none focus:ring-0 text-white placeholder-white placeholder-opacity-70"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIRequest()}
                />
                <button 
                  className="bg-white bg-opacity-30 text-sm py-2 px-4 rounded-r-full"
                  onClick={handleAIRequest}
                  disabled={isLoading}>
                  {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 每日主题区域 */}
        <section className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-400">
          <div className="flex justify-between">
            <h2 className="text-base font-semibold mb-1 text-yellow-700">今日主题: {dailyTheme.title}</h2>
            <button onClick={handleRefreshRecommendations} className="text-yellow-600">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          <p className="text-sm text-yellow-700 mb-2">{dailyTheme.description}</p>
        </section>

        {/* 每日发现区域 */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-primary">每日AI智能推荐</h2>
            <Link to="/discover" className="text-primary text-sm">
              查看更多 <i className="fas fa-chevron-right"></i>
            </Link>
          </div>

          {loadingRecommendations ? (
            <div className="flex justify-center items-center py-10">
              <i className="fas fa-spinner fa-pulse text-primary text-2xl"></i>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-4">
                {recommendations.slice(0, 3).map((product, index) => (
                  <div key={product.id || index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-3">
                        <Link to={`/recommendation/${product.id}`}>
                          <h3 className="text-sm font-medium mb-1 truncate">{product.title}</h3>
                        </Link>
                        <p className="text-xs text-gray-500 mb-2">{product.description || recommendationReasons[index] || '智能推荐'}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold text-primary">¥{product.price?.toFixed(2)}</p>
                          <Link 
                            to={`/recommendation/${product.id}`}
                            className="bg-primary text-white text-xs py-1 px-2 rounded-full"
                          >
                            查看详情
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recommendationReasons.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h3 className="text-sm font-medium mb-2 text-gray-700">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    AI智能推荐理由
                  </h3>
                  <ul className="space-y-2">
                    {recommendationReasons.slice(0, 3).map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <p className="text-xs text-gray-600">{reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>

        {/* 个性化体验区域 */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3 text-primary">个性化体验</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border-l-2 border-blue-400">
              <i className="fas fa-history text-blue-500 mb-2"></i>
              <h3 className="text-sm font-medium mb-1">浏览历史</h3>
              <p className="text-xs text-gray-600">查看您最近的浏览记录</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border-l-2 border-green-400">
              <i className="fas fa-heart text-green-500 mb-2"></i>
              <h3 className="text-sm font-medium mb-1">收藏夹</h3>
              <p className="text-xs text-gray-600">查看您收藏的商品</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border-l-2 border-purple-400">
              <i className="fas fa-tags text-purple-500 mb-2"></i>
              <h3 className="text-sm font-medium mb-1">优惠活动</h3>
              <p className="text-xs text-gray-600">发现限时特价商品</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border-l-2 border-red-400">
              <i className="fas fa-fire text-red-500 mb-2"></i>
              <h3 className="text-sm font-medium mb-1">热门榜单</h3>
              <p className="text-xs text-gray-600">了解最热门的商品</p>
            </div>
          </div>
        </section>
      </main>

      {/* 简单的底部导航 */}
      <footer className="bg-white border-t border-gray-200 py-2">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center">
            <i className="fas fa-home text-primary"></i>
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link to="/discover" className="flex flex-col items-center">
            <i className="fas fa-compass text-primary"></i>
            <span className="text-xs mt-1">发现</span>
          </Link>
          <Link to="#" className="flex flex-col items-center">
            <i className="fas fa-robot text-primary"></i>
            <span className="text-xs mt-1">AI助手</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center">
            <i className="fas fa-user text-gray-400"></i>
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default DailyAiApp;