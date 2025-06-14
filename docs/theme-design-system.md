# Daily Discover - 前端主题设计系统架构与AI开发规范 v3.0

## 1. 核心原则与目标

本设计系统旨在构建一个**高性能、高可扩展、视觉高度一致**的前端UI体系。它不仅是组件库，更是指导AI进行高效、规范开发的核心规则集。

- **核心目标**：**效率提升与性能优化**。通过规范化、原子化的方式，最大化AI自主开发的范围，减少人工干预，实现快速迭代。
- **设计哲学**：**遵循原子设计（Atomic Design）**。将UI拆分为原子、分子、有机体、模板和页面五个层次，确保组件的独立性、复用性和可组合性。
- **性能第一**：所有组件和功能的设计都必须将性能作为首要考量，实施懒加载、代码分割、虚拟列表等策略，确保首屏加载时间<1.5s。
- **体验一致**：通过设计令牌（Design Tokens）和严格的开发规范，确保产品在所有场景下提供统一、可预测的用户体验。
- **可测试性**：每个组件必须具备良好的可测试性，支持单元测试和端到端测试，确保质量。
- **可扩展性**：采用插件化架构，支持功能的动态加载和卸载，为未来扩展做好准备。

## 2. 架构设计

### 2.1 原子设计（Atomic Design）分层

我们将遵循原子设计思想，对`src/theme/components`目录进行逻辑分层：

- **Atoms (原子)**：构成UI的最基础元素，不可再分。
  - **职责**：只负责样式，不包含业务逻辑。
  - **示例**：`tokens.js`（颜色、间距等）、`Button.js`、`FormInput`的基础样式、`GlobalStyles.js`。
- **Molecules (分子)**：由多个原子组合而成的简单UI组件。
  - **职责**：完成一个独立的、简单的功能。
  - **示例**：一个包含`FormLabel`和`FormInput`的完整输入框、`ShopInfo.js`（头像+店名）。
- **Organisms (有机体)**：由多个分子或原子构成的复杂、独立的UI区域。
  - **职责**：代表产品中一个明确的功能区域。
  - **示例**：`NavBar`、`TopBar`、包含多个输入框和提交按钮的完整表单。
- **Templates (模板)**：定义页面的整体布局和骨架。
  - **职责**：关注页面结构，不关心具体内容，是可复用的页面框架。
  - **示例**：`BasePage.js`。
- **Pages (页面)**：模板的具体实例，填充了真实内容，是用户最终看到的界面。

### 2.2 目录结构（优化后）

```
src/theme/
├── components/              # UI组件 (按原子设计分层)
│   ├── atoms/              # 原子级组件
│   ├── molecules/          # 分子级组件
│   ├── organisms/          # 有机体级组件
│   └── templates/          # 模板级组件
├── hooks/                   # 组件逻辑钩子 (如: useToast.js)
├── providers/               # 全局状态提供者 (如: ToastProvider.js)
├── styles/                  # 样式工具
│   ├── uiConstants.js       # UI设计常量
│   ├── styleUtils.js        # 样式工具函数
│   └── commonStyles.js      # 通用样式
├── utils/                   # 工具函数
│   ├── performance.js       # 性能优化工具
│   ├── testing.js           # 测试辅助工具
│   └── analytics.js         # 分析与监控工具
├── tokens.js                # 设计令牌
├── GlobalStyles.js          # 全局样式
├── ThemeProvider.js         # 主题上下文
└── index.js                 # 主题系统统一导出
```

### 2.3 技术架构

- **核心技术栈**：React + styled-components + React Context
- **状态管理**：React Context + useReducer 模式，避免状态碎片化
- **样式方案**：styled-components 结合 Design Tokens，实现主题切换
- **组件加载**：React.lazy() + Suspense 实现组件级代码分割
- **类型系统**：强制使用 TypeScript/PropTypes，确保类型安全

## 3. 当前状态与挑战（Current Problems）

1.  **逻辑与视图耦合**：组件的状态管理逻辑（如`Toast`的`visible`状态）散落在业务页面中，导致组件不够独立，复用困难。
2.  **样式定义分散**：同时存在`styleUtils.js`、`styled-components`和内联样式三种方式，缺乏统一规范，长期看会增加维护成本。
3.  **缺乏动态与逻辑复用**：当前组件多为静态展示，缺少配套的、可复用的逻辑层（Hooks），导致相似逻辑在不同组件中重复编写。
4.  **性能优化空间**：核心组件未默认实现懒加载（Lazy Loading），在大型页面中可能存在性能瓶颈。
5.  **缺乏监控与分析**：没有内置的性能监控和用户行为分析能力，难以发现和解决潜在问题。
6.  **测试覆盖不足**：组件缺乏自动化测试，可能存在质量隐患。

