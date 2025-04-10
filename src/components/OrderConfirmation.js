import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import instance from '../utils/axios';
import { LeftOutlined, CheckOutlined } from '@ant-design/icons'; // 假设使用antd图标，需安装

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { 
        orderNo, 
        paymentAmount, 
        paymentMethod, 
        paymentTime
    } = location.state || {};

    const [error, setError] = useState(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleViewOrder = () => {
        const orderNo = location.state?.orderNo;
        console.log('orderNo:', orderNo); // 打印订单号以确认是否正确获取到订单号
        if (orderNo) {
            // 修改为模板字符串
            navigate(`/order/${orderNo}`); // 传入订单号
        } else {
            console.error('未获取到订单号');
        }
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    // 支付方式映射
    const paymentMethodMap = {
        '1': '支付宝',
        '2': '微信支付',
        '3': '银行卡'
    };

    // 格式化日期时间
    const formatDateTime = (dateString) => {
        if (!dateString) return '暂无数据';
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (error) {
        return (
            <div className="relative min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* 顶部导航栏 */}
            <div className="fixed top-0 left-0 w-full h-[56px] bg-[#7B66FF] flex items-center px-4 z-50">
                <button className="text-white" onClick={handleBack}>
                    <LeftOutlined className="text-xl" />
                </button>
                <span className="flex-1 text-center text-white text-lg font-medium">
                    支付成功
                </span>
            </div>
            {/* 主要内容区域 */}
            <div className="pt-[56px] px-4">
                {/* 支付结果展示 */}
                <div className="flex flex-col items-center mt-12 mb-10">
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-4 success-animation">
                        <CheckOutlined className="text-white text-2xl" />
                    </div>
                    <h2 className="text-base font-medium mb-2">支付成功</h2>
                    {paymentAmount && (
                        <div className="text-[#7B66FF] text-2xl font-semibold">
                            ¥{paymentAmount.toFixed(2) || '0.00'}
                        </div>
                    )}
                </div>
                {/* 订单信息 */}
                {orderNo && (
                    <div className="bg-white rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">订单编号</span>
                            <span className="text-gray-700 text-sm">{orderNo || '暂无数据'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">支付时间</span>
                            <span className="text-gray-700 text-sm">{formatDateTime(paymentTime)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">支付方式</span>
                            <div className="flex items-center">
                                {paymentMethodMap[paymentMethod] === '支付宝' && (
                                    <i className="fab fa-alipay text-[#1677FF] mr-1"></i>
                                )}
                                {paymentMethodMap[paymentMethod] === '微信支付' && (
                                    <i className="fab fa-weixin text-[#07C160] mr-1"></i>
                                )}
                                <span className="text-gray-700 text-sm">
                                    {paymentMethodMap[paymentMethod] || '未知支付方式'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* 底部按钮 */}
            <div className="fixed bottom-0 left-0 w-full p-4 flex space-x-4 bg-white border-t border-gray-100">
                <button
                    onClick={handleViewOrder}
                    className="flex-1 h-9 border border-[#7B66FF] text-[#7B66FF] text-sm rounded-lg !rounded-button"
                >
                    查看订单
                </button>
                <button
                    onClick={handleReturnHome}
                    className="flex-1 h-9 bg-[#7B66FF] text-white text-sm rounded-lg !rounded-button"
                >
                    返回首页
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;