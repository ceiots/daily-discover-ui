# Daily Discover 前端重构执行计划

本文档详细描述如何分阶段执行`REFACTOR-PLAN.md`中列出的重构任务，确保不影响项目的正常运行和开发流程。

## 1. 准备工作

### 1.1 备份与分支

1. **创建专用分支**：
   ```bash
   git checkout -b refactor/directory-structure
   ```

2. **确保测试通过**：
   ```bash
   npm test
   ```

### 1.2 安装必要工具

1. **安装重构辅助工具**：
   ```bash
   npm install --save-dev eslint-plugin-import eslint-import-resolver-alias
   ```

2. **更新ESLint配置**，添加新的目录结构规则

## 2. 执行步骤

### 阶段1: 清理无用文件 (预计耗时: 0.5天)

```bash
# 删除空文件和无用文件
rm src/components/ExampleComponent.js
rm src/components/auth/Login.js
rm src/components/admin/AdminLogin.js
rm src/components/admin/Dashboard.js
rm src/components/shop/ShopOrderManagement.js
rm src/StagewiseToolbarDev.js

# 提交更改
git add .
git commit -m "refactor: 删除空文件和无用文件"
```

### 阶段2: 目录结构调整 (预计耗时: 1天)

#### 2.1 创建新目录结构

```bash
# 创建新目录
mkdir -p src/pages
mkdir -p src/services/http/interceptors
mkdir -p src/services/api
mkdir -p src/constants
mkdir -p src/components/cart
mkdir -p src/components/user
mkdir -p src/theme/components/molecules/ScrollableSection
mkdir -p src/theme/components/templates/BasePage

# 提交创建的目录
git add .
git commit -m "refactor: 创建新目录结构"
```

#### 2.2 移动页面组件

为防止路径引用问题，我们将使用`git mv`命令，并在每次移动后提交:

```bash
# 移动页面组件
git mv src/components/Daily.js src/pages/DailyPage.js
git mv src/components/Daily.css src/pages/DailyPage.css
git add .
git commit -m "refactor: 移动Daily页面到pages目录"

git mv src/components/Discover.js src/pages/DiscoverPage.js
git mv src/components/Discover.css src/pages/DiscoverPage.css
git add .
git commit -m "refactor: 移动Discover页面到pages目录"

# 以此类推，每次移动一个页面并提交
# ...
```

#### 2.3 移动通用组件

```bash
# 移动通用组件
git mv src/components/CommonHelmet.js src/components/common/CommonHelmet.js
git mv src/components/FixImages.js src/components/common/FixImages.js
git add .
git commit -m "refactor: 整理通用组件到common目录"
```

#### 2.4 主题系统重构

```bash
# 整理主题系统
git mv src/theme/components/BasePage.js src/theme/components/templates/BasePage/BasePage.js
# 创建index.js文件
echo "export { default } from './BasePage';" > src/theme/components/templates/BasePage/index.js
git add .
git commit -m "refactor: 组织BasePage组件到templates目录"

# 合并organisms的index.js
cat src/theme/organisms/index.js >> src/theme/components/organisms/index.js
git add .
git commit -m "refactor: 合并组织organisms的index文件"

# 合并templates的index.js
cat src/theme/templates/index.js >> src/theme/components/templates/index.js
git add .
git commit -m "refactor: 合并组织templates的index文件"
```

### 阶段3: 处理hooks和业务组件 (预计耗时: 1.5天)

#### 3.1 整理Hooks

```bash
# 整理theme相关的hooks
mkdir -p src/theme/hooks/useToast
git mv src/theme/hooks/useToast.js src/theme/hooks/useToast/useToast.js
echo "export { default } from './useToast';" > src/theme/hooks/useToast/index.js
git add .
git commit -m "refactor: 组织useToast到专用目录"

# 抽取App.js中的useAuth
# 这需要手动操作，因为要从文件中抽取代码
# 创建useAuth.js文件，复制App.js中相关代码
# 然后修改App.js，引入新的useAuth hook
git add .
git commit -m "refactor: 抽取useAuth hook到专用文件"
```