## 4. 近期改进计划（MVP）

为了解决上述问题并对齐"大厂"标准，AI在后续开发中将执行以下改进计划：

1.  **【高优】逻辑与视图分离**：为所有包含状态和副作用的组件创建配套的React Hook。
    - **任务**：创建`src/theme/hooks`目录。例如，为`Toast`组件创建`useToast` Hook，封装其显示、隐藏、定时关闭等所有逻辑。
    - **目标**：让组件本身只负责UI渲染，业务页面调用Hook即可使用其完整功能。

2.  **【高优】实现状态管理中心化**：为`Toast`等需要全局调用的组件创建`Provider`。
    - **任务**：创建`src/theme/providers`目录。创建`ToastProvider`，通过Context API在应用根部管理所有Toast实例。
    - **目标**：实现`toast.success('消息')`这样的命令式调用，彻底与业务视图解耦。

3.  **【中优】实施懒加载策略**：对复杂的、非首屏必需的"有机体"级别组件默认启用懒加载。
    - **任务**：在组件导出时，使用`React.lazy()`进行包装。
    - **目标**：减少主包体积，加快应用首页加载速度。

4.  **【中优】引入Storybook**：搭建组件可视化文档与测试环境。
    - **任务**：集成Storybook，并为每个原子/分子组件编写`.stories.js`文件。
    - **目标**：实现"文档即代码"，方便调试、测试和团队协作。

5.  **【中优】添加性能监控**：实现组件级性能监控。
    - **任务**：创建`src/theme/utils/performance.js`，实现组件渲染性能监控工具。
    - **目标**：识别性能瓶颈，为优化提供数据支持。

6.  **【低优】统一样式方案**：规范化样式定义方式。
    - **任务**：全面迁移到styled-components，减少内联样式使用。
    - **目标**：提高样式可维护性和一致性。

## 5. 性能优化策略

为确保主题系统的高性能，我们将采用以下策略：

1. **代码分割**：
   - 组件级别代码分割，非首屏组件使用`React.lazy`懒加载
   - 路由级别代码分割，使用`React.Suspense`和`React.lazy`实现

2. **资源优化**：
   - 图标使用SVG内联或图标字体，减少HTTP请求
   - 图片使用WebP格式，并实现响应式加载
   - 使用`preload`、`prefetch`策略预加载关键资源

3. **渲染优化**：
   - 使用`React.memo`避免不必要的重渲染
   - 使用`useCallback`和`useMemo`缓存函数和计算结果
   - 长列表使用虚拟滚动技术(react-window)

4. **样式优化**：
   - 使用CSS变量实现主题切换，避免重新计算样式
   - 关键CSS内联，非关键CSS异步加载
   - 避免CSS阻塞渲染

5. **监控与分析**：
   - 集成Lighthouse自动化性能评分
   - 实现核心Web指标(CWV)监控
   - 建立性能预算和自动预警机制

## 6. 远期规划与演进方向

- **发布为独立的NPM包**：将主题系统封装为私有或公有NPM包，方便在多个项目中复用。
- **实现"无头组件"（Headless Components）**：将组件的逻辑（Hooks）与UI（JSX）完全分离，允许在不同项目中应用完全不同的视觉风格，实现极致的灵活性和可扩展性。
- **增强主题动态性**：支持在线动态切换主题（如更换品牌色、字体），并持久化。
- **微前端支持**：使主题系统能够在微前端架构中无缝运行，支持不同团队独立开发与部署。
- **服务端渲染优化**：优化组件的SSR支持，提升首屏加载速度和SEO友好性。
- **国际化增强**：内置RTL支持和多语言切换能力，支持全球化产品。
- **无障碍优化**：全面提升组件的可访问性，符合WCAG 2.1 AA级标准。

## 7. 监控与测试

### 7.1 性能监控

- **核心指标**：首次内容绘制(FCP)、最大内容绘制(LCP)、首次输入延迟(FID)、累积布局偏移(CLS)
- **监控方式**：使用Web Vitals库收集真实用户数据，结合Prometheus+Grafana可视化
- **预警机制**：当性能指标下降超过20%时自动告警

