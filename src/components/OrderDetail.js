import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronRight, FaMapMarkerAlt, FaStore, FaFileAlt, FaClock, FaCreditCard, FaFileInvoice } from "react-icons/fa";
import instance from "../utils/axios";

const OrderDetail = () => {
  // 使用 useParams 钩子获取 URL 参数
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogistics, setShowLogistics] = useState(false);

  useEffect(() => {
    // 修改 fetchOrderDetail 函数，使其接收 orderNumber 参数
    const fetchOrderDetail = async (orderNumber) => {
      try {
        
        const response = await instance.get(`/order/${orderNumber}`); // 调用
        // 后端接口获取订单详情
        console.log("Fetching order detail for response:", response.data);
        if (response.data) {
          setOrderDetail(response.data);
          setLoading(false);
        } else {
          console.error('获取订单详情失败');
        }
      } catch (error) {
        console.error('请求出错:', error);
      }
    };

    // 调用 fetchOrderDetail 函数并传入 orderNumber 参数
    fetchOrderDetail(orderNumber);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  // 复制订单号
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderDetail.orderNumber)
      .then(() => {
        alert("订单号已复制到剪贴板");
      })
      .catch(err => {
        console.error('复制失败: ', err);
      });
  };

  // 根据订单状态获取对应的操作按钮
  const getOrderActions = (order) => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
              取消订单
            </button>
            <button className="flex-1 py-2.5 text-xs text-white bg-primary rounded-full">
              立即付款
            </button>
          </div>
        );
      case "processing":
        return (
          <button className="w-full py-2.5 text-xs text-primary border border-primary rounded-full">
            提醒发货
          </button>
        );
      case "shipped":
        return (
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
              查看物流
            </button>
            <button className="flex-1 py-2.5 text-xs text-primary border border-primary rounded-full">
              确认收货
            </button>
          </div>
        );
      case "completed":
        return (
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 text-xs border border-gray-300 rounded-full">
              再次购买
            </button>
            <button className="flex-1 py-2.5 text-xs text-primary border border-primary rounded-full">
              评价订单
            </button>
          </div>
        );
      case "canceled":
        return (
          <button className="w-full py-2.5 text-xs border border-gray-300 rounded-full">
            删除订单
          </button>
        );
      default:
        return null;
    }
  };

  // 获取状态卡片的背景颜色
  const getStatusCardBgColor = (status) => {
    switch (status) {
      case "pending": return "bg-primary";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-indigo-500";
      case "completed": return "bg-green-500";
      case "canceled": return "bg-gray-500";
      default: return "bg-primary";
    }
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果没有找到订单
  if (!orderDetail) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-lg font-medium mb-2">未找到订单</h2>
          <p className="text-sm text-gray-600 mb-4">抱歉，未能找到ID为 {orderNumber} 的订单信息</p>
          <button 
            onClick={() => navigate('/order-list')}
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
          <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center">
            <FaArrowLeft className="text-gray-800 text-sm" />
          </button>
          <span className="text-sm font-medium ml-2">订单详情</span>
        </div>
      </nav>

      {/* 订单内容 */}
      <main className="mt-[44px] px-4 space-y-3 pb-4">
        {/* 订单状态卡片 */}
        <div className={`${getStatusCardBgColor(orderDetail.status)} text-white p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{orderDetail.statusText}</span>
            {orderDetail.status === "pending" && (
              <span className="text-xs">
                支付剩余时间：{orderDetail.countdown}
              </span>
            )}
          </div>
          
          {/* 物流信息 - 仅在待收货和已完成状态显示 */}
          {(orderDetail.status === "shipped" || orderDetail.status === "completed") && orderDetail.logistics && (
            <div 
              className="mt-3 text-xs" 
              onClick={() => setShowLogistics(!showLogistics)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p>{orderDetail.logistics.company}：{orderDetail.logistics.number}</p>
                  <p className="mt-1 opacity-90">{orderDetail.logistics.detail}</p>
                  <p className="mt-1 opacity-80">{orderDetail.logistics.lastUpdate}</p>
                </div>
                <FaChevronRight className={`transition-transform duration-300 ${showLogistics ? 'transform rotate-90' : ''}`} />
              </div>
              
              {/* 物流时间线 */}
              {showLogistics && (
                <div className="mt-3 border-t border-white border-opacity-20 pt-3">
                  <p className="mb-2 font-medium">物流跟踪</p>
                  <div className="space-y-3">
                    {orderDetail.logistics.timeline.map((item, index) => (
                      <div key={index} className="relative pl-4">
                        {index < orderDetail.logistics.timeline.length - 1 && (
                          <div className="absolute left-1.5 top-2 w-px h-full bg-white bg-opacity-30"></div>
                        )}
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white"></div>
                        <div>
                          <p className="font-medium">{item.status}</p>
                          <p className="opacity-80">{item.location}</p>
                          <p className="opacity-60 text-[10px] mt-1">{item.time}</p>
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
        <div className="bg-white p-4 rounded-lg">
          <div className="flex">
            <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 ml-3">
              <div className="flex items-center justify-between">
                {/* 添加可选链操作符 */}
                <span className="text-sm font-medium">{orderDetail?.address?.name}</span>
                <span className="text-gray-600 text-xs">{orderDetail?.address?.phone}</span>
              </div>
              {/* 添加可选链操作符 */}
              <p className="mt-1 text-xs text-gray-600">{orderDetail?.address?.address}</p>
            </div>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center mb-3">
            <FaStore className="text-gray-600 text-xs mr-1" />
            <span className="text-xs">{orderDetail.shopName}</span>
          </div>
          {orderDetail.items.map((item) => (
            <div key={item.id} className="flex gap-3 pb-3">
              <img
                src={item.image}
                className="w-20 h-20 object-cover rounded"
                alt={item.name}
              />
              <div className="flex-1">
                <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {item.specs} | {item.attributes}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">¥{item.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">x{item.quantity}</span>
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
            <span>{orderDetail.createTime}</span>
          </div>
          
          {/* 支付方式 - 仅在已支付的订单中显示 */}
          {orderDetail.status !== "pending" && orderDetail.status !== "canceled" && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <FaCreditCard className="text-gray-500 mr-2" />
                <span className="text-gray-600">支付方式</span>
              </div>
              <span>{orderDetail.paymentMethod}</span>
            </div>
          )}
          
          {/* 发票信息 - 仅在已支付的订单中显示 */}
          {orderDetail.status !== "pending" && orderDetail.status !== "canceled" && orderDetail.invoice && (
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
            <span>¥{orderDetail.paymentAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-600">运费</span>
            <span>{orderDetail.shipping > 0 ? `¥${orderDetail.shipping.toFixed(2)}` : '免运费'}</span>
          </div>
          {orderDetail.discount > 0 && (
            <div className="flex justify-between text-xs mb-3">
              <span className="text-gray-600">优惠</span>
              <span className="text-red-500">-¥{orderDetail.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-100 mt-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">实付金额</span>
              <span className="text-lg text-primary font-medium">
                ¥{(orderDetail.paymentAmount + orderDetail.shipping - orderDetail.discount).toFixed(2)}
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



