/**
 * 主题组件索引文件
 * 导出所有主题相关的组件，按原子设计分层
 */

// 导出原子组件
export * from './atoms';

// 导出分子组件
export * from './molecules';

// 导出有机体组件
// export * from './organisms';

// 导出模板组件
// export * from './templates';

// 导出现有组件
export { default as BasePage } from './BasePage';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Form } from './Form';
export { default as NavBar } from './NavBar';
export { default as PageTitle } from './PageTitle';
export { default as ScrollableSection } from './ScrollableSection';
export { default as ShopInfo } from './ShopInfo';
export { default as Toast } from './Toast';
export { default as TopBar } from './TopBar';

// 创建组件对象，便于整体引入
import * as atoms from './atoms';
import * as molecules from './molecules';
// import * as organisms from './organisms';
// import * as templates from './templates';

import BasePage from './BasePage';
import Button from './Button';
import Card from './Card';
import Form from './Form';
import NavBar from './NavBar';
import PageTitle from './PageTitle';
import ScrollableSection from './ScrollableSection';
import ShopInfo from './ShopInfo';
import Toast from './Toast';
import TopBar from './TopBar';

// 组件对象，包含所有组件
const components = {
  // 原子设计分层
  atoms,
  molecules,
  // organisms,
  // templates,
  
  // 现有组件
  BasePage,
  Button,
  Card,
  Form,
  NavBar,
  PageTitle,
  ScrollableSection,
  ShopInfo,
  Toast,
  TopBar
};

export default components; 