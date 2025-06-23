import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../services/http/instance";
import { BasePage, Button, Card, Tabs, Tab } from "../../theme";
import { format } from "date-fns";

const SettlementCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [settledOrders, setSettledOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalCommission: 0,
    totalSettlementAmount: 0,
  });
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return navigate("/login");
        
        const res = await instance.get(`/shop/user`);
        if (res.data.code === 200 && res.data.data) {
          setShopId(res.data.data.id);
        } else {
          // 如果没有店铺，跳转到创建店铺页面
          navigate("/create-shop");
        }
      } catch (error) {
        console.error("获取店铺信息失败", error);
      }
    };
    
    fetchShopInfo();
  }, [navigate]);

  useEffect(() => {
    if (shopId) {
      fetchSettlementData();
    }
  }, [shopId, activeTab, dateRange]);

  const fetchSettlementData = async () => {
    setLoading(true);
    try {
      // 获取结算汇总
      const summaryRes = await instance.get(`/order-settlement/summary`, {
        params: {
          shopId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });
      
      if (summaryRes.data.code === 200) {
        setSummary(summaryRes.data.data);
      }
      
      // 获取待结算订单
      if (activeTab === "pending") {
        const pendingRes = await instance.get(`/order-settlement/pending`, {
          params: {
            shopId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        });
        
        if (pendingRes.data.code === 200) {
          setPendingOrders(pendingRes.data.data || []);
        }
      }
      
      // 获取已结算订单
      if (activeTab === "settled") {
        const settledRes = await instance.get(`/order-settlement/settled`, {
          params: {
            shopId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        });
        
        if (settledRes.data.code === 200) {
          setSettledOrders(settledRes.data.data || []);
        }
      }
    } catch (error) {
      console.error("获取结算数据失败", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const headerLeft = (
    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
      <i className="ri-arrow-left-line text-xl"></i>
    </button>
  );

  const renderSummaryCard = () => (
    <Card className="mb-4">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">结算概览</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-neutral-500 text-sm">待结算订单数</div>
            <div className="text-xl font-medium">{summary.totalOrders || 0}笔</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm">待结算金额</div>
            <div className="text-xl font-medium text-primary">¥{summary.totalSettlementAmount?.toFixed(2) || "0.00"}</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm">订单总金额</div>
            <div className="text-xl font-medium">¥{summary.totalAmount?.toFixed(2) || "0.00"}</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm">平台服务费</div>
            <div className="text-xl font-medium text-orange-500">¥{summary.totalCommission?.toFixed(2) || "0.00"}</div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderDateFilter = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex-1">
        <label className="text-xs text-neutral-500 mb-1 block">开始日期</label>
        <input
          type="date"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateRangeChange}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-neutral-500 mb-1 block">结束日期</label>
        <input
          type="date"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateRangeChange}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
        />
      </div>
    </div>
  );

  const renderOrderList = (orders, isSettled) => (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-neutral-400">
          {loading ? "加载中..." : "暂无订单数据"}
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">订单号: {order.orderNumber}</div>
                <div className="text-xs text-neutral-500">{order.date}</div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-neutral-500">订单金额</div>
                <div className="font-medium">¥{order.paymentAmount?.toFixed(2)}</div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-neutral-500">平台服务费 ({(order.platformCommissionRate * 100).toFixed(0)}%)</div>
                <div className="text-orange-500">¥{order.platformCommissionAmount?.toFixed(2)}</div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-neutral-500">实际结算金额</div>
                <div className="text-primary font-medium">¥{order.shopAmount?.toFixed(2)}</div>
              </div>
              
              {isSettled && (
                <div className="flex justify-between items-center">
                  <div className="text-xs text-neutral-500">结算时间</div>
                  <div className="text-xs">{format(new Date(order.settlementTime), "yyyy-MM-dd HH:mm")}</div>
                </div>
              )}
              
              <div className="mt-3 pt-2 border-t border-neutral-100 flex justify-between items-center">
                <div className="text-xs">
                  {order.items?.length || 0}件商品
                </div>
                <div>
                  {isSettled ? (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded">已结算</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded">待结算</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <BasePage
      title="结算中心"
      showHeader
      headerLeft={headerLeft}
      backgroundColor="paper"
    >
      <div className="max-w-lg mx-auto w-full p-4">
        {renderSummaryCard()}
        {renderDateFilter()}
        
        <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
          <Tab value="pending" label="待结算" />
          <Tab value="settled" label="已结算" />
        </Tabs>
        
        {activeTab === "pending" && renderOrderList(pendingOrders, false)}
        {activeTab === "settled" && renderOrderList(settledOrders, true)}
      </div>
    </BasePage>
  );
};

export default SettlementCenter;