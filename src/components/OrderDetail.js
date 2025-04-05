import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaStore,
  FaFileAlt,
  FaClock,
  FaCreditCard,
  FaFileInvoice,
  FaShoppingCart,
  FaCommentAlt,
  FaTrashAlt,
  FaTruck,
  FaCheck,
} from "react-icons/fa";
import instance from "../utils/axios";
import { useCountdown } from '../utils/orderUtils';
// 新增：导入 OrderCountdown 组件
import OrderCountdown from './OrderCountdown';

const OrderDetail = () => {
  // 使用 useParams 钩子获取 URL 参数
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogistics, setShowLogistics] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  // 获取订单详情
  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await instance.get(`/order/${orderNumber}`);
      console.log("Fetching order detail for response:", response.data);
      if (response.data) {
        setOrderDetail(response.data);
        setLoading(false);
        
        // 如果是待付款状态，初始化倒计时
        if (response.data.status === "pending" || response.data.status === 1) {
          // 解析倒计时字符串，例如 "30分钟"
          let minutes = 30;
          if (response.data.countdown) {
            const match = response.data.countdown.match(/(\d+)/);
            if (match && match[1]) {
              minutes = parseInt(match[1], 10);
            }
          }
          
          // 设置倒计时秒数
          setRemainingTime(minutes * 60);
        }
      } else {
        console.error("获取订单详情失败");
      }
    } catch (error) {
      console.error("请求出错:", error);
    }
  }, [orderNumber]);

  // 初始化数据
  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // 倒计时效果
  useEffect(() => {
    // 只有在待付款状态且剩余时间大于0时才启动倒计时
    if (
      remainingTime > 0 && 
      orderDetail && 
      (orderDetail.status === "pending" || orderDetail.status === 1)
    ) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // 倒计时结束，可以刷新订单状态
            fetchOrderDetail();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      // 组件卸载时清除定时器
      return () => clearInterval(timer);
    }
  }, [remainingTime, orderDetail, fetchOrderDetail]);

  const handleBack = () => {
    navigate(-1);
  };

  // 复制订单号
  const copyOrderNumber = () => {
    if (!orderDetail || !orderDetail.orderNumber) return;
    
    navigator.clipboard
      .writeText(orderDetail.orderNumber)
      .then(() => {
        alert("订单号已复制到剪贴板");
      })
      .catch((err) => {
        console.error("复制失败: ", err);
      });
  };

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "0分00秒";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}秒`;
  };

  // 格式化规格信息
  const formatSpecifications = (specs) => {
    if (!specs) return "默认规格";
    
    try {
      // 如果是字符串，尝试解析成对象
      const specsObj = typeof specs === 'string' ? JSON.parse(specs) : specs;
      
      // 如果是数组格式
      if (Array.isArray(specsObj)) {
        return specsObj.map(spec => {
          if (spec.name && spec.values) {
            // 如果 values 是数组，将其连接起来
            const values = Array.isArray(spec.values) ? spec.values.join('/') : spec.values;
            return `${spec.name}: ${values}`;
          }
          return '';
        }).filter(Boolean).join(' | ');
      } 
      // 如果是对象格式
      else if (specsObj.name && specsObj.values) {
        const values = Array.isArray(specsObj.values) ? specsObj.values.join('/') : specsObj.values;
        return `${specsObj.name}: ${values}`;
      }
      // 如果是简单的键值对格式
      else {
        return Object.entries(specsObj)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' | ');
      }
    } catch (error) {
      console.error("规格格式化错误:", error);
      // 如果解析失败，直接返回原始字符串，但去掉多余的符号
      if (typeof specs === 'string') {
        return specs
          .replace(/[{}""]/g, '')  // 移除括号和引号
          .replace(/name:/g, '')       // 移除 name: 标签
          .replace(/values:/g, '')     // 移除 values: 标签
          .replace(/,/g, ' | ');       // 将逗号替换为分隔符
      }
      return String(specs);
    }
  };

  // 根据订单状态获取对应的操作按钮
  const getOrderActions = (order) => {
    if (!order) return null;
    
    // 不要在这里使用 hooks！
    const renderPendingActions = () => (
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
          取消订单
        </button>
        <button className="flex-1 py-2.5 text-xs bg-primary text-white rounded-full">
          立即支付
        </button>
      </div>
    );
    
    const renderProcessingActions = () => (
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
          申请退款
        </button>
        <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
          联系客服
        </button>
      </div>
    );
    
    const renderShippedActions = () => (
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
          查看物流
        </button>
        <button className="flex-1 py-2.5 text-xs bg-primary text-white rounded-full">
          确认收货
        </button>
      </div>
    );
    
    const renderCompletedActions = () => (
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
          申请售后
        </button>
        <button className="flex-1 py-2.5 text-xs bg-primary text-white rounded-full">
          评价商品
        </button>
      </div>
    );
    
    const renderCanceledActions = () => (
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
          删除订单
        </button>
        <button className="flex-1 py-2.5 text-xs bg-primary text-white rounded-full">
          再次购买
        </button>
      </div>
    );
    
    switch (order.status) {
      case "pending":
      case 1:
        return renderPendingActions();
      case "processing":
      case 2:
        return renderProcessingActions();
      case "shipped":
      case 3:
        return renderShippedActions();
      case "completed":
      case 4:
        return renderCompletedActions();
      case "canceled":
      case 5:
        return renderCanceledActions();
      default:
        return null;
    }
  };

  // 根据订单状态获取状态卡片的背景颜色
  const getStatusCardBgColor = (status) => {
    switch (status) {
      case "pending":
      case 1:
        return "bg-indigo-500";
      case "processing":
      case 2:
        return "bg-blue-500";
      case "shipped":
      case 3:
        return "bg-green-500";
      case "completed":
      case 4:
        return "bg-teal-500";
      case "canceled":
      case 5:
        return "bg-gray-500";
      default:
        return "bg-indigo-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">订单不存在</h2>
          <p className="text-gray-500 mb-6">
            抱歉，未找到该订单信息，请检查订单号是否正确
          </p>
          <button
            onClick={() => navigate("/order-list")}
            className="px-4 py-2 bg-primary text-white rounded-full text-sm"
          >
            返回订单列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="h-11 flex items-center px-4">
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaArrowLeft className="text-gray-800 text-sm" />
          </button>
          <span className="text-sm font-medium ml-2">订单详情</span>
        </div>
      </nav>

      {/* 订单内容 */}
      <main className="mt-[44px] px-4 space-y-3 pb-4">
        {/* 订单状态卡片 */}
        <div
          className={`${getStatusCardBgColor(
            orderDetail.status
          )} text-white p-4 rounded-lg`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {orderDetail.statusText || orderDetail.statusStr}
            </span>
            {(orderDetail.status === "pending" || orderDetail.status === 1) && (
              <span className="text-xs">
                支付剩余时间：<OrderCountdown initialCountdown={remainingTime} />
              </span>
            )}
          </div>

          {/* 物流信息 - 仅在待收货和已完成状态显示 */}
          {(orderDetail.status === "shipped" || orderDetail.status === 3 ||
            orderDetail.status === "completed" || orderDetail.status === 4) &&
            orderDetail.logistics && (
              <div
                className="mt-3 text-xs"
                onClick={() => setShowLogistics(!showLogistics)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p>
                      {orderDetail.logistics.company}：
                      {orderDetail.logistics.number}
                    </p>
                    <p className="mt-1 opacity-90">
                      {orderDetail.logistics.detail}
                    </p>
                    <p className="mt-1 opacity-80">
                      {orderDetail.logistics.lastUpdate}
                    </p>
                  </div>
                  <FaChevronRight
                    className={`transition-transform duration-300 ${
                      showLogistics ? "transform rotate-90" : ""
                    }`}
                  />
                </div>

                {/* 物流时间线 */}
                {showLogistics && orderDetail.logistics.timeline && (
                  <div className="mt-3 border-t border-white border-opacity-20 pt-3">
                    <p className="mb-2 font-medium">物流跟踪</p>
                    <div className="space-y-3">
                      {orderDetail.logistics.timeline.map((item, index) => (
                        <div key={index} className="relative pl-4">
                          {index <
                            orderDetail.logistics.timeline.length - 1 && (
                            <div className="absolute left-1.5 top-2 w-px h-full bg-white bg-opacity-30"></div>
                          )}
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white"></div>
                          <div>
                            <p className="font-medium">{item.status}</p>
                            <p className="opacity-80">{item.location}</p>
                            <p className="opacity-60 text-[10px] mt-1">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* 收货地址 */}
        {orderDetail.address && (
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-primary text-sm mt-0.5 mr-3" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">
                      {orderDetail.address.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {orderDetail.address.phone}
                    </span>
                  </div>
                  {orderDetail.address.isDefault && (
                    <span className="text-[10px] text-primary border border-primary rounded-full px-1">
                      默认
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {orderDetail.address.province} {orderDetail.address.city}{" "}
                  {orderDetail.address.district} {orderDetail.address.detail}
                  {orderDetail?.address?.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 商品信息 */}
        <div className="bg-white rounded-lg p-4">
          {orderDetail.items && orderDetail.items.map((item, index) => (
            <div key={item.id || index} className="pb-3">
              {/* 店铺信息 - 移到最上方 */}
              <div className="flex items-center mb-3">
                {item.shopAvatarUrl ? (
                  <img 
                    src={item.shopAvatarUrl} 
                    className="w-4 h-4 rounded-full mr-1" 
                    alt={item.shopName} 
                  />
                ) : (
                  <FaStore className="text-gray-600 text-xs mr-1" />
                )}
                <span className="text-xs">{item.shopName}</span>
              </div>
              
              {/* 商品信息 */}
              <div className="flex gap-3">
                <img
                  src={item.image || item.imageUrl}
                  className="w-20 h-20 object-cover rounded"
                  alt={item.name}
                />
                <div className="flex-1">
                  <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatSpecifications(item.specifications)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary">
                      ¥{(item.price || 0).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      x{item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 订单信息 */}
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <FaFileAlt className="text-gray-500 mr-2" />
              <span className="text-gray-600">订单编号</span>
            </div>
            <div className="flex items-center">
              <span>{orderDetail.orderNumber}</span>
              <button
                onClick={copyOrderNumber}
                className="ml-2 text-primary text-[10px] border border-primary rounded-full px-1.5 py-0.5"
              >
                复制
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <FaClock className="text-gray-500 mr-2" />
              <span className="text-gray-600">创建时间</span>
            </div>
            <span>
              {orderDetail.date}
            </span>
          </div>

          {/* 支付方式 - 仅在已支付的订单中显示 */}
          {orderDetail.status !== "pending" && orderDetail.status !== 1 &&
            orderDetail.status !== "canceled" && orderDetail.status !== 5 && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <FaCreditCard className="text-gray-500 mr-2" />
                  <span className="text-gray-600">支付方式</span>
                </div>
                <span>{orderDetail.paymentMethodText || "在线支付"}</span>
              </div>
            )}

          {/* 发票信息 - 仅在已支付的订单中显示 */}
          {orderDetail.status !== "pending" && orderDetail.status !== 1 &&
            orderDetail.status !== "canceled" && orderDetail.status !== 5 &&
            orderDetail.invoice && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <FaFileInvoice className="text-gray-500 mr-2" />
                  <span className="text-gray-600">发票信息</span>
                </div>
                <div className="flex items-center text-primary">
                  <span>{orderDetail.invoice.type}</span>
                  <FaChevronRight className="ml-1 text-xs" />
                </div>
              </div>
            )}
        </div>

        {/* 金额信息 */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-600">商品总价</span>
            <span>¥{(orderDetail.paymentAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-600">运费</span>
            <span>
              {orderDetail.shipping > 0
                ? `¥${orderDetail.shipping.toFixed(2)}`
                : "免运费"}
            </span>
          </div>
          {orderDetail.discount > 0 && (
            <div className="flex justify-between text-xs mb-3">
              <span className="text-gray-600">优惠</span>
              <span className="text-red-500">
                -¥{orderDetail.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-100 mt-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">实付金额</span>
              <span className="text-lg text-primary font-medium">
                ¥
                {(
                  (orderDetail.paymentAmount || 0) +
                  (orderDetail.shipping || 0) -
                  (orderDetail.discount || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 底部操作按钮 - 不同状态显示不同按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
        {getOrderActions(orderDetail)}
      </div>
    </div>
  );
};

export default OrderDetail;
