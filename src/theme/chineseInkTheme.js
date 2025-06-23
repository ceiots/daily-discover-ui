import theme from './tokens'; // Import the default export

const { colors, spacing, typography, shadows, radius, transitions } = theme; // Destructure

const chineseInkTheme = {
  colors: {
    ...colors,
    primary: '#5B47E8', // 主色调与tokens保持一致
    primaryHover: '#4a3ac8', // 主色悬停状态与tokens保持一致
    background: '#f4f4f4', // 使用浅灰色背景
    surface: '#FFFFFF', // 使用纯白作为表面色
    textMain: '#2c2c2c', // 深灰色主文字
    textSub: '#6b6b6b', // 中灰色次要文字
    border: '#e7e7e7', // 边框颜色
  },
  typography: typography,
  spacing: spacing,
  shadows: shadows,
  borderRadius: radius,
  animations: transitions,
  sizes: {
    // Define sizes if needed, e.g.
    // navHeight: '60px',
  },
  // components 中的样式将不再需要，因为已经通过 tokens 统一管理
  components: {
    button: {
      padding: typography.fontSize.base, // 使用 token 定义
    },
    input: {
      padding: typography.fontSize.base, // 使用 token 定义
    },
  },
};

export default chineseInkTheme; 