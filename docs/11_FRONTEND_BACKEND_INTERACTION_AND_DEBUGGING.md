# 11. 前后端交互与调试指南 (注册与登录流程示例)

本文档旨在为前端开发者（包括AI）提供一套清晰、可操作的指南，帮助理解前端应用如何与后端服务进行高效、可靠的交互，并提供一套系统化的调试方法，确保能够快速定位并解决前后端协作中遇到的问题。

**目标：**
- **透明化交互链路**: 详细阐述从UI交互到后端API调用的完整流程。
- **标准化API契约**: 明确前后端数据传输的格式和规范。
- **系统化错误处理**: 提供常见错误类型（网络、超时、业务）的识别和处理策略。
- **高效调试实践**: 指导如何利用浏览器开发者工具和前端日志进行问题定位。
- **“一步到位”开发**: 助力开发者和AI在遵循规范的前提下，高效、准确地实现功能。

## 1. 核心交互流程概览 (以注册/登录为例)

以下流程图展示了用户在前端进行注册或登录时，数据如何从UI层流向后端服务，并最终影响用户状态的：

```mermaid
graph TD;
    A[用户在UI层输入信息/点击按钮] --> B{UI组件（视图）}; 
    B --> C[调用对应页面或模块的 use... Hook];
    C --> D{Hook内部逻辑处理 (状态管理/数据校验)};
    D --> E[调用 src/services/api/authService.js];
    E --> F[authService 调用 src/services/http/instance.js (Axios实例)];
    F --> G{Axios发送HTTP请求 (到后端 API_BASE_URL)};
    G --> H[后端 daily-discover-server];
    H --> I{后端处理请求 (业务逻辑/数据库操作)};
    I --> J{后端返回统一 Result 响应}; 
    J --> K{Axios响应拦截器处理}; 
    K --> L{authService 处理后端响应}; 
    L --> M[Hook更新前端状态/提示用户];
    M --> N[UI组件响应状态变化/显示结果];
    
    subgraph Frontend
        B
        C
        D
        E
        F
        G
        K
        L
        M
        N
    end
    
    subgraph Backend
        H
        I
        J
    end
```

## 2. API 契约与前后端协作规范

所有前后端交互都必须遵循以下约定。这是实现高效协作和“一次到位”开发的基础。

### 2.1 API_BASE_URL 配置

- **位置**: `daily-discover-ui/src/constants/api.js`
- **当前值**: `https://dailydiscover.top/daily-discover/api/v1`
- **重要性**: **这是前端访问后端服务的唯一入口。任何网络问题或请求超时，首先要检查此URL是否正确，以及后端服务是否在该URL上正常运行和响应。**

### 2.2 统一的后端响应结构

后端 `daily-discover-server` 统一返回 `Result` 对象，前端必须理解并正确解析此结构。`Result` 对象通常包含：

- `code`: 业务状态码 (例如，`0` 表示成功，其他表示业务错误)。
- `message`: 描述操作结果或错误信息的字符串，直接用于用户提示。
- `data`: 实际的业务数据载荷，成功时包含所需数据，失败时可能为 `null`。
- `traceId`: 链路追踪ID，用于日志关联和问题排查。

