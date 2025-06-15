# 8. 项目状态与待办事项

本文档用于追踪当前工程状态、技术债务、重构计划和待办事项，**每次修改后都应更新**。

## 8.1 当前工程状态与问题

基于对当前工程的全面分析，我们发现以下关键问题需要解决：

1. **目录结构与代码整洁度**：
   - [ ] **页面组件位置混乱**：部分页面级组件（如`Discover.js`, `Daily.js`）仍在 `src/components` 目录中，应迁移至 `src/pages`。
   - [ ] **存在无用文件**：`src` 目录下存在 Create React App 的默认遗留文件（如 `App.css`, `logo.svg`, `SimpleApp.js`），对项目无用且造成干扰。
   - [ ] **API调用分散**：部分组件中可能仍存在直接的 `axios` 调用，未通过 `services` 层。

2. **逻辑与视图耦合**：
   - [ ] `App.js` 中包含路由和全局逻辑，过于臃肿，应进一步简化为纯粹的组件根。
   - [ ] 部分组件自身的业务逻辑（如状态、副作用）未抽离为独立的自定义 Hook。

3. **性能与规范**：
   - [ ] **缺少代码分割**：路由和大型组件未实现懒加载，影响首屏性能。
   - [ ] **缺少缓存机制**：API 请求没有统一的缓存策略。

## 8.2 后续重构计划 (Roadmap)

#### 阶段1：架构清理与核心重构 (进行中)

- [ ] **清理无用文件**:
  - `src/App.css`
  - `src/logo.svg`
  - `src/styles.css`
  - `src/SimpleApp.js`
- [ ] **账户页面迁移**: 创建 `src/pages/account` 目录，并将 `LoginPage`, `ForgotPasswordPage` 等相关页面移入。
- [ ] **认证逻辑抽离**: 将 `App.js` 中的认证相关逻辑完全抽离到 `src/hooks/useAuth.js`。
- [x] **页面组件归位**: 将 `src/components` 中的 `Discover.js` 和 `Daily.js` 移动到 `src/pages`。

#### 阶段2：性能优化

- [ ] **实现懒加载**: 对所有 `pages` 下的组件应用 `React.lazy` 和 `Suspense`。
- [ ] **实现API缓存**: 为 `services` 层的 `axios` 实例配置缓存策略。

#### 阶段3：可维护性提升

- [ ] **组件逻辑抽离**: 为 `Discover.js` 和 `Daily.js` 等页面创建对应的 `useDiscover.js` 和 `useDaily.js` Hooks。
- [ ] **完善测试**: 为核心 Hooks 和 services 编写单元测试。


## TODO for Next Phase (P1 - High Priority)

- [ ] **功能验证 (E2E Testing)**: 项目虽然可以运行，但核心功能（登录、注册、内容展示、商品购买等）需要端到端验证，确保在重构后未引入逻辑 bug。
- [ ] **UI/UX 一致性检查**: 检查所有页面，确保 UI 元素、间距、颜色、字体等符合设计规范。
- [ ] **性能优化**: 分析应用性能，特别是 `Discover` 和 `Daily` 等复杂页面，识别并优化渲染瓶颈。
- [ ] **代码质量提升**: 
  - [ ] 移除所有 `console.log` 和未使用的变量/函数。
  - [ ] 为核心业务逻辑（如 `useAuth`）补充单元测试。
  - [ ] 检查并修复所有 `eslint` `warning` 级别的问题。
- [ ] **依赖审查**: 检查 `package.json`，移除不再需要的依赖，升级有安全风险的旧版本依赖。

## Backlog (P2 - Medium Priority)

- [ ] **组件重构**: `Discover.js` 文件过大（超过600行），逻辑复杂，需要将其拆分为更小的、可复用的子组件。
- [ ] **API 错误处理**: 完善全局的 API 请求错误处理机制，为用户提供更友好的错误提示。
- [ ] **文档完善**: 为 `src/theme` 下的核心组件和 `hooks` 编写详细的 `README.md` 或 JSDoc 文档。

## 8.3 已完成 ✅ (2025-06-18)

- **[架构]** 创建了规范化的目录结构 (`pages`, `services`, `hooks`, `constants` 等)。
- **[修复]** 解决了 `theme` 模块中的各类导出和引用错误。
- **[修复]** 修正了 `NavBar` 和 `useAuth` 的导入路径问题。
- **[修复]** 确保项目在修复后能够成功编译并运行。
- **[文档]** 创建了全新的、模块化的项目文档体系。

## 8.4 待办事项清单 📝

- **[功能]** 根据UI/UX设计稿，继续开发或优化其他页面功能
- **[测试]** 为核心组件和Hooks编写单元测试
- **[重构]** 将账户页面目录结构，将 `LoginPage`, `ForgotPasswordPage`, `RegisterPage` 移至 `src/pages/account`
- **[重构]** 将认证逻辑从 `App.js` 抽离至 `src/hooks/useAuth.js`

## 8.5 新增已完成项 (最近更新)

- **[修复]** 解决了因循环依赖导致的 `useToast` 和 `ToastProvider` 运行时初始化错误。通过将 `ToastContext` 抽离到独立文件，成功解耦模块。
- **[修复]** 修正了 `App.js` 中对已删除组件 `EventDetail` 的引用问题。
- **[修复]** 通过重建 `src/theme/components/index.js`，彻底解决了因缓存或文件损坏导致的模块导出失败问题。
- **[重构]** 将 `Discover.js` 和 `Daily.js` 及其附属的 CSS 文件从 `src/components` 迁移至 `src/pages`，使其目录结构更符合项目规范。
- **[修复]** 通过精确计算相对路径，修复了 `useNavBar` 和 `useAuth` 等Hooks之间错误的循环导入问题，解决了最终的运行时模块找不到的错误。

## 8.6 待办事项清单 📝

- **[功能]** 根据UI/UX设计稿，继续开发或优化其他页面功能
- **[测试]** 为核心组件和Hooks编写单元测试
- **[重构]** 将账户页面目录结构，将 `LoginPage`, `ForgotPasswordPage`, `RegisterPage` 移至 `src/pages/account`
- **[重构]** 将认证逻辑从 `App.js` 抽离至 `src/hooks/useAuth.js` 