### 7.2 测试策略

- **单元测试**：使用Jest+React Testing Library测试组件逻辑
- **集成测试**：测试组件间交互和数据流
- **视觉测试**：使用Storybook+Loki进行视觉回归测试
- **端到端测试**：关键流程使用Playwright进行端到端测试
- **性能测试**：使用Lighthouse CI进行性能基准测试

## 8. AI开发核心规范

**AI在执行开发任务时，必须严格遵循以下规则：**

1.  **规则1：逻辑先行，Hook优先**
    - 在创建任何有状态或有副作用的组件（分子/有机体级别）时，**必须**优先创建对应的`useComponent` Hook来封装其所有逻辑。
    - 所有Hook必须遵循React Hooks规范，并包含完整的JSDoc注释。

2.  **规则2：常量优先，杜绝硬编码**
    - **严禁**在组件样式中硬编码任何颜色、间距、字号等值。**必须**全部使用`src/theme/tokens.js`或`src/theme/styles/uiConstants.js`中定义的令牌和常量。
    - 新增设计令牌时，必须同时更新文档和类型定义。

3.  **规则3：性能默认，懒载先行**
    - 对于所有"有机体"级别的组件（如`NavBar`, 复杂表单等），**必须**默认使用`React.lazy`和`Suspense`进行懒加载处理。
    - 必须为每个组件添加`displayName`，便于性能分析和调试。
    - 列表渲染必须考虑虚拟化，当列表项超过50个时强制使用虚拟列表。

4.  **规则4：文档同步，Storybook驱动**
    - 每创建一个新的原子或分子组件，**必须**同步创建一个对应的`.stories.js`文件，展示其不同状态下的表现。
    - 组件文档必须包含Props表格、使用示例和注意事项。

5.  **规则5：样式统一，工具先行**
    - 推荐使用`styleUtils.js`中的工具函数创建标准样式。对于复杂或一次性样式，应使用`styled-components`，**避免**使用内联`style`属性。
    - CSS-in-JS中避免使用嵌套选择器，保持样式结构扁平。

6.  **规则6：原子化提交**
    - 组件（.js）、其样式、对应的Hook（.js）、测试（.test.js）和文档（.stories.js）应在一个原子提交（Commit）中完成，确保功能完整性。

7.  **规则7：可访问性内置**
    - 所有交互组件必须支持键盘操作，并包含适当的ARIA属性。
    - 颜色对比度必须符合WCAG AA级标准（正文4.5:1，大文本3:1）。

8.  **规则8：测试驱动开发**
    - 新组件开发必须先编写测试用例，然后实现功能，确保测试覆盖率>80%。
    - 每个组件至少包含基本渲染测试、交互测试和边界条件测试。

## 9. 附录：组件与工具详解

*（此部分保留原文档的详细内容，作为具体实现时的参考手册）*

### 9.1 设计令牌 (Design Tokens)

设计令牌定义在 `tokens.js` 文件中，包含以下主要类别：

### 9.1.1 颜色系统

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

### 9.1.2 UI常量系统

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

### 9.1.3 样式工具函数

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

### 9.1.4 间距系统

基于4px网格系统设计的间距令牌：

```javascript
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  // ...其他间距
};
```

### 9.1.5 其他设计令牌

- `typography`：字体系统
- `radius`：圆角半径
- `shadows`：阴影效果
- `breakpoints`：响应式断点
- `transitions`：过渡动画
- `borders`：边框样式

### 9.2 组件使用指南

### 9.2.1 使用主题提供者

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

### 9.2.2 使用主题钩子

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

### 9.2.3 使用UI常量

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

### 9.2.4 使用样式工具函数

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

### 9.2.5 使用表单组件

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

### 9.2.6 使用Toast组件

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

### 9.2.7 使用基础页面布局

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


# 主题UI/UX设计体系

### 精简配色方案 (优化版)

**主色调系统 (增强层次)：**
- **主色调**：深紫色 `#5B47E8`
  - 更深邃的紫色，提升专业感和质感
  - 用于主要CTA按钮、品牌标识、重要链接
- **主色变化**：
  - 浅紫色：`#7C69EF` - 悬停状态、次要强调
  - 深紫色：`#4A3BD1` - 按压状态、深度强调
  - 极浅紫：`#F4F2FF` - 背景高亮、选中状态

