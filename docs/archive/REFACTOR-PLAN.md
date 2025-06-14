# Daily Discover 前端重构计划 v1.0

本文档列出项目需要进行的重构任务，按优先级排序。目标是使项目结构更加清晰，符合`ENGINEERING-DESIGN.md`和`DIRECTORY-STRUCTURE.md`中定义的规范。

## 1. 高优先级任务 (P0)

### 1.1 删除空文件和无用文件

| 文件路径 | 操作 | 原因 |
|---------|------|------|
| `src/components/ExampleComponent.js` | 删除 | 空文件，无实际使用 |
| `src/components/auth/Login.js` | 删除 | 已被`src/components/account/LoginPage.js`替代 |
| `src/components/admin/AdminLogin.js` | 删除 | 空文件，未实现功能 |
| `src/components/admin/Dashboard.js` | 删除 | 空文件，已被`AdminDashboard.js`替代 |
| `src/components/shop/ShopOrderManagement.js` | 删除 | 空文件，未实现功能 |
| `src/StagewiseToolbarDev.js` | 删除 | 开发测试文件，无实际使用 |

### 1.2 统一组件目录结构

#### 1.2.1 新建页面组件目录

创建`src/pages`目录，并将页面级组件移动到该目录下：

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/Daily.js` | `src/pages/DailyPage.js` | 移动并重命名 |
| `src/components/Discover.js` | `src/pages/DiscoverPage.js` | 移动并重命名 |
| `src/components/MyService.js` | `src/pages/ProfilePage.js` | 移动并重命名 |
| `src/components/CategoryPage.js` | `src/pages/CategoryPage.js` | 移动 |
| `src/components/EventDetail.js` | `src/pages/EventDetailPage.js` | 移动并重命名 |
| `src/components/SearchResultsPage.js` | `src/pages/SearchResultsPage.js` | 移动 |
| `src/components/LogisticsTracker.js` | `src/pages/LogisticsTrackerPage.js` | 移动并重命名 |
| `src/components/MyContentPage.js` | `src/pages/MyContentPage.js` | 移动 |
| `src/components/RefundDetail.js` | `src/pages/RefundDetailPage.js` | 移动并重命名 |
| `src/components/RefundForm.js` | `src/pages/RefundFormPage.js` | 移动并重命名 |
| `src/components/ContentCreationPage.js` | `src/pages/ContentCreationPage.js` | 移动 |

#### 1.2.2 整理通用组件

将通用组件整合到`src/components/common`目录下：

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/CommonHelmet.js` | `src/components/common/CommonHelmet.js` | 移动 |
| `src/components/FixImages.js` | `src/components/common/FixImages.js` | 移动 |

#### 1.2.3 统一CSS文件与对应组件放置在同一目录

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/ContentCreationPage.css` | `src/pages/ContentCreationPage.css` | 移动 |
| `src/components/Daily.css` | `src/pages/DailyPage.css` | 移动并重命名 |
| `src/components/Discover.css` | `src/pages/DiscoverPage.css` | 移动并重命名 |
| `src/components/EventDetail.css` | `src/pages/EventDetailPage.css` | 移动并重命名 |
| `src/components/MyContentPage.css` | `src/pages/MyContentPage.css` | 移动 |
| `src/components/MyService.css` | `src/pages/ProfilePage.css` | 移动并重命名 |
| `src/components/myService/Cart.css` | `src/components/cart/Cart.css` | 移动 |

### 1.3 主题系统重构

#### 1.3.1 统一组件目录结构

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/theme/components/BasePage.js` | `src/theme/components/templates/BasePage/BasePage.js` | 移动 |
| `src/theme/organisms/index.js` | `src/theme/components/organisms/index.js` | 合并 |
| `src/theme/templates/index.js` | `src/theme/components/templates/index.js` | 合并 |

## 2. 中优先级任务 (P1)

