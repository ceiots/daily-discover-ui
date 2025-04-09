import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../utils/axios";

const PaymentPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNo, paymentAmount, paymentMethod, paymentTime } =
    location.state || {};

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
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const passwordBoxes = Array.from({ length: 6 }, (_, i) => `pwd${i + 1}`);

  // 获取支付方式信息
  const isAlipay = paymentMethod === "1";
  const isWechat = paymentMethod === "2";

  // 模拟支付平台SDK加载
  useEffect(() => {
    const loadPaymentSDK = setTimeout(() => {
      console.log(`加载${isAlipay ? "支付宝" : "微信支付"}SDK`);
      // 实际项目中，这里应该加载相应的支付SDK
      // 例如：动态创建script标签加载SDK
    }, 500);

    return () => clearTimeout(loadPaymentSDK);
  }, [isAlipay, isWechat]);

  // 更新订单状态的函数
  const updateOrderStatus = async (status) => {
    try {
      await instance.post("/order/set-status", {
        orderNo,
        status,
      });
    } catch (err) {
      console.error("更新订单状态失败:", err);
    }
  };

  // 处理支付请求
  const handlePayment = async () => {
    try {
      setPaymentStatus("loading");

      // 调用支付接口
      const response = await instance.post("/payment/process", {
        orderNo,
        paymentMethod,
        paymentAmount,
        paymentPassword: password,
      });

      const result = response.data;
      if (result.code === 200) {
        // 模拟支付平台回调
        simulatePaymentCallback();
      } else {
        setPaymentStatus("failed");
        setErrorMessage(result.message || "支付请求失败");
        // 设置订单状态为待支付
        await updateOrderStatus("待支付");
      }
    } catch (error) {
      setCountdown(60); // 支付失败后60秒内不允许重试
      console.error("支付请求失败:", error);
      setPaymentStatus("failed");
      setErrorMessage("网络异常，请稍后重试");
      // 设置订单状态为待支付
      await updateOrderStatus("待支付");
    }
  };

  
const handlePasswordChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPassword(value);
    if (value.length === 6) {
        handlePasswordSubmit();
    }
};

const handlePasswordSubmit = async () => {
    try {
        setPaymentStatus('loading');
        const response = await instance.post('/payment/process', {
            orderNo,
            paymentMethod,
            paymentAmount,
            paymentPassword: password
        });
        const result = response.data;
        if (result.code === 200) {
            simulatePaymentCallback();
        } else {
            setPaymentStatus('failed');
            setErrorMessage(result.message || '支付请求失败');
            await updateOrderStatus('待支付');
        }
    } catch (error) {
        setCountdown(60);
        console.error('支付请求失败:', error);
        setPaymentStatus('failed');
        setErrorMessage('网络异常，请稍后重试');
        await updateOrderStatus('待支付');
    }
};

  // 模拟支付平台回调
  const simulatePaymentCallback = () => {
    setTimeout(() => {
      // 模拟支付成功
      setPaymentStatus("success");

      // 支付成功后跳转到订单确认页
      setTimeout(() => {
        navigate("/order-confirmation", {
          state: {
            orderNo,
            paymentAmount,
            paymentMethod,
            paymentTime,
          },
        });
      }, 1000);
    }, 2000);
  };

  // 添加倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 处理键盘输入
  const handleKeyClick = (keyValue) => {
    if (keyValue === "delete") {
      if (password.length > 0) {
        setPassword(password.slice(0, -1));
      }
    } else if (password.length < 6) {
      setPassword(password + keyValue);
    }

    if (password.length === 5 && keyValue !== "delete") {
      setTimeout(() => {
        setShowModal(true);
        handlePayment();
      }, 1000);
    }
  };

  // 取消支付
  const handleCancel = async () => {
    try {
      await updateOrderStatus("待支付");
      navigate(-1);
    } catch (error) {
      console.error("取消支付失败:", error);
      navigate(-1);
    }
  };

  return (
    <div className="bg-gray-50 w-375px h-762px mx-auto relative">
      {/* 导航栏 */}
      <div className="fixed top-0 w-full bg-primary text-white p-4 flex items-center justify-between z-10">
        <div
          className="w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={handleCancel}
        >
          <i className="ri-arrow-left-s-line ri-lg"></i>
        </div>
        <div className="text-lg font-medium">输入支付密码</div>
        <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
          <i className="ri-more-line ri-lg"></i>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-16 pb-20 px-4">
        {/* 支付信息 */}
        <div className="bg-white rounded-lg p-6 mt-4 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="text-gray-600 mb-2">支付金额</div>
            <div className="text-3xl font-semibold mb-4">¥ {paymentAmount}</div>
            {/* <div className="text-gray-600 text-sm flex items-center">
                            <span>支付安全由银行和支付机构保障</span>
                        </div> */}
            {/* 支付安全提示 */}
            <div className="mt-4 flex items-center justify-center text-gray-500 text-xs">
              <div className="w-4 h-4 flex items-center justify-center mr-1">
                <i className="ri-shield-check-line"></i>
              </div>
              <span>支付安全由银行和支付机构保障(此处仅作UI模拟)</span>
            </div>
          </div>
        </div>

        {/* 密码输入区域 */}
        <div className="bg-white rounded-lg p-6 mt-4 shadow-sm">
          <div className="text-gray-600 text-sm mb-4">请输入支付密码</div>
          <div className="flex justify-between mb-8">
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
          {/* 忘记密码链接 */}
          {/* <div className="text-right">
                        <a href="#" className="text-primary text-sm">忘记密码？</a>
                    </div> */}
        </div>
      </div>

      {/* 键盘区域 */}
      <div className="fixed bottom-0 w-full bg-gray-100 shadow-lg">
        <div className="grid grid-cols-3 gap-px bg-gray-200">
          {/* 第一行 */}
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer"
              onClick={() => handleKeyClick(key.toString())}
            >
              {key}
            </div>
          ))}
          {/* 第二行 */}
          {[4, 5, 6].map((key) => (
            <div
              key={key}
              className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer"
              onClick={() => handleKeyClick(key.toString())}
            >
              {key}
            </div>
          ))}
          {/* 第三行 */}
          {[7, 8, 9].map((key) => (
            <div
              key={key}
              className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer"
              onClick={() => handleKeyClick(key.toString())}
            >
              {key}
            </div>
          ))}
          {/* 第四行 */}
          <div className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer"></div>
          <div
            className="keyboard-key bg-white h-14 flex items-center justify-center text-lg font-medium cursor-pointer"
            onClick={() => handleKeyClick("0")}
          >
            0
          </div>
          <div
            className="keyboard-key bg-white h-14 flex items-center justify-center cursor-pointer"
            onClick={() => handleKeyClick("delete")}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-delete-back-2-line ri-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPassword;

