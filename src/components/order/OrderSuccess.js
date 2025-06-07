import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BasePage, Button } from '../../theme';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNo, paymentAmount, paymentMethod } = location.state || {};

  // 格式化支付方式显示
  const formatPaymentMethod = (method) => {
    if (method === 1) return '支付宝';
    if (method === 2) return '微信支付';
    return method || '未知支付方式';
  };

  // 返回首页
  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  // 查看订单
  const handleViewOrder = () => {
    if (orderNo) {
      navigate(`/order/${orderNo}`, { replace: true });
    }
  };

  return (
    <BasePage
      title="支付成功"
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={handleBackToHome}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle="支付成功"
      backgroundColor="default"
    >
      <div className="flex flex-col items-center justify-center p-6 min-h-[60vh]">
        {/* 成功图标 */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <i className="ri-check-line text-4xl text-green-500"></i>
        </div>
        
        {/* 成功信息 */}
        <h2 className="text-xl font-bold mb-2">支付成功</h2>
        <p className="text-gray-500 mb-6">您的订单已支付成功，感谢您的购买！</p>
        
        {/* 订单信息 */}
        <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500">订单编号</span>
            <span className="font-medium">{orderNo || '未知'}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500">支付金额</span>
            <span className="font-medium text-primary">¥{paymentAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">支付方式</span>
            <span className="font-medium">{formatPaymentMethod(paymentMethod)}</span>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="w-full flex flex-col gap-3">
          <Button variant="primary" block onClick={handleViewOrder}>
            查看订单
          </Button>
          <Button variant="outline" block onClick={handleBackToHome}>
            返回首页
          </Button>
        </div>
      </div>
    </BasePage>
  );
};

export default OrderSuccess; 