# 前端文档中心 (Frontend Documentation)

欢迎来到 Daily Discover 前端应用的文档中心。本文档是前端开发的"唯一真相来源"，所有相关开发活动 **【`MANDATORY`】** 必须以此处定义的规范为准。

在开始之前，请确保您已阅读位于项目根目录的 **[全局 README.md](../../README.md)**，以了解项目的整体愿景和架构。

## 核心文档导航

| 类别             | 核心内容                                                     | 关键文档/必读                                                                                                         |
| :--------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| **🚀 核心开发规则**  | **所有开发者必须遵守的规则，尤其是AI**                       | **`04_UI_DESIGN_SYSTEM.md`**, **`05_CORE_DEVELOPMENT_RULES.md`**                                                        |
| **🗺️ 架构与设计**    | 应用架构、技术栈、目录结构、UI设计系统                       | `02_ARCHITECTURE_AND_TECH_STACK.md`, `03_DIRECTORY_AND_NAMING.md`                                                       |
| **💡 核心技术详解**  | React, Axios, Styled-components等核心技术的最佳实践        | `09_CORE_TECHNOLOGIES.md`                                                                                             |
| **🔧 前后端交互**    | **API契约、请求流程、错误处理、调试技巧**                    | **`11_FRONTEND_BACKEND_INTERACTION_AND_DEBUGGING.md`**                                                                  |
| **📈 项目状态与待办** | 当前开发状态、技术债务、版本计划、Roadmap                    | `08_PROJECT_STATUS_AND_TODOLIST.md`                                                                                   |
| **📝 其他规范**      | 通用指南、工作流、测试策略                                   | `01_GENERAL_GUIDELINES.md`, `06_WORKFLOW_AND_CI_CD.md`, `07_TESTING_STRATEGY.md`                                      |
| **🛠️ 重构计划示例** | 认证模块 "Hook-First" 重构计划的实例                         | `10_AUTH_REFACTOR_PLAN.md`                                                                                            |

---
**核心原则**: 逻辑先行 (Hook-First)。在开始任何有状态或有副作用的组件开发前，请务必先查阅 `04_UI_DESIGN_SYSTEM.md` 中关于 **Hook-First** 的强制规定。 