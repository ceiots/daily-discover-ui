import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import { getImage } from './DailyAiApp';
import NavBar from './NavBar';
import ArticleCard from './ai/ArticleCard';
import './AiExplore.css';

const AiExplore = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('全部');
  const [aiInsights, setAiInsights] = useState([]);
  const insightRef = useRef(null);
  const [showArticlePreview, setShowArticlePreview] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // AI关键词/标签数据
  const aiTags = [
    { id: 1, name: '全部', color: '#4f46e5' },
    { id: 2, name: '智能家居', color: '#0ea5e9' },
    { id: 3, name: '人工智能', color: '#8b5cf6' },
    { id: 4, name: '大数据', color: '#ec4899' },
    { id: 5, name: '区块链', color: '#f59e0b' },
    { id: 6, name: '元宇宙', color: '#10b981' }
  ];

  // AI洞察/飘过的关键信息
  const initialInsights = [
    "2023年全球AI市场规模达到1350亿美元，预计2028年将达到8240亿美元",
    "超过75%的企业计划在未来两年增加AI相关投资",
    "智能家居设备预计到2025年将达到4840亿美元的市场规模",
    "ChatGPT用户数量在一年内突破1亿，创下历史最快增长记录",
    "75%的公司担心AI人才短缺将阻碍其数字化转型",
    "大数据分析可以帮助企业提高15-20%的运营效率",
    "研究显示AI辅助医疗诊断准确率提高了30%",
    "区块链技术在供应链中的应用可减少40%的文书工作",
    "63%的消费者更愿意向使用AI改善用户体验的品牌购买产品"
  ];

  const mockArticlesData = [
    {
      id: 1,
      title: '智能家居入门指南：打造舒适便捷的生活空间',
      summary: '本文介绍如何通过智能设备打造现代化家居环境，提升生活品质。',
      aiSummary: '核心要点：智能音箱是入门首选、系统互通性是关键、场景设置提升便利性、AI学习用户习惯是未来趋势。',
      content: '<p>随着科技的发展，智能家居已经逐渐走进千家万户。本文将详细介绍智能家居的基本概念、核心设备以及如何根据不同需求搭建适合自己的智能家居系统。</p><h3>智能家居的核心设备</h3><p>智能音箱、智能灯具、智能开关和智能窗帘是入门智能家居的首选设备。这些设备不仅安装简单，而且可以通过语音控制，极大地提升了生活便利性。</p><h3>系统互通与场景设置</h3><p>选择支持主流协议的设备，确保不同品牌产品之间可以互相通信。通过场景设置，可以实现一键控制多个设备，例如"回家模式"可以同时打开灯光、空调和窗帘。</p><h3>智能家居的发展趋势</h3><p>未来智能家居将更加注重AI学习用户习惯，自动调整家居环境，提供更加个性化的服务体验。</p>',
      createdAt: '2023-10-15',
      category: '智能家居',
      tags: ['智能家居', 'IoT', '生活方式'],
      coverImage: 'product3',
      readTime: '5分钟',
      keyInsights: ['智能音箱是入门核心', '场景设置提升便利性', '互通性是选购关键']
    },
    {
      id: 2,
      title: 'AI驱动的个性化学习：教育领域的革命',
      summary: '探索AI如何改变传统教育模式，为学生提供量身定制的学习体验。',
      aiSummary: '要点总结：AI可根据学习进度调整内容难度、实时反馈提高学习效率、个性化学习路径弥补差距、教师角色从知识传授转向引导者。',
      content: '<p>人工智能正在重塑教育领域，从根本上改变了我们理解学习和教学的方式。</p><h3>适应性学习系统</h3><p>AI驱动的学习平台能够实时分析学生的学习行为和进度，自动调整内容难度和教学方法，确保每个学生都能得到最适合自己的学习体验。</p><h3>实时反馈与评估</h3><p>AI系统可以提供即时反馈，帮助学生迅速识别错误并改正，大大提高学习效率。</p><h3>教师角色的转变</h3><p>随着AI接管部分教学任务，教师的角色将从知识传授者转变为学习引导者和启发者。</p>',
      createdAt: '2023-11-20',
      category: '人工智能',
      tags: ['教育科技', 'AI', '个性化学习'],
      coverImage: 'theme1',
      readTime: '8分钟',
      keyInsights: ['适应性学习提高效率', '实时反馈加快进步', '教师角色正在转变']
    },
    {
      id: 3,
      title: '企业数字化转型中的AI赋能战略',
      summary: '剖析AI技术如何帮助传统企业实现数字化转型，提升竞争力。',
      aiSummary: '核心发现：数据是转型基础、AI可优化85%重复流程、跨部门协作是成功关键、增量实施比全面改革更有效。',
      content: '<p>数字化转型已成为企业保持竞争力的必由之路，而AI技术正是这一转型的核心驱动力。</p><h3>数据基础设施建设</h3><p>成功的AI实施需要高质量、结构化的数据支持。企业首先需要完善数据收集、存储和管理体系。</p><h3>流程自动化与优化</h3><p>AI可以自动化处理重复性任务，优化业务流程，提高运营效率，降低人为错误。</p><h3>增量式实施策略</h3><p>分步骤、小规模地实施AI解决方案，逐步扩大应用范围，可以有效降低风险和阻力。</p>',
      createdAt: '2023-12-05',
      category: '大数据',
      tags: ['企业战略', '数字化转型', '流程优化'],
      coverImage: 'product4',
      readTime: '10分钟',
      keyInsights: ['数据质量决定AI成效', '自动化提升效率', '增量实施降低风险']
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    fetchArticles();
    
    // 初始化AI洞察
    setAiInsights(initialInsights);
    
    // 启动AI洞察滚动动画
    const interval = setInterval(() => {
      if (insightRef.current) {
        rotateInsights();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await instance.get('/ai/articles');
      if (response.data && response.data.code === 200) {
        setArticles(response.data.data || mockArticlesData);
      } else {
        setArticles(mockArticlesData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('获取文章列表失败:', error);
      setArticles(mockArticlesData);
      setIsLoading(false);
    }
  };

  const rotateInsights = () => {
    setAiInsights(prev => {
      const newInsights = [...prev];
      const firstItem = newInsights.shift();
      newInsights.push(firstItem);
      return newInsights;
    });
  };

  const filterArticlesByTag = (tag) => {
    setActiveTag(tag);
    // 在实际项目中，这里可以调用API根据标签筛选文章
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setShowArticlePreview(true);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImage('theme1');
  };

  const filteredArticles = activeTag === '全部' 
    ? articles 
    : articles.filter(article => article.category === activeTag || article.tags?.includes(activeTag));

  return (
    <div className="ai-explore-wrapper">
      <div className="ai-explore-header">
        <div className="header-content">
          <h1 className="explore-title">AI 探索空间</h1>
          <p className="explore-subtitle">发现AI带来的无限可能</p>
        </div>
      </div>

      <div className="ai-explore-container">
        {/* AI洞察部分 - 飘过的信息效果 */}
        <section className="ai-insights-section">
          <div className="insights-header">
            <div className="insights-title">
              <i className="fas fa-lightbulb"></i>
              <h2>AI 洞察</h2>
            </div>
            <div className="insights-subtitle">实时更新的AI行业数据和趋势</div>
          </div>
          
          <div className="insights-ticker-container" ref={insightRef}>
            <div className="insights-ticker">
              {aiInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`insight-item ${index === 0 ? 'active' : ''}`}
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="insight-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="insight-text">{insight}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI标签筛选 */}
        <section className="ai-tags-section">
          <div className="tags-container">
            {aiTags.map(tag => (
              <div 
                key={tag.id}
                className={`ai-tag ${activeTag === tag.name ? 'active' : ''}`}
                style={{
                  '--tag-color': tag.color,
                  background: activeTag === tag.name ? tag.color : `${tag.color}22`
                }}
                onClick={() => filterArticlesByTag(tag.name)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </section>

        {/* AI文章总结部分 */}
        <section className="ai-summaries-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-brain"></i>
              AI 知识总结
            </h2>
            <p className="section-subtitle">由AI提取的关键框架和核心信息</p>
          </div>

          <div className="ai-article-grid">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>正在加载AI总结...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <div 
                  key={article.id}
                  className="ai-summary-card"
                  onClick={() => handleViewArticle(article)}
                >
                  <div className="summary-card-header">
                    <div 
                      className="article-category-tag"
                      style={{
                        background: aiTags.find(tag => tag.name === article.category)?.color || '#4f46e5'
                      }}
                    >
                      {article.category}
                    </div>
                    <div className="article-read-time">
                      <i className="far fa-clock"></i>
                      {article.readTime || '5分钟阅读'}
                    </div>
                  </div>
                  
                  <div className="summary-card-image">
                    <img 
                      src={getImage(article.coverImage)}
                      alt={article.title}
                      onError={handleImageError}
                    />
                  </div>
                  
                  <div className="summary-card-content">
                    <h3 className="summary-title">{article.title}</h3>
                    
                    <div className="ai-summary-container">
                      <div className="ai-summary-label">
                        <div className="ai-icon">AI</div>
                        <span>总结</span>
                      </div>
                      <p className="ai-summary-text">{article.aiSummary}</p>
                    </div>
                    
                    <div className="key-insights">
                      {article.keyInsights && article.keyInsights.map((insight, idx) => (
                        <div key={idx} className="key-insight-tag">
                          <i className="fas fa-check-circle"></i>
                          {insight}
                        </div>
                      ))}
                    </div>
                    
                    <div className="read-more">
                      <span>阅读全文</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-message">
                <i className="fas fa-search"></i>
                <p>没有找到相关的AI总结内容</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 文章预览模态框 */}
      {showArticlePreview && selectedArticle && (
        <div className="modal-overlay" onClick={() => setShowArticlePreview(false)}>
          <div className="article-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedArticle.title}</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowArticlePreview(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="article-preview-content">
              <div className="article-meta-info">
                <span>
                  <i className="far fa-calendar-alt mr-1"></i>
                  {selectedArticle.createdAt}
                </span>
                <span>
                  <i className="far fa-folder mr-1"></i>
                  {selectedArticle.category}
                </span>
                <span>
                  <i className="fas fa-brain mr-1"></i>
                  AI分析
                </span>
              </div>
              
              <div className="ai-analysis-box">
                <div className="ai-analysis-header">
                  <div className="ai-icon">AI</div>
                  <h4>核心洞察</h4>
                </div>
                <div className="ai-analysis-content">
                  <p>{selectedArticle.aiSummary}</p>
                  
                  <div className="ai-key-points">
                    {selectedArticle.keyInsights && selectedArticle.keyInsights.map((insight, idx) => (
                      <div key={idx} className="ai-key-point">
                        <i className="fas fa-check-circle"></i>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedArticle.coverImage && (
                <div className="article-preview-cover mb-4">
                  <img 
                    src={getImage(selectedArticle.coverImage)}
                    alt={selectedArticle.title}
                    className="w-full max-h-[300px] object-contain rounded-lg"
                    onError={handleImageError}
                  />
                </div>
              )}
              
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
            <div className="modal-footer">
              <button 
                className="primary-btn"
                onClick={() => window.open(`/article/${selectedArticle.id}`, '_blank')}
              >
                <i className="fas fa-book-open mr-1"></i>
                阅读全文
              </button>
              <button 
                className="secondary-btn"
                onClick={() => {
                  navigator.share({
                    title: selectedArticle.title,
                    text: selectedArticle.summary,
                    url: window.location.origin + `/article/${selectedArticle.id}`
                  }).catch(err => console.log('分享失败', err));
                }}
              >
                <i className="fas fa-share-alt mr-1"></i>
                分享
              </button>
            </div>
          </div>
        </div>
      )}
      
      <NavBar />
    </div>
  );
};

export default AiExplore; 