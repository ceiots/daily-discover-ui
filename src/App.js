import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
import { ThemeProvider, GlobalStyles } from './theme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';

// Global components
import NavBar from './theme/components/NavBar';
import CommonHelmet from './components/CommonHelmet';

// Page components
import Daily from './components/Daily';
import Discover from './components/Discover';
import MyService from './components/MyService';
import Settings from './components/settings/Settings';

// Auth pages
import LoginPage from './pages/account/LoginPage';
import RegisterPage from './pages/account/RegisterPage';
import ForgotPasswordPage from './pages/account/ForgotPasswordPage';

// Lazy-loaded pages
const OrderList = lazy(() => import('./components/order/OrderList'));
const OrderDetail = lazy(() => import('./components/order/OrderDetail'));
const LogisticsTracker = lazy(() => import('./components/LogisticsTracker'));
const ProductDetail = lazy(() => import("./components/product/ProductDetail"));
const RefundForm = lazy(() => import("./components/RefundForm"));
const RefundDetail = lazy(() => import("./components/RefundDetail"));
const AddressList = lazy(() => import('./components/myService/AddressList'));
const EventDetail = lazy(() => import("./components/EventDetail"));
const CategoryPage = lazy(() => import("./components/CategoryPage"));
const SearchResultsPage = lazy(() => import('./components/SearchResultsPage'));
const PaymentPassword = lazy(() => import('./components/settings/PaymentPassword'));
const ProfileEdit = lazy(() => import('./components/settings/ProfileEdit'));
const ContentCreationPage = lazy(() => import('./components/ContentCreationPage'));
const EcommerceCreationPage = lazy(() => import('./components/creation/EcommerceCreationPage'));
const MyContentPage = lazy(() => import('./components/MyContentPage'));
const MyShopPage = lazy(() => import('./components/shop/MyShopPage'));
const ProductManagePage = lazy(() => import('./components/product/ProductManagePage'));
const ShopCreationPage = lazy(() => import('./components/shop/ShopCreationPage'));
const ShopDetailPage = lazy(() => import('./components/shop/ShopDetailPage'));
const ShopEditPage = lazy(() => import('./components/shop/ShopEditPage'));
const Cart = lazy(() => import('./components/myService/Cart'));
const Payment = lazy(() => import('./components/order/Payment'));
const OrderSuccess = lazy(() => import('./components/order/OrderSuccess'));

// Helper to determine if NavBar should be shown
function showNavBar(pathname) {
  const pathsWithoutNavBar = [
    '/ecommerce-creation',
    '/address-list',
    '/cart',
    '/payment',
    '/payment-password',
    '/order-success',
    '/login',
    '/register',
    '/forgot-password',
  ];

  if (pathname.startsWith('/product/')) {
    return false;
  }
  
  return !pathsWithoutNavBar.some(path => pathname.startsWith(path));
}

const AppContent = () => {
  const location = useLocation();
  const { userLoading } = useAuth();
  const shouldShowNavBar = showNavBar(location.pathname);

  if (userLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <CommonHelmet />
      <div className="page-container">
        <Suspense fallback={<div>Loading Page...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Daily />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/shop-detail/:id" element={<ShopDetailPage />} />

            {/* Protected Routes */}
            <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
            <Route path="/my-service" element={<ProtectedRoute><MyService /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/order-list/:status" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
            <Route path="/order-detail/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/logistics/:orderId" element={<ProtectedRoute><LogisticsTracker /></ProtectedRoute>} />
            <Route path="/refund/:orderId" element={<ProtectedRoute><RefundForm /></ProtectedRoute>} />
            <Route path="/refund-detail/:refundId" element={<ProtectedRoute><RefundDetail /></ProtectedRoute>} />
            <Route path="/address-list" element={<ProtectedRoute><AddressList /></ProtectedRoute>} />
            <Route path="/settings/payment-password" element={<ProtectedRoute><PaymentPassword /></ProtectedRoute>} />
            <Route path="/settings/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
            <Route path="/creation" element={<ProtectedRoute><ContentCreationPage /></ProtectedRoute>} />
            <Route path="/ecommerce-creation" element={<ProtectedRoute><EcommerceCreationPage /></ProtectedRoute>} />
            <Route path="/my-content" element={<ProtectedRoute><MyContentPage /></ProtectedRoute>} />
            <Route path="/my-shop" element={<ProtectedRoute><MyShopPage /></ProtectedRoute>} />
            <Route path="/product-manage" element={<ProtectedRoute><ProductManagePage /></ProtectedRoute>} />
            <Route path="/shop-creation" element={<ProtectedRoute><ShopCreationPage /></ProtectedRoute>} />
            <Route path="/shop-edit/:id" element={<ProtectedRoute><ShopEditPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </div>
      {shouldShowNavBar && <NavBar className="bottom-nav" />}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;