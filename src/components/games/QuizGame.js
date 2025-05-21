import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizGame.css';
import instance from '../../utils/axios';
import { useAuth } from '../../App';

// 默认题目，当API获取失败时使用
const DEFAULT_QUESTIONS = {
  'productQuiz': [
    {
      id: 1,
      question: "哪种智能手表功能最适合记录日常运动数据？",
      options: ["Apple Watch", "普通手表", "智能手环", "计步器"],
      correctAnswer: 0,
      explanation: "Apple Watch具有完整的健康监测功能，可以全面记录心率、运动轨迹、消耗卡路里等日常运动数据。"
    },
    {
      id: 2,
      question: "以下哪种材质的耳机通常音质更好？",
      options: ["塑料材质", "金属材质", "木质材质", "取决于声学设计而非材质"],
      correctAnswer: 3,
      explanation: "耳机的音质主要取决于声学设计、驱动单元和调音，而非外壳材质。好的声学设计才是优质音质的关键。"
    },
    {
      id: 3,
      question: "以下哪种显示技术在户外阳光下可读性最好？",
      options: ["LCD液晶", "OLED有机发光", "电子墨水屏", "Mini LED"],
      correctAnswer: 2,
      explanation: "电子墨水屏采用反射式显示技术，在阳光下可见度最高，不会出现反光问题，非常适合阅读器等设备。"
    },
    {
      id: 4,
      question: "智能家居中，以下哪种设备最适合作为控制中枢？",
      options: ["智能灯泡", "智能音箱", "智能电视", "智能窗帘"],
      correctAnswer: 1,
      explanation: "智能音箱通常集成了语音助手和智能家居控制中心功能，可以通过语音控制家中其他智能设备。"
    },
    {
      id: 5,
      question: "哪种充电技术能够为设备提供最快的充电速度？",
      options: ["标准USB充电", "无线充电", "PD快充", "太阳能充电"],
      correctAnswer: 2,
      explanation: "PD(Power Delivery)快充是目前主流的快速充电技术，可以提供高达100W的功率，远超其他充电方式。"
    }
  ],
  'brandQuiz': [
    {
      id: 1,
      question: "以下哪个品牌专注于智能家居生态系统？",
      options: ["Sony", "Xiaomi", "LG", "Canon"],
      correctAnswer: 1,
      explanation: "小米(Xiaomi)拥有完整的智能家居生态系统，包括各类智能家电、传感器和控制设备，并通过米家APP实现统一控制。"
    },
    {
      id: 2,
      question: "Apple的标志性产品线不包括以下哪一个？",
      options: ["iPhone", "iPad", "iRobot", "iMac"],
      correctAnswer: 2,
      explanation: "iRobot是一家机器人公司的品牌，主要生产Roomba扫地机器人，与Apple没有关系。"
    },
    {
      id: 3,
      question: "哪个品牌是全球最大的电子商务平台之一？",
      options: ["Microsoft", "Google", "Amazon", "Facebook"],
      correctAnswer: 2,
      explanation: "Amazon是全球最大的电子商务平台之一，提供海量商品在线销售服务，同时也是云计算巨头。"
    },
    {
      id: 4,
      question: "以下哪个品牌不生产智能手机？",
      options: ["Samsung", "Tesla", "Huawei", "Oppo"],
      correctAnswer: 1,
      explanation: "Tesla是电动汽车和清洁能源公司，专注于电动车、太阳能和能源存储解决方案，目前不生产智能手机。"
    },
    {
      id: 5,
      question: "哪个品牌以其高端音频设备而闻名？",
      options: ["Bose", "Adidas", "Casio", "Panasonic"],
      correctAnswer: 0,
      explanation: "Bose是知名的高端音频设备制造商，以其降噪耳机、音响系统和扬声器闻名全球。"
    }
  ],
  'daily-quiz': [
    {
      id: 1,
      question: "每日发现算法主要基于什么向用户推荐商品？",
      options: ["随机推荐", "用户浏览历史和偏好", "热门销量", "促销活动"],
      correctAnswer: 1,
      explanation: "每日发现算法分析用户的浏览历史、购买记录和偏好，以及相似用户的兴趣爱好，提供个性化推荐。"
    },
    {
      id: 2,
      question: "AI推荐系统中，\"冷启动问题\"指的是什么？",
      options: ["系统启动速度慢", "对新用户无法提供个性化推荐", "首次使用耗电量大", "系统需要预热"],
      correctAnswer: 1,
      explanation: "冷启动问题指的是推荐系统对新用户或新商品没有足够的数据，难以提供准确的个性化推荐。"
    },
    {
      id: 3,
      question: "以下哪项不是智能推荐系统考虑的因素？",
      options: ["用户偏好", "商品相似度", "用户地理位置", "商品包装颜色"],
      correctAnswer: 3,
      explanation: "智能推荐系统主要考虑用户偏好、行为历史、商品相似度和用户画像等因素，商品包装颜色通常不是主要考虑因素。"
    },
    {
      id: 4,
      question: "哪种类型的AI技术在商品推荐中应用最广泛？",
      options: ["自然语言处理", "图像识别", "机器学习", "虚拟现实"],
      correctAnswer: 2,
      explanation: "机器学习技术，特别是协同过滤、内容推荐和深度学习算法在商品推荐系统中应用最为广泛。"
    },
    {
      id: 5,
      question: "在电商平台中，\"用户画像\"主要指什么？",
      options: ["用户头像", "用户的综合特征模型", "用户的社交媒体资料", "用户的真实照片"],
      correctAnswer: 1,
      explanation: "用户画像是根据用户的属性、行为和偏好等数据，构建的用户综合特征模型，用于个性化推荐和营销。"
    },
    {
      id: 6,
      question: "智能购物助手通常不具备以下哪种功能？",
      options: ["商品推荐", "价格比较", "自动下单", "实时客服"],
      correctAnswer: 2,
      explanation: "大多数智能购物助手提供推荐、比价和客服功能，但出于安全考虑，通常不会自动代替用户下单购买商品。"
    },
    {
      id: 7,
      question: "以下哪种方式最能提高AI推荐的准确性？",
      options: ["增加推荐数量", "提高系统速度", "收集更多用户反馈", "增加广告投放"],
      correctAnswer: 2,
      explanation: "收集用户对推荐结果的反馈（如点击、购买、评分）是改进推荐算法精度的最有效方式。"
    },
    {
      id: 8,
      question: "消费者在购物决策过程中，通常最受哪种因素影响？",
      options: ["价格", "品牌", "个人需求", "朋友推荐"],
      correctAnswer: 2,
      explanation: "尽管价格、品牌和他人推荐都有影响，但个人需求通常是购物决策的最主要驱动因素。"
    },
    {
      id: 9,
      question: "电商平台中的\"长尾效应\"指什么？",
      options: ["畅销商品带来的主要收入", "小众商品总体可贡献大量销售", "促销活动后的持续效应", "用户停留时间长"],
      correctAnswer: 1,
      explanation: "长尾效应指大量小众商品（非爆款）的累计销售量可能超过少数热门商品，是电商平台的重要特征。"
    },
    {
      id: 10,
      question: "AI发现中\"每日主题\"的主要作用是什么？",
      options: ["增加页面美观度", "引导用户消费方向", "提高系统性能", "减少系统负载"],
      correctAnswer: 1,
      explanation: "每日主题通过设定特定话题或场景，引导用户关注特定品类或场景下的商品，提供更有针对性的购物体验。"
    }
  ]
};

