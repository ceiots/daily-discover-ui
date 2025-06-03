import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { useAuth } from "../../App"; // 确保正确导入
import instance from "../../utils/axios";

const Cart = () => {
  const { isLoggedIn, userInfo } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
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
        const items = response.data;
        setCartItems(items);
        
        // 初始化数量状态
        const initialQuantities = {};
        items.forEach(item => {
          initialQuantities[item.id] = item.quantity || 1;
        });
        setQuantities(initialQuantities);
        
        setLoading(false);
      } catch (error) {
        console.error("获取购物车数据失败:", error);
        setError("获取购物车数据失败，请稍后重试");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isLoggedIn, navigate, userInfo]);

  useEffect(() => {
    updateTotal();
  }, [selectedItems, cartItems]);

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
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const shopItems = cartItems.filter((i) => i.shopId === item.shopId);
      const shopChecked = shopItems.every((i) => selectedItems[i.id]);
  
      setSelectedShops((prev) => ({
        ...prev,
        [item.shopId]: shopChecked,
      }));
    }
  
    setSelectAll(Object.values(selectedItems).every(Boolean));
    updateTotal();
  };

  const handleShopCheckboxChange = (shopId) => {
    const shopChecked = !selectedShops[shopId];
    const newSelectedItems = { ...selectedItems };
  
    // Update the selection state for items belonging to the current shop
    cartItems.forEach((item) => {
      if (item.shopId === shopId) {
        newSelectedItems[item.id] = shopChecked;
      }
    });
  
    setSelectedItems(newSelectedItems);
    setSelectedShops((prev) => ({
      ...prev,
      [shopId]: shopChecked,
    }));
  
    setSelectAll(Object.values(newSelectedItems).every(Boolean));
    updateTotal();
  };
  

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    const newSelectedItems = {};
    const newSelectedShops = {};

    cartItems.forEach((item) => {
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
      await instance.put(`/cart/update/${itemId}`, request);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(
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

    navigate('/payment', { state: { selectedItems: selectedCartItems } });
  };

  const updateTotal = () => {
    let total = 0;
    let count = 0;
  
    cartItems.forEach((item) => {
      if (selectedItems[item.id] === true) {  // 明确检查是否为 true
        total += item.price * item.quantity;
        count += item.quantity;
      }
    });
  
    const totalPriceElement = document.getElementById('totalPrice');
    const totalItemsElement = document.getElementById('totalItems');
    
    if (totalPriceElement && totalItemsElement) {
      totalPriceElement.textContent = `¥ ${total.toFixed(2)}`;
      totalItemsElement.textContent = count;
    }
  };

  const handleDelete = async () => {
    const idsToDelete = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (idsToDelete.length === 0) {
      alert("请先选择要删除的商品！");
      return;
    }

    try {
      await Promise.all(idsToDelete.map(id =>
        instance.delete(`/cart/delete/${id}`)
      ));
      setCartItems((prevItems) => prevItems.filter(item => !idsToDelete.includes(item.id.toString())));
      setSelectedItems({});
      setShowDropdown(false);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  return (
    <div className="w-[375px] min-h-screen mx-auto bg-gray-50">
      <header className="fixed top-0 w-full bg-primary text-white z-50 px-4 h-[48px] flex items-center justify-between shadow-sm">
        <button className="flex items-center" onClick={handleBack}>
          <i className="fas fa-arrow-left text-lg"></i>
        </button>
        <span className="text-base font-medium">购物车</span>
        <button
          className="flex items-center"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <i className="fas fa-ellipsis-vertical text-lg"></i>
        </button>
      </header>

      <main className="pt-[72px] pb-[80px]">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white px-4 py-4 mb-4 rounded-lg shadow-sm"
            >
              {showDropdown && (
                <div className="absolute top-20 right-4 bg-white shadow-lg rounded-md">
                  <button onClick={handleDelete}>删除</button>
                </div>
              )}
              <div className="shop-checkbox flex items-center mb-4">
                <img
                  src={item.shopAvatarUrl}
                  className="w-6 h-6 rounded-full"
                  alt="店铺logo"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {item.shopName}
                </span>
              </div>

              <div className="flex gap-4">{/* 商品图片和详情区域 */}
                <input
                  type="checkbox"
                  className="product-checkbox w-5 h-5 rounded border-gray-300"
                  checked={selectedItems[item.id]}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <img
                  src={item.productImage}
                  className="w-20 h-20 rounded object-cover"
                  alt={item.productName}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-1 mr-8" style={{ wordWrap: 'break-word' }}>{item.productName}</h3>
                  <p className="text-xs text-gray-500 mb-2" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    规格：{item.specifications.map(spec => `${spec.name}-${spec.values.join(', ')}`).join('，')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary">¥ {item.price}</span>
                    <div className="flex items-center gap-4 mr-12">
                      <button
                        className="w-5 h-5 flex items-center justify-center border border-gray-300"
                        onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1)}
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
                        className="w-8 h-5 text-center border border-gray-300"
                      />
                      <button
                        className="w-5 h-5 flex items-center justify-center border border-gray-300"
                        onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">购物车是空的</div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[60px] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="selectAll" className="w-5 h-5 rounded border-gray-300" onChange={handleSelectAllChange}/>
          <label htmlFor="selectAll" className="text-sm">全选</label>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            合计: <span className="text-primary font-medium" id="totalPrice">¥ 0</span>
          </div>
          <button className="bg-primary text-white px-6 py-2 !rounded-button" onClick={handleCheckout}>
            结算 (<span id="totalItems">0</span>)
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Cart;