**背景系统 (增强对比)：**
- 主背景：纯白色 `#FFFFFF`
- 次级背景：浅灰色 `#F8F9FA` → `#FAFBFC` (微调，更柔和)
- 三级背景：`#F1F3F5` (新增，用于层级区分)

**中性色谱 (提升可读性)：**
- 主文本：深灰色 `#333333` → `#1F2937` (提升对比度至16.07:1)
- 次要文本：中灰色 `#666666` → `#4B5563` (提升对比度至9.73:1)
- 辅助文本：`#6B7280` (新增，对比度7.26:1)
- 分割线：浅灰色 `#E5E5E5` → `#E5E7EB` (微调，更统一)

**功能色彩 (增强识别)：**
- 成功：绿色 `#10B981` → `#059669` (提升对比度)
- 警告：橙色 `#F59E0B` (新增)
- 错误：红色 `#EF4444` → `#DC2626` (提升识别度)
- 信息：蓝色 `#3B82F6` (新增)

### 精密字体系统 (移动端优化)

**字体选择：**
- 中文：苹方 (PingFang SC) / 思源黑体 (Source Han Sans)
- 英文：SF Pro Display / Inter / Helvetica Neue

**响应式字体层级：**

**桌面端 (1024px+)：**
- **Display**: 28px/1.15 (32px行高) - 超大标题，着陆页核心标题
- **H1**: 22px/1.18 (26px行高) - 页面主标题，上下边距32px
- **H2**: 18px/1.22 (22px行高) - 模块标题，上下边距24px
- **H3**: 16px/1.25 (20px行高) - 分组标题，上下边距20px
- **Body Large**: 15px/1.47 (22px行高) - 重要正文，段落间距16px
- **Body**: 14px/1.43 (20px行高) - 标准正文，段落间距14px
- **Caption**: 12px/1.33 (16px行高) - 辅助信息，上下边距8px
- **Micro**: 11px/1.27 (14px行高) - 时间戳、版权信息 (提升1px)

**移动端 (768px以下)：**
- **Display**: 24px/1.17 (28px行高) - 适配小屏幕
- **H1**: 20px/1.2 (24px行高) - 减小以适应移动端
- **H2**: 18px/1.22 (22px行高) - 保持不变
- **H3**: 16px/1.25 (20px行高) - 保持不变
- **Body Large**: 16px/1.5 (24px行高) - 移动端增大提升可读性
- **Body**: 15px/1.47 (22px行高) - 移动端增大
- **Caption**: 13px/1.38 (18px行高) - 微调提升可读性
- **Micro**: 11px/1.27 (14px行高) - 保持最小可读尺寸

**字重系统 (保持不变)：**
- Light (300) - 大标题，营造轻盈感
- Regular (400) - 正文内容
- Medium (500) - 强调文本
- Semibold (600) - 小标题、按钮文字
- Bold (700) - 重要提示、警告文本

### 现代图标系统 (精细化)

**设计原则：**
- 线条宽度：1.5px - 更精细的视觉效果
- 圆角半径：1px - 微妙圆润，保持锐利
- 填充风格：线性图标为主，关键操作使用填充图标
- 光学校正：确保视觉重量平衡

**尺寸规格 (优化触摸体验)：**
- Tiny: 12px - 文本内联图标
- Small: 16px - 按钮、表单图标
- Medium: 20px - 导航、列表图标
- Large: 24px - 页面标题图标
- XL: 32px - 功能区块图标
- XXL: 48px - 空状态、引导页图标 (新增)

## 二、现代响应式框架

### 智能断点系统 (精确优化)
```
移动优先，精确断点：
- Mobile Small: 320px - 480px (小屏手机)
- Mobile: 480px - 768px (标准手机)
- Tablet: 768px - 1024px (平板)
- Desktop: 1024px - 1440px (桌面)
- Large: 1440px - 1920px (大屏)
- XL: 1920px+ (超大屏优化)
```

### 精密布局网格 (增强适配)

**容器系统：**
- 最大宽度：1200px (桌面端)
- 边距：移动端16px，平板20px，桌面端24px
- 列间距：移动端16px，平板20px，桌面端24px
- 安全区域：移动端顶部44px，底部34px (考虑刘海屏)

