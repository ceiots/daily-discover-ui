# 5. AI & 开发者核心开发规则

**此为最高优先级规则，所有代码提交前【`MANDATORY`】必须逐条自查。**

1.  **【目录规则】严格遵守目录规范**
    - 创建任何新文件前，**必须**先查阅 **[03_DIRECTORY_AND_NAMING.md](./03_DIRECTORY_AND_NAMING.md)**，并将其放置在绝对正确的位置。
    - 页面级组件放`pages`，可复用业务组件放`components`，UI基础组件放`theme/components`。

2.  **【架构规则】逻辑与视图分离 (Hook First)**
    - **任何**有状态、有副作用或包含任何非渲染逻辑的组件，**必须**将所有逻辑抽离到对应的`useComponent` Hook中。
    - **严禁**在JSX文件中编写任何业务逻辑、事件处理或状态管理代码。
    - 这是项目的**首要架构原则**，必须无条件遵守。详细实现请参照 **[04_UI_DESIGN_SYSTEM.md](./04_UI_DESIGN_SYSTEM.md)** 中的规则1。

3.  **【UI规则】组合而非创造 (Composition over Creation)**
    - 构建新界面时，**必须**优先从`theme/components`中组合使用现有的`atoms`和`molecules`。
    - **严禁**在`pages`或`components`中直接使用`styled-components`创建本应属于`theme`层的通用UI组件。
    - 详细规范请参阅 **[04_UI_DESIGN_SYSTEM.md](./04_UI_DESIGN_SYSTEM.md)**。

4.  **【样式规则】使用设计令牌 (No Hard-coded Styles)**
    - **严禁**在组件中硬编码任何颜色、间距、字号等样式值。
    - **必须**使用`src/theme/tokens.js`中定义的令牌。

5.  **【性能规则】性能优化默认开启**
    - 所有`pages`组件和`organisms`级别的组件，**必须**使用`React.lazy`和`Suspense`进行懒加载。
    - **必须**对页面和绝大多数组件使用 `React.memo`，并添加 `displayName`。
    - **必须**对所有传递给子组件的函数使用 `useCallback`。

6.  **【API规则】调用服务层 (Service Layer First)**
    - **严禁**在组件或Hook中直接调用`axios`或`fetch`。
    - **必须**通过`src/services/api/`中定义的、按业务模块划分的函数来获取数据。

7.  **【质量规则】文档与测试同行 (Docs & Tests alongside Code)**
    - 创建新组件/Hook时，**必须**为其编写JSDoc注释，说明其用途和Props。
    - 核心业务逻辑（`hooks`）和工具函数**必须**编写单元测试。
    - 单元测试文件**必须**与被测试的源文件并置存放，并使用 `.test.js` 后缀 (例如 `utils/format.test.js`)。

8.  **【安全规则】安全是基石 (Security by Design)**
    - **所有**处理用户输入的地方，**必须**进行有效性验证。
    - **所有**需要向用户反馈的异步操作，**必须**使用`toast`通知并处理`loading`状态。
    - **所有**页面**必须**包含`<Helmet>`以设置SEO元信息。

9.  **【提交规则】清晰、原子、有意义**
    - **必须**遵循 Conventional Commits 规范 (`feat:`, `fix:`, `refactor:`, `docs:`)。
    - 一次提交只做一件高度相关的事情。

## 9. 废弃的规则 (Deprecated)

- **避免**使用 `styleUtils.js`，该模式已不再推荐。
- 不再需要在组件中创建独立的样式文件（如 `ProductDetail.css`），样式应通过 `styled-components` 与组件文件并存或在 `theme` 中定义。

## 8. 安全编码规范

### 8.1 输入验证与输出编码
- **所有用户输入必须验证**：使用Joi或Yup等库进行数据验证
- **输出必须编码**：使用DOMPurify等库处理HTML内容，防止XSS攻击
- **URL参数处理**：使用encodeURIComponent处理URL参数

### 8.2 认证与授权
- **JWT处理**：安全存储JWT（仅使用httpOnly cookies），处理过期逻辑
- **权限检查**：实现细粒度的权限检查组件和Hooks

### 8.3 敏感数据处理
- **数据脱敏**：个人信息显示时自动脱敏（如手机号显示为135****6789）
- **本地存储安全**：敏感数据不得使用localStorage，必须使用加密后的sessionStorage    