import { createGlobalStyle } from 'styled-components';

/**
 * 全局样式组件
 * 设置应用程序级别的基础样式
 */
const GlobalStyles = createGlobalStyle`
  /* 基础样式重置 */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  /* 设置根字体大小和行高 */
  html {
    font-size: 12px; /* 根据tokens.js调整，整体缩小 */
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* 基础字体设置 */
  body {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px; /* 基础字体稍小，更紧凑 */
    font-weight: 400;
    color: ${({ theme }) => theme.colors.textMain};
    background-color: ${({ theme }) => theme.colors.background};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* 链接样式 */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  a:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
  
  /* 按钮重置 */
  button {
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: none;
  }
  
  /* 输入框样式重置 */
  input, textarea, select {
    font: inherit;
    color: inherit;
  }
  
  /* 移除列表样式 */
  ul, ol {
    list-style: none;
  }
  
  /* 标题字体大小设置 - 紧凑美观 */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Ma Shan Zheng', cursive; /* 应用手写体 */
  }

  h1 { font-size: 1.8rem; font-weight: 600; line-height: 1.2; margin-bottom: 0.5em; }
  h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.2; margin-bottom: 0.5em; }
  h3 { font-size: 1.2rem; font-weight: 600; line-height: 1.3; margin-bottom: 0.4em; }
  h4 { font-size: 1rem; font-weight: 500; line-height: 1.3; margin-bottom: 0.4em; }
  h5 { font-size: 0.9rem; font-weight: 500; line-height: 1.4; margin-bottom: 0.3em; }
  h6 { font-size: 0.8rem; font-weight: 500; line-height: 1.4; margin-bottom: 0.3em; }
  
  /* 常用间距类 */
  .mt-1 { margin-top: 0.2rem; }
  .mt-2 { margin-top: 0.4rem; }
  .mt-3 { margin-top: 0.6rem; }
  .mt-4 { margin-top: 0.8rem; }
  .mb-1 { margin-bottom: 0.2rem; }
  .mb-2 { margin-bottom: 0.4rem; }
  .mb-3 { margin-bottom: 0.6rem; }
  .mb-4 { margin-bottom: 0.8rem; }
  .ml-1 { margin-left: 0.2rem; }
  .ml-2 { margin-left: 0.4rem; }
  .mr-1 { margin-right: 0.2rem; }
  .mr-2 { margin-right: 0.4rem; }
  
  /* 常用内边距类 */
  .p-1 { padding: 0.2rem; }
  .p-2 { padding: 0.4rem; }
  .p-3 { padding: 0.6rem; }
  .p-4 { padding: 0.8rem; }
  .px-1 { padding-left: 0.2rem; padding-right: 0.2rem; }
  .px-2 { padding-left: 0.4rem; padding-right: 0.4rem; }
  .px-3 { padding-left: 0.6rem; padding-right: 0.6rem; }
  .px-4 { padding-left: 0.8rem; padding-right: 0.8rem; }
  .py-1 { padding-top: 0.2rem; padding-bottom: 0.2rem; }
  .py-2 { padding-top: 0.4rem; padding-bottom: 0.4rem; }
  .py-3 { padding-top: 0.6rem; padding-bottom: 0.6rem; }
  .py-4 { padding-top: 0.8rem; padding-bottom: 0.8rem; }
  
  /* 文本类 */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-xs { font-size: 0.7rem; } /* 缩小 */
  .text-sm { font-size: 0.8rem; } /* 缩小 */
  .text-md { font-size: 0.9rem; } /* 缩小 */
  .text-lg { font-size: 1rem; } /* 缩小 */
  .text-bold { font-weight: 600; }
  .text-normal { font-weight: 400; }
  
  /* 文本颜色类 */
  .text-primary { color: ${({ theme }) => theme.colors.primary}; }
  .text-main { color: ${({ theme }) => theme.colors.textMain}; }
  .text-sub { color: ${({ theme }) => theme.colors.textSub}; }
  .text-error { color: ${({ theme }) => theme.colors.error}; }
  .text-success { color: ${({ theme }) => theme.colors.success}; }
  
  /* 布局类 */
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .flex-wrap { flex-wrap: wrap; }
  .flex-1 { flex: 1; }
  .gap-1 { gap: 0.25rem; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  
  /* 常用动画 */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
  .animate-slideUp { animation: slideUp 0.3s ease forwards; }
  
  /* 表单样式重置 */
  input, select, textarea {
    border: 1px solid ${({ theme }) => theme.colors.border}; /* 窄边框 */
    border-radius: 4px; /* 略微减小圆角 */
    padding: 7px 9px; /* 调整内边距 */
    font-size: 0.85rem; /* 调整字体大小 */
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 1px ${({ theme }) => `${theme.colors.primary}20`}; /* 调整阴影 */
    }
  }
  
  /* 按钮基础样式 */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
  
  .btn-primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  }
  
  /* 卡片基础样式 */
  .card {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
`;

export default GlobalStyles; 