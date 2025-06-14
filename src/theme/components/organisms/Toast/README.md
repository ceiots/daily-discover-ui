# Toast 轻提示组件

轻提示组件用于在页面中显示简短的提示信息，支持多种样式和位置设置。

## 组件类型

Toast 组件提供两种类型的提示方式：

### 1. SimpleToast - 简单轻提示

最简单的轻提示，通过 ID 和 `showToast` 方法控制显示，适合简单的使用场景。

```jsx
import { SimpleToast, showToast } from '../../theme/components';

// 在组件中使用
function MyComponent() {
  const handleClick = () => {
    showToast('操作成功', 3000, 'toast-id');
  };
  
  return (
    <div>
      <button onClick={handleClick}>显示提示</button>
      <SimpleToast id="toast-id" />
    </div>
  );
}
```

### 2. Toast - 可配置轻提示

可配置的轻提示组件，支持不同类型、位置和自动关闭功能。

```jsx
import { Toast } from '../../theme/components';
import { useState } from 'react';

function MyComponent() {
  const [visible, setVisible] = useState(false);
  
  const showToast = () => setVisible(true);
  const hideToast = () => setVisible(false);
  
  return (
    <div>
      <button onClick={showToast}>显示提示</button>
      <Toast 
        message="操作成功" 
        type="success" 
        position="top" 
        duration={3000}
        visible={visible} 
        onClose={hideToast} 
      />
    </div>
  );
}
```

## 组件 API

### SimpleToast 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| id | string | 'toast' | Toast 元素的 ID，用于通过 `showToast` 函数控制 |

### Toast 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| message | string | - | 提示信息内容（必填） |
| type | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | 提示类型 |
| duration | number | 3000 | 显示时长（毫秒），设为 0 则不自动关闭 |
| position | 'top' \| 'bottom' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'center' | 'center' | 提示显示位置 |
| visible | boolean | false | 是否显示提示 |
| onClose | () => void | - | 关闭时的回调函数 |
| className | string | '' | 自定义类名 |

### showToast 方法

```js
showToast(message, duration, toastId);
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| message | string | - | 提示信息内容（必填） |
| duration | number | 3000 | 显示时长（毫秒） |
| toastId | string | 'toast' | 要显示的 Toast 元素 ID |

## 样式定制

Toast 组件的样式使用 UI 常量系统，包括颜色、尺寸和动画等，可通过修改 `uiConstants.js` 进行全局定制。

```jsx
// 自定义样式示例
<ToastContainer 
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderLeft: '3px solid #5B47E8'
  }}
  className="custom-toast"
>
  自定义提示内容
</ToastContainer>
```

## 最佳实践

1. **简单场景**：使用 SimpleToast + showToast 方法，无需管理状态
2. **复杂场景**：使用 Toast 组件，可精确控制显示行为和样式
3. **全局通知**：可在 App 根组件中设置全局 Toast，通过事件总线或上下文控制 