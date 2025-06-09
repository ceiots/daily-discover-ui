// 主题配置文件 - 优化版简洁高级UI/UX设计体系
const theme = {
  colors: {
    // 主色调：深紫色
    primary: {
      50: '#F4F2FF',  // 极浅紫
      100: '#E6E3F7', // 浅紫背景
      200: '#D0B7FA',
      300: '#C0A0F8',
      400: '#7C69EF', // 浅紫色（悬停状态）
      500: '#5B47E8', // 主色调
      600: '#5B47E8', // 主色调（保持一致）
      700: '#4A3BD1', // 深紫色（按压状态）
      800: '#3A2A82', // 更深紫
      900: '#2E2266',
    },
    // 中性色谱
    neutral: {
      50: '#FFFFFF',  // 主背景
      100: '#FAFBFC', // 次级背景
      200: '#F1F3F5', // 三级背景
      300: '#E5E7EB', // 分割线
      400: '#9CA3AF',
      500: '#6B7280', // 辅助文本
      600: '#4B5563', // 次要文本
      700: '#374151',
      800: '#1F2937', // 主文本
      900: '#111827',
    },
    // 功能色彩
    success: '#059669', // 成功
    warning: '#F59E0B', // 警告
    error: '#DC2626',   // 错误
    info: '#3B82F6',    // 信息
    // 背景
    background: {
      default: '#FFFFFF',
      paper: '#FAFBFC',
      tertiary: '#F1F3F5',
    },
  },
  
  fontFamily: {
    base: `'PingFang SC', 'Source Han Sans', 'SF Pro Display', 'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  
  // 精密字体系统
  fontSize: {
    // 桌面端 (1024px+)
    display: '28px',
    h1: '22px',
    h2: '18px',
    h3: '16px',
    'body-large': '15px',
    body: '14px',
    caption: '12px',
    micro: '11px',
    
    // 移动端尺寸在媒体查询中处理
  },
  
  lineHeight: {
    display: '1.15',
    h1: '1.18',
    h2: '1.22',
    h3: '1.25',
    'body-large': '1.47',
    body: '1.43',
    caption: '1.33',
    micro: '1.27',
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // 精密布局网格
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },
  
  borderRadius: {
    none: '0',
    sm: '4px',
    DEFAULT: '6px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },
  
  boxShadow: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    DEFAULT: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    none: 'none',
    primary: '0 4px 14px rgba(91, 71, 232, 0.25)',
  },
  
  // 高级交互模式
  transition: {
    default: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slow: 'all 350ms cubic-bezier(0.19, 1, 0.22, 1)',
    elastic: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // 智能断点系统
  screens: {
    'mobile-sm': '320px',
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
    xl: '1920px',
  },
  
  // 安全区域
  safeArea: {
    top: 'env(safe-area-inset-top, 0)',
    right: 'env(safe-area-inset-right, 0)',
    bottom: 'env(safe-area-inset-bottom, 0)',
    left: 'env(safe-area-inset-left, 0)',
  },
};

export default theme; 