# Daily Discover - 前端主题设计系统架构与AI开发规范 v4.0

## 1. 核心原则与目标

本设计系统旨在构建一个**高性能、高可扩展、视觉高度一致**的前端UI体系。它不仅是组件库，更是指导AI进行高效、规范开发的核心规则集。

- **核心目标**：**效率提升与性能优化**。通过规范化、原子化的方式，最大化AI自主开发的范围，减少人工干预，实现快速迭代。
- **设计哲学**：**遵循原子设计（Atomic Design）**。将UI拆分为原子、分子、有机体、模板和页面五个层次，确保组件的独立性、复用性和可组合性。
- **性能第一**：所有组件和功能的设计都必须将性能作为首要考量，实施懒加载、代码分割、虚拟列表等策略，确保首屏加载时间<1.5s。
- **体验一致**：通过设计令牌（Design Tokens）和严格的开发规范，确保产品在所有场景下提供统一、可预测的用户体验。
- **可测试性**：每个组件必须具备良好的可测试性，支持单元测试和端到端测试，确保质量。
- **可扩展性**：采用插件化架构，支持功能的动态加载和卸载，为未来扩展做好准备。
- **逻辑与视图分离**：严格区分逻辑层(Hooks)和视图层(JSX)，提高代码可维护性和复用性。

## 2. 架构设计

### 2.1 原子设计（Atomic Design）分层

我们遵循原子设计思想，对`src/theme`目录进行逻辑分层：

- **Atoms (原子)**：构成UI的最基础元素，不可再分。
  - **职责**：只负责样式，不包含业务逻辑。
  - **特点**：高度可复用，几乎不包含状态，主要关注样式。
  - **示例**：`Text.js`、`Button.js`、`PageTitle.js`等基础样式元素。
- **Molecules (分子)**：由多个原子组合而成的简单UI组件。
  - **职责**：完成一个独立的、简单的功能。
  - **特点**：实现特定的UI功能，可包含简单交互。
  - **示例**：`InfoCard.js`、`Card.js`、`ShopInfo.js`、`ScrollableSection.js`。
- **Organisms (有机体)**：由多个分子或原子构成的复杂、独立的UI区域。
  - **职责**：代表产品中一个明确的功能区域。
  - **特点**：实现完整的业务功能，可能包含复杂状态。
  - **示例**：`NavBar.js`、`TopBar.js`、`Toast`组件等。
- **Templates (模板)**：定义页面的整体布局和骨架。
  - **职责**：关注页面结构，不关心具体内容，是可复用的页面框架。
  - **特点**：定义页面骨架，接收内容填充。
  - **示例**：`BasePage.js`。

### 2.2 `src/theme` 目录结构

```
daily-discover-ui/src/theme/
├── components/              # UI组件 (按原子设计分层)
│   ├── atoms/              # 原子级组件
│   ├── molecules/          # 分子级组件
│   ├── organisms/          # 有机体级组件
│   └── templates/          # 模板级组件
├── hooks/                   # 组件逻辑钩子
├── providers/               # 全局状态提供者
├── styles/                  # 样式工具
├── utils/                   # 工具函数
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
- **类型系统**：强制使用 PropTypes，确保类型安全
- **性能监控**：内置性能监控和用户行为分析工具

## 3. AI开发核心规范

**AI在执行UI开发任务时，必须将以下规则视为不可违背的最高指令。**

1.  **规则1：【`MANDATORY`】逻辑先行，Hook优先 (The "Hook-First" Principle)**
    - **立即行动**: 在创建任何**有状态**或**有副作用**的组件（通常是分子/有机体/页面级别）之前，**必须**优先创建并完善对应的 `useComponent` Hook (例如 `useRegisterForm`, `useLoginPage`) 来封装其**全部**逻辑。
    - **Hook职责**: Hook是组件的"大脑"，必须包含：
        - 状态定义 (`useState`)。
        - 副作用处理 (`useEffect`)。
        - 所有的事件处理函数 (如 `handleSubmit`, `handleChange`, `handleSendCode`)。
        - 派生状态计算 (`useMemo`)。
        - 函数性能优化 (`useCallback`)。
    - **视图职责**: 组件（View）是"骨架"，**只负责**接收从Hook返回的状态和函数，并渲染UI。**严禁**在视图组件中直接编写业务逻辑。
    - **示例**: 一个页面的基本结构应如下所示：
      ```javascript
      // a. 先创建 Hook: src/pages/account/useLoginPage.js
      const useLoginPage = () => {
        const [formData, setFormData] = useState(...);
        const [error, setError] = useState('');
        const navigate = useNavigate();
        
        const handleChange = useCallback((e) => { ... }, []);
        const handleSubmit = useCallback(async (e) => { ... }, [formData, navigate]);
        
        return { formData, error, handleChange, handleSubmit };
      };

      // b. 再创建视图: src/pages/account/LoginPage.js
      import { useLoginPage } from './useLoginPage';

      const LoginPage = React.memo(() => {
        const { formData, error, handleChange, handleSubmit } = useLoginPage();
        
        return (
          <PageWrapper>
            <Form onSubmit={handleSubmit}>
              {/* ...Inputs, Buttons... */}
            </Form>
          </PageWrapper>
        );
      });
      ```

2.  **规则2：【`MANDATORY`】拥抱令牌，杜绝硬编码 (The "Token-First" Principle)**
    - **严禁**在`styled-components`的模板字符串中硬编码任何颜色 (`#FFF`, `blue`)、间距 (`16px`)、字号 (`1rem`) 等样式值。
    - **必须**全部通过导入并使用 `src/theme/tokens.js` 中定义的令牌，例如 `colors.primary`, `spacing[4]`, `typography.fontSize.base`。

