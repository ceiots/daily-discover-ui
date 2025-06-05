import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import instance from '../../utils/axios';
import PropTypes from 'prop-types';
import './ShopDetailPage.css';

const ShopDetailPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // 获取店铺详情
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/shop/${shopId}`);
        
        if (response.data && response.data.code === 200) {
          setShop(response.data.data);
          
          // 检查当前用户是否为店铺所有者
          if (isLoggedIn) {
            const token = localStorage.getItem('token');
            const userResponse = await instance.get('/shop/user', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (userResponse.data && userResponse.data.code === 200 && userResponse.data.data) {
              setIsOwner(userResponse.data.data.id === parseInt(shopId));
            }
          }
        } else {
          setError('获取店铺详情失败');
        }
      } catch (error) {
        console.error('获取店铺详情失败：', error);
        setError('获取店铺详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId, isLoggedIn]);

  // 获取店铺商品
  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const response = await instance.get(`/product/shop/${shopId}`);
        
        if (response.data && response.data.code === 200) {
          setProducts(response.data.data || []);
        } else {
          console.error('获取店铺商品失败：', response.data?.message);
        }
      } catch (error) {
        console.error('获取店铺商品失败：', error);
      }
    };
    
    if (shopId) {
      fetchShopProducts();
    }
  }, [shopId]);

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
        </div>
      </div>
    );
  };

  // 添加PropTypes验证
  ProductItem.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired,
      soldCount: PropTypes.number
    }).isRequired
  };

  return (
    <div className="shop-detail-page pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">店铺详情</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-16 px-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <i className="fas fa-spinner fa-spin text-primary mr-2"></i>
            <span>加载中...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : shop ? (
          <>
            {/* 店铺信息 */}
            <div className="shop-info bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-3">
                  <img 
                    src={shop.shopLogo || 'https://via.placeholder.com/64'} 
                    alt={shop.shopName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium">{shop.shopName}</h2>
                  <p className="text-sm text-gray-500 mt-1">{shop.shopDescription || '暂无描述'}</p>
                </div>
              </div>

              {/* 店铺联系信息 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm mb-2">
                  <i className="fas fa-phone text-gray-400 w-5"></i>
                  <span className="text-gray-600">{shop.contactPhone || '暂无联系电话'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-envelope text-gray-400 w-5"></i>
                  <span className="text-gray-600">{shop.contactEmail || '暂无联系邮箱'}</span>
                </div>
              </div>

              {/* 编辑按钮（仅店铺所有者可见） */}
              {/* {isOwner && (
                <button 
                  onClick={() => navigate(`/shop-edit/${shop.id}`)} 
                  className="w-full mt-4 py-2 bg-primary text-white rounded-lg"
                >
                  编辑店铺信息
                </button>
              )} */}
            </div>

            {/* 商品列表 */}
            <div className="shop-products">
              <h3 className="text-lg font-medium mb-3">店铺商品</h3>
              {products.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-white rounded-lg">
                  暂无商品
                  {isOwner && (
                    <div className="mt-2">
                      <button 
                        onClick={() => navigate('/create-product')} 
                        className="px-4 py-2 bg-primary text-white rounded-full text-sm"
                      >
                        去创建
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {products.map(product => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-red-500">店铺不存在</div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;