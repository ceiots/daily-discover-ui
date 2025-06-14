/**
 * 性能监控工具
 * 提供组件渲染性能监控和分析功能
 */
import { useRef, useEffect } from 'react';

/**
 * 使用Web Vitals库收集核心性能指标
 * @param {Function} reportHandler - 处理性能指标的回调函数
 */
export const initWebVitals = (reportHandler) => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportHandler); // 累积布局偏移
      getFID(reportHandler); // 首次输入延迟
      getFCP(reportHandler); // 首次内容绘制
      getLCP(reportHandler); // 最大内容绘制
      getTTFB(reportHandler); // 首字节时间
    });
  }
};

/**
 * 组件渲染性能Hook
 * 监控组件的渲染时间和频率
 * @param {string} componentName - 组件名称
 * @param {Object} options - 配置选项
 * @param {boolean} options.logToConsole - 是否在控制台输出性能日志
 * @param {Function} options.onPerformanceData - 性能数据回调
 * @returns {Object} 性能数据对象
 */
export const useComponentPerformance = (
  componentName,
  { logToConsole = false, onPerformanceData = null } = {}
) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const renderDurations = useRef([]);
  
  // 记录渲染开始时间
  const startTime = performance.now();
  
  useEffect(() => {
    // 计算渲染时间
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    const timeSinceLastRender = endTime - lastRenderTime.current;
    
    // 更新引用数据
    renderCount.current += 1;
    lastRenderTime.current = endTime;
    renderDurations.current.push(renderTime);
    
    // 保持最近的100次渲染数据
    if (renderDurations.current.length > 100) {
      renderDurations.current.shift();
    }
    
    // 计算平均渲染时间
    const averageRenderTime = 
      renderDurations.current.reduce((sum, time) => sum + time, 0) / 
      renderDurations.current.length;
    
    // 性能数据对象
    const performanceData = {
      componentName,
      renderCount: renderCount.current,
      currentRenderTime: renderTime,
      averageRenderTime,
      timeSinceLastRender,
      timestamp: new Date().toISOString()
    };
    
    // 输出到控制台
    if (logToConsole) {
      console.log(
        `%c[Performance] ${componentName}`, 
        'color: #5B47E8; font-weight: bold;',
        performanceData
      );
    }
    
    // 回调函数
    if (typeof onPerformanceData === 'function') {
      onPerformanceData(performanceData);
    }
    
    // 性能警告
    if (renderTime > 16) { // 16ms = 60fps的渲染预算
      console.warn(
        `%c[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render, which may cause frame drops.`,
        'color: #F59E0B; font-weight: bold;'
      );
    }
  });
  
  return {
    getRenderCount: () => renderCount.current,
    getAverageRenderTime: () => 
      renderDurations.current.reduce((sum, time) => sum + time, 0) / 
      renderDurations.current.length,
    getRenderHistory: () => [...renderDurations.current]
  };
};

/**
 * 高阶组件：添加性能监控
 * @param {React.Component} Component - 要监控的组件
 * @param {Object} options - 配置选项
 * @returns {React.Component} 增强的组件
 */
export const withPerformanceMonitoring = (Component, options = {}) => {
  const MonitoredComponent = (props) => {
    const componentName = Component.displayName || Component.name || 'UnknownComponent';
    useComponentPerformance(componentName, options);
    return <Component {...props} />;
  };
  
  MonitoredComponent.displayName = `WithPerformance(${Component.displayName || Component.name || 'Component'})`;
  return MonitoredComponent;
};

/**
 * 测量函数执行时间的工具函数
 * @param {Function} fn - 要测量的函数
 * @param {string} fnName - 函数名称
 * @returns {Function} 包装后的函数
 */
export const measureFunctionPerformance = (fn, fnName = 'anonymous') => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    const executionTime = end - start;
    
    console.log(`[Function Performance] ${fnName} took ${executionTime.toFixed(2)}ms to execute`);
    
    return result;
  };
};

export default {
  initWebVitals,
  useComponentPerformance,
  withPerformanceMonitoring,
  measureFunctionPerformance
}; 