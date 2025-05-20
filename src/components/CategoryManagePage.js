import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import { useAuth } from '../App';
import '../App.css';

const CategoryManagePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [isLoggedIn, navigate]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/product/user');
      if (response.data && response.data.code === 200) {
        setProducts(response.data.data || []);
      } else {
        setError('获取商品列表失败');
      }
    } catch (error) {
      console.error('获取商品列表失败:', error);
      setError('获取商品列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/ecommerce-creation?id=${productId}`);
  };
  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('确定要删除这个商品吗？')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await instance.delete(`/product/${productId}`);
      if (response.data && response.data.code === 200) {
        fetchProducts(); // 重新加载商品列表
      } else {
        setError('删除商品失败');
      }
    } catch (error) {
      console.error('删除商品失败:', error);
      setError('删除商品失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = () => {
    navigate('/ecommerce-creation');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaArrowLeft className="text-gray-800 text-sm" />
          </button>
          <span className="text-sm font-medium ml-2">商品管理</span>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-primary text-white px-4 py-1 rounded-full text-xs flex items-center"
        >
          <FaPlus className="mr-1" /> 添加商品
        </button>
      </nav>
      
      {/* 商品列表 */}
      <div className="mt-16 px-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-4">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无商品，点击`添加商品`创建</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-16 h-16 object-cover rounded-md mr-3" 
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{product.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">¥{product.price?.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">库存: {product.stock || 0} 已售: {product.soldCount || 0}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="w-8 h-8 flex items-center justify-center text-primary"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-500"
                  >
                    <FaTrash />
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

export default CategoryManagePage; 