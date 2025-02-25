import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import instance from "../utils/axios";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedShops, setSelectedShops] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = 23; // Replace with actual user logic
        const response = await instance.get(`/cart/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    updateTotal(); // Ensure total is updated whenever selectedItems or cartItems change
  }, [selectedItems, cartItems]);

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
    const newSelectedItems = { ...selectedItems };

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
    console.log("Selected items for checkout:", selectedCartItems);
  };

  const updateTotal = () => {
    let total = 0;
    let count = 0;

    cartItems.forEach((item) => {
      if (selectedItems[item.id]) {
        total += item.price * item.quantity;
        count += item.quantity;
      }
    });

    document.getElementById('totalPrice').textContent = `¥ ${total.toFixed(2)}`;
    document.getElementById('totalItems').textContent = count;
  };

  function showConfirmOrder() {
    document.getElementById("confirmOrderModal").classList.remove("hidden");
  }

  function hideConfirmOrder() {
    document.getElementById("confirmOrderModal").classList.add("hidden");
  }

  function editAddress() {
    // 编辑地址的逻辑
  }

  function submitOrder() {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg";
    toast.textContent = "订单提交成功";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
      hideConfirmOrder();
    }, 2000);
  }

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
                {/* <input
                  type="checkbox"
                  className="mr-4"
                  checked={selectedShops[item.shopId]}
                  onChange={() => handleShopCheckboxChange(item.shopId)}
                /> */}
                <img
                  src={item.shopAvatarUrl}
                  className="w-6 h-6 rounded-full"
                  alt="店铺logo"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {item.shopName}
                </span>
              </div>

              <div className="flex gap-4">
                <input
                  type="checkbox"
                  className="product-checkbox w-5 h-5 rounded border-gray-300"
                  checked={!!selectedItems[item.id]}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <img
                  src={item.productImage}
                  className="w-20 h-20 rounded object-cover"
                  alt={item.productName}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-1">{item.productName}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    规格：{item.specifications.map(spec => `${spec.name}-${spec.values.join(', ')}`).join('，')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary">¥ {item.price}</span>
                    <div className="flex items-center gap-4 mr-12">
                      <button
                        className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <i className="fas fa-minus text-[10px] text-gray-300"></i>
                      </button>
                      <span className="text-gray-400 text-xs">{item.quantity}</span>
                      <button
                        className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <i className="fas fa-plus text-[10px] text-gray-300"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10">购物车为空</p>
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
          <button className="bg-primary text-white px-6 py-2 !rounded-button" onClick={showConfirmOrder}>
            结算 (<span id="totalItems">0</span>)
          </button>
        </div>
      </footer>

          <div>
            <div
              id="confirmOrderModal"
              className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden"
            >
              <div className="w-[375px] bg-white absolute bottom-0 rounded-t-2xl">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">确认订单</span>
                    <button
                      onClick="hideConfirmOrder()"
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div
                    className="bg-gray-50 p-4 rounded-lg flex items-center"
                    onClick="editAddress()"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium">张先生</span>
                        <span className="ml-4 text-gray-500">138****8888</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        浙江省杭州市西湖区文三路 443 号
                      </p>
                    </div>
                    <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-500">支付方式</span>
                      <div className="flex items-center">
                        <span>微信支付</span>
                        <i
                          className="ri-arrow-right-s-line text-xl text-gray-400 ml-2"
                        ></i>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-500">优惠券</span>
                      <div className="flex items-center">
                        <span className="text-primary">暂无可用</span>
                        <i
                          className="ri-arrow-right-s-line text-xl text-gray-400 ml-2"
                        ></i>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-500">配送方式</span>
                      <div className="flex items-center">
                        <span>快递配送</span>
                        <i
                          className="ri-arrow-right-s-line text-xl text-gray-400 ml-2"
                        ></i>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">商品金额</span>
                      <span>¥468.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">运费</span>
                      <span>¥0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">优惠金额</span>
                      <span className="text-primary">-¥0.00</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">实付金额</span>
                    <span className="text-primary text-xl font-medium">¥468.00</span>
                  </div>
                  <button
                    className="w-full bg-primary text-white h-12 !rounded-button"
                    onClick="submitOrder()"
                  >
                    提交订单
                  </button>
                </div>
              </div>
            </div>
          </div>  
    </div>
  );
};

export default Cart;