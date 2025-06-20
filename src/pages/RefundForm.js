import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import instance from '../services/http/instance';

const RefundForm = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const orderData = location.state?.orderData || {};
  
  // 状态
  const [refundType, setRefundType] = useState(1); // 1-仅退款，2-退货退款
  const [reason, setReason] = useState(0);
  const [reasonDetail, setReasonDetail] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 退款原因选项
  const reasonOptions = [
    { value: 0, label: '请选择退款原因' },
    { value: 1, label: '不想要了/拍错了' },
    { value: 2, label: '商品信息描述不符' },
    { value: 3, label: '质量问题' },
    { value: 4, label: '商品损坏' },
    { value: 5, label: '其他原因' }
  ];
  
  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    
    // 如果没有orderData，需要获取订单数据
    if (!orderData.id && orderId) {
      fetchOrderData();
    }
  }, [isLoggedIn, orderId]);
  
  // 获取订单数据
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/order/${orderId}`);
      if (response.data && response.data.code === 200) {
        // 设置订单数据
      } else {
        setError('获取订单数据失败');
      }
    } catch (error) {
      console.error('获取订单数据失败:', error);
      setError('获取订单数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理图片上传
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setLoading(true);
      
      // 使用FormData上传图片
      const formData = new FormData();
      formData.append('file', files[0]);
      
      const response = await instance.post('/product/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.code === 200) {
        setImages([...images, response.data.data.url]);
      } else {
        setError('上传图片失败');
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      setError('上传图片失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 删除图片
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  // 提交退款申请
  const handleSubmit = async () => {
    // 表单验证
    if (reason === 0) {
      setError('请选择退款原因');
      return;
    }
    
    if (reason === 5 && !reasonDetail) {
      setError('请填写退款原因');
      return;
    }
    
    try {
      setLoading(true);
      
      const refundData = {
        orderNumber: orderData.orderNumber,
        orderId: orderId,
        shopId: orderData.items[0]?.shopId,
        refundType: refundType,
        reason: reason,
        reasonDetail: reason === 5 ? reasonDetail : reasonOptions.find(opt => opt.value === reason)?.label,
        amount: orderData.totalAmount,
        imageList: images
      };
      
      const response = await instance.post('/refund/create', refundData);
      
      if (response.data && response.data.code === 200) {
        navigate(`/refund/${response.data.data.id}`);
      } else {
        setError(response.data?.message || '提交退款申请失败');
      }
    } catch (error) {
      console.error('提交退款申请失败:', error);
      setError('提交退款申请失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="h-11 flex items-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaArrowLeft className="text-gray-800 text-sm" />
          </button>
          <span className="text-sm font-medium ml-2">申请退款</span>
        </div>
      </nav>
      
      {/* 表单内容 */}
      <div className="pt-12 px-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner"></div>
            <span className="ml-2 text-sm text-gray-600">加载中...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        ) : (
          <>
            {/* 订单信息 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-3">
                <h3 className="text-sm font-medium mb-2">订单信息</h3>
                {orderData.items && orderData.items.length > 0 && (
                  <div className="flex items-center gap-2 pb-2">
                    <img
                      src={orderData.items[0].imageUrl}
                      className="w-16 h-16 object-cover rounded"
                      alt={orderData.items[0].name}
                    />
                    <div className="flex-1">
                      <h3 className="text-xs mb-1 line-clamp-2">
                        {orderData.items[0].name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary">
                          ¥{orderData.items[0]?.price ? orderData.items[0].price.toFixed(2) : "0.00"}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          x{orderData.items[0].quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  订单编号: {orderData.orderNumber}
                </div>
              </div>
            </div>
            
            {/* 退款类型 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-3">
                <h3 className="text-sm font-medium mb-3">退款类型</h3>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="refundType"
                      checked={refundType === 1}
                      onChange={() => setRefundType(1)}
                      className="mr-2"
                    />
                    <span className="text-sm">仅退款</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="refundType"
                      checked={refundType === 2}
                      onChange={() => setRefundType(2)}
                      className="mr-2"
                    />
                    <span className="text-sm">退货退款</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* 退款原因 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-3">
                <h3 className="text-sm font-medium mb-3">退款原因</h3>
                <select
                  value={reason}
                  onChange={(e) => setReason(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  {reasonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {reason === 5 && (
                  <textarea
                    value={reasonDetail}
                    onChange={(e) => setReasonDetail(e.target.value)}
                    placeholder="请详细描述退款原因"
                    className="w-full mt-3 p-2 border border-gray-300 rounded text-sm h-24"
                  />
                )}
              </div>
            </div>
            
            {/* 上传凭证 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-3">
                <h3 className="text-sm font-medium mb-3">上传凭证</h3>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`凭证图片${index + 1}`}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 3 && (
                    <label className="border border-dashed border-gray-300 rounded flex flex-col items-center justify-center aspect-square cursor-pointer">
                      <FaCamera className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">添加图片</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  最多上传3张图片，支持jpg、png格式
                </p>
              </div>
            </div>
            
            {/* 退款金额 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">退款金额</h3>
                  <span className="text-primary font-medium">
                    ¥{orderData.totalAmount ? orderData.totalAmount.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2.5 rounded-full text-white text-sm font-medium ${
                  loading ? 'bg-gray-400' : 'bg-primary'
                }`}
              >
                {loading ? '提交中...' : '提交申请'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RefundForm;