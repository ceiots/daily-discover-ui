/**
 * 主题系统入口文件
 * 统一导出主题相关的组件、钩子、样式和工具
 */

// 导出组件
import * as components from './components';
export { components };

// 导出常用组件，方便直接引用
export { 
  Button, 
  Text, 
  PageTitle,
  Card,
  InfoCard,
  ShopInfo,
  ScrollableSection,
  NavBar,
  TopBar,
  Toast,
  SimpleToast,
  ToastComponent,
  showToast,
  BasePage
} from './components';

// 导出钩子
import * as hooks from './hooks';
export { hooks };

// 导出常用钩子，方便直接引用
export { 
  useToast,
  useNavBar
} from './hooks';

// 导出样式工具
import * as styles from './styles';
export { styles };

// 导出设计令牌
import tokens from './tokens';
export { tokens };

// 导出主题上下文
import ThemeProvider from './ThemeProvider';
import { useTheme } from './useTheme';
export { ThemeProvider, useTheme };

// 导出工具
import * as utils from './utils';
export { utils };

// 导出全局样式
import GlobalStyles from './GlobalStyles';
export { GlobalStyles };

// 默认导出
export default {
  components,
  hooks,
  styles,
  tokens,
  ThemeProvider,
  useTheme,
  utils,
  GlobalStyles
}; 