// 游戏信息数据
const GAME_INFO = {
  'productQuiz': {
    title: '商品知识问答',
    description: '测试您对商品的了解程度',
    icon: 'question-circle',
    theme: 'linear-gradient(135deg, #6366f1, #4f46e5)'
  },
  'brandQuiz': {
    title: '品牌知识竞赛',
    description: '测试您对品牌的了解',
    icon: 'trademark',
    theme: 'linear-gradient(135deg, #ec4899, #db2777)'
  },
  'daily-quiz': {
    title: 'AI购物助手知识竞赛',
    description: '测试您对智能购物、AI推荐和消费趋势的了解程度',
    icon: 'trophy',
    theme: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  }
};

const QuizGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 每题30秒
  const timerRef = useRef(null);
  const [gameTitle, setGameTitle] = useState('');
  
  // 根据游戏ID设置标题
  useEffect(() => {
    if (gameId === 'productQuiz') {
      setGameTitle('商品知识问答');
    } else if (gameId === 'brandQuiz') {
      setGameTitle('品牌知识竞赛');
    } else if (gameId === 'daily-quiz') {
      setGameTitle('每日知识挑战');
    } else {
      setGameTitle('知识问答');
    }
  }, [gameId]);
  
  // 加载问题
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // 从API获取问题
        if (isLoggedIn) {
          const response = await instance.get(`/api/games/${gameId}/questions`);
          if (response.data && response.data.questions) {
            setQuestions(response.data.questions);
          } else {
            // 如果API返回为空，使用默认问题
            setQuestions(DEFAULT_QUESTIONS[gameId] || []);
          }
        } else {
          // 未登录用户使用默认问题
          setQuestions(DEFAULT_QUESTIONS[gameId] || []);
        }
      } catch (error) {
        console.error('获取问题失败:', error);
        // 发生错误时使用默认问题
        setQuestions(DEFAULT_QUESTIONS[gameId] || []);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [gameId, isLoggedIn]);
  
  // 处理计时器
  useEffect(() => {
    if (loading || gameOver || showExplanation) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, loading, gameOver, showExplanation]);
  
  // 重置计时器
  const resetTimer = () => {
    setTimeLeft(30);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  // 计时结束处理
  const handleTimeUp = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers(prev => [
      ...prev, 
      { 
        questionId: currentQuestion.id,
        selectedOption: null,
        isCorrect: false,
        timeSpent: 30
      }
    ]);
    setShowExplanation(true);
  };
  
  // 选择答案
  const handleSelectOption = (optionIndex) => {
    if (selectedOption !== null || showExplanation) return;
    
    setSelectedOption(optionIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10); // 正确答案加10分
    }
    
    setUserAnswers(prev => [
      ...prev, 
      { 
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        isCorrect: isCorrect,
        timeSpent: 30 - timeLeft
      }
    ]);
    
    clearInterval(timerRef.current);
    setShowExplanation(true);
  };
  
  // 下一题
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    resetTimer();
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 游戏结束
      setGameOver(true);
      // 提交分数
      if (isLoggedIn) {
        submitScore();
      }
    }
  };
  
  // 提交分数
  const submitScore = async () => {
    try {
      await instance.post(`/api/games/${gameId}/score`, {
        score,
        userId: userInfo?.id,
        answers: userAnswers
      });
    } catch (error) {
      console.error('提交分数失败:', error);
    }
  };
  
  // 重新开始游戏
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setUserAnswers([]);
    setGameOver(false);
    resetTimer();
  };
  
  // 返回主页
  const goBackHome = () => {
    navigate(-1);
  };
  
  const shareResult = () => {
    // 分享游戏结果的逻辑
    if (navigator.share) {
      navigator.share({
        title: `${gameTitle}成绩`,
        text: `我在${gameTitle}中获得了${score}分，共${questions.length}题！来挑战我吧！`,
        url: window.location.href
      }).catch(error => console.error('分享失败:', error));
    } else {
      alert(`分享链接已复制：我在${gameTitle}中获得了${score}分，共${questions.length}题！来挑战我吧！`);
    }
  };
  
  // 加载状态
  if (loading) {
    return (
      <div className="quiz-game-container">
        <div className="quiz-header" style={{ background: gameId === 'brandQuiz' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <button className="back-button" onClick={goBackHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>{gameTitle}</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        <div className="quiz-loading">
          <div className="spinner"></div>
          <p>加载问题中...</p>
        </div>
      </div>
    );
  }
  
  // 游戏结束
  if (gameOver) {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;
    
    return (
      <div className="quiz-game-container">
        <div className="quiz-header" style={{ background: gameId === 'brandQuiz' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <button className="back-button" onClick={goBackHome}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>{gameTitle}</h1>
          <div style={{ width: '36px' }}></div>
        </div>
        
        <div className="quiz-result">
          <div className="result-header">
            <div className="result-score-container">
              <div className="result-score">{score}</div>
              <div className="result-max">/{questions.length * 10}</div>
            </div>
            <h2>游戏结束!</h2>
            <p>您回答了 {questions.length} 个问题，答对 {correctAnswers} 个</p>
            <div className="accuracy-bar">
              <div className="accuracy-progress" style={{ width: `${accuracy}%` }}></div>
            </div>
            <p className="accuracy-label">{accuracy.toFixed(0)}% 正确率</p>
          </div>
          
          <div className="result-actions">
            <button className="restart-button" onClick={restartGame}>
              <i className="fas fa-redo"></i>
              重新挑战
            </button>
            <button className="share-button" onClick={shareResult}>
              <i className="fas fa-share-alt"></i>
              分享成绩
            </button>
          </div>
          
          <div className="home-button-container">
            <button className="home-button" onClick={goBackHome}>
              <i className="fas fa-home"></i>
              返回主页
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 游戏进行中
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="quiz-game-container">
      <div className="quiz-header" style={{ background: gameId === 'brandQuiz' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
        <button className="back-button" onClick={goBackHome}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>{gameTitle}</h1>
        <div style={{ width: '36px' }}></div>
      </div>
      
      {currentQuestion && (
        <div className="quiz-content">
          <div className="quiz-progress">
            <div className="progress-text">
              <span>问题 {currentQuestionIndex + 1}/{questions.length}</span>
              <span>得分: {score}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="quiz-timer">
            <div className="timer-bar">
              <div 
                className={`timer-fill ${timeLeft <= 10 ? 'timer-warning' : ''}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
            <div className="timer-text">{timeLeft}秒</div>
          </div>
          
          <div className="question-card">
            <h2 className="question-text">{currentQuestion.question}</h2>
            
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${
                    selectedOption === index ? 'selected' : ''
                  } ${
                    showExplanation 
                      ? index === currentQuestion.correctAnswer 
                        ? 'correct' 
                        : selectedOption === index ? 'incorrect' : ''
                      : ''
                  }`}
                  onClick={() => handleSelectOption(index)}
                  disabled={showExplanation}
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="option-text">{option}</div>
                </button>
              ))}
            </div>
            
            {showExplanation && (
              <div className="explanation-container">
                <div className={`explanation ${selectedOption === currentQuestion.correctAnswer ? 'correct-explanation' : 'incorrect-explanation'}`}>
                  <div className="explanation-header">
                    <i className={`fas ${selectedOption === currentQuestion.correctAnswer ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    <h3>{selectedOption === currentQuestion.correctAnswer ? '回答正确！' : '回答错误'}</h3>
                  </div>
                  <p>{currentQuestion.explanation}</p>
                </div>
                <button className="next-button" onClick={handleNextQuestion}>
                  {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
