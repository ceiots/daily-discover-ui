/**
 * 主题组件导出索引
 * 按原子设计分层导出组件
 */

// 原子(Atoms)级别组件
import Button from './atoms/Button';
import Text from './atoms/Text';
import PageTitle from './atoms/PageTitle';

// Import form components from Form/components.js instead of atoms directory
import {
  FormBrandLogo,
  FormBrandText,
  FormInput,
  FormLabel,
  FormSubmitButton,
  FormBottomLink,
  FormCheckbox,
  FormEyeIcon,
  FormErrorMessage,
  FormGroup,
  FormInputGroup,
  FormCheckboxContainer,
  FormContainer,
  FormFrame,
  FormHeader,
  FormFooterText,
  FormTitle,
  FormLoader,
  FormCodeButton,
  FormCheckboxLabel
} from './Form/components';

// 分子(Molecules)级别组件
import Card from './molecules/Card';
import InfoCard from './molecules/InfoCard';
import ShopInfo from './molecules/ShopInfo';
import ScrollableSection from './molecules/ScrollableSection';

// 有机体(Organisms)级别组件
import NavBar from './organisms/NavBar';
import TopBar from './organisms/TopBar';
import { ToastContainer, showToast, SimpleToast, Toast } from './organisms/Toast';

// 模板(Templates)级别组件
import BasePage from './templates/BasePage';

// 导出所有组件
export {
  // 原子组件
  Button,
  Text,
  PageTitle,
  FormBrandLogo,
  FormBrandText,
  FormInput,
  FormLabel,
  FormSubmitButton,
  FormBottomLink,
  FormCheckbox,
  FormEyeIcon,
  FormErrorMessage,
  FormCodeButton,
  FormCheckboxLabel,
  
  // 分子组件
  Card,
  InfoCard,
  ShopInfo,
  ScrollableSection,
  FormGroup,
  FormInputGroup,
  FormCheckboxContainer,
  FormContainer,
  FormFrame,
  FormHeader,
  FormFooterText,
  FormTitle,
  FormLoader,
  
  // 有机体组件
  NavBar,
  TopBar,
  ToastContainer,
  showToast,
  SimpleToast,
  Toast,
  
  // 模板组件
  BasePage,
};

// 默认导出所有组件 - 可选，但为保持一致性
export default {
  // 原子组件
  Button,
  Text,
  PageTitle,
  FormBrandLogo,
  FormBrandText,
  FormInput,
  FormLabel,
  FormSubmitButton,
  FormBottomLink,
  FormCheckbox,
  FormEyeIcon,
  FormErrorMessage,
  FormCodeButton,
  FormCheckboxLabel,
  
  // 分子组件
  Card,
  InfoCard,
  ShopInfo,
  ScrollableSection,
  FormGroup,
  FormInputGroup,
  FormCheckboxContainer,
  FormContainer,
  FormFrame,
  FormHeader,
  FormFooterText,
  FormTitle,
  FormLoader,
  
  // 有机体组件
  NavBar,
  TopBar,
  ToastContainer,
  showToast,
  SimpleToast,
  Toast,
  
  // 模板组件
  BasePage,
};