import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { useAuth } from "../../App"; // 确保正确导入
import instance from "../../utils/axios";
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
    // Bug 修复：修改了对象展开语法和多余括号的问题
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Update shop selection based on item selection
    const item = cartGroups.find((item) => item.id === id);
    if (item) {
      const shopItems = cartGroups.filter((i) => i.shopId === item.shopId);
      const shopChecked = shopItems.every((i) => selectedItems[i.id]);

      setSelectedShops((prev) => ({
        ...prev,
        [item.shopId]: shopChecked,
      }));
    }

    setSelectAll(Object.values(selectedItems).every(Boolean));
    updateTotal();
  };


  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    const newSelectedItems = {};
    const newSelectedShops = {};

    cartGroups.forEach((item) => {
      newSelectedItems[item.id] = checked;
      newSelectedShops[item.shopId] = checked;
    });

    setSelectedItems(newSelectedItems);
    setSelectedShops(newSelectedShops);
    setSelectAll(checked);
    updateTotal();
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const request = { quantity: newQuantity };
      const response = await instance.put(`/cart/update/${itemId}`, request);
      
      // 检查 CommonResult 返回格式
      if (response.data && response.data.code === 200) {
        setCartGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.shopId === itemId ? { ...group, quantity: newQuantity } : group
          )
        );
        setQuantities((prev) => ({
          ...prev,
          [itemId]: newQuantity,
        }));
      } else {
        alert(response.data?.message || "更新数量失败");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "更新数量失败，请稍后重试");
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = cartGroups.filter(
      (item) => selectedItems[item.id]
    );
    if (selectedCartItems.length === 0) {
      alert("请选择要结算的商品！");
      return;
    }

    // Extract shop information for selected items
    /* const shopInfo = {};
    selectedCartItems.forEach((item) => {
      shopInfo[item.shopId] = {
        shopName: item.shopName,
        shopAvatarUrl: item.shopAvatarUrl,
      };
    }); */

    navigate("/payment", { state: { selectedItems: selectedCartItems } });
  };

  const updateTotal = () => {
    let total = 0;
    let count = 0;

    cartGroups.forEach((item) => {
      if (selectedItems[item.id] === true) {
        // 明确检查是否为 true
        total += item.price * item.quantity;
        count += item.quantity;
      }
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
        setCartGroups((prevGroups) =>
          prevGroups.filter((item) => !idsToDelete.includes(item.id.toString()))
        );
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
        <button className="btn" onClick={() => navigate("/profile")}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle="购物车"
      backgroundColor="default"
    >
      <main className="pb-[65px]">
        {cartGroups.length > 0 ? (
          cartGroups.map((shop) => (
            <div key={shop.shopId} className="mb-4 mx-1">
              <div className="flex items-center mb-2">
                <img
                  src={shop.shopAvatarUrl}
                  className="w-6 h-6 rounded-full"
                  alt="店铺logo"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  {shop.shopName}
                </span>
              </div>
              {shop.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white px-2 py-2 mb-2 rounded-lg shadow-sm flex gap-2 items-center"
                >
                  {showDropdown && (
                    <div className="absolute top-20 right-4 bg-white shadow-lg rounded-md">
                      <button onClick={handleDelete}>删除</button>
                    </div>
                  )}
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300"
                    checked={selectedItems[item.id]}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <img
                    src={item.productImage}
                    className="w-16 h-16 rounded object-cover"
                    alt={item.productName}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      规格：
                      {item.specifications
                        .map((spec) => `${spec.name}-${spec.values.join(", ")}`)
                        .join("，")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-bold">¥ {item.price}</span>
                      <div className="flex items-center gap-2 bg-gray-50 rounded px-1">
                        <button
                          className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded text-gray-500"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              (quantities[item.id] || 1) - 1
                            )
                          }
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
                          className="w-10 h-5 text-center border border-gray-200 rounded bg-gray-50"
                        />
                        <button
                          className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded text-gray-500"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              (quantities[item.id] || 1) + 1
                            )
                          }
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
          <div className="text-center py-8 text-gray-400">购物车是空的</div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[60px] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="selectAll"
            className="w-5 h-5 rounded border-gray-300"
            onChange={handleSelectAllChange}
          />
          <label htmlFor="selectAll" className="text-sm">
            全选
          </label>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            合计:{" "}
            <span className="text-primary font-medium" id="totalPrice">
              ¥ 0
            </span>
          </div>
          <button
            className="bg-primary text-white px-6 py-2 !rounded-button"
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
