import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePage } from '../../theme';
import instance from '../../utils/axios';

const ProductAudit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditStatus, setAuditStatus] = useState(1); // 默认通过
  const [auditRemark, setAuditRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        navigate('/login');
        return;
      }
      
      const response = await instance.get('/admin/products/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'userId': userId
        }
      });
      
      if (response.data && response.data.code === 200) {
        setProducts(response.data.data || []);
      } else if (response.data && response.data.code === 403) {
        setError('您没有权限访问此页面');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (error) {
      console.error('获取待审核商品失败:', error);
      setError('获取待审核商品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    if (!selectedProduct) return;
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await instance.post(
        `/admin/products/${selectedProduct.id}/audit`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': userId
          },
          params: {
            auditStatus,
            auditRemark: auditRemark || (auditStatus === 1 ? '审核通过' : '审核不通过')
          }
        }
      );
      
      if (response.data && response.data.code === 200) {
        // 审核成功，刷新列表
        fetchPendingProducts();
        setAuditModalVisible(false);
        setSelectedProduct(null);
        setAuditStatus(1);
        setAuditRemark('');
      } else {
        setError('审核失败: ' + (response.data?.message || '未知错误'));
      }
    } catch (error) {
      console.error('审核商品失败:', error);
      setError('审核商品失败: ' + (error.message || '未知错误'));
    } finally {
      setSubmitting(false);
    }
  };

  const openAuditModal = (product) => {
    setSelectedProduct(product);
    setAuditStatus(1); // 默认通过
    setAuditRemark('');
    setAuditModalVisible(true);
  };

  return (
    <BasePage
      title="商品审核"
      showHeader={true}
      showBack={true}
      onBack={() => navigate('/admin/dashboard')}
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
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium">待审核商品 ({products.length})</h2>
              <button 
                className="text-sm bg-primary text-white px-3 py-1 rounded-full"
                onClick={fetchPendingProducts}
              >
                <i className="ri-refresh-line mr-1"></i> 刷新
              </button>
            </div>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                <i className="ri-check-double-line text-4xl text-green-500 mb-2"></i>
                <p>没有待审核的商品</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="w-20 h-20 rounded overflow-hidden mr-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{product.title}</h3>
                        <div className="text-sm text-gray-500 mt-1">¥{product.price}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          店铺: {product.shopName || '未知店铺'}
                        </div>
                        <div className="text-xs text-gray-400">
                          提交时间: {new Date(product.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <button 
                          className="bg-primary text-white px-4 py-1 rounded text-sm mb-2"
                          onClick={() => openAuditModal(product)}
                        >
                          审核
                        </button>
                        <button 
                          className="border border-gray-300 text-gray-600 px-4 py-1 rounded text-sm"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          查看
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 审核弹窗 */}
            {auditModalVisible && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 w-80 max-w-[90%]">
                  <h3 className="text-lg font-medium mb-4">审核商品</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">商品名称</p>
                    <p className="font-medium">{selectedProduct.title}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">审核结果</p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="auditStatus"
                          value={1}
                          checked={auditStatus === 1}
                          onChange={() => setAuditStatus(1)}
                          className="mr-1"
                        />
                        <span>通过</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="auditStatus"
                          value={2}
                          checked={auditStatus === 2}
                          onChange={() => setAuditStatus(2)}
                          className="mr-1"
                        />
                        <span>拒绝</span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm text-gray-500 mb-1 block">
                      审核备注
                      {auditStatus === 2 && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      rows="3"
                      value={auditRemark}
                      onChange={(e) => setAuditRemark(e.target.value)}
                      placeholder={auditStatus === 2 ? "请填写拒绝原因" : "可选填"}
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      onClick={() => setAuditModalVisible(false)}
                      disabled={submitting}
                    >
                      取消
                    </button>
                    <button
                      className="px-3 py-1 bg-primary text-white rounded text-sm"
                      onClick={handleAudit}
                      disabled={submitting || (auditStatus === 2 && !auditRemark)}
                    >
                      {submitting ? '提交中...' : '确认'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </BasePage>
  );
};

export default ProductAudit; 