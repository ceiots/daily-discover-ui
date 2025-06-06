import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductAudit from '../components/admin/ProductAudit';
import ShopAudit from '../components/admin/ShopAudit';
import UserManagement from '../components/admin/UserManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products/pending" element={<ProductAudit />} />
      <Route path="/admin/shops/pending" element={<ShopAudit />} />
      <Route path="/admin/users" element={<UserManagement />} />
    </Routes>
  );
};

export default AdminRoutes; 