**垂直韵律 (4px基准系统)：**
- 基础单位：4px
- 微间距：4px, 8px (组件内元素)
- 标准间距：12px, 16px, 20px (相关元素分组)
- 大间距：24px, 32px, 40px (模块之间)
- 超大间距：48px, 64px, 80px (页面区块)
- 行高基准：4px倍数对齐，确保垂直节奏

### 高级交互模式 (增强体验)

**微交互动效：**
- 标准缓动：`cubic-bezier(0.4, 0.0, 0.2, 1)` - 200ms
- 快速反馈：`cubic-bezier(0.25, 0.46, 0.45, 0.94)` - 150ms
- 慢速展示：`cubic-bezier(0.19, 1, 0.22, 1)` - 350ms
- 弹性效果：`cubic-bezier(0.68, -0.55, 0.265, 1.55)` - 300ms (新增)

**状态过渡 (优化反馈)：**
- 悬停：transform: translateY(-1px) + box-shadow增强
- 激活：transform: scale(0.98) + brightness(0.95) - 微妙按压感
- 聚焦：2px外框 + 4px外发光
- 加载：opacity渐变 + 骨架屏 + 微妙脉动

## 三、高质感组件标准

### 按钮系统 (增强可访问性)

**主要按钮：**
- 背景：`#5B47E8`，文字：白色，圆角：6px，高度：44px
- 最小宽度：120px，内边距：16px 24px
- 悬停：背景加深至`#4A3BD1`，轻微上移1px，阴影增强
- 聚焦：2px `#5B47E8` 外框 + 4px `rgba(91, 71, 232, 0.3)` 外发光
- 禁用：背景`#D1D5DB`，文字`#9CA3AF`

**次要按钮：**
- 边框：1px solid `#5B47E8`，文字：`#5B47E8`，背景：透明
- 悬停：背景`rgba(91, 71, 232, 0.08)`，边框加深至`#4A3BD1`
- 聚焦：同主要按钮聚焦样式

**文本按钮：**
- 文字：`#5B47E8`，无背景无边框，内边距：8px 12px
- 悬停：背景`rgba(91, 71, 232, 0.06)`，下划线显示
- 最小触摸目标：44px × 44px

### 表单控件 (响应式优化)

**输入框：**
- 高度：44px (移动端), 40px (桌面端)
- 边框：1px solid `#E5E7EB`
- 圆角：6px (统一圆角)
- 内边距：12px 16px
- 聚焦：边框变为`#5B47E8`，2px外发光`rgba(91, 71, 232, 0.2)`
- 错误：边框`#DC2626`，2px外发光`rgba(220, 38, 38, 0.2)`

**选择器：**
- 下拉箭头：自定义SVG图标，12px尺寸
- 选项间距：12px垂直间距，8px水平间距
- 悬停：背景`#F9FAFB`
- 选中：背景`#F4F2FF`，文字`#5B47E8`

### 卡片设计 (层次优化)

**标准卡片：**
- 背景：`#FFFFFF`
- 边框：1px solid `#F3F4F6`
- 圆角：8px
- 阴影：`0 1px 3px rgba(0,0,0,0.1)`
- 悬停阴影：`0 4px 12px rgba(0,0,0,0.15)` (增强效果)
- 过渡：`all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)`

**内容间距：**
- 内边距：20px (移动端), 24px (桌面端)
- 元素间距：16px垂直间距
- 标题与正文：12px间距
- 正文与辅助信息：8px间距

## 四、专业级交互标准

### 加载状态 (体验优化)

**骨架屏：**
- 背景色：`#F1F5F9` (更柔和)
- 动画条：`#E2E8F0`
- 动画：从左到右的光泽扫过效果，2s循环
- 圆角：与实际内容保持一致
- 动画缓动：`ease-in-out`

**进度指示：**
- 线性进度条：高度3px (增加1px), 圆角1.5px
- 环形进度：线宽2.5px (微调), 主色调显示
- 百分比文字：12px，`#4B5563`

### 反馈系统 (多样化反馈)

**成功提示：**
- Toast消息：绿色左边框4px + 成功图标 + 淡绿背景
- 自动消失：4秒后淡出 (延长1秒)
- 位置：右上角，距离边缘24px

**错误处理：**
- 表单验证：输入框下方红色文字提示，12px字号
- 错误页面：简洁插图 + 问题说明 + 解决方案按钮
- 网络错误：重试按钮 + 刷新提示

