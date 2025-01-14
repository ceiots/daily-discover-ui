import React from 'react';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  return (
    <body className="bg-gray-50 min-h-screen">
    <div className="w-[375px] mx-auto min-h-screen flex flex-col items-center justify-center px-5 py-8">
        <div className="w-full flex flex-col items-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 success-animation">
                <i className="fas fa-check text-white text-3xl"></i>
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">支付成功</h1>
            <p className="text-3xl font-bold text-primary mb-8">¥ 2,399.00</p>

            <div className="w-full bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">支付方式</span>
                        <span className="text-gray-700">微信支付</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">支付时间</span>
                        <span className="text-gray-700">2024-01-18 15:30:45</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">订单编号</span>
                        <span className="text-gray-700">202401181530450001</span>
                    </div>
                </div>
            </div>
            <div className="w-full space-y-4">
                <button className="w-full bg-primary text-white py-3 font-medium !rounded-button">
                    完成
                </button>
                <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 font-medium !rounded-button">
                    查看订单详情
                </button>
            </div>
        </div>
    </div>
</body>
  );
};

export default OrderConfirmation; 