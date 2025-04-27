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
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import instance from "../utils/axios";
import { formatSpecifications } from "../utils/orderUtils";
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
  const [logisticsInfo, setLogisticsInfo] = useState(null);
  const [logisticsLoading, setLogisticsLoading] = useState(false);
  const [logisticsError, setLogisticsError] = useState(null);

  // 获取订单详情
  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await instance.get(`/order/${orderNumber}`);
      console.log("Fetching order detail for response:", response.data);
      if (response.data) {
        setOrderDetail(response.data);
        setLoading(false);
        const countdown = response.data.order.countdown || 30 * 60;
        setRemainingTime(countdown);
        
        // 如果订单状态是已发货或已完成，自动获取物流信息
        if (
          response.data.order.status === "shipped" || 
          response.data.order.status === 3 ||
          response.data.order.status === "completed" || 
          response.data.order.status === 4
        ) {
          fetchLogisticsInfo(response.data.order.id);
        }
      } else {
        console.error("获取订单详情失败");
      }
    } catch (error) {
      console.error("请求出错:", error);
    }
  }, [orderNumber]);

  // 获取物流信息
  const fetchLogisticsInfo = async (orderId) => {
    try {
      setLogisticsLoading(true);
      setLogisticsError(null);
      
      // 调用实时物流信息API
      const response = await instance.get(`/logistics/realtime/order/${orderId}`);
      
      if (response.data && response.data.success) {
        setLogisticsInfo(response.data.data);
      } else {
        setLogisticsError(response.data?.message || "获取物流信息失败");
      }
    } catch (error) {
      console.error("获取物流信息出错:", error);
      setLogisticsError("获取物流信息失败，请稍后再试");
    } finally {
      setLogisticsLoading(false);
    }
  };

  // 刷新物流信息
  const refreshLogisticsInfo = useCallback(() => {
    if (orderDetail?.order?.id) {
      fetchLogisticsInfo(orderDetail.order.id);
    }
  }, [orderDetail]);

  // 初始化数据
  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleBack = () => {
    navigate(-1);
  };

  // 复制订单号
  const copyOrderNumber = () => {
    if (!orderDetail || !orderDetail.order.orderNumber) return;
    
    navigator.clipboard
      .writeText(orderDetail.order.orderNumber)
      .then(() => {
        alert("订单号已复制到剪贴板");
      })
      .catch((err) => {
        console.error("复制失败: ", err);
      });
  };
  
  // 复制物流单号
  const copyTrackingNumber = () => {
    if (!logisticsInfo || !logisticsInfo.number) return;
    
    navigator.clipboard
      .writeText(logisticsInfo.number)
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
        <button 
          className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full"
          onClick={() => navigate(`/logistics/${orderDetail.order.orderNumber}`)}
        >
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
        console.log("Rendering pending actions");
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
              {orderDetail.order.statusText || orderDetail.order.statusStr}
            </span>
            {(orderDetail.order.status === "pending" || orderDetail.order.status === 1) && (
              <span className="text-xs">
                支付剩余时间：<OrderCountdown initialCountdown={orderDetail.order.countdown || 30 * 60} remainingTime={remainingTime} />
              </span>
            )}
          </div>

          {/* 物流信息 - 仅在待收货和已完成状态显示 */}
          {(orderDetail.order.status === "shipped" || orderDetail.order.status === 3 ||
            orderDetail.order.status === "completed" || orderDetail.order.status === 4) && (
              <div
                className="mt-3 text-xs"
                onClick={() => {
                  setShowLogistics(!showLogistics);
                  if (!showLogistics && !logisticsInfo) {
                    refreshLogisticsInfo();
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {logisticsLoading ? (
                      <p>正在加载物流信息...</p>
                    ) : logisticsError ? (
                      <p className="text-red-200">{logisticsError}</p>
                    ) : logisticsInfo ? (
                      <div>
                        <p className="flex items-center gap-1">
                          {getLogisticsStatusIcon(logisticsInfo.status)}
                          <span className="ml-1">{logisticsInfo.statusText}</span>
                        </p>
                        <p className="mt-1">
                          {logisticsInfo.company}：{logisticsInfo.number}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyTrackingNumber();
                            }}
                            className="ml-2 text-[10px] border border-white border-opacity-50 rounded-full px-1.5 py-0.5"
                          >
                            复制
                          </button>
                        </p>
                        <p className="mt-1 opacity-90">{logisticsInfo.detail}</p>
                        <p className="mt-1 opacity-80">{logisticsInfo.lastUpdate}</p>
                      </div>
                    ) : (
                      <p>暂无物流信息</p>
                    )}
                  </div>
                  <FaChevronRight
                    className={`transition-transform duration-300 ${
                      showLogistics ? "transform rotate-90" : ""
                    }`}
                  />
                </div>

                {/* 物流时间线 */}
                {showLogistics && logisticsInfo && logisticsInfo.timeline && (
                  <div className="mt-3 border-t border-white border-opacity-20 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">物流跟踪</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          refreshLogisticsInfo();
                        }}
                        className="text-[10px] border border-white border-opacity-50 rounded-full px-1.5 py-0.5 flex items-center"
                      >
                        刷新
                      </button>
                    </div>
                    <div className="space-y-3">
                      {logisticsInfo.timeline.map((item, index) => (
                        <div key={index} className="relative pl-4">
                          {index <
                            logisticsInfo.timeline.length - 1 && (
                            <div className="absolute left-1.5 top-2 w-px h-full bg-white bg-opacity-30"></div>
                          )}
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white"></div>
                          <div>
                            <p className="font-medium">{item.status}</p>
                            <p className="opacity-80">{item.location}</p>
                            <p className="opacity-80">{item.description}</p>
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
                  {orderDetail.address.province} {orderDetail.address.city} {orderDetail.address.district} {orderDetail.address.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 商品信息 */}
        <div className="bg-white rounded-lg p-4">
          {orderDetail.order.items && orderDetail.order.items.map((item, index) => (
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
              <span>{orderDetail.order.orderNumber}</span>
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
              {orderDetail.order.date}
            </span>
          </div>

          {/* 支付方式 - 仅在已支付的订单中显示 */}
          {orderDetail.order.status !== "pending" && orderDetail.order.status !== 1 &&
            orderDetail.order.status !== "canceled" && orderDetail.order.status !== 5 && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <FaCreditCard className="text-gray-500 mr-2" />
                  <span className="text-gray-600">支付方式</span>
                </div>
                <span>{orderDetail.order.paymentMethodText || "在线支付"}</span>
              </div>
            )}

          {/* 发票信息 - 仅在已支付的订单中显示 */}
          {orderDetail.order.status !== "pending" && orderDetail.order.status !== 1 &&
            orderDetail.order.status !== "canceled" && orderDetail.order.status !== 5 &&
            orderDetail.order.invoice && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <FaFileInvoice className="text-gray-500 mr-2" />
                  <span className="text-gray-600">发票信息</span>
                </div>
                <div className="flex items-center text-primary">
                  <span>{orderDetail.order.invoice.type}</span>
                  <FaChevronRight className="ml-1 text-xs" />
                </div>
              </div>
            )}
        </div>

        {/* 金额信息 */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-600">商品总价</span>
            <span>¥{(orderDetail.order.paymentAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-600">运费</span>
            <span>
              {orderDetail.order.shipping > 0
                ? `¥${orderDetail.order.shipping.toFixed(2)}`
                : "免运费"}
            </span>
          </div>
          {orderDetail.order.discount > 0 && (
            <div className="flex justify-between text-xs mb-3">
              <span className="text-gray-600">优惠</span>
              <span className="text-red-500">
                -¥{orderDetail.order.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-100 mt-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">实付金额</span>
              <span className="text-lg text-primary font-medium">
                ¥
                {(
                  (orderDetail.order.paymentAmount || 0) +
                  (orderDetail.order.shipping || 0) -
                  (orderDetail.order.discount || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 底部操作按钮 - 不同状态显示不同按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
        {getOrderActions(orderDetail.order)}
      </div>
    </div>
  );
};

export default OrderDetail;
