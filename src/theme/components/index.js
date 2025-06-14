/**
 * 主题组件导出索引
 * 按原子设计分层导出组件
 */

// 原子(Atoms)级别组件
import Button from './atoms/Button';
import Text from './atoms/Text';
import PageTitle from './atoms/PageTitle';

// 分子(Molecules)级别组件
import Card from './molecules/Card';
import InfoCard from './molecules/InfoCard';
import ShopInfo from './molecules/ShopInfo';
import ScrollableSection from './molecules/ScrollableSection';

// 有机体(Organisms)级别组件
import NavBar from './organisms/NavBar';
import TopBar from './organisms/TopBar';
import * as ToastModule from './organisms/Toast';

// 模板(Templates)级别组件
import BasePage from './templates/BasePage';

// 导出所有组件
export {
  // 原子组件
  Button,
  Text,
  PageTitle,
  
  // 分子组件
  Card,
  InfoCard,
  ShopInfo,
  ScrollableSection,
  
  // 有机体组件
  NavBar,
  TopBar,
  
  // Toast组件的各个导出
  ToastModule as Toast,
  
  // 模板组件
  BasePage
};

// 单独导出Toast组件内部接口，方便直接使用
export const { SimpleToast, Toast: ToastComponent, showToast, ToastContainer } = ToastModule;

// 默认导出所有组件
export default {
  // 原子组件
  Button,
  Text,
  PageTitle,
  
  // 分子组件
  Card,
  InfoCard,
  ShopInfo,
  ScrollableSection,
  
  // 有机体组件
  NavBar,
  TopBar,
  Toast: ToastModule,
  
  // 模板组件
  BasePage
}; 