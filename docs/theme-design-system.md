# Daily Discover 主题设计系统

## 1. 目录结构

主题设计系统位于 `src/theme` 目录下，采用模块化设计，包含以下主要部分：

```
src/theme/
├── components/              # 组件目录
│   ├── Form/                # 表单组件
│   │   ├── components.js    # 表单子组件定义
│   │   ├── index.js         # 表单组件导出
│   │   ├── styles.js        # 表单样式
│   │   └── validators.js    # 表单验证工具
│   ├── Toast/               # Toast组件
│   │   ├── index.js         # Toast组件定义和导出
│   │   └── README.md        # Toast组件文档
│   ├── NavBar/              # 导航栏组件
│   │   ├── index.js         # NavBar组件定义和导出
│   │   └── README.md        # NavBar组件文档
│   ├── BasePage.js          # 基础页面布局
│   ├── Button.js            # 按钮组件
│   ├── Card.js              # 卡片组件
│   ├── ScrollableSection.js # 可滚动区域
│   ├── ShopInfo.js          # 商店信息组件
│   ├── TopBar.js            # 顶部栏组件
│   └── index.js             # 组件统一导出
├── styles/                  # 样式工具目录
│   ├── uiConstants.js       # UI常量定义
│   ├── styleUtils.js        # 样式工具函数
│   └── commonStyles.js      # 通用样式
├── tokens.js                # 设计令牌（颜色、间距、字体等）
├── GlobalStyles.js          # 全局样式定义
├── ThemeProvider.js         # 主题提供者和上下文
├── useTheme.js              # 主题钩子
└── index.js                 # 主题系统统一导出
```

## 2. 设计令牌 (Design Tokens)

设计令牌定义在 `tokens.js` 文件中，包含以下主要类别：

### 2.1 颜色系统

```javascript
export const colors = {
  // 主色调
  primary: '#5B47E8',
  primaryHover: '#4a39d1',
  
  // 中性色谱
  neutral: { ... },
  
  // 功能色彩
  success: '#52c41a',
  warning: '#f59e0b',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // 营销场景特殊色
  marketing: { ... },
  
  // 商品评分
  rating: { ... }
};
```

### 2.2 UI常量系统

为了更好地统一样式和简化维护，我们引入了UI常量系统，定义在 `styles/uiConstants.js` 文件中：

```javascript
// 颜色常量
export const UI_COLORS = {
  PRIMARY: '#5B47E8',
  PRIMARY_HOVER: '#4A3BD1',
  PRIMARY_SHADOW: 'rgba(91, 71, 232, 0.2)',
  PRIMARY_LIGHT: '#F4F2FF',
  BG_LIGHT: '#F8F8FB',
  BG_WHITE: '#FFFFFF',
  TEXT_DARK: '#1F2937',
  TEXT_MEDIUM: '#4B5563',
  TEXT_LIGHT: '#6B7280',
  ERROR: '#DC2626',
  // ...更多颜色常量
};

// 尺寸常量
export const UI_SIZES = {
  FONT_TINY: '11px',
  FONT_SMALL: '12px',
  FONT_MEDIUM: '13px',
  FONT_NORMAL: '14px',
  INPUT_HEIGHT: '40px',
  NAV_HEIGHT: '56px',
  // ...更多尺寸常量
};

// 边框常量
export const UI_BORDERS = {
  RADIUS_SMALL: '4px',
  RADIUS_MEDIUM: '6px',
  RADIUS_LARGE: '8px',
  // ...更多边框常量
};

// 阴影和动画常量
export const UI_SHADOWS = {
  LIGHT: '0 1px 6px rgba(0, 0, 0, 0.05)',
  MEDIUM: '0 4px 12px rgba(0, 0, 0, 0.08)',
  // ...更多阴影常量
};

export const UI_ANIMATIONS = {
  FAST: 'all 0.2s ease',
  NORMAL: 'all 0.3s ease',
  // ...更多动画常量
};
```

### 2.3 样式工具函数

为了简化组件样式的创建和保持一致性，我们提供了一系列样式工具函数，定义在 `styles/styleUtils.js` 文件中：

```javascript
// 创建输入框样式
export const createInputStyles = (hasError = false, customStyles = {}) => ({
  height: UI_SIZES.INPUT_HEIGHT,
  fontSize: UI_SIZES.FONT_MEDIUM,
  padding: UI_SIZES.INPUT_SPACING,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: hasError ? UI_COLORS.ERROR : UI_COLORS.BORDER_LIGHT,
  // ...更多样式属性
  ...customStyles,
});

// 创建按钮样式
export const createButtonStyles = (variant = 'primary', disabled = false, customStyles = {}) => ({
  // ...按钮样式定义
  ...customStyles,
});

// 更多样式生成函数
export const createLabelStyles = (customStyles = {}) => ({ ... });
export const createCardStyles = (elevation = 'low', customStyles = {}) => ({ ... });
export const createFormContainerStyles = (customStyles = {}) => ({ ... });
export const createFormGroupStyles = (customStyles = {}) => ({ ... });
export const createErrorStyles = (customStyles = {}) => ({ ... });
export const createCodeButtonStyles = (active = true, customStyles = {}) => ({ ... });
export const createBadgeStyles = (type = 'default', filled = false, customStyles = {}) => ({ ... });
```

