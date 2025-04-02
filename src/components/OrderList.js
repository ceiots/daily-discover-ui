import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import instance from "../utils/axios";
import { useAuth } from "../App";

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
  
  // 状态映射表
  const statusMap = {
    "0": "全部",
    "1": "待付款",
    "2": "待发货",
    "3": "待收货",
    "4": "已完成"
  };
  
  // 根据 URL 参数设置初始状态
  const [selectedStatus, setSelectedStatus] = useState(
    status ? statusMap[status] || "全部" : "全部"
  );
  
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
    if (isLoggedIn && userInfo?.id) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          // 确保status是整数类型
          const statusParam = parseInt(status) || 0;
          // 添加分页参数
          const response = await instance.get(`/order/user/${userInfo.id}?status=${statusParam}&page=${page}&size=${size}&sort=created_at,desc`);
          
          // 检查响应格式并设置数据
          if (response.data && response.data.data) {
            console.log("查询："+JSON.stringify(response.data.data));
            setOrderData(response.data.data.content || []);
            setTotalPages(response.data.data.totalPages || 0);
            setTotalElements(response.data.data.totalElements || 0);
          } else {
            setOrderData([]);
            setTotalPages(0);
            setTotalElements(0);
          }
          setError(null);
        } catch (error) {
          console.error("获取订单数据失败:", error);
          setError("获取订单数据失败，请稍后重试");
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }
  }, [isLoggedIn, userInfo, status, page, size]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

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

  const handleBack = () => {
    navigate(-1);
  };

  // 根据订单状态获取对应的操作按钮
  const getOrderActions = (order) => {
    switch (order.status) {
      case "待付款": // 待付款
        return (
          <>
            <button 
              className="px-3 py-1.5 text-xs text-gray-600 bg-gray-50 rounded-full mr-2"
            >
              取消订单
            </button>
            <button 
              onClick={() => handlePayment(order.id)}
              className="px-3 py-1.5 text-xs text-white bg-primary rounded-full"
            >
              立即付款
            </button>
          </>
        );
      case "待发货": // 待发货
        return (
          <button 
            className="px-3 py-1.5 text-xs text-primary border border-primary rounded-full"
          >
            提醒发货
          </button>
        );
      case "待收货": // 待收货
        return (
          <>
            <button 
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-full mr-2"
            >
              查看物流
            </button>
            <button 
              className="px-3 py-1.5 text-xs text-primary border border-primary rounded-full"
            >
              确认收货
            </button>
          </>
        );
      case "已完成": // 已完成
        return (
          <>
            <button 
              onClick={() => handleRebuy(order.id)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-full mr-2"
            >
              再次购买
            </button>
            <button 
              className="px-3 py-1.5 text-xs text-primary border border-primary rounded-full"
            >
              评价订单
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const filteredOrders =
    selectedStatus === "全部"
      ? orderData
      : orderData.filter((order) => order.status === selectedStatus);

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
          <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center">
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
              selectedStatus === "全部" ? "text-primary border-primary border-b-2" : "text-gray-500"
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
              selectedStatus === "待付款" ? "text-primary border-primary border-b-2" : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("待付款");
              navigate("/order-list/1", { replace: true });
            }}
          >
            待付款
          </button>
          <button
            className={`${
              selectedStatus === "待发货" ? "text-primary border-primary border-b-2" : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("待发货");
              navigate("/order-list/2", { replace: true });
            }}
          >
            待发货
          </button>
          <button
            className={`${
              selectedStatus === "待收货" ? "text-primary border-primary border-b-2" : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("待收货");
              navigate("/order-list/3", { replace: true });
            }}
          >
            待收货
          </button>
          <button
            className={`${
              selectedStatus === "已完成" ? "text-primary border-primary border-b-2" : "text-gray-500"
            } py-2 px-2 text-xs`}
            onClick={() => {
              handleStatusChange("已完成");
              navigate("/order-list/4", { replace: true });
            }}
          >
            已完成
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
              onClick={() => navigate('/')}
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <i className="ri-store-2-line mr-1 text-gray-600 text-xs"></i>
                      <span className="text-xs">{order.shopName}</span>
                    </div>
                    <span className={`text-xs ${
                      order.status === "待付款" ? "text-red-500" : 
                      order.status === "已完成" ? "text-green-500" : "text-primary"
                    }`}>
                      {order.statusText}
                    </span>
                  </div>
                  
                  {/* 订单内容 */}
                  <Link to={`/order/${order.id}`}>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <img
                          src={item.image}
                          className="w-16 h-16 object-cover rounded"
                          alt={item.name}
                        />
                        <div className="flex-1">
                          <h3 className="text-xs mb-1 line-clamp-2">{item.name}</h3>
                          <p className="text-[10px] text-gray-500 mb-1">
                            {item.specs} | {item.attributes}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-primary">¥{item?.price ? item.price.toFixed(2) : '0.00'}</span>
                            <span className="text-[10px] text-gray-500">x{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Link>
                  
                  {/* 订单底部信息 */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] text-gray-500">
                      {order.date}
                    </div>
                    <div className="text-[10px]">
                      共{order.items.length}件商品 合计: <span className="text-primary">¥{order?.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                  
                  {/* 倒计时 - 仅待付款订单显示 */}
                  {order.status === "待付款" && (
                    <div className="flex items-center mt-1">
                      <div className="text-[10px] text-red-500">
                        <i className="ri-time-line mr-1"></i>
                        <span>支付剩余时间：{order.countdown}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* 订单操作按钮 */}
                  <div className="flex justify-end mt-2">
                    {getOrderActions(order)}
                  </div>
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
              className={`px-3 py-1 text-xs rounded-l-md ${page === 0 ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}
            >
              上一页
            </button>
            <span className="px-3 py-1 text-xs bg-gray-100">
              {page + 1} / {totalPages}
            </span>
            <button 
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className={`px-3 py-1 text-xs rounded-r-md ${page >= totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}`}
            >
              下一页
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderList;
