import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const OrderCountdown = ({ initialCountdown }) => {
  const [remainingTime, setRemainingTime] = useState(() => {
    const countdown = parseInt(initialCountdown, 10);
    return isNaN(countdown) ? 1800 : countdown;  // 默认30分钟(1800秒)
  });

  useEffect(() => {
    // 移除多余的转换和设置逻辑
    if (remainingTime <= 0) return;

    console.log("倒计时开始，初始值:", remainingTime);

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          console.log("倒计时结束");
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => {
      console.log("清除倒计时定时器");
      clearInterval(timer);
    };
  }, [remainingTime]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0分00秒";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}秒`;
  };

  return <span>{formatTime(remainingTime)}</span>;
};

OrderCountdown.propTypes = {
  initialCountdown: PropTypes.number.isRequired,
};

export default OrderCountdown;