### 2.4 间距系统

基于4px网格系统设计的间距令牌：

```javascript
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  // ...其他间距
};
```

### 2.5 其他设计令牌

- `typography`：字体系统
- `radius`：圆角半径
- `shadows`：阴影效果
- `breakpoints`：响应式断点
- `transitions`：过渡动画
- `borders`：边框样式

## 3. 组件使用指南

### 3.1 使用主题提供者

在应用根组件中使用 `ThemeProvider` 包裹：

```jsx
import { ThemeProvider, GlobalStyles } from './theme';

function App() {
  return (
    <ThemeProvider initialMode="light">
      <GlobalStyles />
      {/* 应用内容 */}
    </ThemeProvider>
  );
}
```

### 3.2 使用主题钩子

在组件中获取主题变量：

```jsx
import { useTheme } from '../theme';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div style={{ color: theme.colors.primary }}>
      使用主题颜色的组件
    </div>
  );
}
```

### 3.3 使用UI常量

```jsx
import { UI_COLORS, UI_SIZES } from '../theme/styles/uiConstants';

function StyledComponent() {
  return (
    <div style={{ 
      color: UI_COLORS.TEXT_MEDIUM,
      fontSize: UI_SIZES.FONT_MEDIUM
    }}>
      使用UI常量的组件
    </div>
  );
}
```

### 3.4 使用样式工具函数

```jsx
import { createInputStyles, createButtonStyles } from '../theme/styles/styleUtils';

function FormComponent() {
  const inputStyles = createInputStyles(false);
  const buttonStyles = createButtonStyles('primary');
  
  return (
    <div style={createFormContainerStyles()}>
      <label style={createLabelStyles()}>用户名</label>
      <input style={inputStyles} placeholder="请输入用户名" />
      <button style={buttonStyles}>提交</button>
    </div>
  );
}
```

### 3.5 使用表单组件

表单组件已经统一重命名为 `FormXxx` 格式，同时保留了旧的命名方式作为兼容：

```jsx
import {
  FormContainer,
  FormFrame,
  FormGroup,
  FormLabel,
  FormInput,
  FormInputGroup,
  FormErrorMessage,
  FormSubmitButton,
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel
} from '../theme/components/Form';

function LoginForm() {
  return (
    <FormContainer>
      <FormFrame>
        <form>
          <FormGroup>
            <FormLabel>用户名</FormLabel>
            <FormInput placeholder="请输入用户名" />
          </FormGroup>
          {/* 其他表单元素 */}
          <FormSubmitButton>登录</FormSubmitButton>
        </form>
      </FormFrame>
    </FormContainer>
  );
}
```

### 3.6 使用Toast组件

Toast组件用于显示简短的提示信息，有两种使用方式：

```jsx
// 方式一：简单Toast
import { SimpleToast, showToast } from '../theme/components';

function MyComponent() {
  const handleClick = () => {
    showToast('操作成功');
  };
  
  return (
    <div>
      <button onClick={handleClick}>显示提示</button>
      <SimpleToast id="toast" />
    </div>
  );
}

// 方式二：可配置Toast
import { Toast } from '../theme/components';
import { useState } from 'react';

function MyComponent() {
  const [visible, setVisible] = useState(false);
  
  return (
    <div>
      <button onClick={() => setVisible(true)}>显示提示</button>
      <Toast 
        message="操作成功" 
        type="success" 
        position="top" 
        visible={visible} 
        onClose={() => setVisible(false)} 
      />
    </div>
  );
}
```

### 3.7 使用基础页面布局

`BasePage` 组件提供了统一的页面布局：

```jsx
import { BasePage } from '../theme';

function MyPage() {
  return (
    <BasePage 
      showHeader={true}
      headerTitle="页面标题"
      padding={true}
    >
      {/* 页面内容 */}
    </BasePage>
  );
}
```

## 4. 表单组件优化

表单组件经过精心优化，采用了紧凑精致的样式：

### 4.1 尺寸调整

- 输入框高度从42px减小为40px
- 表单组间距从15px减小为14px
- 标签字体大小从13px减小为12px
- 输入框内边距优化为更加紧凑的布局

### 4.2 视觉效果增强

- 验证码按钮添加了微妙的发光效果，与主色调一致
- 输入框聚焦状态下有轻微的发光效果，增强交互反馈
- 按钮悬停和点击状态有细微的阴影和缩放变化

### 4.3 使用示例

```jsx
// 验证码输入框示例
<FormGroup>
  <FormLabel>验证码</FormLabel>
  <FormInputGroup>
    <FormInput 
      placeholder="请输入验证码" 
      value={code}
      onChange={handleCodeChange}
    />
    <FormCodeButton 
      onClick={handleGetCode} 
      disabled={countdown > 0}
      className={countdown > 0 ? "" : "code-button-active"}
    >
      {countdown > 0 ? `${countdown}秒` : "获取验证码"}
    </FormCodeButton>
  </FormInputGroup>
  {error && <FormErrorMessage>{error}</FormErrorMessage>}
</FormGroup>
```

