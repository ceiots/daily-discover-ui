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
    font-size: 14px;
    line-height: 1.4;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* 基础字体设置 */
  body {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.9rem;
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
  h1 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
  h2 { font-size: 1.3rem; font-weight: 600; line-height: 1.3; }
  h3 { font-size: 1.15rem; font-weight: 600; line-height: 1.4; }
  h4 { font-size: 1.05rem; font-weight: 500; line-height: 1.4; }
  h5 { font-size: 0.95rem; font-weight: 500; line-height: 1.4; }
  h6 { font-size: 0.9rem; font-weight: 500; line-height: 1.4; }
  
  /* 常用间距类 */
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .ml-1 { margin-left: 0.25rem; }
  .ml-2 { margin-left: 0.5rem; }
  .mr-1 { margin-right: 0.25rem; }
  .mr-2 { margin-right: 0.5rem; }
  
  /* 常用内边距类 */
  .p-1 { padding: 0.25rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  
  /* 文本类 */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-sm { font-size: 0.8rem; }
  .text-md { font-size: 0.9rem; }
  .text-lg { font-size: 1rem; }
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
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}20`};
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