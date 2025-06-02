import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../utils/axios";

const PaymentPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderNo, paymentAmount, paymentMethod } = location.state || {};

    // 验证必要参数
    if (!orderNo || !paymentAmount || !paymentMethod) {
        console.error("缺少必要的支付参数");
        navigate(-1);
        return null;
    }

    // 支付状态
    const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, loading, success, failed
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [loadingText, setLoadingText] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [errorCountdown, setErrorCountdown] = useState(0);
    const passwordBoxes = Array.from({ length: 6 }, (_, i) => `pwd${i + 1}`);

    // 获取支付方式信息
    const isAlipay = paymentMethod === "1";
    const isWechat = paymentMethod === "2";

    // 模拟支付宝/微信 UI
    useEffect(() => {
        document.title = isAlipay ? "支付宝 - 输入支付密码" : "微信支付 - 输入支付密码";
        return () => {
            document.title = "Daily Discover";
        };
    }, [isAlipay]);

    // 处理支付请求
    const handlePayment = async (newPassword) => {
        try {
            setPaymentStatus("loading");
            setLoadingText("正在验证支付密码...");
            console.log("支付接口调用：", orderNo, newPassword, paymentMethod, paymentAmount);
            const response = await instance.post("/payment/process", {
                orderNo,
                paymentMethod,
                paymentPassword: newPassword
            });
            const result = response.data;
            if (result.code === 200) {
                setLoadingText("支付处理中...");
                const paymentTime = result.data.paymentTime || new Date().toISOString();
                setTimeout(() => {
                    setPaymentStatus("success");
                    setLoadingText("支付成功，正在跳转...");
                    setTimeout(() => {
                        navigate("/order-confirmation", {
                            state: {
                                orderNo,
                                paymentAmount,
                                paymentMethod,
                                paymentTime,
                            },
                        });
                    }, 3000);
                }, 3000);
            } else {
                setPaymentStatus("failed");
                const errorMsg = result.message || "支付密码错误，请重新输入";
                setErrorMessage(errorMsg);
                setErrorCountdown(10); 
                setCountdown(3); 
                setPassword(""); 
                console.error(`支付失败，错误信息: ${errorMsg}`);
            }
        } catch (error) {
            setPaymentStatus("failed");
            setCountdown(3); 
            const errorMsg = "网络异常，请稍后重试";
            setErrorMessage(errorMsg);
            setErrorCountdown(10); 
            setPassword(""); 
            console.error("支付请求失败:", error);
        }
    };

    // 添加倒计时效果
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && paymentStatus === "failed") {
            setPaymentStatus("pending");
            setErrorMessage("");
        }
    }, [countdown, paymentStatus]);

    // 错误信息倒计时效果
    useEffect(() => {
        if (errorCountdown > 0) {
            const timer = setTimeout(() => setErrorCountdown(errorCountdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (errorCountdown === 0) {
            setErrorMessage("");
        }
    }, [errorCountdown]);

    // 处理键盘输入
    const handleKeyClick = (keyValue) => {
        if (paymentStatus === "loading" || paymentStatus === "success") {
            return;
        }
        if (keyValue === "delete") {
            if (password.length > 0) {
                setPassword(password.slice(0, -1));
            }
        } else if (password.length < 6) {
            const newPassword = password + keyValue;
            setPassword(newPassword);
            if (newPassword.length === 6) {
                setTimeout(() => {
                    handlePayment(newPassword);
                }, 300);
            }
        }
    };

    // 取消支付
    const handleCancel = async () => {
        navigate(-1);
    };

    // 监听 paymentStatus 变化
    useEffect(() => {
        if (paymentStatus === "failed") {
            console.error(`支付失败，当前支付状态: `, paymentStatus);
        }
    }, [paymentStatus]);

    return (
        <div className="bg-gray-50 w-full max-w-md mx-auto relative min-h-screen">
            {/* 导航栏 */}
            <div className="fixed top-0 w-full bg-primary text-white p-4 flex items-center justify-between z-10">
                <div
                    className="w-8 h-8 flex items-center justify-center cursor-pointer"
                    onClick={handleCancel}
                >
                    <i className="ri-arrow-left-s-line ri-lg"></i>
                </div>
                <div className="text-lg font-medium">
                    {isAlipay ? "支付宝付款" : isWechat ? "微信支付" : "输入支付密码"}
                </div>
                <div className="w-8 h-8 flex items-center justify-center"></div>
            </div>

            {/* 主要内容区域 */}
            <div className="pt-16 pb-20 px-4">
                {/* 支付信息 */}
                <div className="bg-white rounded-lg p-6 mt-4 shadow-sm">
                    <div className="flex flex-col items-center">
                        <div className="text-gray-600 mb-2">支付金额</div>
                        <div className="text-3xl font-semibold mb-4">¥ {paymentAmount}</div>
                        <div className="text-gray-500 text-sm">
                            收款方: {isAlipay ? " 每日发现开发商" : isWechat ? " wx_user" : "每日发现开发商"}
                        </div>
                        <div className="mt-4 flex items-center justify-center text-gray-500 text-xs">
                            <div className="w-4 h-4 flex items-center justify-center mr-1">
                                <i className="ri-shield-check-line"></i>
                            </div>
                            <span>仅作支付模拟</span>
                        </div>
                    </div>
                </div>

                {/* 密码输入区域 */}
                <div className="bg-white rounded-lg p-6 mt-4 shadow-sm">
                    {paymentStatus === "loading" ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin mb-3"></div>
                            <div className="text-gray-600">{loadingText}</div>
                        </div>
                    ) : paymentStatus === "failed" ? (
                        <div className="flex flex-col items-center justify-center py-3">
                            <div className="text-red-500 mb-3"><i className="ri-error-warning-line text-xl"></i></div>
                            <div className="text-red-500 mb-2">{errorMessage}</div>
                            {countdown > 0 && (
                                <div className="text-gray-500 text-sm">{countdown}秒后可重试</div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="text-gray-600 text-sm mb-3">请输入支付密码</div>
                            <div className="flex justify-between mb-4">
                                {passwordBoxes.map((id, index) => (
                                    <div
                                        key={id}
                                        className={`w-12 h-12 border ${
                                            password.length > index ? "border-primary" : "border-gray-300"
                                        } rounded flex items-center justify-center`}
                                    >
                                        {password.length > index && (
                                            <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {isAlipay && (
                                <div className="text-right">
                                    <a href="#" className="text-primary text-sm">忘记密码？</a>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* 键盘区域 - 只在非加载状态下显示 */}
            {paymentStatus !== "loading" && paymentStatus !== "success" && (
                <div className="fixed bottom-0 w-full bg-gray-100 shadow-lg">
                    <div className="grid grid-cols-3 gap-px bg-gray-200">
                        {/* 第一行 */}
                        {[1, 2, 3].map((key) => (
                            <div
                                key={key}
                                className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer active:bg-gray-100"
                                onClick={() => handleKeyClick(key.toString())}
                            >
                                {key}
                            </div>
                        ))}
                        {/* 第二行 */}
                        {[4, 5, 6].map((key) => (
                            <div
                                key={key}
                                className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer active:bg-gray-100"
                                onClick={() => handleKeyClick(key.toString())}
                            >
                                {key}
                            </div>
                        ))}
                        {/* 第三行 */}
                        {[7, 8, 9].map((key) => (
                            <div
                                key={key}
                                className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer active:bg-gray-100"
                                onClick={() => handleKeyClick(key.toString())}
                            >
                                {key}
                            </div>
                        ))}
                        {/* 第四行 */}
                        <div className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium"></div>
                        <div
                            className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer active:bg-gray-100"
                            onClick={() => handleKeyClick("0")}
                        >
                            0
                        </div>
                        <div
                            className="keyboard-key bg-white h-14 flex items-center justify-center cursor-pointer active:bg-gray-100"
                            onClick={() => handleKeyClick("delete")}
                        >
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-delete-back-2-line ri-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPassword;
