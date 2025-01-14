import React from "react";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { orderId } = useParams();

  // 示例订单数据
  const order = {
    id: orderId,
    amount: "¥2,399.00",
    date: "2024-01-18",
    items: [
      { name: "iPhone 15 Pro Max", price: "¥9,999", quantity: 1 },
      { name: "Apple Watch Series 9", price: "¥3,199", quantity: 1 },
    ],
  };

  return (
    <div >
      <div className="nav-bar px-4">
        <i className="fas fa-arrow-left text-gray-600"></i>
        <span className="ml-4 text-xs font-medium">订单详情</span>
      </div>
      <div className="content">
        <div className="bg-primary text-white p-3">
          <div className="flex items-center">
            <i className="fas fa-truck text-sm"></i>
            <span className="ml-2 text-xs">运输中</span>
          </div>
          <div className="mt-1 text-xs opacity-90">
            韵达快递：YD895674231568
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="text-xs">杭州市西湖区文二路配送点 已签收</div>
              <div className="text-xs opacity-80 mt-0.5">2023-11-24 14:30</div>
            </div>
            <i className="fas fa-chevron-right text-sm"></i>
          </div>
        </div>
        <div className="bg-white p-4 mt-2">
          <div className="flex items-start">
            <i className="fas fa-map-marker-alt text-primary mt-1"></i>
            <div className="ml-2 flex-1">
              <div className="flex justify-between">
                <span className="font-medium text-xs">陈晓明</span>
                <span className="text-gray-600 text-xs">138****5678</span>
              </div>
              <div className="text-gray-600 text-xs mt-1">
                浙江省杭州市西湖区文二路 478 号智慧产业创业园 B 座 3 层 301 室
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 mt-2">
          <div className="flex items-center text-xs text-gray-600">
            <i className="far fa-file-alt"></i>
            <span className="ml-2">订单编号</span>
            <span className="ml-auto">202311240038576</span>
          </div>
          <div className="flex items-center mt-3 text-xs text-gray-600">
            <i className="far fa-clock"></i>
            <span className="ml-2">下单时间</span>
            <span className="ml-auto">2023-11-23 15:30:25</span>
          </div>
          <div className="flex items-center mt-3 text-xs text-gray-600">
            <i className="fas fa-credit-card"></i>
            <span className="ml-2">支付方式</span>
            <span className="ml-auto">支付宝</span>
          </div>
          <div className="flex items-center mt-3 text-xs text-gray-600">
            <i className="fas fa-file-invoice"></i>
            <span className="ml-2">发票信息</span>
            <div className="ml-auto flex items-center text-primary">
              <span>电子普通发票</span>
              <i className="fas fa-chevron-right ml-1"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 mt-2">
          <div className="flex">
            <img
              src="https://ai-public.mastergo.com/ai/img_res/e5cd24b93b4e48fcdaf882f9b5c4e6d5.jpg"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-xs">
                新款无线蓝牙耳机 Pro Max
              </div>
              <div className="text-xs text-gray-500 mt-1">
                颜色：星空黑 | 规格：标准版
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">¥ 999.00</span>
                <span className="text-gray-500 text-xs">x1</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 mt-2">
          <div className="flex justify-between text-xs mb-3">
            <span>商品总价</span>
            <span>¥ 999.00</span>
          </div>
          <div className="flex justify-between text-xs mb-3">
            <span>运费</span>
            <span>¥ 0.00</span>
          </div>
          <div className="flex justify-between text-xs mb-3">
            <span>优惠券</span>
            <span className="text-secondary">-¥ 50.00</span>
          </div>
          <div className="h-[1px] bg-gray-100 my-3"></div>
          <div className="flex justify-between">
            <span className="text-xs">实付金额</span>
            <span className="text-base font-medium text-primary">¥ 949.00</span>
          </div>
        </div>
      </div>
      <div className="bottom-buttons flex mt-5">
        <button className="flex-1 py-2 border border-gray-300 text-gray-600 mr-3 !rounded-button text-xs">
          查看物流
        </button>
        <button className="flex-1 py-2 border border-gray-300 text-gray-600 mr-3 !rounded-button text-xs  text-primary">
          确认收货
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
