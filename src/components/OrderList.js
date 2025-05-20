import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaStore } from "react-icons/fa";
import instance from "../utils/axios";
import { useAuth } from "../App";
import { formatSpecifications } from "../utils/orderUtils";
import OrderCountdown from './OrderCountdown';

const OrderList = () => {
  const { status } = useParams(); // 获取 URL 参数
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();

  // 状态定义
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [remainingTimes, setRemainingTimes] = useState({});

  // 将获取订单的逻辑定义为函数
  const fetchOrders = async (statusParam = status) => {
    if (!isLoggedIn || !userInfo?.id) return;

    try {
      setLoading(true);
      // 确保 status 是整数类型
      const statusValue = parseInt(statusParam) || 0;
      // 添加分页参数
      const response = await instance.get(
        `/order/user/${userInfo.id}?status=${statusValue}&page=${page}&size=${size}&sort=created_at,desc`
      );

      console.log("查询响应:", response.data);

      // 检查响应格式并设置数据
      if (response.data && response.data.data) {
        const newOrderData = response.data.data.content || [];
        const newRemainingTimes = {};
        newOrderData.forEach(order => {
          if (order.status === 1) {
            newRemainingTimes[order.id] = order.countdown || 30 * 60;
          }
        });
        setOrderData(newOrderData);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalElements(response.data.data.totalElements || 0);
        setRemainingTimes(newRemainingTimes);
      } else {
        setOrderData([]);
        setTotalPages(0);
        setTotalElements(0);
        setRemainingTimes({});
      }
      setError(null);
    } catch (error) {
      console.error("获取订单数据失败:", error);
      setError("获取订单数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 状态映射表 - 修改为更清晰的数字映射
  const statusMap = {
    0: "全部",
    1: "待付款",
    2: "待发货",
    3: "待收货",
    4: "已完成",
    5: "已取消",
    6: "退款中",
    7: "已退款"
  };

  // 反向映射表，用于从文字状态获取状态码
  const reverseStatusMap = {
    全部: "0",
    待付款: "1",
    待发货: "2",
    待收货: "3",
    已完成: "4",
    已取消: "5",
    退款中: "6",
    已退款: "7"
  };

  // 根据 URL 参数设置初始状态
  const [selectedStatus, setSelectedStatus] = useState(
    status ? statusMap[status] || "全部" : "全部"
  );

  // 修改状态切换处理函数
  const handleStatusChange = (statusText) => {
    setSelectedStatus(statusText);
    // 从文字状态获取状态码
    const statusCode = reverseStatusMap[statusText];
    console.log("statusCode:", statusCode); // 打印状态码以确认
    navigate(`/order-list/${statusCode}`, { replace: true });

    // 重置页码并获取新数据
    setPage(0);
    fetchOrders(statusCode);
  };

  // 当 URL 参数变化时更新选中状态
  useEffect(() => {
    if (status && statusMap[status]) {
      setSelectedStatus(statusMap[status]);
    } else {
      setSelectedStatus("全部");
    }
  }, [status]);

  // 获取订单数据
  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn, userInfo, status, page, size]);

  const handleFavorite = (orderId) => {
    console.log(`收藏订单: ${orderId}`);
  };

  const handleDelete = (orderId) => {
    console.log(`删除订单: ${orderId}`);
  };

  const handlePayment = (orderId) => {
    console.log(`支付订单: ${orderId}`);
    navigate(`/payment/${orderId}`);
  };

  const handleRebuy = (orderId) => {
    console.log(`再次购买: ${orderId}`);
    // 这里可以添加再次购买的逻辑
  };
  
  const handleRefund = (order) => {
    console.log(`申请退款: ${order.id}`);
    navigate(`/refund/apply/${order.id}`, { state: { orderData: order } });
  };
  
  const handleCancel = (orderId) => {
    console.log(`取消订单: ${orderId}`);
    // 这里添加取消订单的逻辑
    // 可以调用取消订单的接口
  };
  
  const handleConfirmReceipt = (orderId) => {
    console.log(`确认收货: ${orderId}`);
    // 这里添加确认收货的逻辑
    // 可以调用确认收货的接口
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 修改过滤逻辑
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "全部") {
      return orderData;
    }
    return orderData.filter((order) => {
      // 使用 statusMap 将数字状态转换为文字进行比较
      return statusMap[order.status] === selectedStatus;
    });
  }, [orderData, selectedStatus]);

  // 修改状态显示逻辑
  const getOrderStatus = (status) => {
    return statusMap[status] || "未知状态";
  };

  // 渲染订单操作按钮
  const renderOrderActions = (order) => {
    const { status, id } = order;
    
    switch(status) {
      case 1: // 待付款
        return (
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              className="px-3 py-1 text-xs border border-gray-300 rounded-full"
              onClick={() => handleCancel(id)}
            >
              取消订单
            </button>
            <button 
              className="px-3 py-1 text-xs bg-primary text-white rounded-full"
              onClick={() => handlePayment(id)}
            >
              立即支付
            </button>
          </div>
        );
      case 2: // 待发货
        return (
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              className="px-3 py-1 text-xs border border-gray-300 rounded-full"
              onClick={() => handleRefund(order)}
            >
              申请退款
            </button>
          </div>
        );
      case 3: // 待收货
        return (
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              className="px-3 py-1 text-xs border border-gray-300 rounded-full"
              onClick={() => handleRefund(order)}
            >
              申请退款
            </button>
            <button 
              className="px-3 py-1 text-xs bg-primary text-white rounded-full"
              onClick={() => handleConfirmReceipt(id)}
            >
              确认收货
            </button>
          </div>
        );
      case 4: // 已完成
        return (
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              className="px-3 py-1 text-xs border border-gray-300 rounded-full"
              onClick={() => handleRebuy(id)}
            >
              再次购买
            </button>
            <button 
              className="px-3 py-1 text-xs border border-primary text-primary rounded-full"
              onClick={() => navigate(`/review/${id}`)}
            >
              评价
            </button>
            <button 
              className="px-3 py-1 text-xs border border-gray-300 rounded-full"
              onClick={() => handleRefund(order)}
            >
              申请退款
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  /* if (loading) {
    return <div>加载中...</div>;
  } */

  /*   if (error) {
    return <div>{error}</div>;
  } */

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="h-11 flex items-center px-4">
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaArrowLeft className="text-gray-800 text-sm" />
          </button>
          <span className="text-sm font-medium ml-2">全部订单</span>
          {/* <div className="ml-auto">
            <FaSearch className="text-gray-600 text-sm" />
          </div> */}
        </div>
        <div className="flex justify-between px-4">
          <button
            className={`${
              selectedStatus === "全部"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("全部");
              navigate("/order-list/0", { replace: true });
            }}
          >
            全部
          </button>
          <button
            className={`${
              selectedStatus === "待付款"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("待付款");
            }}
          >
            待付款
          </button>
          <button
            className={`${
              selectedStatus === "待发货"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("待发货");
            }}
          >
            待发货
          </button>
          <button
            className={`${
              selectedStatus === "待收货"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("待收货");
            }}
          >
            待收货
          </button>
          <button
            className={`${
              selectedStatus === "已完成"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("已完成");
            }}
          >
            已完成
          </button>
        </div>
        <div className="flex px-4 border-t border-gray-100">
          <button
            className={`${
              selectedStatus === "退款中"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs mr-4`}
            onClick={() => {
              handleStatusChange("退款中");
            }}
          >
            退款中
          </button>
          <button
            className={`${
              selectedStatus === "已退款"
                ? "text-primary border-primary border-b-2"
                : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("已退款");
            }}
          >
            已退款
          </button>
        </div>
      </nav>

      {/* 订单列表 */}
      <main className="mt-[90px] px-4 space-y-3 pb-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 flex items-center justify-center mb-3">
              <img
                src="https://public.readdy.ai/ai/img_res/f2c00337702712163a061331aa926f1b.jpg"
                className="w-full h-full object-cover"
                alt="暂无订单"
              />
            </div>
            <p className="text-gray-500 text-xs">暂无相关订单</p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 bg-primary text-white px-4 py-1.5 rounded-full text-xs"
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="p-3">
                  {/* 遍历每个商品，显示其对应的店铺信息 */}
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {index > 0 && <hr className="my-2 border-gray-200" />}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {item.shopAvatarUrl ? (
                            <img
                              src={item.shopAvatarUrl}
                              className="w-4 h-4 rounded-full mr-1"
                              alt={item.shopName}
                            />
                          ) : (
                            <FaStore className="text-gray-600 text-xs mr-1" />
                          )}
                          <span className="text-xs">
                            {item.shopName || "未知店铺"}
                          </span>
                        </div>
                        <div
                          className={`text-xs ${
                            order.status === 1
                              ? "text-red-500"
                              : order.status === 4
                              ? "text-green-500"
                              : order.status === 6
                              ? "text-orange-500"
                              : order.status === 7
                              ? "text-blue-500"
                              : "text-primary"
                          }`}
                        >
                          {getOrderStatus(order.status)}
                        </div>
                      </div>
                      {/* 订单内容 */}
                      <Link to={`/order/${order.orderNumber}`}>
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                          <img
                            src={item.imageUrl}
                            className="w-16 h-16 object-cover rounded"
                            alt={item.name}
                          />
                          <div className="flex-1">
                            <h3 className="text-xs mb-1 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-[10px] text-gray-500 mb-1">
                              {formatSpecifications(item.specifications)}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-primary">
                                ¥{item?.price ? item.price.toFixed(2) : "0.00"}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                x{item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}

                  {/* 订单底部信息 */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] text-gray-500">
                      {order.date}
                    </div>
                    <div className="text-[10px]">
                      共{order.items.length}件商品 合计:{" "}
                      <span className="text-primary">
                        ¥
                        {order?.totalAmount
                          ? order.totalAmount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>

                  {/* 倒计时 - 仅待付款订单显示 */}
                  {order.status === 1 && (
                    <div className="flex items-center mt-1">
                      <div className="text-[10px] text-red-500">
                        <i className="ri-time-line mr-1"></i>
                        <span>支付剩余时间：<OrderCountdown initialCountdown={order.countdown || 30 * 60} remainingTime={remainingTimes[order.id]} />
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* 订单操作按钮 */}
                  {renderOrderActions(order)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 pb-4">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-3 py-1 text-xs rounded-l-md ${
                page === 0
                  ? "bg-gray-200 text-gray-500"
                  : "bg-primary text-white"
              }`}
            >
              上一页
            </button>
            <span className="px-3 py-1 text-xs bg-gray-100">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className={`px-3 py-1 text-xs rounded-r-md ${
                page >= totalPages - 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-primary text-white"
              }`}
            >
              下一页
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default OrderList;
