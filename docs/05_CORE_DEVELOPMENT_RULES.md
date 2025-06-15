# 5. AI & 开发者核心开发规则

**此为最高优先级规则，所有代码提交前必须自查。**

1.  **【目录规则】严格遵守目录规范**
    - 创建任何文件前，必须先查阅 **[03_DIRECTORY_AND_NAMING.md](./03_DIRECTORY_AND_NAMING.md)**，并将其放置在正确的位置。
    - 页面级组件放`pages`，可复用业务组件放`components`，UI基础组件放`theme/components`。

2.  **【架构规则】逻辑与视图分离 (Hook First)**
    - 任何有状态、有副作用或包含复杂逻辑的组件，**必须**将逻辑抽离到对应的`useComponent` Hook中。
    - **严禁**在JSX文件中编写大量业务逻辑。

3.  **【UI规则】遵循原子设计**
    - **严禁**在`pages`或`components`中直接编写本应属于`theme`层的UI组件。
    - 构建界面时，优先从`theme/components`中组合使用`atoms`和`molecules`。
    - 详细规范请参阅 **[04_UI_DESIGN_SYSTEM.md](./04_UI_DESIGN_SYSTEM.md)**。

4.  **【样式规则】使用设计令牌 (No Hard-coded Styles)**
    - **严禁**在组件中硬编码任何颜色、间距、字号等值。
    - **必须**使用`src/theme/tokens.js`中定义的令牌。

5.  **【性能规则】性能默认，懒载先行**
    - 所有`pages`组件和`organisms`级别的组件，**必须**默认使用`React.lazy`和`Suspense`进行懒加载。
    - 渲染超过10个项目的列表时，**必须**使用虚拟化技术 (`react-window`)。

6.  **【API规则】调用服务层**
    - **严禁**在组件或页面中直接调用`axios`。
    - **必须**通过`src/services/api/`中定义的函数来获取数据。

7.  **【质量规则】文档与测试同行**
    - 创建新组件时，**必须**为其编写JSDoc注释，说明其用途和Props。
    - 核心业务逻辑和工具函数**必须**编写单元测试。
    - 单元测试文件**必须**与被测试的源文件并置存放，并使用 `.test.js` 或 `.spec.js` 后缀 (例如 `utils/format.test.js`)。 

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