### 2.1 统一Hooks组织方式

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/theme/hooks/useToast.js` | `src/theme/hooks/useToast/useToast.js` | 移动并确保index.js导出 |
| `src/components/recommendation/useUserActivity.js` | `src/hooks/useUserActivity.js` | 移动到全局hooks目录 |
| `src/App.js中的useAuth Hook` | `src/hooks/useAuth.js` | 抽取并移动 |

### 2.2 整理业务组件模块

#### 2.2.1 重命名`myService`目录为`user`

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/myService/AddressList.js` | `src/components/user/AddressList.js` | 移动 |
| `src/components/myService/Cart.js` | `src/components/cart/Cart.js` | 移动到单独的cart模块 |

#### 2.2.2 视频组件重构

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/videos/VideoService.js` | `src/services/api/video.js` | 移动并重命名，将API调用移至services层 |

### 2.3 重构ScrollableSection组件

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/common/ScrollableSection.js` | `src/theme/components/molecules/ScrollableSection/ScrollableSection.js` | 移动到主题系统 |
| `src/components/common/ScrollableSection.css` | `src/theme/components/molecules/ScrollableSection/ScrollableSection.css` | 移动到主题系统 |
| `src/theme/components/molecules/ScrollableSection.js` | - | 确保与上面的组件合并，避免重复 |

## 3. 低优先级任务 (P2)

### 3.1 重命名文件以保持一致性

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| `src/components/videos/VideoList/VideoList.js` | `src/components/videos/VideoList/index.js` | 重命名以符合目录索引规范 |
| `src/components/videos/VideoPlayer/VideoPlayer.js` | `src/components/videos/VideoPlayer/index.js` | 重命名以符合目录索引规范 |
| `src/components/games/MatchThree/MatchThree.js` | `src/components/games/MatchThree/index.js` | 重命名以符合目录索引规范 |
| `src/components/games/SnakeGame/SnakeGame.js` | `src/components/games/SnakeGame/index.js` | 重命名以符合目录索引规范 |
| `src/components/games/TetrisGame/TetrisGame.js` | `src/components/games/TetrisGame/index.js` | 重命名以符合目录索引规范 |

### 3.2 创建缺失的服务层文件和目录

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| - | `src/services/http/instance.js` | 创建 |
| - | `src/services/http/interceptors/index.js` | 创建 |
| - | `src/services/http/cache.js` | 创建 |
| `src/utils/axios.js` | `src/services/http/axios.js` | 移动 |

### 3.3 整理常量文件

| 源文件 | 目标文件 | 操作 |
|-------|---------|------|
| - | `src/constants/api.js` | 创建 |
| - | `src/constants/business.js` | 创建 |

## 4. 持续改进任务

以下是需要在整个项目开发过程中持续关注的任务：

1. **确保组件逻辑与视图分离**：将组件内的业务逻辑抽离到Hooks中
2. **遵循导入导出规范**：确保所有文件遵循统一的导入导出方式
3. **统一命名风格**：确保组件、Hooks、工具函数等遵循命名约定
4. **更新`DIRECTORY-STRUCTURE.md`**：每次重构后更新目录结构文档
5. **补充JSDoc注释**：为关键函数和组件添加完整文档注释
6. **优化导入路径**：使用路径别名简化导入语句

## 5. 重构执行策略

为确保重构过程不影响业务功能的正常运行，我们采用以下策略：

1. **先删除无用文件**：减少代码复杂度
2. **然后进行结构调整**：按照P0->P1->P2的顺序执行重构任务
3. **逐步引入新规范**：重构完成后，新开发的功能必须遵循新规范
4. **添加ESLint规则**：通过自动化工具确保规范执行

## 6. 完成标准

完成重构后，项目应该满足以下要求：

1. 目录结构清晰，符合`DIRECTORY-STRUCTURE.md`定义的规范
2. 组件按照原子设计模式组织
3. 业务逻辑与UI分离，使用Hooks管理业务逻辑
4. 文件命名统一，符合命名规范
5. 没有空文件或未使用的文件
6. 导入导出方式统一 