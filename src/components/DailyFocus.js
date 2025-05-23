import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DailyFocus.css';
import instance from '../utils/axios';

const DailyFocus = ({ currentDate }) => {
  // 状态定义
  const [weatherData, setWeatherData] = useState({
    temperature: '25°C',
    range: '18°C ~ 28°C',
    condition: '晴转多云',
    city: '北京市',
    icon: 'sun'
  });
  const [dailyQuote, setDailyQuote] = useState({
    content: '保持对生活的热爱，把每一天都过得热气腾腾。',
    author: '佚名'
  });
  const [dailyTip, setDailyTip] = useState('长时间看屏幕后，记得远眺放松眼睛哦！');
  const [specialDay, setSpecialDay] = useState('');
  const [historicalEvent, setHistoricalEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 格式化日期和星期
  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const getWeekday = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekdays[date.getDay()]}`;
  };

  // 获取天气信息
  const fetchWeatherData = async () => {
    try {
      // 真实场景中应调用天气API
      // 这里使用模拟数据
      const weatherIcons = ['sun', 'cloud-sun', 'cloud', 'cloud-rain', 'cloud-showers-heavy'];
      const conditions = ['晴朗', '晴转多云', '多云', '小雨', '大雨'];
      const randomIndex = Math.floor(Math.random() * weatherIcons.length);
      
      // 使用地理位置API获取城市（如果可用）
      // 这里使用模拟数据
      const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      // 生成随机温度
      const baseTemp = Math.floor(Math.random() * 15) + 15; // 15-30度
      const minTemp = baseTemp - Math.floor(Math.random() * 5); // 基础温度减1-5度
      const maxTemp = baseTemp + Math.floor(Math.random() * 5); // 基础温度加1-5度
      
      setWeatherData({
        temperature: `${baseTemp}°C`,
        range: `${minTemp}°C ~ ${maxTemp}°C`,
        condition: conditions[randomIndex],
        city: randomCity,
        icon: weatherIcons[randomIndex]
      });
    } catch (error) {
      console.error('获取天气信息失败:', error);
      // 保持默认值
    }
  };

  // 获取每日一句
  const fetchDailyQuote = async () => {
    try {
      // 模拟API调用
      const quotes = [
        { content: '生活不是等待风暴过去，而是学会在雨中跳舞。', author: '佚名' },
        { content: '每一个不曾起舞的日子，都是对生命的辜负。', author: '尼采' },
        { content: '把握现在，就是创造未来。', author: '佚名' },
        { content: '今天的努力，是为了明天的微笑。', author: '佚名' },
        { content: '保持对生活的热爱，把每一天都过得热气腾腾。', author: '佚名' }
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setDailyQuote(randomQuote);
    } catch (error) {
      console.error('获取每日一句失败:', error);
      // 保持默认值
    }
  };

  // 获取每日小贴士
  const fetchDailyTip = async () => {
    try {
      // 模拟API调用
      const tips = [
        '长时间看屏幕后，记得远眺放松眼睛哦！',
        '喝水小提醒：现在就喝一杯水，保持身体水分充足。',
        '工作间隙，站起来活动一下，对身体健康很有帮助。',
        '专注工作25分钟，休息5分钟，能显著提高效率。',
        '晚餐少吃多动，有助于提高睡眠质量。'
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setDailyTip(randomTip);
    } catch (error) {
      console.error('获取每日小贴士失败:', error);
      // 保持默认值
    }
  };

  // 检查特殊日子
  const checkSpecialDay = (dateString) => {
    const today = dateString ? new Date(dateString) : new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // 简易节日/节气判断逻辑
    const specialDays = {
      '1-1': '元旦快乐！',
      '5-1': '劳动节快乐！',
      '10-1': '国庆节快乐！',
      '2-14': '情人节快乐！',
      '12-25': '圣诞快乐！',
      // 可添加更多节日/节气
    };
    
    const key = `${month}-${day}`;
    if (specialDays[key]) {
      setSpecialDay(specialDays[key]);
    } else {
      setSpecialDay('');
    }
  };

  // 获取历史上的今天精选事件
  const fetchHistoricalEventHighlight = async (dateString) => {
    try {
      // 在真实场景中，应该调用API获取历史事件
      // 这里使用模拟数据
      const date = dateString ? new Date(dateString) : new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // 模拟事件数据
      const mockEvents = [
        { 
          id: 1, 
          title: '人类首次登月', 
          year: 1969,
          description: '1969年7月20日，阿波罗11号宇航员尼尔·阿姆斯特朗成为第一个踏上月球的人类。'
        },
        { 
          id: 2, 
          title: '第一台个人电脑发布', 
          year: 1975,
          description: 'Altair 8800成为第一台商业化的个人电脑，开启了个人计算机时代。'
        },
        { 
          id: 3, 
          title: '万维网发明', 
          year: 1989,
          description: '蒂姆·伯纳斯-李发明了万维网(World Wide Web)，彻底改变了人类获取信息的方式。'
        }
      ];
      
      // 随机选择一个事件作为精选
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setHistoricalEvent(randomEvent);
    } catch (error) {
      console.error('获取历史事件失败:', error);
      setHistoricalEvent(null);
    }
  };

  // 初始化数据
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchWeatherData(),
        fetchDailyQuote(),
        fetchDailyTip(),
        fetchHistoricalEventHighlight(currentDate)
      ]);
      checkSpecialDay(currentDate);
      setIsLoading(false);
    };
    
    fetchAllData();
  }, [currentDate]);

  // 分享每日一句
  const handleShareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: '每日一句',
        text: `${dailyQuote.content} —— ${dailyQuote.author}`,
        url: window.location.href
      })
      .catch(error => console.error('分享失败:', error));
    } else {
      // 复制到剪贴板
      const textToCopy = `${dailyQuote.content} —— ${dailyQuote.author}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert('已复制到剪贴板'))
        .catch(err => console.error('复制失败:', err));
    }
  };

  // 获取天气图标类名
  const getWeatherIconClass = (icon) => {
    switch (icon) {
      case 'sun': return 'fas fa-sun text-yellow-500';
      case 'cloud-sun': return 'fas fa-cloud-sun text-yellow-400';
      case 'cloud': return 'fas fa-cloud text-gray-400';
      case 'cloud-rain': return 'fas fa-cloud-rain text-blue-400';
      case 'cloud-showers-heavy': return 'fas fa-cloud-showers-heavy text-blue-500';
      default: return 'fas fa-sun text-yellow-500';
    }
  };

  if (isLoading) {
    return (
      <div className="daily-focus-container bg-white rounded-lg p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-focus-container bg-white rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium flex items-center">
          <i className="fas fa-star text-primary mr-2"></i>
          今日焦点
        </h2>
      </div>
      
      {/* 日期和天气信息 */}
      <div className="focus-header flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="date-info mb-2 sm:mb-0">
          <div className="text-base font-semibold">{formatDate(currentDate)}</div>
          <div className="text-sm text-gray-500">{getWeekday(currentDate)}</div>
          {specialDay && (
            <div className="text-sm text-primary font-medium mt-1">{specialDay}</div>
          )}
        </div>
        
        <div className="weather-info flex items-center bg-gray-50 rounded-lg px-3 py-2">
          <i className={`${getWeatherIconClass(weatherData.icon)} text-2xl mr-2`}></i>
          <div>
            <div className="flex items-center">
              <span className="text-lg font-medium">{weatherData.temperature}</span>
              <span className="text-xs text-gray-500 ml-2">{weatherData.range}</span>
            </div>
            <div className="text-sm text-gray-600">{weatherData.condition} · {weatherData.city}</div>
          </div>
        </div>
      </div>
      
      <div className="focus-divider my-3 border-t border-gray-100"></div>
      
      {/* 每日一句 */}
      <div className="daily-quote mb-3">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <i className="fas fa-quote-left mr-1"></i>
          <span>每日一句</span>
        </div>
        <div className="quote-content p-3 bg-gray-50 rounded-lg relative">
          <p className="text-sm text-gray-700">{dailyQuote.content}</p>
          {dailyQuote.author && (
            <p className="text-xs text-gray-500 text-right mt-1">—— {dailyQuote.author}</p>
          )}
          <button 
            onClick={handleShareQuote}
            className="absolute top-2 right-2 text-gray-400 hover:text-primary"
          >
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      
      {/* 每日小贴士 */}
      <div className="daily-tip">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <i className="fas fa-lightbulb text-yellow-400 mr-1"></i>
          <span>今日小贴士</span>
        </div>
        <div className="tip-content p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{dailyTip}</p>
        </div>
      </div>
      
      {/* 历史上的今天精华版 */}
      {historicalEvent && (
        <div className="historical-event mt-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <i className="fas fa-history mr-1"></i>
            <span>历史上的今天</span>
          </div>
          <div className="event-content p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-primary font-semibold mr-2">{historicalEvent.year}</span>
              <h4 className="text-sm font-medium">{historicalEvent.title}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">{historicalEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

DailyFocus.propTypes = {
  currentDate: PropTypes.string.isRequired,
};

export default DailyFocus;