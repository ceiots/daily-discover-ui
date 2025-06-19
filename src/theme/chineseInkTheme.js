const chineseInkTheme = {
  colors: {
    primary: '#2c3e50', // 靛蓝 - 深邃，作为主色
    secondary: '#c0392b', // 暗红 - 用于强调和点缀
    background: '#f4f4f4', // 月白 - 类似宣纸的微黄色背景
    surface: 'rgba(255, 255, 255, 0.85)', // 半透明表面，营造层次感
    textMain: '#333333', // 墨黑 - 主要文字颜色
    textLight: '#7f8c8d', // 弱化的灰色文字
    accent: '#3498db', // 亮蓝色 - 用于链接等提示
    success: '#27ae60',
    error: '#e74c3c',
    white: '#ffffff',
  },
  typography: {
    fontFamilyBase: "'PingFang SC', 'Helvetica Neue', Arial, sans-serif",
    fontFamilyHeading: "'Ma Shan Zheng', cursive",
    fontSizeBase: '14px',
    fontSizeSmall: '12px',
    fontSizeLarge: '16px',
    h1: '2.2rem',
    h2: '1.8rem',
    h3: '1.5rem',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
    medium: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
  },
  animations: {
    fast: '0.2s ease',
    normal: '0.3s ease',
  },
  sizes: {
    // Define sizes if needed, e.g.
    // navHeight: '60px',
  },
  components: {
    button: {
      padding: '8px 16px',
    },
    input: {
      padding: '10px 12px',
    },
  },
};

export default chineseInkTheme; 