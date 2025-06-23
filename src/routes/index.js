import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
// import LoadingSpinner from '../components/common/LoadingSpinner';

const DiscoverPage = lazy(() => import('../pages/Discover'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<div>Root Layout</div>}>
                    {/* <Route index element={<HomePage />} /> */}
                    <Route path="discover" element={<DiscoverPage />} />
                    {/* <Route path="login" element={<LoginPage />} /> */}
                    {/* <Route path="register" element={<RegisterPage />} /> */}

                    {/* Example of a protected route */}
                    {/* <Route path="dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } /> */}
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes; 