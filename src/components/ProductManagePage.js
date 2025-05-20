import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useAuth } from '../App';
import instance from '../utils/axios';
import PropTypes from 'prop-types';
import '../App.css';

const ProductManagePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [isLoggedIn, navigate]);

  // 获取商品数据
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        navigate('/login');
        return;
      }
      
      const response = await instance.get('/product/user');
      
      if (response.data && response.data.code === 200) {
        setProducts(response.data.data || []);
      } else {
        setError(response.data?.message || '获取商品失败');
      }
    } catch (error) {
      console.error('获取商品列表失败：', error);
      setError('获取商品列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 编辑商品
  const handleEditProduct = (productId) => {
    navigate(`/ecommerce-creation?id=${productId}`);
  };

  // 查看商品
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // 删除商品
  const handleDeleteProduct = async (e, productId) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    if (!window.confirm('确定要删除这个商品吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      const response = await instance.delete(`/product/${productId}`);
      
      if (response.data && response.data.code === 200) {
        // 删除成功，刷新商品列表
        fetchProducts();
      } else {
        setError(response.data?.message || '删除商品失败');
      }
    } catch (error) {
      console.error('删除商品失败：', error);
      setError('删除商品失败，请稍后重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  // 格式化价格显示
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 w-full">
        <div className="flex items-center justify-between px-4 py-3 max-w-[480px] mx-auto">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-lg font-medium">商品管理</h1>
          <button 
            onClick={() => navigate('/ecommerce-creation')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="pt-16 px-4 max-w-[480px] mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-4">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无商品</p>
            <button 
              onClick={() => navigate('/ecommerce-creation')} 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center mx-auto"
            >
              <FaPlus className="mr-1" /> 发布商品
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex p-3" onClick={() => handleViewProduct(product.id)}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-20 h-20 object-cover rounded-md" 
                  />
                  <div className="flex-1 ml-3">
                    <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
                    <div className="text-primary mt-1">¥{formatPrice(product.price)}</div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>库存: {product.stock || 0}</span>
                      <span className="mx-2">|</span>
                      <span>已售: {product.soldCount || 0}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      {product.auditStatus === 1 ? (
                        <span className="text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded">已上架</span>
                      ) : product.auditStatus === 0 ? (
                        <span className="text-xs text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded">审核中</span>
                      ) : (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">未通过</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex border-t border-gray-100">
                  <button 
                    className="flex-1 py-2 text-xs text-gray-500 flex items-center justify-center"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <FaEye className="mr-1" /> 查看
                  </button>
                  <div className="w-px bg-gray-100"></div>
                  <button 
                    className="flex-1 py-2 text-xs text-blue-500 flex items-center justify-center"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    <FaEdit className="mr-1" /> 编辑
                  </button>
                  <div className="w-px bg-gray-100"></div>
                  <button 
                    className="flex-1 py-2 text-xs text-red-500 flex items-center justify-center"
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                    disabled={deleteLoading}
                  >
                    <FaTrash className="mr-1" /> 删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagePage; 