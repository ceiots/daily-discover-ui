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
│   ├── BasePage.js          # 基础页面布局
│   ├── Button.js            # 按钮组件
│   ├── Card.js              # 卡片组件
│   ├── NavBar.js            # 导航栏组件
│   ├── ScrollableSection.js # 可滚动区域
│   ├── ShopInfo.js          # 商店信息组件
│   ├── Toast.js             # 提示消息组件
│   ├── TopBar.js            # 顶部栏组件
│   └── index.js             # 组件统一导出
├── tokens.js                # 设计令牌（颜色、间距、字体等）
├── ThemeProvider.js         # 主题提供者和上下文
├── useTheme.js              # 主题钩子（兼容导出）
└── index.js                 # 主题系统统一导出
```

## 2. 设计令牌 (Design Tokens)

设计令牌定义在 `tokens.js` 文件中，包含以下主要类别：

### 2.1 颜色系统

```javascript
export const colors = {
  // 主色调
  primary: '#5B47E8',
  secondary: '#766DE8',
  
  // 中性色谱
  neutral: { ... },
  
  // 功能色彩
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // 营销场景特殊色
  marketing: { ... },
  
  // 商品评分
  rating: { ... }
};
```

### 2.2 间距系统

基于4px网格系统设计的间距令牌：

```javascript
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  // ...其他间距
};
```

### 2.3 其他设计令牌

- `typography`：字体系统
- `shadows`：阴影效果
- `breakpoints`：响应式断点
- `radius`：圆角半径
- `transitions`：过渡动画
- `borders`：边框样式
- `cardPresets`：卡片预设样式

## 3. 组件使用指南

### 3.1 使用主题提供者

在应用根组件中使用 `ThemeProvider` 包裹：

```jsx
import { ThemeProvider } from './theme';

function App() {
  return (
    <ThemeProvider initialMode="light">
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
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.colors.primary }}>
      使用主题颜色的组件
    </div>
  );
}
```

### 3.3 使用表单组件

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

### 3.4 使用基础页面布局

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

## 4. 样式工具函数

`styleUtils` 提供了常用的样式生成工具：

```javascript
import { styleUtils } from '../theme';

// 创建渐变背景
const gradientBackground = styleUtils.gradient(colors.primary, colors.secondary);

// 创建阴影效果
const cardShadow = styleUtils.shadow('md');

// 创建边框样式
const buttonBorder = styleUtils.createBorder('1px', 'solid', colors.primary);

// 创建按钮样式
const buttonStyle = styleUtils.createButtonStyle('primary', 'medium', true);
```

## 5. 主题扩展与自定义

### 5.1 添加新组件

在 `components` 目录下创建新组件文件，并在 `components/index.js` 中导出：

```javascript
// components/MyComponent.js
import React from 'react';
import styled from 'styled-components';
import { theme } from '../tokens';

export const MyComponent = styled.div`
  color: ${theme.colors.primary};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.radius.md};
`;

export default MyComponent;

// components/index.js
export { default as MyComponent } from './MyComponent';
```

### 5.2 扩展设计令牌

在项目扩展时，可以在 `tokens.js` 中添加新的设计令牌：

```javascript
// 添加新的颜色类别
export const colors = {
  // 现有颜色...
  
  // 新增图表颜色
  chart: {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f59e0b',
    red: '#ef4444'
  }
};

// 添加新的动画效果
export const animations = {
  fadeIn: 'fadeIn 0.3s ease-in-out',
  slideIn: 'slideIn 0.3s ease-out',
  pulse: 'pulse 1.5s infinite'
};
```

## 6. 开发规范

为保持设计系统的一致性，开发时请遵循以下规范：

1. **组件命名规范**：所有表单相关组件使用 `FormXxx` 的命名方式
2. **样式优先使用设计令牌**：不要硬编码颜色、间距等值，而是使用 `theme` 中的设计令牌
3. **响应式设计**：使用 `theme.breakpoints` 中定义的断点，确保在不同设备上的一致体验
4. **避免内联样式**：尽量使用 styled-components 定义样式，保持组件可复用性
5. **组件文档**：为每个组件添加 JSDoc 注释，说明组件的用途和属性

## 7. 暗色模式支持

主题系统支持亮色和暗色两种模式，可以通过 `ThemeProvider` 的 `initialMode` 属性设置初始模式：

```jsx
<ThemeProvider initialMode="dark">
  {/* 应用内容 */}
</ThemeProvider>
```

在组件中可以通过 `useTheme` 钩子获取当前主题模式和切换方法：

```jsx
function ThemeToggle() {
  const theme = useTheme();
  
  return (
    <button onClick={theme.toggleMode}>
      切换至{theme.mode === 'light' ? '暗色' : '亮色'}模式
    </button>
  );
}
```

## 8. 使用建议

1. **组件复用**：优先使用设计系统中的组件，避免重复开发
2. **一致性**：保持UI的一致性，使用统一的颜色、间距和字体
3. **表单验证**：使用 `Form.validators` 进行表单字段验证
4. **样式重用**：使用 `styleUtils` 生成常用样式，减少重复代码
5. **适配性**：使用响应式设计，确保在不同设备上的良好体验

通过遵循本文档的指导，可以确保应用程序的UI设计一致、高效且易于维护。 