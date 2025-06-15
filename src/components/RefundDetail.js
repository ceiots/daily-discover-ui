import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import instance from '../../services/http/instance';

const RefundDetail = () => {
  const navigate = useNavigate();
  const { refundId } = useParams();
  const { isLoggedIn } = useAuth();
  
  // 状态
  const [refundData, setRefundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 退款状态映射
  const statusMap = {
    0: { text: '待处理', color: 'text-yellow-500' },
    1: { text: '商家已同意', color: 'text-green-500' },
    2: { text: '商家已拒绝', color: 'text-red-500' },
    3: { text: '退款完成', color: 'text-green-500' },
    4: { text: '已取消', color: 'text-gray-500' }
  };
  
  // 退款类型映射
  const refundTypeMap = {
    1: '仅退款',
    2: '退货退款'
  };
  
  // 检查登录状态和获取退款数据
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    fetchRefundData();
  }, [isLoggedIn, refundId]);
  
  // 获取退款数据
  const fetchRefundData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/refund/${refundId}`);
      
      if (response.data && response.data.code === 200) {
        const data = response.data.data;
        
        // 处理图片列表
        if (data.images) {
          data.imageList = data.images.split(',');
        } else {
          data.imageList = [];
        }
        
        setRefundData(data);
      } else {
        setError(response.data?.message || '获取退款详情失败');
      }
    } catch (error) {
      console.error('获取退款详情失败:', error);
      setError('获取退款详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 取消退款申请
  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await instance.post(`/refund/${refundId}/cancel`);
      
      if (response.data && response.data.code === 200) {
        // 重新获取数据
        fetchRefundData();
      } else {
        setError(response.data?.message || '取消退款申请失败');
      }
    } catch (error) {
      console.error('取消退款申请失败:', error);
      setError('取消退款申请失败，请稍后重试');
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
          <span className="text-sm font-medium ml-2">退款详情</span>
        </div>
      </nav>
      
      {/* 内容 */}
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
        ) : refundData ? (
          <>
            {/* 状态信息 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-4">
                <div className={`text-base font-medium ${statusMap[refundData.status]?.color}`}>
                  {statusMap[refundData.status]?.text || '未知状态'}
                </div>
                {refundData.status === 2 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>拒绝原因: {refundData.refusalReason}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 订单信息 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-3">
                <h3 className="text-sm font-medium mb-2">订单信息</h3>
                {refundData.product && (
                  <div className="flex items-center gap-2 pb-2">
                    <img
                      src={refundData.product.imageUrl}
                      className="w-16 h-16 object-cover rounded"
                      alt={refundData.product.title}
                    />
                    <div className="flex-1">
                      <h3 className="text-xs mb-1 line-clamp-2">
                        {refundData.product.title}
                      </h3>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  订单编号: {refundData.orderNumber}
                </div>
              </div>
            </div>
            
            {/* 退款信息 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="p-3">
                <h3 className="text-sm font-medium mb-2">退款信息</h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>退款方式</span>
                    <span>{refundTypeMap[refundData.refundType] || '未知'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>退款原因</span>
                    <span>{refundData.reasonDetail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>退款金额</span>
                    <span className="text-primary">¥{refundData.amount ? refundData.amount.toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>申请时间</span>
                    <span>{new Date(refundData.createdAt).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 凭证图片 */}
            {refundData.imageList && refundData.imageList.length > 0 && (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2">凭证图片</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {refundData.imageList.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          className="w-full h-20 object-cover rounded"
                          alt={`凭证 ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* 操作按钮 */}
            {refundData.status === 0 && (
              <div className="mt-8 px-4">
                <button
                  className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium"
                  onClick={handleCancel}
                >
                  取消退款
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            未找到退款申请信息
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundDetail; 