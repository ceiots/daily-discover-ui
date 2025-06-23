import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const DiscoverPage = lazy(() => import('../pages/Discover'));
const RegisterPage = lazy(() => import('../pages/account/RegisterPage'));
const LoginPage = lazy(() => import('../pages/account/LoginPage'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<div>Root Layout</div>}>
                    <Route path="discover" element={<DiscoverPage />} />
                </Route>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes; 