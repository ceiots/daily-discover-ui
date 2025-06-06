import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePage } from '../../theme';
import instance from '../../utils/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    userCount: 0,
    shopCount: 0,
    productCount: 0,
    pendingProductCount: 0,
    pendingShopCount: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          navigate('/login');
          return;
        }
        
        const response = await instance.get('/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': userId
          }
        });
        
        if (response.data && response.data.code === 200) {
          setStats(response.data.data);
        } else if (response.data && response.data.code === 403) {
          setError('您没有权限访问管理后台');
          setTimeout(() => {
            navigate('/promy-servicefile');
          }, 2000);
        }
      } catch (error) {
        console.error('获取管理后台数据失败:', error);
        setError('获取管理后台数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, [navigate]);

  const adminMenuItems = [
    {
      icon: 'ri-shopping-basket-line',
      text: '商品审核',
      count: stats.pendingProductCount,
      onClick: () => navigate('/admin/products/pending')
    },
    {
      icon: 'ri-store-line',
      text: '店铺审核',
      count: stats.pendingShopCount,
      onClick: () => navigate('/admin/shops/pending')
    },
    {
      icon: 'ri-user-settings-line',
      text: '用户管理',
      onClick: () => navigate('/admin/users')
    },
    {
      icon: 'ri-line-chart-line',
      text: '数据分析',
      onClick: () => navigate('/admin/analytics')
    }
  ];

  return (
    <BasePage
      title="管理后台"
      showHeader={true}
      showBack={true}
      onBack={() => navigate('/my-service')}
    >
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">用户总数</div>
                <div className="text-2xl font-bold mt-2">{stats.userCount}</div>
                <div className="flex items-center mt-2">
                  <i className="ri-user-line text-primary text-lg"></i>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">店铺总数</div>
                <div className="text-2xl font-bold mt-2">{stats.shopCount}</div>
                <div className="flex items-center mt-2">
                  <i className="ri-store-2-line text-primary text-lg"></i>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">商品总数</div>
                <div className="text-2xl font-bold mt-2">{stats.productCount}</div>
                <div className="flex items-center mt-2">
                  <i className="ri-shopping-bag-line text-primary text-lg"></i>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">待审核商品</div>
                <div className="text-2xl font-bold mt-2">{stats.pendingProductCount}</div>
                <div className="flex items-center mt-2">
                  <i className="ri-alert-line text-yellow-500 text-lg"></i>
                </div>
              </div>
            </div>

            {/* 管理菜单 */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="font-medium mb-4">管理功能</div>
              <div className="grid grid-cols-4 gap-4">
                {adminMenuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={item.onClick}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 relative">
                      <i className={`${item.icon} text-primary text-xl`}></i>
                      {item.count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {item.count}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-center">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 系统信息 */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-medium mb-4">系统信息</div>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>系统版本</span>
                  <span>v1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>最后更新</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>服务状态</span>
                  <span className="text-green-500 flex items-center">
                    <i className="ri-checkbox-circle-fill mr-1"></i> 正常运行
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BasePage>
  );
};

export default AdminDashboard; 