# Daily Discover 主题系统

这是 Daily Discover App 的主题系统，提供了统一的设计语言和组件，确保整个应用保持一致的视觉风格。

## 主要功能

- **主题变量**：集中管理颜色、字体、间距等设计变量
- **CSS变量**：通过CSS变量实现主题的全局应用
- **基础组件**：提供可复用的页面布局和UI组件
- **暗色模式**：自动支持系统暗色模式

## 使用方法

### 1. 在应用根组件中引入主题提供者

```jsx
// App.js
import React from 'react';
import { ThemeProvider } from './theme';

function App() {
  return (
    <ThemeProvider>
      {/* 你的应用内容 */}
    </ThemeProvider>
  );
}

export default App;
```

### 2. 使用基础页面组件

```jsx
// YourPage.js
import React from 'react';
import { BasePage } from './theme';

function YourPage() {
  return (
    <BasePage 
      title="页面标题"
      showHeader={true}
    >
      <div>
        {/* 页面内容 */}
        <h2>你的页面内容</h2>
        <p>这是一个使用主题系统的页面</p>
      </div>
    </BasePage>
  );
}

export default YourPage;
```

### 3. 在组件中使用主题变量

```jsx
// YourComponent.js
import React from 'react';
import { useTheme } from './theme';

function YourComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ 
      color: theme.colors.primary.main,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md
    }}>
      使用主题变量的组件
    </div>
  );
}

export default YourComponent;
```

### 4. 使用CSS类

```jsx
function YourComponent() {
  return (
    <div className="card rounded-lg shadow-md">
      <div className="card-header">
        <h3 className="card-title">卡片标题</h3>
      </div>
      <div className="card-content">
        <p>卡片内容</p>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary">确认</button>
        <button className="btn btn-outline">取消</button>
      </div>
    </div>
  );
}
```

## 可用的CSS类

### 布局

- `page-container` - 页面容器
- `page-header` - 页面头部
- `page-content` - 页面内容区域
- `page-footer` - 页面底部

### 颜色

- `text-primary` - 主色文本
- `text-secondary` - 次要文本
- `bg-primary` - 主色背景
- `bg-gradient-primary` - 主色渐变背景

### 组件

- `card` - 卡片容器
- `btn` - 按钮
- `btn-primary` - 主色按钮
- `btn-outline` - 轮廓按钮
- `form-control` - 表单控件
- `list` - 列表
- `badge` - 徽章

## 主题变量

主题系统提供了以下变量类别：

- `colors` - 颜色系统
- `typography` - 字体大小
- `spacing` - 间距系统
- `borderRadius` - 圆角
- `shadows` - 阴影
- `animation` - 动画参数
- `breakpoints` - 响应式断点
- `safeArea` - 安全区域

## 自定义主题

如需自定义主题，可以修改 `theme.js` 文件中的变量值。 