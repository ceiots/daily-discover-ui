# 9. 核心技术实现详解

本文档详细介绍项目所使用的核心技术，旨在帮助团队成员（包括AI）深入理解其选型理由、实现方式和最佳实践。

---

## 9.1 前端框架：React 18

- **是什么**：一个用于构建用户界面的 JavaScript 库，是当前前端开发的主流选择。
- **为什么选**：
    - **组件化模型**：能够将复杂UI拆分为独立、可复用的组件，极大提升了开发效率和可维护性。
    - **庞大生态**：拥有海量的第三方库和工具，社区支持强大，能快速解决开发中遇到的问题。
    - **并发特性**：React 18 引入的并发渲染（Concurrent Rendering）机制，为处理复杂UI渲染和提升应用响应速度提供了强大的底层支持。
- **如何做**：
    - 项目全面采用函数式组件和 Hooks 的开发模式。
    - 利用 `useState` 和 `useEffect` 管理组件本地状态和副作用。
    - 通过 `React.lazy` 和 `Suspense` 实现组件和页面的懒加载，进行代码分割。
- **应用场景**：整个Web应用的用户界面，从最小的 `Button` 原子组件到复杂的 `ProductDetail` 页面，都由 React 构建。

---

## 9.2 HTTP客户端：Axios 与 Services 层封装

- **是什么**：一个基于 Promise 的、强大的 HTTP 请求库，可用于浏览器和 Node.js 环境。
- **为什么选**：
    - **功能强大**：支持请求和响应拦截器、自动转换JSON数据、客户端防御XSRF等高级功能。
    - **业界标准**：作为前端最流行的HTTP客户端，稳定可靠，社区活跃。
- **如何做**：
    1.  **基础建设 (`src/services/http`)**:
        - 创建一个统一的 `axios` 实例，配置基础 `baseURL`、`timeout` 等。
        - 设置**请求拦截器**，统一注入认证所需的 `Authorization` Token。
        - 设置**响应拦截器**，对后端返回的数据结构进行预处理（如解构 `{ data }`），并集中处理401、403等通用HTTP错误。
    2.  **业务接口 (`src/services/api`)**:
        - 按照业务模块（如 `authService.js`, `productService.js`）创建独立的API文件。
        - 每个文件封装该模块所有相关的API请求函数，例如 `login(credentials)`、`getProductById(id)`。
        - 组件中**严禁**直接调用 `axios`，必须通过这些封装好的 service 函数发起请求。
- **应用场景**：
    - **调用后端**：所有与 `daily-discover-server` (Spring Boot) 后端服务的通信，都通过 این services 层进行。
    - **示例**：用户登录时，`LoginPage` 组件会调用 `authService.js` 中的 `login(username, password)` 函数。

---

## 9.3 路由管理：React Router v6

- **是什么**：React 应用的官方路由解决方案。
- **为什么选**：
    - **与React深度集成**：能够无缝地利用React的组件模型和Hooks。
    - **声明式路由**：以组件的形式定义路由规则，代码直观易懂。
    - **功能完备**：支持动态路由、嵌套路由、路由参数、编程式导航等所有现代Web应用所需功能。
- **如何做**：
    - 在 `src/routes/index.js` 文件中集中管理所有路由配置。
    - 使用 `createBrowserRouter` 创建路由实例。
    - 页面组件作为 `element` 属性与特定 `path` 关联。
    - 利用 `ProtectedRoute` 组件实现需要用户登录才能访问的受保护路由。
- **应用场景**：整个应用的页面跳转和导航。例如，定义 `/products/:id` 这样的动态路由，使得访问 `/products/123` 时能正确渲染 `ProductDetail` 页面，并通过 `useParams` Hook 获取到 `id: 123`。

---

## 9.4 样式方案：styled-components

- **是什么**：一个流行的 CSS-in-JS 库，允许你在 JavaScript 中编写实际的 CSS 代码来为组件添加样式。
- **为什么选**：
    - **组件级样式**：样式直接与组件绑定，避免了全局CSS可能导致的样式冲突和污染。
    - **动态样式**：可以轻易地根据组件的 `props` 或全局 `theme` 动态改变样式。
    - **自动处理浏览器前缀**：无需手动编写 `-webkit-` 等兼容性代码。
- **如何做**：
    - 在组件文件中，使用 `styled` 标签函数创建一个附加了样式的React组件。例如 `const StyledButton = styled.button\`...\`;`。
    - 将设计令牌（如颜色、间距）从 `src/theme/tokens.js` 中导入，并在样式代码中使用，禁止硬编码。
- **应用场景**：项目内所有组件的样式实现。特别是在 `src/theme` 的原子设计体系中，所有原子和分子组件都通过 `styled-components` 构建。 