/**
 * 设计令牌 (Design Tokens)
 * 
 * 这是UI的唯一事实来源，定义了所有视觉元素的标准
 * 任何样式值的修改都应该在这里进行，确保整个应用的一致性
 */

export const tokens = {
  // 颜色 (Color)
  colors: {
    // 主色 (Primary)
    primary: {
      main: '#5B47E8', // 核心品牌色，用于关键操作、链接、高亮状态
      dark: '#4936D8', // 用于Hover状态
      light: '#E8E5FB', // 用于背景或辅助元素
    },
    // 文本 (Text)
    text: {
      primary: '#212121', // 正文和标题
      secondary: '#666666', // 辅助、次要信息
      disabled: '#BDBDBD', // 禁用状态
      onPrimary: '#FFFFFF', // 在主色背景上使用的文本颜色
    },
    // 背景 (Background)
    bg: {
      page: '#F7F8FA', // 应用的最底层页面背景，提供一个柔和的底色
      container: '#FFFFFF', // 卡片、容器、模态框、表单输入框等内容区域的背景
      containerHover: '#F7F8FA', // 容器在Hover状态下的背景色
    },
    // 反馈 (Feedback)
    feedback: {
      success: '#4CAF50', // 成功
      error: '#F44336', // 错误
      warning: '#FF9800', // 警告
      info: '#2196F3', // 信息
    },
    // 边框与分割线 (Border & Divider)
    border: {
      main: '#E0E0E0',
    },
  },

  // 字体 (Typography)
  typography: {
    // 字体族 (Font Family)
    fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
    // 字号 (Font Size)
    fontSize: {
      xs: '12px', // 标签、时间戳等最次要信息
      sm: '14px', // 辅助文本、输入框
      md: '15px', // 正文、段落默认
      lg: '17px', // 卡片/区域标题
      xl: '20px', // 页面主标题
      xxl: '24px', // 用于特殊营销/展示场景
    },
    // 字重 (Font Weight)
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // 行高 (Line Height)
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
    },
  },

  // 间距 (Spacing)
  spacing: {
    unit: '4px',
    xs: '4px', // 1x
    sm: '8px', // 2x
    md: '12px', // 3x
    lg: '16px', // 4x
    xl: '24px', // 6x
    xxl: '32px', // 8x
  },

  // 布局 (Layout)
  layout: {
    // 圆角 (Border Radius)
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
    },
    // 阴影 (Box Shadow)
    shadow: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
      md: '0 4px 12px rgba(0, 0, 0, 0.1)',
      lg: '0 8px 20px rgba(0, 0, 0, 0.15)',
    },
    // 容器最大宽度 (Container Max Width)
    maxWidth: {
      form: '400px',
    },
  },

  // 动画 (Animation)
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },

  // 安全区域
  safeArea: {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  },
};

export default tokens; 