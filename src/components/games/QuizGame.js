import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CountdownTimer from '../common/CountdownTimer';
import ProgressBar from '../common/ProgressBar';
import './QuizGame.css';
import instance from '../../utils/axios';

const QuizGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  
  useEffect(() => {
    // 获取问题数据
    fetchQuizQuestions(id);
  }, [id]);

  // 获取问题数据
  const fetchQuizQuestions = async (gameId) => {
    try {
      setLoading(true);
      const response = await instance.get(`/game/${gameId}/questions?count=10`);
      
      if (response.data && response.data.code === 200) {
        setQuestions(response.data.data || []);
      } else {
        // 使用默认问题
        setDefaultQuestions();
      }
    } catch (error) {
      console.error('获取问题失败:', error);
      setDefaultQuestions();
    } finally {
      setLoading(false);
    }
  };

  // 设置默认问题
  const setDefaultQuestions = () => {
    setQuestions([
      {
        id: 1,
        text: "以下哪款手机配备了最新的A17 Pro芯片?",
        answers: ["iPhone 13", "iPhone 14 Pro", "iPhone 15 Pro", "iPhone SE"],
        correctAnswer: 2,
        image: null,
        category: "科技"
      },
      {
        id: 2,
        text: "智能手表的心率监测功能通常使用什么技术?",
        answers: ["超声波", "光电容积脉搏波描记法", "心电图", "压力传感器"],
        correctAnswer: 1,
        image: null,
        category: "科技"
      },
      {
        id: 3,
        text: "下列哪种连接方式的传输速度最快?",
        answers: ["蓝牙5.0", "Wi-Fi 6", "USB 2.0", "USB-C 3.2"],
        correctAnswer: 3,
        image: null,
        category: "科技"
      },
      {
        id: 4,
        text: "以下哪种显示技术能够实现每像素自发光?",
        answers: ["LCD", "LED", "OLED", "IPS"],
        correctAnswer: 2,
        image: null,
        category: "科技"
      },
      {
        id: 5,
        text: "无线耳机的主动降噪技术原理是什么?",
        answers: ["吸收环境声波", "产生反相声波", "增强特定频率", "减弱所有频率"],
        correctAnswer: 1,
        image: null,
        category: "科技"
      }
    ]);
  };

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    // 检查答案
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + calculateScore(timeLeft));
    }
    
    // 延迟进入下一题
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(15);
      } else {
        // 游戏结束，跳转到结果页
        navigate(`/game/result/${id}`, { 
          state: { score, totalQuestions: questions.length } 
        });
      }
    }, 1500);
  };
  
  const calculateScore = (timeLeft) => {
    // 基础分 + 时间奖励
    return 100 + (timeLeft * 5);
  };
  
  if (loading) {
    return <div className="loading-container">
      <div className="brand-loader">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <p>题目加载中...</p>
    </div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="error-container">
      <p>无法加载题目，请重试</p>
      <button onClick={() => navigate('/game')} className="back-button">
        返回游戏大厅
      </button>
    </div>;
  }

  const currentQ = questions[currentQuestion];
  
  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <ProgressBar 
          current={currentQuestion + 1} 
          total={questions.length}
        />
        <div className="quiz-score">
          得分: {score}
        </div>
      </div>
      
      <CountdownTimer 
        duration={15} 
        onTimeUpdate={setTimeLeft}
        onTimeout={() => handleAnswerSelect(-1)} // 超时自动处理
      />
      
      <div className="question-card">
        <h2 className="question-text">{currentQ.text}</h2>
        {currentQ.image && (
          <div className="question-image-container">
            <img 
              src={currentQ.image} 
              alt="问题图片" 
              className="question-image"
            />
          </div>
        )}
        
        <div className="answers-container">
          {currentQ.answers.map((answer, index) => (
            <button
              key={index}
              className={`answer-button ${selectedAnswer === index ? 
                (index === currentQ.correctAnswer ? 'correct' : 'incorrect') : ''}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