3.  **规则3：【`MANDATORY`】性能默认，优化先行 (The "Performance-First" Principle)**
    - **页面/复杂组件**: **必须**使用 `React.memo` 进行包裹，并紧随其后添加 `displayName` 属性以供调试，如 `LoginPage.displayName = 'LoginPage';`。
    - **大型列表**: 渲染超过20个项目的列表时，**必须**使用虚拟化技术 (如 `react-window`)。
    - **懒加载**: 所有"有机体"级别及以上的组件和所有页面，**必须**使用`React.lazy`和`Suspense`进行懒加载处理。
    - **函数优化**: 所有传递给子组件的事件处理器或函数，**必须**用 `useCallback` 包裹以防止不必要的重渲染。
    - **数据计算**: 复杂的派生数据计算，**必须**用 `useMemo` 包裹。

4.  **规则4：【`MANDATORY`】组件封装，场景驱动 (The "Composition-First" Principle)**
    - 针对特定业务场景（如认证、设置），如果多个原子/分子组件需要以固定布局重复出现，**必须**将其组合成一个独立的、可复用的场景化组件。
    - **示例**: `ForgotPasswordPage`, `LoginPage`, `RegisterPage` 都使用了共同的布局和基础组件。这些共同部分已被封装在 `src/theme/components/AuthLayoutComponents.js` 中，例如 `PageWrapper`, `MicroNavBar`, `AuthCard`, `SubmitButton`。在创建新的认证相关页面时，**必须**复用这些组件。

5.  **规则5：【`MANDATORY`】用户反馈，体验至上 (The "Feedback-First" Principle)**
    - **所有**重要的异步操作（如登录、注册、保存设置）完成后，**必须**使用 `react-hot-toast` 向用户提供清晰的反馈。
    - `toast.success('操作成功！')` 用于成功场景。
    - `toast.error('操作失败: ' + errorMessage)` 用于失败场景。
    - 在按钮等交互元素上，**必须**处理 `loading` 或 `disabled` 状态，防止用户重复提交。例如，`SubmitButton` 的文本应在"提交中..."和"提交"之间切换。

6.  **规则6：【`MANDATORY`】元数据管理，SEO先行 (The "SEO-First" Principle)**
    - 每个页面级组件**必须**在根节点使用 `<Helmet>` 组件来设置独立的页面 `<title>` 和 `<meta name="description">`，以确保良好的搜索引擎优化（SEO）。

7.  **规则7：【`MANDATORY`】文档同步，JSDoc驱动**
    - 每创建一个新的组件或Hook，**必须**为其添加JSDoc注释，清晰地描述其用途、参数（Props）和返回值。

8.  **规则8：【`MANDATORY`】测试驱动，质量保证**
    - 新的、非视图的业务逻辑（尤其是在`hooks/`和`services/`中），**必须**先编写单元测试用例，再进行功能实现。

9.  **规则9：【`MANDATORY`】原子化提交，信息明确**
    - 一次代码提交（Commit）应聚焦于一个独立的功能点。例如，`feat(auth): add forgot password page` 的提交应包含 `ForgotPasswordPage.js`, `useForgotPassword.js` 以及相关的路由和文档更新。

10. **规则10：【`MANDATORY`】遵循分层，禁止越级**
    - 严格遵循原子设计分层：`Atoms` -> `Molecules` -> `Organisms` -> `Templates` -> `Pages`。
    - **严禁**出现引用循环依赖。
    - `pages` 或 `components` 中的业务组件，可以消费 `theme` 中的所有层级的组件。
    - `theme` 内部，高层级可以消费低层级，反之则**不行**。 