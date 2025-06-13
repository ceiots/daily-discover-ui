/**
 * 主题系统组件统一导出文件
 * 所有主题组件应该通过这个文件导出，方便管理和使用
 */

// 基础页面布局
import BasePage from './BasePage';
export { BasePage };

// 导航组件
import NavBar from './NavBar';
import TopBar from './TopBar';
export { NavBar, TopBar };

// 表单组件
import Form, * as FormComponents from './Form';
export { Form };
export * from './Form';

// 按钮组件
import Button from './Button';
export { Button };

// 卡片组件
import Card from './Card';
export { Card };

// 商店信息组件
import ShopInfo from './ShopInfo';
export { ShopInfo };

// 布局组件
import ScrollableSection from './ScrollableSection';
export { ScrollableSection };

// 提示消息组件
import Toast from './Toast';
export { Toast };

// 导出所有组件作为对象，便于按需引入
const Components = {
  BasePage,
  NavBar,
  TopBar,
  Form,
  Button,
  Card,
  ShopInfo,
  ScrollableSection,
  Toast
};

export default Components; 