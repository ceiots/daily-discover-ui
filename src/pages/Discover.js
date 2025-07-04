import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Discover.css";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../theme/components/organisms/NavBar";
// 引入游戏组件
import MatchThree from "../components/games/MatchThree/MatchThree";
import TetrisGame from "../components/games/TetrisGame/TetrisGame";
import SnakeGame from "../components/games/SnakeGame/SnakeGame";
import SuperMarioGame from "../components/games/SuperMarioGame/SuperMarioGame";
// 引入视频组件
import VideoList from "../components/videos/VideoList/VideoList";
import ArticleCard from '../components/ai/ArticleCard';
import BasePage from '../theme/components/templates/BasePage';
import TopBar from "../theme/components/organisms/TopBar";

// Re-trigger compilation
const DEFAULT_AVATAR = "/default-avatar.png";
const DEFAULT_IMAGE = "/default-image.png";


export const getImage = (imageName) => {
  // 使用更高质量、主题更匹配的Unsplash图片
  const unsplashImages = {
    theme:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    product1:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    product2:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    tech: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    food: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    travel:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ai: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    health:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    education:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    game: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    video:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    challenge:
      "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    plants:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    science:
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    snake:
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  };
  return unsplashImages[imageName] || DEFAULT_IMAGE;
};

// 模拟数据 - 按照产品需求重构
const mockDiscoverData = {
  // 1. 推荐创作
  recommendedContent: [
    {
      id: "rc0",
      title: "数字游民的高效远程办公指南",
      author: { name: "远程达人", avatar: DEFAULT_AVATAR },
      summary: "掌握远程协作工具与自律方法，提升数字游民的工作效率与生活质量",
      category: "生活",
      image: "https://picsum.photos/seed/remote-work/800/500",
      readCount: "2.1K",
      likeCount: "178",
      aiInsight: "AI总结：善用时间管理App与视频会议工具，远程办公效率提升30%", // 添加AI总结
    },
    {
      id: "rc1",
      title: "如何利用AI提升工作效率",
      author: { name: "科技先锋", avatar: DEFAULT_AVATAR },
      summary: "探索最新AI工具如何帮助你在日常工作中节省时间和提高产出质量",
      category: "科技",
      image: getImage("ai"),
      readCount: "3.5K",
      likeCount: "286",
      aiInsight:
        "核心要点：自动化重复任务可节省40%时间，AI辅助写作提升产出质量", // 添加AI总结
    },
    {
      id: "rc2",
      title: "2024年必备的5款生产力工具",
      author: { name: "效率专家", avatar: DEFAULT_AVATAR },
      summary: "这些工具将彻底改变你的工作方式，让你事半功倍",
      category: "工作",
      image: getImage("tech"),
      readCount: "2.8K",
      likeCount: "195",
      aiInsight: "精选推荐：Notion全能笔记、Todoist任务管理、Calendly日程安排", // 添加AI总结
    },
    {
      id: "rc3",
      title: "极简主义生活方式指南",
      author: { name: "生活美学家", avatar: DEFAULT_AVATAR },
      summary: "如何通过减法原则，创造更有品质的生活体验",
      category: "生活",
      image: getImage("theme"),
      readCount: "4.2K",
      likeCount: "367",
      aiInsight: "研究表明：减少30%物品拥有量可提升幸福感达25%", // 添加AI总结
    },
  ],

  // 2. 休闲一刻 - 模拟服务器返回数据
  casualGames: [
    {
      id: "match-three",
      name: "萌果乐消消",
      icon: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "轻松休闲的三消游戏",
      category: "休闲",
      popularity: "爆款",
      playerCount: "3.8M",
      aiRecommend: "匹配度98%：提升专注力和观察力",
    },
    {
      id: "tetris",
      name: "俄罗斯方块",
      icon: getImage("game"),
      description: "经典的方块消除游戏",
      category: "益智",
      popularity: "热门",
      playerCount: "3.5M",
      aiRecommend: "匹配度92%：锻炼空间思维能力",
    },
    {
      id: "snake",
      name: "贪吃蛇",
      icon: getImage("snake"),
      description: "经典的贪吃蛇游戏，简单但上瘾",
      category: "休闲",
      popularity: "新品",
      playerCount: "1.7M",
      aiRecommend: "匹配度91%：训练反应速度和决策能力",
    },
    {
      id: "super-mario",
      name: "超级马里奥",
      icon: "https://images.unsplash.com/photo-1593492583567-9342f53f3454?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "经典的平台跳跃游戏",
      category: "冒险",
      popularity: "经典",
      playerCount: "5.2M",
      aiRecommend: "匹配度95%：怀旧经典，不容错过",
    }
  ],

  // 3. 热门商品
  popularProducts: [
    {
      id: "pp1",
      name: "智能降噪耳机X1",
      image: getImage("product2"),
      price: "¥899",
      originalPrice: "¥1099",
      promotionTag: "限时特惠",
      rating: 4.8,
      salesCount: "2.3万件",
      aiInsight: "智能分析：降噪效果领先同类产品35%", // 添加AI分析
    },
    {
      id: "pp2",
      name: "便携式咖啡机",
      image: getImage("product1"),
      price: "¥299",
      originalPrice: "¥399",
      promotionTag: "新品上市",
      rating: 4.5,
      salesCount: "1.5万件",
      aiInsight: "智能分析：92%用户认为性价比极高", // 添加AI分析
    },
    {
      id: "pp3",
      name: "多功能智能手表",
      image: getImage("tech"),
      price: "¥1299",
      originalPrice: "¥1499",
      promotionTag: "抢购中",
      rating: 4.7,
      salesCount: "8.7千件",
      aiInsight: "智能分析：续航能力超出同价位产品50%", // 添加AI分析
    },
  ],

  // 4. 游戏挑战
  gameChallenges: [
    {
      id: "gc1",
      title: "七日连续登录挑战",
      image: getImage("challenge"),
      reward: "金币×500",
      difficulty: "简单",
      participantsCount: "12.5万",
      endTime: "2024-09-30",
      aiTip: "AI提示：设置每日提醒可提高完成率达85%", // 添加AI提示
    },
    {
      id: "gc2",
      title: "电竞锦标赛",
      image: getImage("game"),
      reward: "实物奖品+奖金",
      difficulty: "困难",
      participantsCount: "3.2万",
      endTime: "2024-10-15",
      aiTip: "AI提示：提前练习特定地图可提升胜率30%", // 添加AI提示
    },
    {
      id: "gc3",
      title: "知识竞赛",
      image: getImage("education"),
      reward: "会员天数×7",
      difficulty: "中等",
      participantsCount: "8.6万",
      endTime: "2024-09-25",
      aiTip: "AI提示：历史和科技类题目出现频率最高", // 添加AI提示
    },
  ],

  // 5. 热门视频
  hotVideos: [
    {
      id: "hv1",
      title: "5分钟学会高效时间管理",
      cover: getImage("education"),
      duration: "05:28",
      creator: "效率专家",
      viewCount: "23.5万",
      aiSummary: "AI摘要：重点是番茄工作法和任务分类优先级", // 添加AI摘要
    },
    {
      id: "hv2",
      title: "最新智能家居产品评测",
      cover: getImage("tech"),
      duration: "08:45",
      creator: "科技达人",
      viewCount: "18.2万",
      aiSummary: "AI摘要：智能音箱和安防系统性价比最高", // 添加AI摘要
    },
    {
      id: "hv3",
      title: "15分钟居家健身全套动作",
      cover: getImage("health"),
      duration: "15:20",
      creator: "健康生活",
      viewCount: "32.6万",
      aiSummary: "AI摘要：无需器械，燃脂效果优于60%同类视频", // 添加AI摘要
    },
  ],

  // 6. 互动话题
  interactiveTopics: [
    {
      id: "it1",
      title: "#数字游民生活方式",
      participation: "3420人参与",
      trending: true,
      category: "生活",
    },
    {
      id: "it2",
      title: "#AI改变未来工作",
      participation: "5890人参与",
      trending: true,
      category: "科技",
    },
    {
      id: "it3",
      title: "#一人食",
      participation: "2150人参与",
      trending: false,
      category: "美食",
    },
  ],
};

const DiscoverPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState(null);
  const [data, setData] = useState(mockDiscoverData);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const videoListRef = useRef(null);
  const casualGamesRef = useRef(null);
  const popularProductsRef = useRef(null);
  const recommendedContentRef = useRef(null);
  const gameChallengesRef = useRef(null);
  const interactiveTopicsRef = useRef(null);

  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // 模拟从服务器获取休闲游戏数据
  const fetchCasualGames = async () => {
    try {
      // 真实场景下，这里应该是API调用
      // const response = await fetch(`${API_BASE_URL}/casual-games`);
      // const gamesData = await response.json();
      // setData(prevData => ({ ...prevData, casualGames: gamesData }));
      console.log("模拟获取休闲游戏数据");
    } catch (error) {
      console.error("获取休闲游戏数据失败:", error);
    }
  };

  useEffect(() => {
    // 模拟数据加载
    const loadDiscoverData = async () => {
      // 真实场景下，这里会调用多个API
      // const [content, games, products, challenges, videos, topics] = await Promise.all([
      //   fetch(`${API_BASE_URL}/recommended-content`),
      //   fetch(`${API_BASE_URL}/casual-games`),
      //   ...
      // ]);
      setData(mockDiscoverData);
      console.log("发现页数据加载完毕");
    };

    loadDiscoverData();

    // 暗黑模式监听
    const darkModeListener = (e) => setIsDarkMode(e.matches);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", darkModeListener);

    return () => {
      mediaQuery.removeEventListener("change", darkModeListener);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearch = () => {
    // 实际应跳转到搜索页面
    navigate("/search-results");
  };

  const handleGameStart = (gameType) => {
    setActiveGame(gameType);
  };

  const handleGameExit = () => {
    setActiveGame(null);
  };

  // 根据activeGame渲染对应的游戏组件
  const renderGameContent = () => {
    switch (activeGame) {
      case "match-three":
        return <MatchThree onExit={handleGameExit} />;
      case "tetris":
        return <TetrisGame onExit={handleGameExit} />;
      case "snake":
        return <SnakeGame onExit={handleGameExit} />;
      case "super-mario":
        return <SuperMarioGame onExit={handleGameExit} />;
      default:
        return null;
    }
  };

  const MemoizedNavBar = React.memo(NavBar);

  // 如果正在玩游戏，则只渲染游戏
  if (activeGame) {
    return (
      <div className="game-container">
        <button onClick={handleGameExit} className="exit-game-btn">
          退出游戏
        </button>
        {renderGameContent()}
      </div>
    );
  }

  // 主页面渲染
  return (
    <BasePage>
      {/* 顶部搜索栏 */}
      <header className="discover-header">
        <div className="search-bar">
          <span role="img" aria-label="search icon" className="search-icon">
            🔍
          </span>
          <input
            type="text"
            placeholder="搜索感兴趣的内容"
            className="search-input"
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          搜索
        </button>
      </header>

      <main className="discover-content">
        {/* 推荐创作 */}
        <section className="content-section">
          <h2 className="section-title">
            <span role="img" aria-label="idea icon">
              💡
            </span>{" "}
            推荐创作
          </h2>
          <div className="horizontal-scroll-container" ref={recommendedContentRef}>
            <div className="card-grid-horizontal">
              {data.recommendedContent.map((item) => (
                <div key={item.id} className="content-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="content-card-image"
                  />
                  <div className="content-card-body">
                    <span className="content-card-category">{item.category}</span>
                    <h3 className="content-card-title">{item.title}</h3>
                    <p className="content-card-summary">{item.summary}</p>
                    <div className="content-card-footer">
                      <div className="author-info">
                        <img
                          src={item.author.avatar}
                          alt={item.author.name}
                          className="author-avatar"
                        />
                        <span>{item.author.name}</span>
                      </div>
                      <div className="content-stats">
                        <span>{item.readCount} 阅读</span>
                        <span>{item.likeCount} 赞</span>
                      </div>
                    </div>
                    {item.aiInsight && (
                      <div className="ai-insight">
                        <span role="img" aria-label="ai icon">
                          🤖
                        </span>{" "}
                        {item.aiInsight}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="scroll-btn left"
            onClick={() => scrollHorizontally(recommendedContentRef, "left")}
          >
            &lt;
          </button>
          <button
            className="scroll-btn right"
            onClick={() => scrollHorizontally(recommendedContentRef, "right")}
          >
            &gt;
          </button>
        </section>

        {/* 休闲一刻 */}
        <section className="content-section">
          <h2 className="section-title">
            <span role="img" aria-label="game icon">
              🎮
            </span>{" "}
            休闲一刻
          </h2>
          <div className="horizontal-scroll-container" ref={casualGamesRef}>
            <div className="card-grid-horizontal">
              {data.casualGames.map((game) => (
                <div key={game.id} className="game-card">
                  <div className="game-card-header">
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="game-card-icon"
                    />
                    <div className="game-card-info">
                      <h3 className="game-card-name">{game.name}</h3>
                      <div className="game-card-tags">
                        <span className="tag-category">{game.category}</span>
                        <span className={`tag-popularity ${game.popularity === '爆款' ? 'hot' : ''}`}>{game.popularity}</span>
                      </div>
                    </div>
                  </div>
                  <p className="game-card-description">{game.description}</p>
                  <div className="game-card-footer">
                    <span className="player-count">{game.playerCount} 在玩</span>
                    <button
                      className="play-button"
                      onClick={() => handleGameStart(game.id)}
                    >
                      开玩
                    </button>
                  </div>
                  {game.aiRecommend && (
                    <div className="ai-insight">
                      <span role="img" aria-label="ai icon">
                        🤖
                      </span>{" "}
                      {game.aiRecommend}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            className="scroll-btn left"
            onClick={() => scrollHorizontally(casualGamesRef, "left")}
          >
            &lt;
          </button>
          <button
            className="scroll-btn right"
            onClick={() => scrollHorizontally(casualGamesRef, "right")}
          >
            &gt;
          </button>
        </section>

        {/* 热门商品 */}
        <section className="content-section">
          <h2 className="section-title">
            <span role="img" aria-label="fire icon">
              🔥
            </span>{" "}
            热门商品
          </h2>
          <div className="horizontal-scroll-container" ref={popularProductsRef}>
            <div className="card-grid-horizontal">
              {data.popularProducts.map((product) => (
                 <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                <div className="product-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                  />
                  <div className="product-card-body">
                    <h3 className="product-card-name">{product.name}</h3>
                    <div className="product-card-pricing">
                      <span className="current-price">{product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="product-card-footer">
                      <span className="sales-count">{product.salesCount}</span>
                      <span className="rating">⭐ {product.rating}</span>
                    </div>
                     {product.aiInsight && (
                      <div className="ai-insight">
                        <span role="img" aria-label="ai icon">
                          🤖
                        </span>{" "}
                        {product.aiInsight}
                      </div>
                    )}
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
           <button
            className="scroll-btn left"
            onClick={() => scrollHorizontally(popularProductsRef, "left")}
          >
            &lt;
          </button>
          <button
            className="scroll-btn right"
            onClick={() => scrollHorizontally(popularProductsRef, "right")}
          >
            &gt;
          </button>
        </section>

        {/* 热门视频 */}
        <section className="content-section">
          <h2 className="section-title">
            <span role="img" aria-label="video icon">
              🎬
            </span>{" "}
            热门视频
          </h2>
          <div className="video-section-container">
            <VideoList videos={data.hotVideos} />
          </div>
        </section>

        {/* 游戏挑战 */}
        <section className="content-section">
          <h2 className="section-title">
            <span role="img" aria-label="trophy icon">
              🏆
            </span>{" "}
            游戏挑战
          </h2>
           <div className="horizontal-scroll-container" ref={gameChallengesRef}>
            <div className="card-grid-horizontal">
          {data.gameChallenges.map((challenge) => (
            <div key={challenge.id} className="challenge-card">
              <img
                src={challenge.image}
                alt={challenge.title}
                className="challenge-card-image"
              />
              <div className="challenge-card-body">
                <h3 className="challenge-card-title">{challenge.title}</h3>
                <p className="challenge-card-reward">奖励: {challenge.reward}</p>
                <div className="challenge-card-footer">
                  <span className={`difficulty ${challenge.difficulty}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="participants">
                    {challenge.participantsCount}人参与
                  </span>
                </div>
                 {challenge.aiTip && (
                      <div className="ai-insight">
                        <span role="img" aria-label="ai icon">
                          🤖
                        </span>{" "}
                        {challenge.aiTip}
                      </div>
                    )}
              </div>
            </div>
          ))}
          </div>
          </div>
            <button
            className="scroll-btn left"
            onClick={() => scrollHorizontally(gameChallengesRef, "left")}
          >
            &lt;
          </button>
          <button
            className="scroll-btn right"
            onClick={() => scrollHorizontally(gameChallengesRef, "right")}
          >
            &gt;
          </button>
        </section>

        {/* 互动话题 */}
        <section className="content-section">
          <h2 className="section-title">
            <span role="img" aria-label="speech bubble icon">
              💬
            </span>{" "}
            互动话题
          </h2>
          <div className="topics-container">
            {data.interactiveTopics.map((topic) => (
              <div key={topic.id} className="topic-item">
                <span className="topic-title">{topic.title}</span>
                <span className="topic-participation">
                  {topic.participation}
                </span>
                {topic.trending && <span className="topic-trending">热</span>}
              </div>
            ))}
          </div>
        </section>

        {/* 返回顶部按钮 */}
        <button onClick={scrollToTop} className="back-to-top-btn">
          ↑
        </button>
      </main>
      <MemoizedNavBar />
    </BasePage>
  );
};

export default DiscoverPage; 