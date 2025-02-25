import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import instance from "../utils/axios";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // State to track selected items
  const [selectAll, setSelectAll] = useState(false); // State to track if all items are selected
  const [showDropdown, setShowDropdown] = useState(false); // 控制下拉菜单的显示


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = 23; // Replace with actual user logic
        const response = await instance.get(
          `/cart/${userId}`
        );
        console.log(response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (selectedItems[item.id] ? item.price * item.quantity : 0),
      0
    );
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce(
      (total, item) => total + (selectedItems[item.id] ? item.quantity : 0),
      0
    );
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle selection
    }));
    // Update selectAll state if necessary
    setSelectAll(cartItems.every((item) => !!selectedItems[item.id]));
  };

  const handleSelectAllChange = () => {
    const newSelectedItems = {};
    cartItems.forEach((item) => {
      newSelectedItems[item.id] = !selectAll; // Toggle all selection
    });
    setSelectedItems(newSelectedItems);
    setSelectAll(!selectAll);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities

    try {
      const request = {
        quantity: newQuantity,
      };
      // Update the quantity in the backend
      await instance.put(
        `/cart/update/${itemId}`,
        request
      );
      // Update the local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }; // 添加缺失的右大括号

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(
      (item) => selectedItems[item.id]
    );
    if (selectedCartItems.length === 0) {
      alert("请选择要结算的商品！");
      return;
    }
    // Proceed to payment page or perform other actions
    console.log("Selected items for checkout:", selectedCartItems);
    // Navigate to payment page or show confirmation modal
  };

  const handleDelete = async () => {
    const idsToDelete = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (idsToDelete.length === 0) {
      alert("请先选择要删除的商品！");
      return;
    }

    try {
      await Promise.all(idsToDelete.map(id => 
        instance.delete("/cart/delete/${id}")
      ));
      setCartItems((prevItems) => prevItems.filter(item => !idsToDelete.includes(item.id.toString())));
      setSelectedItems({}); // 清空选中状态
      setShowDropdown(false); // 关闭下拉菜单
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
              <div className="flex items-center mb-4">
                <input type="checkbox" className="mr-4" />
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
                            <input type="checkbox" className="product-checkbox w-5 h-5 rounded border-gray-300" 
                                checked={!!selectedItems[item.id]} // Check if the item is selected
                                onChange={() => handleCheckboxChange(item.id)} // Handle checkbox change
                                data-shop-id="{item.id}" 
                                data-product-id="{item.id}"
                                data-price="{item.price}"/>
                            <img src={item.productImage} className="w-20 h-20 rounded object-cover" alt={item.productName}/>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium mb-1">{item.productName}</h3>
                                <p className="text-xs text-gray-500 mb-2">
                                    规格：{item.specifications.map(spec => `${spec.name}-${spec.values.join(', ')}`).join('，')}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary">¥ ${item.price}</span>
                                    <div className="flex items-center gap-4 mr-12">
                                    <button className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-button opacity-50 cursor-not-allowed">
                                      <i
                                        className="fas fa-minus text-[10px] text-gray-300"
                                        onClick={() =>
                                          updateQuantity(item.id, item.quantity - 1)
                                        }
                                      ></i>
                                    </button>
                                    <span className="text-gray-400 text-xs">
                                      {item.quantity}
                                    </span>
                                    <button className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-button opacity-50 cursor-not-allowed">
                                      <i
                                        className="fas fa-plus text-[10px] text-gray-300"
                                        onClick={() =>
                                          updateQuantity(item.id, item.quantity + 1)
                                        }
                                      ></i>
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
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-4 h-[56px] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllChange}
            className="checkbox-custom"
          />
          <span className="text-gray-700">全选</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-gray-900 text-sm">
              合计:{" "}
              <span className="text-gray-400 text-sm">
                ¥ {calculateTotalPrice()}
              </span>
            </div>
            <div className="text-gray-500 text-[10px]">
              总共 {calculateTotalQuantity()} 件商品
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="px-5 py-2 bg-primary text-white text-sm rounded-button shadow-sm"
          >
            结算
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
