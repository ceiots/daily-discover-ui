/**
 * 颜色系统
 * 统一管理应用的颜色设计令牌
 */

const colors = {
  // 主色调 - 突出主配色 #5B47E8
  primary: '#5B47E8',
  secondary: '#766DE8',
  
  // 中性色
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // 功能色
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  // 其他营销场景特殊色
  marketing: {
    sale: '#FF4D4F', // 促销红
    new: '#52C41A',  // 新品绿
    hot: '#FA8C16',  // 热卖橙
  },
  
  // 用于商品评分
  rating: {
    yellow: '#FADB14',
    gray: '#D9D9D9',
  },
};

export default colors; 