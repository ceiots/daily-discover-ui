import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const hour = new Date().getHours();
    if (hour < 6) {
      setGreeting('夜深了，早点休息');
    } else if (hour < 12) {
      setGreeting('晨光初现，美好开始');
    } else if (hour < 18) {
      setGreeting('午后时光，惬意悠然');
    } else {
      setGreeting('夕阳西下，静享黄昏');
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('zh-CN', options);
  };

  const discoverItems = [
    {
      id: 1,
      title: '诗词雅韵',
      subtitle: '品味古典文学之美',
      icon: '📜',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 2,
      title: '茶道文化',
      subtitle: '感受茶香禅意',
      icon: '🍵',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 3,
      title: '书法艺术',
      subtitle: '挥毫泼墨间的韵味',
      icon: '🖌️',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 4,
      title: '园林美学',
      subtitle: '山水之间的诗意',
      icon: '🏯',
      color: 'from-purple-400 to-violet-500'
    },
    {
      id: 5,
      title: '传统工艺',
      subtitle: '匠心独运的技艺',
      icon: '🎨',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 6,
      title: '养生之道',
      subtitle: '身心和谐的智慧',
      icon: '🧘',
      color: 'from-teal-400 to-cyan-500'
    }
  ];

  const dailyQuote = {
    text: "山重水复疑无路，柳暗花明又一村",
    author: "陆游",
    poem: "游山西村"
  };

  return (
    <div className="homepage">
      {/* Background with Chinese pattern */}
      <div className="bg-pattern"></div>
      
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-text">每日发现</span>
              <span className="logo-subtitle">Daily Discover</span>
            </div>
          </div>
          
          <div className="time-section">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
        
        <div className="greeting-section">
          <h1 className="greeting">{greeting}</h1>
          <p className="welcome-text">在这里发现生活中的美好与智慧</p>
        </div>
      </header>

      {/* Daily Quote Section */}
      <section className="daily-quote">
        <div className="quote-container">
          <div className="quote-mark">❝</div>
          <p className="quote-text">{dailyQuote.text}</p>
          <div className="quote-author">
            —— {dailyQuote.author} 《{dailyQuote.poem}》
          </div>
        </div>
      </section>

      {/* Discover Grid */}
      <section className="discover-section">
        <h2 className="section-title">今日探索</h2>
        <div className="discover-grid">
          {discoverItems.map((item) => (
            <div key={item.id} className="discover-card">
              <div className={`card-gradient bg-gradient-to-br ${item.color}`}>
                <div className="card-content">
                  <div className="card-icon">{item.icon}</div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-subtitle">{item.subtitle}</p>
                </div>
                <div className="card-overlay"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="action-buttons">
          <button className="action-btn primary">
            <span className="btn-icon">🔍</span>
            <span>开始探索</span>
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">📚</span>
            <span>我的收藏</span>
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">⚙️</span>
            <span>个人设置</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">愿你在每一天都能发现生活的美好</p>
          <div className="footer-decoration">
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;