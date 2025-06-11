/**
 * 阴影系统
 * 统一管理应用的阴影设计令牌
 */

const shadows = {
  // 阴影层级
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  default: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(118, 109, 232, 0.4)',
  
  // 暗色模式阴影
  darkMode: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.16)',
  
  // 特殊场景阴影
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  popup: '0 4px 16px rgba(0, 0, 0, 0.12)',
  dropdown: '0 2px 5px rgba(0, 0, 0, 0.1)',
  toast: '0 4px 12px rgba(0, 0, 0, 0.15)',
  modal: '0 8px 30px rgba(0, 0, 0, 0.18)',
};

export default shadows; 