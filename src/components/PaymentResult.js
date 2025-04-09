import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import instance from '../utils/axios';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [orderInfo, setOrderInfo] = useState({});
  
  useEffect(() => {
    // 从URL中获取支付结果参数
    const params = new URLSearchParams(location.search);
    const tradeNo = params.get('tradeNo');
    const orderNo = params.get('orderNo');
    const totalAmount = params.get('totalAmount');
    const status = params.get('status');
    
    if (status === 'failed') {
      setPaymentStatus('failed');
      return;
    }
    
    if (tradeNo && orderNo) {
      setPaymentStatus('success');
      setOrderInfo({
        tradeNo,
        orderNo,
        totalAmount
      });
      
      // 可以在这里调用接口查询订单状态
      // queryOrderStatus(orderNo);
    } else {
      setPaymentStatus('unknown');
    }
  }, [location]);
  
  const queryOrderStatus = async (orderNo) => {
    try {
      const response = await instance.get(`/order/status?orderNo=${orderNo}`);
      // 根据返回结果更新状态
    } catch (error) {
      console.error('查询订单状态失败:', error);
    }
  };
  
  const goToOrderDetail = () => {
    navigate(`/order-detail`, { state: { orderNo: orderInfo.orderNo } });
  };
  
  const goToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="bg-gray-50 w-375px h-762px mx-auto relative">
      {/* 导航栏 */}
      <div className="fixed top-0 w-full bg-primary text-white p-4 flex items-center justify-between z-10">
        <div className="w-8 h-8"></div>
        <div className="text-lg font-medium">支付结果</div>
        <div className="w-8 h-8"></div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-16 pb-20 px-4">
        <div className="bg-white rounded-lg p-8 mt-8 shadow-sm flex flex-col items-center">
          {paymentStatus === 'success' && (
            <>
              <div className="text-green-500 mb-4">
                <i className="ri-checkbox-circle-line text-5xl"></i>
              </div>
              <h2 className="text-2xl font-semibold mb-4">支付成功</h2>
              <div className="w-full text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>支付宝交易号:</span>
                  <span>{orderInfo.tradeNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>订单号:</span>
                  <span>{orderInfo.orderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>支付金额:</span>
                  <span>¥ {orderInfo.totalAmount}</span>
                </div>
              </div>
            </>
          )}
          
          {paymentStatus === 'failed' && (
            <>
              <div className="text-red-500 mb-4">
                <i className="ri-close-circle-line text-5xl"></i>
              </div>
              <h2 className="text-2xl font-semibold mb-4">支付失败</h2>
              <p className="text-gray-600">请重新尝试支付或联系客服</p>
            </>
          )}
          
          {paymentStatus === 'unknown' && (
            <>
              <div className="text-yellow-500 mb-4">
                <i className="ri-question-mark-circle-line text-5xl"></i>
              </div>
              <h2 className="text-2xl font-semibold mb-4">支付状态未知</h2>
              <p className="text-gray-600">请在订单中查看支付状态</p>
            </>
          )}
          
          <div className="mt-8 flex space-x-4">
            {paymentStatus === 'success' && (
              <button 
                className="px-6 py-3 bg-primary text-white rounded-md"
                onClick={goToOrderDetail}
              >
                查看订单
              </button>
            )}
            <button 
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md"
              onClick={goToHome}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;