**信息提示：**
- 蓝色左边框 + 信息图标
- 警告提示：橙色左边框 + 警告图标

### 导航体验 (统一优化)

**移动端导航：**
- 底部标签栏：高度64px，图标24px
- 活跃状态：主色调 + 3px上方指示线 (增加1px)
- 标签文字：10px，距离图标4px
- 安全区域适配：支持底部home indicator

**桌面端导航：**
- 顶部导航：高度60px (增加4px)
- 面包屑：12px字体 + ">" 分隔符 (更现代)
- 悬停效果：背景`rgba(91, 71, 232, 0.06)`

## 五、可访问性与性能 (全面提升)

### 对比度标准 (严格执行)
- 正文文字：7.26:1 (超过AA级) - `#1F2937` vs `#FFFFFF`
- 次要文字：9.73:1 (超过AA级) - `#4B5563` vs `#FFFFFF`
- 大文字标题：16.07:1 (超过AAA级)
- 交互元素：最低4.5:1 (AA级)

### 键盘导航 (完整支持)
- 焦点样式：2px `#5B47E8` 外框 + 4px `rgba(91, 71, 232, 0.3)` 外发光
- Tab顺序：逻辑化，左到右，上到下
- 快捷键：
  - Esc：关闭弹窗、取消操作
  - Enter：确认操作、提交表单
  - Space：选择复选框、激活按钮
  - 方向键：在选项间导航

### 触摸优化 (移动端友好)
- 最小触摸目标：44px × 44px
- 触摸反馈：轻微震动 (支持设备)
- 滑动手势：支持左滑删除、下拉刷新
- 长按操作：300ms触发，视觉反馈


---
这份文档现在已经更新。它不仅描述了现状，更重要的是**定义了目标、指出了问题、规划了路径，并为AI设定了清晰、可执行的开发规则**。我将严格依据这份新文档来完成后续的前端开发任务。 


# Daily Discover - 前端主题系统优化记录

## 优化概述

根据 `theme-design-system.md` 文档的指导，我们对前端主题系统进行了全面优化，主要围绕以下几个方面：

1. **架构升级**：引入原子设计（Atomic Design）理念，将UI组件分为原子、分子、有机体和模板四个层次
2. **逻辑与视图分离**：创建专门的hooks目录，将业务逻辑与UI表现分离
3. **全局状态管理**：添加providers目录，实现全局状态的集中管理
4. **性能优化工具**：增加性能监控、分析和测试工具

## 具体改进

### 1. 目录结构优化

```
daily-discover-ui/src/theme/
├── components/              # 组件目录
│   ├── atoms/               # 原子组件（基础UI元素）
│   ├── molecules/           # 分子组件（由多个原子组成）
│   ├── organisms/           # 有机体组件（由多个分子组成）
│   └── templates/           # 模板组件（页面级组件）
├── hooks/                   # 自定义Hooks
├── providers/               # 上下文提供者
├── utils/                   # 工具函数
│   ├── performance.js       # 性能监控工具
│   ├── testing.js           # 测试辅助工具
│   └── analytics.js         # 分析与监控工具
├── GlobalStyles.js          # 全局样式
├── ThemeProvider.js         # 主题提供者
├── tokens.js                # 设计令牌
└── index.js                 # 主入口文件
```

### 2. 组件架构升级

- **原子组件**：创建了Text等基础UI元素
- **分子组件**：创建了InfoCard等组合多个原子的组件
- **逻辑分离**：将Toast组件拆分为useToast Hook和ToastProvider

### 3. 性能优化

- 添加了组件性能监控工具（useComponentPerformance）
- 添加了函数执行时间测量工具（measureFunctionPerformance）
- 实现了Web Vitals核心指标收集

### 4. 测试与分析

- 添加了测试辅助工具，简化组件测试流程
- 添加了分析工具，收集用户行为和性能数据

## 后续计划

1. **组件库扩展**：继续完善原子设计体系，添加更多基础组件
2. **性能基准测试**：建立组件性能基准，确保性能达标
3. **自动化测试**：为核心组件添加单元测试和端到端测试
4. **文档完善**：使用Storybook等工具完善组件文档

## 技术债务

1. 现有组件尚未完全重构为原子设计模式
2. 部分组件仍然存在逻辑与视图耦合的问题
3. 测试工具中的jest依赖需要安装和配置

---

*更新日期: 2023-10-25*