#### 3.2 整理业务组件

```bash
# 重命名myService为user
mkdir -p src/components/user
git mv src/components/myService/AddressList.js src/components/user/AddressList.js
git add .
git commit -m "refactor: 将myService重命名为user"

# 移动Cart组件到独立目录
mkdir -p src/components/cart
git mv src/components/myService/Cart.js src/components/cart/Cart.js
git mv src/components/myService/Cart.css src/components/cart/Cart.css
git add .
git commit -m "refactor: 将Cart移动到专用目录"
```

#### 3.3 移动API服务

```bash
# 移动VideoService到services/api
git mv src/components/videos/VideoService.js src/services/api/video.js
git add .
git commit -m "refactor: 将VideoService移动到services/api"
```

### 阶段4: ScrollableSection组件重构 (预计耗时: 0.5天)

```bash
# 创建ScrollableSection目录
mkdir -p src/theme/components/molecules/ScrollableSection

# 这个组件在两个地方都有，需要手动合并
# 比较两个文件，合并为一个更完善的版本
# 然后移动到目标位置
# 这需要手动操作，确保功能正确合并

git add .
git commit -m "refactor: 重构ScrollableSection组件"
```

### 阶段5: 后续优化 (预计耗时: 1天)

```bash
# 重命名组件文件，遵循index.js模式
git mv src/components/videos/VideoList/VideoList.js src/components/videos/VideoList/index.js
git add .
git commit -m "refactor: 重命名VideoList组件文件为index.js"

# 以此类推，重命名其他组件文件
# ...

# 创建缺失的服务层文件
touch src/services/http/instance.js
touch src/services/http/interceptors/index.js
touch src/services/http/cache.js
git add .
git commit -m "refactor: 创建缺失的HTTP服务层文件"

# 移动axios工具
git mv src/utils/axios.js src/services/http/axios.js
git add .
git commit -m "refactor: 将axios移动到HTTP服务层"

# 创建常量文件
touch src/constants/api.js
touch src/constants/business.js
git add .
git commit -m "refactor: 创建API和业务常量文件"
```

## 3. 验证与测试

每个阶段完成后，都需要进行以下验证：

1. **运行应用**：
   ```bash
   npm start
   ```

2. **运行测试**：
   ```bash
   npm test
   ```

3. **修复路径引用错误**：
   - 使用IDE的全局搜索功能查找引用旧路径的地方
   - 逐一修复错误引用

4. **检查构建结果**：
   ```bash
   npm run build
   ```

## 4. 合并与部署

### 4.1 合并到主分支

```bash
# 切回主分支
git checkout main

# 合并重构分支
git merge --no-ff refactor/directory-structure

# 解决可能的冲突
# ...

# 推送到远程仓库
git push origin main
```

### 4.2 更新文档

1. 确保`DIRECTORY-STRUCTURE.md`文档与实际目录结构保持一致
2. 更新`README.md`，说明目录结构的调整
3. 将重构计划和执行文档归档到`docs/archive/`目录

## 5. 后续工作

### 5.1 设置路径别名

在`webpack.config.js`或`jsconfig.json`中添加路径别名，简化导入：

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@pages/*": ["pages/*"],
      "@hooks/*": ["hooks/*"],
      "@theme/*": ["theme/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

### 5.2 ESLint 规则更新

添加import路径规范的ESLint规则：

```json
{
  "rules": {
    "import/order": [
      "error", 
      {
        "groups": [
          "builtin", 
          "external", 
          "internal", 
          ["parent", "sibling"], 
          "object", 
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
}
```

### 5.3 培训与指导

1. 为团队成员提供新目录结构的培训
2. 创建示例组件，展示如何按照新规范开发
3. 代码审核时重点关注目录结构和组件组织

## 6. 持续改进

重构是持续进行的过程，我们应该：

1. 每次sprint结束时检查目录结构的合规性
2. 定期更新`DIRECTORY-STRUCTURE.md`文档
3. 收集开发者反馈，优化目录结构
4. 根据项目发展，适时调整组织方式 