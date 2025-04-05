import { useState, useEffect } from 'react';

export const useCountdown = (initialCountdown) => {
  const [remainingTime, setRemainingTime] = useState(initialCountdown);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  return remainingTime;
};


// 格式化规格信息
export const formatSpecifications = (specs) => {
    if (!specs) return "默认规格";
    
    try {
        // 如果是字符串，尝试解析成对象
        const specsObj = typeof specs === 'string' ? JSON.parse(specs) : specs;
        
        // 如果是数组格式
        if (Array.isArray(specsObj)) {
            return specsObj.map(spec => {
                if (spec.name && spec.values) {
                    // 如果 values 是数组，将其连接起来
                    const values = Array.isArray(spec.values) ? spec.values.join('/') : spec.values;
                    return `${spec.name}: ${values}`;
                }
                return '';
            }).filter(Boolean).join(' | ');
        } 
        // 如果是对象格式
        else if (specsObj.name && specsObj.values) {
            const values = Array.isArray(specsObj.values) ? specsObj.values.join('/') : specsObj.values;
            return `${specsObj.name}: ${values}`;
        }
        // 如果是简单的键值对格式
        else {
            return Object.entries(specsObj)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' | ');
        }
    } catch (error) {
        console.error("规格格式化错误:", error);
        // 如果解析失败，直接返回原始字符串，但去掉多余的符号
        if (typeof specs === 'string') {
            return specs
                .replace(/[{}""]/g, '')  // 移除括号和引号
                .replace(/name:/g, '')       // 移除 name: 标签
                .replace(/values:/g, '')     // 移除 values: 标签
                .replace(/,/g, ' | ');       // 将逗号替换为分隔符
        }
        return String(specs);
    }
};

// 初始化倒计时
export const initCountdown = (countdownStr, setCountdown, orderNumber, fetchOrderDetail) => {
    // 解析倒计时字符串，例如 "30分钟"
    let minutes = 30;
    if (countdownStr) {
        const match = countdownStr.match(/(\d+)/);
        if (match && match[1]) {
            minutes = parseInt(match[1], 10);
        }
    }
    
    // 设置倒计时秒数
    let seconds = minutes * 60;
    
    // 更新倒计时显示
    const updateCountdown = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        setCountdown(`${mins}分${secs < 10 ? '0' : ''}${secs}秒`);
    };
    updateCountdown(seconds);
    
    // 设置定时器，每秒更新倒计时
    const timer = setInterval(() => {
        // 确保倒计时不会变为负数
        seconds = Math.max(0, seconds - 1);
        if (seconds === 0) {
            clearInterval(timer);
            // 调用获取订单详情函数时添加错误处理
            const fetchAndHandleOrder = async () => {
                try {
                    await fetchOrderDetail(orderNumber); // Now it can access the function
                } catch (error) {
                    console.error('Error refreshing order status:', error);
                }
            };
            fetchAndHandleOrder();
        } else {
            updateCountdown(seconds);
        }
    }, 1000);

    // 组件卸载时清除定时器
    return () => clearInterval(timer);
};