import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const OrderCountdown = ({ initialCountdown, remainingTime }) => {
  const [currentTime, setCurrentTime] = useState(() => {
    if (remainingTime) {
      return remainingTime;
    }
    const countdown = parseInt(initialCountdown, 10);
    return isNaN(countdown) ? 1800 : countdown; // 默认30分钟(1800秒)
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (remainingTime) {
      setCurrentTime(remainingTime);
    }
  }, [remainingTime]);

  useEffect(() => {
    if (currentTime <= 0) return;

    console.log("倒计时开始，初始值:", currentTime);

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timerRef.current);
          console.log("倒计时结束");
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => {
      console.log("清除倒计时定时器");
      clearInterval(timerRef.current);
    };
  }, [currentTime]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0分00秒";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}秒`;
  };

  return <span>{formatTime(currentTime)}</span>;
};

OrderCountdown.propTypes = {
  initialCountdown: PropTypes.number.isRequired,
  remainingTime: PropTypes.number,
};

export default OrderCountdown;