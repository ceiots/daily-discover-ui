# NavBar 导航栏组件

NavBar是Daily Discover应用的底部导航栏组件，提供主要页面间的快速导航功能。

## 功能特性

- 支持通过React Router实现导航切换
- 带有突出显示的当前页面指示器
- 中央按钮区域可定制，支持显示用户头像或特定图标
- 自适应底部安全区域（支持iOS底部安全区域）
- 自动检测登录状态变化并更新UI

## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| className | string | - | 自定义CSS类名，用于扩展样式 |

## 使用示例

```jsx
import { NavBar } from '../../theme/components';

// 基本用法
function AppLayout({ children }) {
  return (
    <div className="app-container">
      <main>{children}</main>
      <NavBar />
    </div>
  );
}

// 自定义样式
function CustomLayout({ children }) {
  return (
    <div className="app-container">
      <main>{children}</main>
      <NavBar className="custom-nav-bar" />
    </div>
  );
}
```

## 样式定制

NavBar组件使用UI常量系统进行样式定义，可以通过修改`uiConstants.js`中的常量来全局调整样式：

```javascript
// 在uiConstants.js中可调整的导航栏样式常量
export const UI_SIZES = {
  // ...其他尺寸常量
  NAV_HEIGHT: '56px',
  NAV_ICON_SIZE: '20px',
  NAV_TEXT_SIZE: '12px',
  NAV_TEXT_SPACING: '2px',
};
```

如果需要更具体的样式调整，可以使用`className`属性结合自定义CSS：

```css
/* 自定义导航栏样式 */
.custom-nav-bar {
  background-color: #fafafa;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
```

## 内部结构

NavBar组件包含以下主要部分：

1. **导航容器 (NavContainer)** - 固定在底部的主容器
2. **导航包装器 (NavWrapper)** - 布局和对齐导航项
3. **导航项目 (NavItem)** - 单个导航链接，包含图标和文本
4. **活动指示器 (NavIndicator)** - 显示当前活动页面
5. **中央按钮 (CenterButton)** - 特殊的中央按钮区域

## 实现细节

- 使用`useLocation`钩子检测当前路由路径
- 使用`isActive`函数确定哪个导航项处于激活状态
- 监听`loginStateChanged`事件以响应登录状态变化
- 根据登录状态自动显示用户头像或默认图标
- 使用styled-components实现样式隔离和主题支持

## 最佳实践

- NavBar通常应该放在应用布局的底部
- 可以配合顶部栏(TopBar)一起使用，形成完整的应用框架
- 导航项数量应控制在3-5个之间，保持简洁
- 避免在NavBar中放置过多文字内容

## 相关组件

- [TopBar](../TopBar/README.md) - 顶部导航栏
- [BasePage](../BasePage/README.md) - 基础页面布局 