**示例响应 (成功)**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": { "userId": "123", "token": "jwt-token-string" }
}
```

**示例响应 (业务失败)**:
```json
{
  "code": 40001, 
  "message": "邮箱格式不正确",
  "data": null,
  "traceId": "some-unique-trace-id"
}
```

### 2.3 认证模块 API 契约

以下是核心认证功能的API详细契约，前端必须严格按照此定义进行请求。

| 功能         | HTTP 方法 | 前端路径/后端端点 (`API_BASE_URL` 后缀) | 请求体/参数 (`@RequestBody` vs `@RequestParam`)                      | 响应数据 (Result.data)                                   | 错误码示例 (来自后端)                                  |
| ------------ | --------- | ------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| 用户注册     | `POST`    | `/users/register`                     | `JSON Body`: `{ username, password, confirmPassword, email, code, nickname, ...deviceInfo }` | `UserVO` (包含 `token` 和 `userInfo`)                   | `40001` (用户名已存在), `40002` (验证码错误)            |
| 用户登录     | `POST`    | `/users/login`                        | `JSON Body`: `{ username, password, ...deviceInfo }`                  | `UserVO` (包含 `token` 和 `userInfo`)                   | `40003` (用户名或密码错误), `40004` (账户被禁用)        |
| 发送验证码   | `POST`    | `/users/send-code`                    | `URL Params`: `email`, `type` (2:注册, 3:重置密码)                 | `boolean` (true:成功)                                    | `40005` (邮箱已注册/未注册), `50001` (邮件服务异常)       |
| 重置密码     | `PUT`     | `/users/password/reset`               | `URL Params`: `email`, `code`, `password`                            | `boolean` (true:成功)                                    | `40002` (验证码错误), `40006` (旧密码与新密码相同)        |

## 3. 前端异常处理策略

在 `src/services/http/instance.js` 的 `httpClient.interceptors.response.use` 中实现了统一的错误拦截。前端应该能够区分和处理以下几类错误：

### 3.1 网络错误 (Network Error)

- **特征**: `error.request` 存在，但 `error.response` 为 `undefined`。常见于：
    - 前端 `baseURL` 配置错误，导致请求发送到无效地址。
    - 后端服务未运行或宕机。
    - 浏览器网络连接问题。
    - **`timeout of XXXms exceeded`**: 属于网络错误的一种，意味着请求在指定时间内未收到响应。
- **前端提示**: `网络错误，请检查您的网络连接。` 或 `网络连接超时，请检查网络或稍后再试。`
- **排查步骤**: 
    1. **检查 `baseURL`**: 再次核对 `src/constants/api.js` 中的 `API_BASE_URL` 是否与后端实际运行地址完全一致。
    2. **检查后端服务状态**: 确认后端服务是否已成功启动并监听在正确的端口。如果由您处理，请确保它已上线。
    3. **浏览器网络检查**: 在开发者工具（F12）的 Network (网络) 标签页中，查看请求是否发出，状态码是什么，以及是否有跨域 (CORS) 错误。

### 3.2 HTTP 状态码错误 (HTTP Status Code Error)

- **特征**: `error.response` 存在，且 `error.response.status` 为 4xx 或 5xx。这是后端返回的HTTP层面的错误。
    - `401 Unauthorized`: 未认证，通常是Token过期或无效。`httpClient` 拦截器会自动处理并跳转登录页。
    - `403 Forbidden`: 权限不足。
    - `404 Not Found`: 请求的资源不存在或API路径错误。
    - `500 Internal Server Error`: 后端代码逻辑错误或服务器内部问题。
- **前端提示**: 通常显示后端 `error.response.data.message`。例如，`服务器错误: 500`。
- **排查步骤**: 
    1. **查看后端日志**: 这是最关键的一步。后端日志会记录详细的错误堆栈。
    2. **API路径核对**: 检查前端调用的API路径是否与后端定义的路径完全一致。
    3. **请求参数核对**: 确保请求体或URL参数与后端期望的类型和格式匹配。

### 3.3 业务逻辑错误 (Business Logic Error)

- **特征**: `error.response` 存在，`error.response.status` 通常是 `200 OK`，但后端 `Result` 对象的 `code` 字段非 `0` (例如，`40001`、`40002`)。
- **前端提示**: 显示后端 `error.response.data.message`。例如，`用户名已存在`。
- **排查步骤**: 
    1. **查看后端返回的 `code` 和 `message`**: 这些直接说明了业务层面的错误原因。
    2. **遵循业务规则**: 检查前端的业务逻辑是否满足后端的业务规则（例如，密码复杂度、邮箱唯一性等）。

## 4. 调试技巧与工具

### 4.1 浏览器开发者工具 (F12)

- **Console (控制台)**:
    - 查看 `console.log` 和 `console.error` 输出，特别是 `[authService]` 前缀的日志，它们会显示请求的发送情况和接收到的响应/错误。
- **Network (网络)**:
    - **Overview (概览)**: 检查所有发出的HTTP请求。关注它们的Method (方法), Status (状态码), Type (类型), Time (耗时)。
    - **Headers (请求头/响应头)**: 确认请求URL是否正确，请求头是否包含 `Authorization` Token，响应头是否包含 `Content-Type`。
    - **Payload (请求负载)**: 检查前端发送给后端的请求体或参数是否正确。对于 `POST` 请求，确保 JSON 数据格式正确；对于 `GET` 或 `URL Params`，确保参数名称和值正确。
    - **Response (响应)**: 查看后端返回的原始响应数据。这对于判断后端 `Result` 结构和 `code`/`message`/`data` 内容至关重要。
    - **Timing (时间)**: 分析请求的各个阶段耗时，有助于判断是网络延迟、服务器处理慢还是其他问题。

### 4.2 前端日志 (`console.log`)

- **策略**: 在关键的交互点和数据流转处（如Hook内部、Service调用前后、错误捕获处）添加详细的 `console.log`。
    - **示例**: 在 `authService.js` 中，我们已经添加了日志来追踪 `sendVerificationCode` 的发送和错误。

### 4.3 后端日志

- **重要性**: 后端日志是排查后端问题的“唯一真相”。当前端遇到HTTP 5xx 错误、业务错误或超时时，务必检查后端服务的控制台输出或日志文件。它会提供详细的错误堆栈信息。

## 5. 通用问题排查流程 (以“发送验证码失败”为例)

当遇到类似“发送验证码失败”且伴随“超时”的错误时，请按照以下流程进行排查：

1.  **检查前端控制台日志**: 
    - 查找 `[authService] Sending verification code to...`，确认请求是否发出。
    - 查找 `[authService] sendVerificationCode error:` 后面的具体错误信息，是 `timeout` 还是其他。

2.  **检查浏览器 Network 标签页**: 
    - 找到对应的 `/users/send-code` 请求。
    - **Status**: 如果是 `(failed)` 或没有状态码，可能是网络问题或后端未运行。
    - **Time**: 如果耗时接近 `API_TIMEOUT` (30秒)，那就是超时。
    - **Payload**: 检查发送的 `email` 和 `type` 参数是否正确。
    - **Response**: 如果有响应，查看后端返回的 `code` 和 `message`。

3.  **确认后端服务状态 (由您处理)**: 
    - 确保后端 `daily-discover-server` 已成功启动并运行在 `https://dailydiscover.top/daily-discover/api/v1` 上。
    - 检查后端服务控制台是否有任何启动错误或运行时异常。

4.  **检查后端日志 (由您处理)**: 
    - 如果前端请求已发出但超时，后端日志会显示是否收到了请求，以及请求在哪里被阻塞或抛出异常。

5.  **对照 API 契约**: 
    - 再次核对 `src/services/api/authService.js` 中 `sendVerificationCode` 的实现，确保其请求方法 (`POST`)、路径 (`/users/send-code`)、参数名称 (`email`, `type`) 和类型 (`string`, `number`) 与本文档中定义的契约完全一致。

## 6. 总结

这份文档旨在提供一个全面的视图，帮助您和AI高效地协作，解决前后端交互中的问题。遵循这些规范和排查步骤，将极大地提高开发效率，减少反复沟通。记住，**前端负责正确地发出请求和处理响应；后端负责正确地接收、处理请求并返回响应。** 任何问题都可以沿着这个链路进行定位。
