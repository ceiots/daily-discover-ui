import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    // 这里可以添加支付逻辑，例如调用支付 API
    // 假设支付成功后，生成订单并跳转到订单确认页面
    navigate('/order-confirmation'); // 跳转到订单确认页面
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
     <body className="bg-gray-50">
     <nav className="fixed top-0 left-0 right-0 h-[52px] bg-white shadow-sm z-50 flex items-center px-4">
     <button className="flex items-center justify-center w-8 h-8">
     <i className="fas fa-arrow-left text-gray-700"  onClick={handleBack}></i>
     </button>
     <h1 className="flex-1 text-center text-sm font-medium">确认支付</h1>
     </nav>
     <main className="pt-[68px] pb-[80px] px-4">
     <div className="bg-white rounded-lg p-5 mb-4 text-center shadow-sm">
     <p className="text-gray-500 mb-2">支付金额</p>
     <p className="text-xl font-semibold mb-2">¥ 2,399.00</p>
     <p className="text-gray-400 text-sm">订单号：2023112012345678</p>
     </div>
     <div className="bg-white rounded-lg mb-4 shadow-sm">
     <div className="p-3 border-b border-gray-100">
     <h2 className="font-medium text-sm">支付方式</h2>
     </div>
     <div className="divide-y divide-gray-100">
     <label className="flex items-center p-3 cursor-pointer">
     <div className="w-6 h-6 flex items-center justify-center bg-[#07C160] rounded-md">
     <i className="fab fa-weixin text-white"></i>
     </div>
     <span className="ml-3 flex-1 text-sm">微信支付</span>
     <input type="radio" name="payment" className="w-4 h-4 text-primary" checked/>
     </label>
     <label className="flex items-center p-3 cursor-pointer">
     <div className="w-6 h-6 flex items-center justify-center bg-[#1677FF] rounded-md">
     <i className="fab fa-alipay text-white"></i>
     </div>
     <span className="ml-3 flex-1 text-sm">支付宝</span>
     <input type="radio" name="payment" className="w-4 h-4 text-primary"/>
     </label>
     </div>
     </div>
     <div className="bg-white rounded-lg p-4 shadow-sm">
     <h2 className="font-medium mb-3 text-sm">订单明细</h2>
     <div className="space-y-3 text-sm">
     <div className="flex justify-between">
     <span className="text-gray-500">商品总价</span>
     <span>¥2,499.00</span>
     </div>
     <div className="flex justify-between">
     <span className="text-gray-500">运费</span>
     <span>¥0.00</span>
     </div>
     <div className="flex justify-between">
     <span className="text-gray-500">优惠券</span>
     <span className="text-green-500">-¥100.00</span>
     </div>
     <div className="flex justify-between pt-3 border-t border-gray-100">
     <span className="font-medium">实付金额</span>
     <span className="font-medium text-primary">¥2,399.00</span>
     </div>
     </div>
     </div>
     </main>
     <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
     <button className="w-full h-10 bg-primary text-white text-xs font-medium !rounded-button flex items-center justify-center" onClick={handlePayment}>
     确认支付 ¥2,399.00
     </button>
     <p className="text-center text-xs text-gray-400 mt-2">
     <i className="fas fa-shield-alt mr-1"></i>
     支付安全由银行和第三方支付机构保障
     </p>
     </footer>
     </body>
  );
};

export default Payment; 