/**
 * 主题系统统一导出
 * 此文件导出所有主题相关组件、钩子、工具和样式
 */

// 组件导出
import { Button, Text, PageTitle } from './components/atoms';
import { Card, ShopInfo, InfoCard } from './components/molecules';
import { NavBar, TopBar } from './components/organisms';
import { BasePage } from './components/templates';

// 钩子导出
import useTheme from './useTheme';
import { useToast } from './hooks';

// 样式导出
import ThemeProvider from './ThemeProvider';
import GlobalStyles from './GlobalStyles';
import * as tokens from './tokens';
import * as commonStyles from './styles/commonStyles';
import * as styleUtils from './styles/styleUtils';
import { UI_COLORS, UI_SIZES, UI_SPACING } from './styles/uiConstants';

// 工具导出
import { 
  useComponentPerformance, 
  measureFunctionPerformance 
} from './utils/performance';
import { renderWithTheme } from './utils/testing';
import { trackEvent, trackPageView } from './utils/analytics';

// 组件导出
export {
  // 原子组件
  Button,
  Text,
  PageTitle,
  
  // 分子组件
  Card,
  ShopInfo,
  InfoCard,
  
  // 有机体组件
  NavBar,
  TopBar,
  
  // 模板组件
  BasePage,
  
  // 钩子
  useTheme,
  useToast,
  
  // 样式
  ThemeProvider,
  GlobalStyles,
  tokens,
  commonStyles,
  styleUtils,
  UI_COLORS,
  UI_SIZES,
  UI_SPACING,
  
  // 工具
  useComponentPerformance,
  measureFunctionPerformance,
  renderWithTheme,
  trackEvent,
  trackPageView
};

// 默认导出主题提供者，便于快速集成
export default ThemeProvider; 
