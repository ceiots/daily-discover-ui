import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const DiscoverPage = lazy(() => import('../pages/Discover'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<div>Root Layout</div>}>
                    <Route path="discover" element={<DiscoverPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes; 