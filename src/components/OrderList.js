import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

const OrderList = () => {
  const { status } = useParams(); // 获取 URL 参数
  const navigate = useNavigate();
  
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
    console.log("status:", status);
    if (status && statusMap[status]) {
      setSelectedStatus(statusMap[status]);
    } else {
      setSelectedStatus("全部");
    }
  }, [status]);

  // 从 test.html 迁移过来的模拟订单数据
  const orderData = [
    {
      id: "DD20250331001",
      date: "2025-03-30",
      status: "待付款",
      statusText: "待付款",
      totalAmount: 299.0,
      paymentDeadline: "23:59:59",
      shopName: "墨香阁文房四宝",
      countdown: "23:45:12",
      items: [
        {
          id: 1,
          name: "精品红木毛笔套装 初学者入门书法工具",
          price: 299.0,
          quantity: 1,
          specs: "高档礼盒装",
          attributes: "狼毫/红木",
          image:
            "https://public.readdy.ai/ai/img_res/f405f8c4224c6d59389a4262f9f527d3.jpg",
        },
      ],
      actions: ["cancel", "pay"],
    },
    {
      id: "DD20250329002",
      date: "2025-03-29",
      status: "待发货",
      statusText: "待发货",
      totalAmount: 368.0,
      shopName: "景德镇陶瓷旗舰店",
      items: [
        {
          id: 2,
          name: "景德镇手绘青花瓷茶具套装 家用功夫茶杯",
          price: 368.0,
          quantity: 1,
          specs: "一壶六杯",
          attributes: "青花瓷/手绘",
          image:
            "https://public.readdy.ai/ai/img_res/68a0db3c83781be759e4b8979f4e38c2.jpg",
        },
      ],
      actions: ["remind"],
    },
    {
      id: "DD20250328003",
      date: "2025-03-28",
      status: "待收货",
      statusText: "待收货",
      totalAmount: 199.0,
      deliveryCompany: "顺丰速运",
      trackingNumber: "SF1234567890",
      shopName: "苏州丝绸专卖店",
      items: [
        {
          id: 3,
          name: "苏州丝绸真丝围巾 女士春秋季百搭长款丝巾",
          price: 199.0,
          quantity: 1,
          specs: "175cm×55cm",
          attributes: "100%桑蚕丝/蓝色",
          image:
            "https://public.readdy.ai/ai/img_res/774fa972c97f4339bccb95a25f9c566b.jpg",
        },
      ],
      actions: ["track", "confirm"],
    },
    {
      id: "DD20250327004",
      date: "2025-03-27",
      status: "已完成",
      statusText: "已完成",
      totalAmount: 528.0,
      shopName: "宜兴紫砂艺术馆",
      items: [
        {
          id: 4,
          name: "紫砂茶壶套装 原矿紫泥手工刻绘功夫茶具",
          price: 528.0,
          quantity: 1,
          specs: "280ml容量",
          attributes: "原矿紫泥/手工刻绘",
          image:
            "https://public.readdy.ai/ai/img_res/3ae9ce0fe3398798e7c3a00636dac53b.jpg",
        },
      ],
      actions: ["review", "rebuy"],
    },
    {
      id: "DD20250326005",
      date: "2025-03-26",
      status: "已完成",
      statusText: "已完成",
      totalAmount: 158.0,
      shopName: "锦绣坊民族服饰",
      items: [
        {
          id: 5,
          name: "中国风刺绣手提包 女士复古民族风单肩包",
          price: 158.0,
          quantity: 1,
          specs: "中号25cm×18cm",
          attributes: "棉麻材质/红色",
          image:
            "https://public.readdy.ai/ai/img_res/e12b714f698b2f6659f1edccfd350e5d.jpg",
        },
      ],
      actions: ["review", "rebuy"],
    },
  ];

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
                            <span className="text-xs text-primary">¥{item.price.toFixed(2)}</span>
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
                      共{order.items.length}件商品 合计: <span className="text-primary">¥{order.totalAmount.toFixed(2)}</span>
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
      </main>
    </div>
  );
};

export default OrderList;
