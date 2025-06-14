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

// 表单组件
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormErrorMessage,
  FormBottomLink,
  FormFooterText,
  FormSubmitButton,
  FormCheckboxContainer,
  FormCheckboxLabel
} from './Form/components';

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
  BasePage,
  
  // 表单组件
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormErrorMessage,
  FormBottomLink,
  FormFooterText,
  FormSubmitButton,
  FormCheckboxContainer,
  FormCheckboxLabel
};

// 导出Toast的便捷方法
export const SimpleToast = ToastModule.SimpleToast;
export const ToastComponent = ToastModule.ToastComponent;
export const ToastContainer = ToastModule.ToastContainer;
export const showToast = ToastModule.showToast;

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