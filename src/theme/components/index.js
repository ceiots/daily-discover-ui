/**
 * 主题系统组件统一导出文件
 * 所有主题组件应该通过这个文件导出，方便管理和使用
 */

// 导入所有组件
import BasePage from './BasePage';
import Button from './Button';
import Card from './Card';
import ScrollableSection from './ScrollableSection';
import ShopInfo from './ShopInfo';
import TopBar from './TopBar';
import NavBar from './NavBar';
import PageTitle from './PageTitle';
import { SimpleToast, showToast, Toast, ToastContainer } from './Toast';

// 从Form目录导出表单组件
export * from './Form';

// 导出基础组件
export { 
  BasePage,
  Button,
  Card,
  NavBar,
  PageTitle,
  ScrollableSection,
  ShopInfo,
  TopBar
};

// 导出Toast相关组件
export { 
  SimpleToast, 
  showToast,
  Toast,
  ToastContainer
};

// 导出所有组件作为对象，便于按需引入
const Components = {
  BasePage,
  Button,
  Card,
  NavBar,
  PageTitle,
  ScrollableSection,
  ShopInfo,
  TopBar,
  SimpleToast,
  showToast,
  Toast,
  ToastContainer
};

export default Components; 