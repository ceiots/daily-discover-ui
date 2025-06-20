# 10. 认证模块重构计划 (Hook-First 原则实战)

## 1. 目标

本次重构旨在解决当前认证模块（登录、注册、忘记密码）存在的技术债务和交互问题。我们将严格遵循前端文档中最新确立的 **“Hook-First (逻辑先行)”** 核心架构原则，对认证页面进行一次全面的、规范化的重构。

**最终目标：**
- **修复 Bug**：彻底解决“发送验证码”按钮无响应等所有已知和潜在的交互问题。
- **代码质量提升**：实现业务逻辑与视图的完全分离，使代码更清晰、可维护、可测试。
- **遵循规范**：使认证模块成为全项目的代码标杆，为后续所有开发（无论是人类还是AI）提供一个可遵循的范例。
- **打通前后端**: 确保UI层的所有操作都能正确调用`daily-discover-server`的对应接口，并提供恰当的用户反馈（如`toast`提示和`loading`状态）。

## 2. 核心原则

本次重构将严格遵守以下已在 `04_UI_DESIGN_SYSTEM.md` 和 `05_CORE_DEVELOPMENT_RULES.md` 中定义的规则：

1.  **【`MANDATORY`】Hook-First 原则**: 所有页面的业务逻辑（状态、副作用、事件处理函数）都必须封装在独立的 `use...` Hook 文件中。
2.  **【`MANDATORY`】性能默认原则**: 页面组件必须使用 `React.memo`，所有事件处理函数必须使用 `useCallback`。
3.  **【`MANDATORY`】用户反馈原则**: 所有异步操作必须有 `loading` 状态处理，并使用 `react-hot-toast` 向用户反馈操作结果。
4.  **【`MANDATORY`】服务层调用原则**: 严禁在组件或Hook中直接使用`axios`，所有API请求必须通过 `src/services/api/` 中的服务发起。

## 3. 重构蓝图

### 3.1 目录结构

重构后，`src/pages/account/` 目录将形成以下结构，清晰地将“视图”和“逻辑”分离：

```
src/pages/account/
├── LoginPage.js               # 登录页 (纯视图组件)
├── useLoginPage.js            # 登录页的逻辑Hook
├── RegisterPage.js            # 注册页 (纯视图组件)
├── useRegisterPage.js         # 注册页的逻辑Hook
├── ForgotPasswordPage.js      # 忘记密码页 (纯视图组件)
├── useForgotPasswordPage.js   # 忘记密码页的逻辑Hook
└── WeChatCallbackPage.js      # (维持现状)
```

### 3.2 Hook 职责定义

每个 `use...` Hook 将成为对应页面的“大脑”，负责管理所有非UI的事务：

| Hook                       | 负责的状态 (`useState`)                                               | 负责的函数 (`useCallback`)                                    |
| -------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------- |
| `useLoginPage`             | `formData`, `error`, `loading`                                      | `handleChange`, `handleSubmit`                              |
| `useRegisterPage`          | `formData`, `errors`, `loading`, `sendingCode`, `countdown`         | `handleChange`, `handleSendCode`, `handleSubmit`, `validateForm` |
| `useForgotPasswordPage`    | `email`, `code`, `password`, `confirmPassword`, `step`, `error`, `loading`, `isSendingCode`, `countdown` | `handleSendCode`, `handleResetPassword`                     |

### 3.3 视图组件职责定义

每个页面组件 (`.js` 文件) 将成为“纯净的”视图层，其职责仅限于：
1. 调用对应的 `use...` Hook 获取状态和事件处理器。
2. 将状态和处理器绑定到UI元素上。
3. 渲染由 `AuthLayoutComponents.js` 和 `theme` 提供的UI组件。

视图组件内部将**不再包含**任何 `useState`, `useEffect`, `useCallback` 或业务逻辑函数定义。

## 4. 执行步骤

1.  **创建 `useRegisterPage.js`**，将 `RegisterPage.js` 的所有逻辑迁移过去。
2.  **改造 `RegisterPage.js`**，使其成为调用 `useRegisterPage` 的纯视图组件，并在此过程中修复验证码发送功能。
3.  **创建 `useLoginPage.js`** 并改造 `LoginPage.js`。
4.  **创建 `useForgotPasswordPage.js`** 并改造 `ForgotPasswordPage.js`。
5.  **审查与验证**: 确保所有页面功能正常，符合预期。
6.  **更新文档**: 在 `08_PROJECT_STATUS_AND_TODOLIST.md` 中更新任务状态。

---
*本文档是本次重构的唯一蓝图，所有相关开发都必须以此为准。*
