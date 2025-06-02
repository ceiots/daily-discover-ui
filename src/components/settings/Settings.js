import React, { useState } from "react";
import { useAuth } from "../../App";
import instance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { BasePage } from "../../theme";

const Settings = () => {
  const { refreshUserInfo } = useAuth();
  const navigate = useNavigate();

  // 账户设置状态
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 支付密码状态
  const [showPaymentPassword, setShowPaymentPassword] = useState(false);
  const [paymentPasswordStatus, setPaymentPasswordStatus] = useState("");
  const [paymentPasswordError, setPaymentPasswordError] = useState("");

  // 修改账户密码
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (newPassword.length < 6) {
      setError("密码长度不能少于6位");
      return;
    }

    const userId = localStorage.getItem("userId");
    try {
      const response = await instance.post(
        "/user/change-password",
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            userId: userId,
          },
        }
      );
      setSuccess("密码修改成功");
      setError("");
      // 清空输入框
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // 3秒后隐藏修改密码表单
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.response?.data || "修改密码失败");
    }
  };

  // 跳转到支付密码设置页面
  const handleNavigateToPaymentPassword = () => {
    navigate("/payment-password-setting");
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await instance.post("/user/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 清除本地存储
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userInfo");
      // 刷新用户信息
      refreshUserInfo();
      // 跳转到首页
      navigate("/");
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  return (
    <BasePage
      title="设置"
      showHeader={true}
      headerLeft={
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <i className="ri-arrow-left-s-line text-xl mr-2"></i>
          <span>返回</span>
        </button>
      }
      headerTitle="设置"
    >
      <div className="p-4 bg-gray-50 min-h-screen">
        {/* 顶部导航 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <i className="ri-arrow-left-s-line text-xl mr-2"></i>
              <span>返回</span>
            </button>
          </div>
        </div>

        {/* 账户设置卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">账户设置</h3>
            <div className="border-t border-gray-100"></div>
          </div>

          {/* 修改密码选项 */}
          <div className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer py-2"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              <div className="flex items-center">
                <i className="ri-lock-line text-gray-500 mr-3"></i>
                <span className="text-base">修改密码</span>
              </div>
              <i
                className={`ri-arrow-${
                  showChangePassword ? "up" : "down"
                }-s-line text-gray-400`}
              ></i>
            </div>

            {showChangePassword && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div>
                  <input
                    type="password"
                    placeholder="请输入旧密码"
                    className="w-full p-2 border rounded"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="请输入新密码"
                    className="w-full p-2 border rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="请确认新密码"
                    className="w-full p-2 border rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && (
                  <div className="text-green-500 text-sm">{success}</div>
                )}
                <button
                  className="w-full bg-primary text-white py-2 rounded"
                  onClick={handleChangePassword}
                >
                  确认修改
                </button>
              </div>
            )}
          </div>

          {/* 个人资料选项 */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer py-2"
              onClick={() => navigate("/settings/profile")}
            >
              <div className="flex items-center">
                <i className="ri-user-3-line text-gray-500 mr-3"></i>
                <span className="text-base">个人资料</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* 支付安全卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">支付安全</h3>
            <div className="border-t border-gray-100"></div>
          </div>

          {/* 支付密码选项 */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer py-2"
              onClick={handleNavigateToPaymentPassword}
            >
              <div className="flex items-center">
                <i className="ri-lock-password-line text-gray-500 mr-3"></i>
                <span className="text-base">支付密码</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* 退出登录按钮 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <button
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium"
            onClick={handleLogout}
          >
            退出登录
          </button>
        </div>
      </div>
    </BasePage>
  );
};

export default Settings;
