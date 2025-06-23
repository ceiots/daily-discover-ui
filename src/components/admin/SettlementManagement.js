import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../services/http/instance";
import { BasePage, Button, Card, Tabs, Tab, Modal } from "../../theme";
import { format } from "date-fns";

const SettlementManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [settledOrders, setSettledOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchShops();
    fetchSettlementData();
  }, [activeTab, selectedShop, dateRange]);

  const fetchShops = async () => {
    try {
      const res = await instance.get("/shop/all");
      if (res.data.code === 200) {
        setShops(res.data.data || []);
      }
    } catch (error) {
      console.error("获取店铺列表失败", error);
    }
  };

  const fetchSettlementData = async () => {
    setLoading(true);
    try {
      // 获取待结算订单
      if (activeTab === "pending") {
        const params = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        };
        
        if (selectedShop !== "all") {
          params.shopId = selectedShop;
        }
        
        const pendingRes = await instance.get(`/admin/settlement/pending`, { params });
        
        if (pendingRes.data.code === 200) {
          setPendingOrders(pendingRes.data.data || []);
        }
      }
      
      // 获取已结算订单
      if (activeTab === "settled") {
        const params = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        };
        
        if (selectedShop !== "all") {
          params.shopId = selectedShop;
        }
        
        const settledRes = await instance.get(`/admin/settlement/settled`, { params });
        
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

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === pendingOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pendingOrders.map((order) => order.id));
    }
  };

  const handleSettleOrders = async () => {
    if (selectedOrders.length === 0) return;
    
    setShowConfirmModal(true);
  };

  const confirmSettlement = async () => {
    setLoading(true);
    try {
      const res = await instance.post("/admin/settlement/batch-settle", selectedOrders);
      
      if (res.data.code === 200) {
        // 重新获取数据
        fetchSettlementData();
        // 清空选择
        setSelectedOrders([]);
        // 显示成功消息
        alert(`结算成功！成功处理 ${res.data.data.success} 笔订单`);
      } else {
        alert("结算失败：" + res.data.message);
      }
    } catch (error) {
      console.error("结算订单失败", error);
      alert("结算失败，请稍后重试");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const headerLeft = (
    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
      <i className="ri-arrow-left-line text-xl"></i>
    </button>
  );

  const renderFilters = () => (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-3">
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
      
      <div>
        <label className="text-xs text-neutral-500 mb-1 block">选择店铺</label>
        <select
          value={selectedShop}
          onChange={handleShopChange}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
        >
          <option value="all">全部店铺</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.shopName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderPendingOrders = () => (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedOrders.length > 0 && selectedOrders.length === pendingOrders.length}
            onChange={handleSelectAll}
            className="mr-2"
          />
          <span className="text-sm">全选</span>
        </div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={selectedOrders.length === 0 || loading}
          onClick={handleSettleOrders}
        >
          结算选中订单 ({selectedOrders.length})
        </Button>
      </div>
      
      {renderOrderList(pendingOrders, false, true)}
    </div>
  );

  const renderOrderList = (orders, isSettled, selectable = false) => (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-neutral-400">
          {loading ? "加载中..." : "暂无订单数据"}
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className="p-3">
              {selectable && (
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleOrderSelect(order.id)}
                  />
                </div>
              )}
              
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium ml-6">{order.shopName}</div>
                <div className="text-xs text-neutral-500">{order.date}</div>
              </div>
              
              <div className="border-b border-neutral-100 pb-2 mb-2">
                <div className="text-xs text-neutral-500">订单号: {order.orderNumber}</div>
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
              
              {!isSettled && !selectable && (
                <div className="mt-3">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    fullWidth
                    onClick={() => {
                      setSelectedOrders([order.id]);
                      setShowConfirmModal(true);
                    }}
                  >
                    结算此订单
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <BasePage
      title="结算管理"
      showHeader
      headerLeft={headerLeft}
      backgroundColor="paper"
    >
      <div className="max-w-lg mx-auto w-full p-4">
        {renderFilters()}
        
        <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
          <Tab value="pending" label="待结算" />
          <Tab value="settled" label="已结算" />
        </Tabs>
        
        {activeTab === "pending" && renderPendingOrders()}
        {activeTab === "settled" && renderOrderList(settledOrders, true)}
        
        <Modal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="确认结算"
        >
          <div className="p-4">
            <p className="mb-4">确定要结算选中的 {selectedOrders.length} 笔订单吗？</p>
            <p className="text-neutral-500 text-sm mb-6">
              结算后，系统将自动计算平台佣金，并将剩余金额结算给商家。此操作不可撤销。
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outlined"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                取消
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmSettlement}
                disabled={loading}
              >
                {loading ? "处理中..." : "确认结算"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </BasePage>
  );
};

export default SettlementManagement;