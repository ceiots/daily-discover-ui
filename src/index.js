// index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // 导入 createRoot
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // 引入 Font Awesome CSS

const root = createRoot(document.getElementById('root')); // 创建根节点
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
); // 使用 render 方法渲染应用