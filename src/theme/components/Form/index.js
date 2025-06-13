/**
 * 表单组件和工具统一导出文件
 */

// 导出所有表单组件
import {
  FormContainer,
  FormFrame,
  FormGroup,
  FormLabel,
  FormInput,
  FormInputGroup,
  FormErrorMessage,
  FormSubmitButton,
  FormTitle,
  FormBrandLogo,
  FormPageContainer,
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel,
  FormBottomLink,
  FormFooterText,
  FormCodeButton,
  FormEyeIcon,
  // 旧名称组件别名，为了兼容
  Label,
  Input,
  InputGroup,
  SubmitButton,
  ErrorMessage,
  BrandLogo,
  PageContainer,
  Title,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  BottomLink,
  FooterText,
  CodeButton,
  EyeIcon
} from './components';

// 导出验证器
import * as validators from './validators';

// 导出样式
import {
  inputGroupStyle,
  checkboxContainerStyle,
  codeButtonStyle,
  disabledCodeButtonStyle
} from './styles';

// 命名导出所有组件和工具
export {
  // 新命名组件
  FormContainer,
  FormFrame,
  FormGroup,
  FormLabel,
  FormInput,
  FormInputGroup,
  FormErrorMessage,
  FormSubmitButton,
  FormTitle,
  FormBrandLogo,
  FormPageContainer,
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel,
  FormBottomLink,
  FormFooterText,
  FormCodeButton,
  FormEyeIcon,
  
  // 旧名称兼容组件
  Label,
  Input,
  InputGroup,
  SubmitButton,
  ErrorMessage,
  BrandLogo,
  PageContainer,
  Title,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  BottomLink,
  FooterText,
  CodeButton,
  EyeIcon,
  
  // 样式
  inputGroupStyle,
  checkboxContainerStyle,
  codeButtonStyle,
  disabledCodeButtonStyle,
  
  // 验证器
  validators
};

// 默认导出组件对象
const Form = {
  // 新命名组件
  Container: FormContainer,
  Frame: FormFrame,
  Group: FormGroup,
  Label: FormLabel,
  Input: FormInput,
  InputGroup: FormInputGroup,
  ErrorMessage: FormErrorMessage,
  SubmitButton: FormSubmitButton,
  Title: FormTitle,
  BrandLogo: FormBrandLogo,
  PageContainer: FormPageContainer,
  CheckboxContainer: FormCheckboxContainer,
  Checkbox: FormCheckbox,
  CheckboxLabel: FormCheckboxLabel,
  BottomLink: FormBottomLink,
  FooterText: FormFooterText,
  CodeButton: FormCodeButton,
  EyeIcon: FormEyeIcon,
  
  // 验证器
  validators
};

export default Form; 