import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { useAuth } from "../../hooks/useAuth";
import instance from "../../services/http/instance";
import { BasePage } from "../../theme";

const Cart = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const navigate = useNavigate();
  const [cartGroups, setCartGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedShops, setSelectedShops] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantities, setQuantities] = useState({}); // 添加数量状态

  useEffect(() => {
    // 检查用户是否登录
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // 获取购物车数据
    const fetchCartItems = async () => {
      try {
        const userId = userInfo?.id || localStorage.getItem("userId");
        if (!userId) {
          throw new Error("用户ID不存在");
        }

        const response = await instance.get(`/cart/${userId}`);
        console.log('购物车response: ',response);  
        // 适配 CommonResult 返回格式
        if (response.data && response.data.code === 200) {
          const groups = response.data.data || [];
          setCartGroups(groups);
          
          // 初始化商品数量
          const initialQuantities = {};
          groups.forEach(group => {
            group.items.forEach(item => {
              initialQuantities[item.id] = item.quantity;
            });
          });
          setQuantities(initialQuantities);
        } else {
          throw new Error(response.data?.message || "获取购物车数据失败");
        }

        setLoading(false);
      } catch (error) {
        console.error("获取购物车数据失败:", error);
        setError(error.message || "获取购物车数据失败，请稍后重试");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isLoggedIn, navigate, userInfo]);

  useEffect(() => {
    updateTotal();
  }, [selectedItems, cartGroups]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShopCheckboxChange = (shopId) => {
    const shopChecked = !selectedShops[shopId];
    setSelectedShops((prev) => ({
      ...prev,
      [shopId]: shopChecked,
    }));

    // 更新该店铺下所有商品的选中状态
    const shopGroup = cartGroups.find(group => group.shopId === shopId);
    if (shopGroup) {
      const newSelectedItems = { ...selectedItems };
      shopGroup.items.forEach(item => {
        newSelectedItems[item.id] = shopChecked;
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    const newSelectedItems = {};
    const newSelectedShops = {};

    cartGroups.forEach(group => {
      newSelectedShops[group.shopId] = checked;
      group.items.forEach(item => {
        newSelectedItems[item.id] = checked;
      });
    });

    setSelectedItems(newSelectedItems);
    setSelectedShops(newSelectedShops);
    setSelectAll(checked);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const request = { quantity: newQuantity };
      const response = await instance.put(`/cart/update/${itemId}`, request);
      
      // 检查 CommonResult 返回格式
      if (response.data && response.data.code === 200) {
        // 更新本地商品数量状态
        setQuantities(prev => ({
          ...prev,
          [itemId]: newQuantity
        }));
        
        // 更新购物车商品数量
        setCartGroups(prevGroups => {
          return prevGroups.map(group => {
            const updatedItems = group.items.map(item => 
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            return { ...group, items: updatedItems };
          });
        });
      } else {
        alert(response.data?.message || "更新数量失败");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "更新数量失败，请稍后重试");
    }
  };

  const handleCheckout = () => {
    // 收集所有选中的商品
    const selectedCartItems = [];
    cartGroups.forEach(group => {
      group.items.forEach(item => {
        if (selectedItems[item.id]) {
          selectedCartItems.push(item);
        }
      });
    });
    
    if (selectedCartItems.length === 0) {
      alert("请选择要结算的商品！");
      return;
    }

    navigate("/payment", { state: { selectedItems: selectedCartItems } });
  };

  const updateTotal = () => {
    let total = 0;
    let count = 0;

    cartGroups.forEach(group => {
      group.items.forEach(item => {
        if (selectedItems[item.id]) {
          total += item.price * item.quantity;
          count += item.quantity;
        }
      });
    });

    const totalPriceElement = document.getElementById("totalPrice");
    const totalItemsElement = document.getElementById("totalItems");

    if (totalPriceElement && totalItemsElement) {
      totalPriceElement.textContent = `¥ ${total.toFixed(2)}`;
      totalItemsElement.textContent = count;
    }
  };

  const handleDelete = async () => {
    const idsToDelete = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );
    if (idsToDelete.length === 0) {
      alert("请先选择要删除的商品！");
      return;
    }

    try {
      // 处理删除请求并检查 CommonResult 格式
      const deleteResults = await Promise.all(
        idsToDelete.map((id) => instance.delete(`/cart/delete/${id}`))
      );
      
      // 检查所有删除请求是否成功
      const allSuccess = deleteResults.every(
        (res) => res.data && res.data.code === 200
      );
      
      if (allSuccess) {
        // 更新购物车分组数据，移除已删除的商品
        setCartGroups(prevGroups => {
          const newGroups = prevGroups.map(group => {
            const remainingItems = group.items.filter(
              item => !idsToDelete.includes(item.id.toString())
            );
            return { ...group, items: remainingItems };
          }).filter(group => group.items.length > 0); // 移除没有商品的店铺分组
          
          return newGroups;
        });
        
        // 清除选中状态
        setSelectedItems({});
        setShowDropdown(false);
      } else {
        const failedMessage = deleteResults
          .filter((res) => res.data && res.data.code !== 200)
          .map((res) => res.data?.message)
          .join("; ");
        alert(`删除失败: ${failedMessage || "请稍后重试"}`);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      alert("删除商品失败，请稍后重试");
    }
  };

  return (
    <BasePage
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={() => navigate("/my-service")}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle="购物车"
      backgroundColor="default"
    >
      <main className="pb-[65px] bg-gray-50">
        {loading ? (
          <div className="text-center py-8 text-gray-400">加载中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : cartGroups.length > 0 ? (
          cartGroups.map((shop) => (
            <div key={shop.shopId} className="mb-3 mx-2 bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2 border-gray-300 rounded"
                    checked={selectedShops[shop.shopId] || false}
                    onChange={() => handleShopCheckboxChange(shop.shopId)}
                  />
                  <img
                    src={shop.shopAvatarUrl}
                    className="w-5 h-5 rounded-full"
                    alt="店铺logo"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">
                    {shop.shopName}
                  </span>
                </div>
                <button 
                  className="text-xs text-gray-500"
                  onClick={handleDelete}
                >
                  删除
                </button>
              </div>
              
              {shop.items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-2 py-2 border-b border-gray-50 last:border-0"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-8 border-gray-300 rounded"
                    checked={selectedItems[item.id] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <img
                    src={item.productImage}
                    className="w-16 h-16 rounded object-cover"
                    alt={item.productName}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {item.specifications
                          .map((spec) => `${spec.name}:${spec.values.join(",")}`)
                          .join(" ")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-semibold text-base">¥{item.price}</span>
                      <div className="flex items-center gap-1 bg-gray-50 rounded-full px-1">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500"
                          onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantities[item.id] || 1}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          className="w-8 h-6 text-center bg-transparent border-0 text-sm"
                        />
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-500"
                          onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">🛒</div>
            <p>购物车是空的</p>
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[60px] flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="selectAll"
            className="w-4 h-4 rounded border-gray-300"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
          <label htmlFor="selectAll" className="text-sm text-gray-600">
            全选
          </label>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            合计:{" "}
            <span className="text-primary font-semibold" id="totalPrice">
              ¥ 0.00
            </span>
          </div>
          <button
            className="bg-primary text-white px-6 py-2 rounded-full text-sm"
            onClick={handleCheckout}
          >
            结算 (<span id="totalItems">0</span>)
          </button>
        </div>
      </footer>
    </BasePage>
  );
};

export default Cart;
