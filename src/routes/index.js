import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// 懒加载页面组件
const DiscoverPage = lazy(() => import('../pages/Discover'));
const LoginPage = lazy(() => import('../pages/account/LoginPage'));
const RegisterPage = lazy(() => import('../pages/account/RegisterPage'));

// 根据SEO-First原则添加默认元数据
const DefaultHelmet = () => (
  <Helmet>
    <title>Daily Discover - 发现每一天</title>
    <meta name="description" content="Daily Discover - 您的个性化电商与内容发现平台" />
  </Helmet>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <DefaultHelmet />
      <Routes>
        <Route path="/" element={<div>根布局</div>}>
          <Route index element={<div>首页</div>} />
          <Route path="discover" element={<DiscoverPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<div>404 - 页面未找到</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 