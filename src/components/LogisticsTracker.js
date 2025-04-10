import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCopy,
  FaSyncAlt
} from 'react-icons/fa';
import instance from '../utils/axios';

const LogisticsTracker = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [logistics, setLogistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // 获取物流信息
  const fetchLogisticsInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 先获取订单信息
      const orderResponse = await instance.get(`/order/${orderNumber}`);
      
      if (!orderResponse.data || !orderResponse.data.order) {
        setError('未找到订单信息');
        setLoading(false);
        return;
      }
      
      const orderId = orderResponse.data.order.id;
      
      // 获取物流信息
      const logisticsResponse = await instance.get(`/api/logistics/realtime/order/${orderId}`);
      
      if (logisticsResponse.data && logisticsResponse.data.success) {
        setLogistics(logisticsResponse.data.data);
      } else {
        setError(logisticsResponse.data?.message || '获取物流信息失败');
      }
    } catch (error) {
      console.error('获取物流信息出错:', error);
      setError('获取物流信息失败，请稍后再试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderNumber]);

  // 刷新物流信息
  const refreshLogistics = () => {
    setRefreshing(true);
    fetchLogisticsInfo();
  };

  // 初始化加载
  useEffect(() => {
    fetchLogisticsInfo();
  }, [fetchLogisticsInfo]);
  
  // 复制物流单号
  const copyTrackingNumber = () => {
    if (!logistics || !logistics.number) return;
    
    navigator.clipboard
      .writeText(logistics.number)
      .then(() => {
        alert("物流单号已复制到剪贴板");
      })
      .catch((err) => {
        console.error("复制失败: ", err);
      });
  };
  
  // 获取物流状态图标
  const getLogisticsStatusIcon = (status) => {
    switch (status) {
      case 0:
        return <FaBox className="text-yellow-500" />;
      case 1:
        return <FaTruck className="text-blue-500" />;
      case 2:
        return <FaTruck className="text-green-500" />;
      case 3:
        return <FaCheckCircle className="text-green-600" />;
      case 4:
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };
  
  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="h-11 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center"
            >
              <FaArrowLeft className="text-gray-800 text-sm" />
            </button>
            <span className="text-sm font-medium ml-2">物流详情</span>
          </div>
          <button
            onClick={refreshLogistics}
            className="w-8 h-8 flex items-center justify-center"
            disabled={loading || refreshing}
          >
            <FaSyncAlt className={`text-gray-600 text-sm ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </nav>

      {/* 内容区域 */}
      <main className="mt-[44px] px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={refreshLogistics}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-full text-sm"
            >
              重试
            </button>
          </div>
        ) : logistics ? (
          <>
            {/* 物流概览 */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                {getLogisticsStatusIcon(logistics.status)}
                <span className="text-sm font-medium ml-2">{logistics.statusText}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>物流单号</span>
                <div className="flex items-center">
                  <span>{logistics.number}</span>
                  <button
                    onClick={copyTrackingNumber}
                    className="ml-2 p-1"
                  >
                    <FaCopy className="text-gray-400 text-xs" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>物流公司</span>
                <span>{logistics.company}</span>
              </div>
              
              {logistics.lastUpdate && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>更新时间</span>
                  <span>{logistics.lastUpdate}</span>
                </div>
              )}
            </div>
            
            {/* 物流轨迹 */}
            {logistics.timeline && logistics.timeline.length > 0 ? (
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">物流跟踪</h3>
                <div className="space-y-6">
                  {logistics.timeline.map((item, index) => (
                    <div key={index} className="relative pl-6">
                      {/* 时间线 */}
                      {index < logistics.timeline.length - 1 && (
                        <div className="absolute left-[7px] top-2 w-[2px] h-full bg-gray-200"></div>
                      )}
                      
                      {/* 节点 */}
                      <div className={`absolute left-0 top-0 w-[16px] h-[16px] rounded-full border-2 ${
                        index === 0 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300 bg-white'
                      }`}></div>
                      
                      {/* 内容 */}
                      <div className={`${index === 0 ? 'text-primary' : 'text-gray-700'}`}>
                        <p className="text-sm font-medium">{item.status}</p>
                        <div className="mt-1 text-xs">
                          <p>{item.location}</p>
                          {item.description && <p className="mt-0.5">{item.description}</p>}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 text-center text-gray-500">
                暂无物流轨迹信息
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-4 text-center text-gray-500">
            暂无物流信息
          </div>
        )}
      </main>
    </div>
  );
};

export default LogisticsTracker; 