## 5. 导航组件优化

底部导航栏组件经过重构，使用了UI常量和样式工具函数：

### 5.1 关键特性

- 使用UI_COLORS常量确保颜色一致性
- 采用更小的图标和文字尺寸，提升紧凑感
- 优化了激活状态指示器
- 统一的过渡动画效果

### 5.2 使用示例

```jsx
import { NavBar } from '../theme/components';

function Layout({ children }) {
  return (
    <div>
      <main>{children}</main>
      <NavBar />
    </div>
  );
}
```

## 6. 开发规范

为保持设计系统的一致性，开发时请遵循以下规范：

1. **使用UI常量**：所有新组件都应该使用 `uiConstants.js` 中定义的常量，而不是硬编码样式值
2. **使用样式工具函数**：使用 `styleUtils.js` 中的工具函数创建一致的样式
3. **组件命名规范**：所有表单相关组件使用 `FormXxx` 的命名方式
4. **响应式设计**：使用 `theme.breakpoints` 中定义的断点，确保在不同设备上的一致体验
5. **避免内联样式**：尽量使用 styled-components 定义样式，保持组件可复用性
6. **组件文档**：为每个组件添加 JSDoc 注释，说明组件的用途和属性

## 7. 暗色模式支持

主题系统支持亮色和暗色两种模式，可以通过 `ThemeProvider` 的 `initialMode` 属性设置初始模式：

```jsx
<ThemeProvider initialMode="dark">
  <GlobalStyles />
  {/* 应用内容 */}
</ThemeProvider>
```

在组件中可以通过 `useTheme` 钩子获取当前主题模式和切换方法：

```jsx
function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      切换至{mode === 'light' ? '暗色' : '亮色'}模式
    </button>
  );
}
```

## 8. 样式工具函数详解

样式工具函数是一组用于生成一致样式的函数，可以极大简化组件的样式定义。以下是主要工具函数的详细说明：

### 8.1 createInputStyles

生成输入框样式，支持错误状态和自定义样式。

```jsx
// 基本用法
import { createInputStyles } from '../theme/styles/styleUtils';

const normalInput = createInputStyles(); // 正常状态
const errorInput = createInputStyles(true); // 错误状态
const customInput = createInputStyles(false, {
  height: '36px',
  fontSize: '14px'
}); // 自定义样式
```

### 8.2 createButtonStyles

生成按钮样式，支持多种变体、禁用状态和自定义样式。

```jsx
// 按钮变体
import { createButtonStyles } from '../theme/styles/styleUtils';

const primaryButton = createButtonStyles('primary');
const secondaryButton = createButtonStyles('secondary');
const outlineButton = createButtonStyles('outline');
const textButton = createButtonStyles('text');
const disabledButton = createButtonStyles('primary', true);
```

### 8.3 createCodeButtonStyles

生成验证码按钮样式，支持活跃状态和自定义样式。

```jsx
// 验证码按钮
import { createCodeButtonStyles } from '../theme/styles/styleUtils';

const activeCodeButton = createCodeButtonStyles(true);
const inactiveCodeButton = createCodeButtonStyles(false);
const customCodeButton = createCodeButtonStyles(true, {
  minWidth: '120px',
  borderRadius: '20px'
});
```

### 8.4 其他样式工具函数

```jsx
import {
  createLabelStyles,
  createCardStyles,
  createFormContainerStyles,
  createFormGroupStyles,
  createErrorStyles,
  createBadgeStyles
} from '../theme/styles/styleUtils';

// 标签样式
const label = createLabelStyles();

// 卡片样式 - 三种不同阴影级别
const lowCard = createCardStyles('low');
const mediumCard = createCardStyles('medium');
const highCard = createCardStyles('high');

// 表单容器和表单组样式
const formContainer = createFormContainerStyles();
const formGroup = createFormGroupStyles();

// 错误消息样式
const errorMessage = createErrorStyles();

// 徽章样式 - 不同类型和填充状态
const defaultBadge = createBadgeStyles('default');
const primaryBadge = createBadgeStyles('primary');
const filledSuccessBadge = createBadgeStyles('success', true);
```

## 9. 项目最佳实践

1. **组件复用**：优先使用设计系统中的组件，避免重复开发
2. **一致性**：保持UI的一致性，使用统一的颜色、间距和字体
3. **表单验证**：使用 `Form.validators` 进行表单字段验证
4. **样式重用**：使用 `styleUtils` 生成常用样式，减少重复代码
5. **适配性**：使用UI常量和响应式设计，确保在不同设备上的良好体验
6. **性能优化**：避免不必要的重新渲染，合理使用React的性能优化技术

通过遵循本文档的指导，可以确保应用程序的UI设计一致、高效且易于维护。 