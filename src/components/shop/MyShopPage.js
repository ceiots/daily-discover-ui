import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import instance from '../../services/http/instance';
import PropTypes from 'prop-types';
import './MyShopPage.css';

const MyShopPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 不再需要在组件内部检查登录状态
  // 因为已经通过ProtectedRoute进行了保护

  // 获取商品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          return;
        }
        
        // 先获取用户的店铺信息
        const shopResponse = await instance.get('/shop/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (shopResponse.data && shopResponse.data.code === 200 && shopResponse.data.data) {
          const shopId = shopResponse.data.data.id;
          
          // 使用店铺ID获取商品列表
          const response = await instance.get(`/shop/${shopId}/products`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.code === 200) {
            setProducts(response.data.data || []);
          } else {
            setError(response.data?.message || '获取商品失败');
          }
        } else {
          setError('您还没有创建店铺或获取店铺信息失败');
        }
      } catch (error) {
        console.error('获取商品列表失败：', error);
        setError('获取商品列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn, navigate]);

  // 格式化价格显示
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  // 商品项组件
  const ProductItem = ({ product }) => {
    return (
      <div 
        className="product-item bg-white rounded-lg overflow-hidden mb-3 shadow-sm"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="relative pt-[100%]">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="text-primary font-medium">¥{formatPrice(product.price)}</div>
            <div className="text-xs text-gray-400">已售 {product.soldCount || 0}</div>
          </div>
          <div className="flex items-center mt-2">
            {product.shopAvatarUrl && (
              <img 
                src={product.shopAvatarUrl} 
                alt={product.shopName} 
                className="w-4 h-4 rounded-full mr-1"
              />
            )}
            <span className="text-xs text-gray-500 truncate">{product.shopName}</span>
          </div>
        </div>
      </div>
    );
  };

  // 添加PropTypes验证
  ProductItem.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      soldCount: PropTypes.number,
      shopName: PropTypes.string,
      shopAvatarUrl: PropTypes.string
    }).isRequired
  };

  return (
    <div className="my-shop-page pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/my-service')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">商品管理</h1>
          <button 
            onClick={() => navigate('/ecommerce-creation')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="product-list pt-16 px-4">
        {/* 管理选项 */}
        <div className="bg-white rounded-lg mb-4 overflow-hidden">
          <div className="flex border-b">
            <div 
              className="flex-1 py-3 text-center text-sm font-medium text-primary border-b-2 border-primary"
            >
              全部商品
            </div>
            <div 
              className="flex-1 py-3 text-center text-sm text-gray-500"
              onClick={() => navigate('/category-manage')}
            >
              分类管理
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <i className="fas fa-spinner fa-spin text-primary mr-2"></i>
            <span>加载中...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无商品
            <div className="mt-2">
              <button 
                onClick={() => navigate('/ecommerce-creation')} 
                className="px-4 py-2 bg-primary text-white rounded-full text-sm"
              >
                发布商品
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShopPage; 