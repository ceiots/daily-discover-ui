// index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // 导入 createRoot
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // 引入 Font Awesome CSS
import { HelmetProvider } from 'react-helmet-async';
import './index.css'; // 确保引入包含Tailwind CSS的样式表

const root = createRoot(document.getElementById('root')); // 创建根节点
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
); // 使用 render 方法渲染应用