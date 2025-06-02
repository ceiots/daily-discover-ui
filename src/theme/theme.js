// 主题配置文件 - 高级美学优化
const theme = {
  colors: {
    // 主色调：深邃蓝紫
    primary: {
      light: '#E6E3F7', // 浅紫
      main: '#6B4EFF',  // 主色（更深更低饱和度）
      dark: '#4B36A8',  // 深紫
    },
    // 灰阶
    neutral: {
      0: '#fff',
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },
    // 状态色
    success: '#22C55E',
    warning: '#F59E42',
    error: '#EF4444',
    info: '#3B82F6',
    // 背景
    background: {
      default: '#F7F7FA',
      paper: '#fff',
      dark: '#18181B',
    },
    // 禁用色
    disabled: '#E5E7EB',
  },
  fontFamily: {
    base: `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif`,
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
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
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 1px 4px 0 rgba(75, 54, 168, 0.04)',
    md: '0 2px 8px 0 rgba(75, 54, 168, 0.08)',
    lg: '0 4px 16px 0 rgba(75, 54, 168, 0.10)',
    none: 'none',
  },
  transition: {
    fast: 'all 0.15s cubic-bezier(0.4,0,0.2,1)',
    normal: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  safeArea: {
    top: 'env(safe-area-inset-top, 0)',
    right: 'env(safe-area-inset-right, 0)',
    bottom: 'env(safe-area-inset-bottom, 0)',
    left: 'env(safe-area-inset-left, 0)',
  },
};

export default theme; 