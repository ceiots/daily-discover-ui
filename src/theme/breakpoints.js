/**
 * 断点系统
 * 统一管理应用的响应式断点设计令牌
 */

const breakpoints = {
  // 断点定义（移动优先）
  xs: '0px',       // 默认移动设备
  sm: '640px',     // 小型平板及以上
  md: '768px',     // 平板及以上
  lg: '1024px',    // 小型桌面及以上
  xl: '1280px',    // 桌面及以上
  '2xl': '1536px', // 大型桌面及以上
  
  // 媒体查询生成函数
  up: (key) => {
    const value = typeof key === 'number' ? `${key}px` : breakpoints[key] || key;
    return `@media (min-width: ${value})`;
  },
  
  down: (key) => {
    const value = typeof key === 'number' ? `${key}px` : breakpoints[key] || key;
    return `@media (max-width: ${value})`;
  },
  
  between: (start, end) => {
    const startValue = typeof start === 'number' ? `${start}px` : breakpoints[start] || start;
    const endValue = typeof end === 'number' ? `${end}px` : breakpoints[end] || end;
    return `@media (min-width: ${startValue}) and (max-width: ${endValue})`;
  },
  
  // 常用设备断点
  devices: {
    mobile: '@media (max-width: 639px)',
    tablet: '@media (min-width: 640px) and (max-width: 1023px)',
    desktop: '@media (min-width: 1024px)',
  },
};

export default breakpoints; 