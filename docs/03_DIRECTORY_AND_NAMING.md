# 3. 目录结构与文件命名规范

## 3.1 `src` 目录结构 (唯一标准)
```
src/
├── assets/               # 静态资源 (图片、字体、全局样式)
├── components/           # 全局业务组件 (多个页面复用，但不属于theme)
├── constants/            # 全局常量 (API路径、业务常量)
├── hooks/                # 全局业务Hooks (如 useAuth, useCart)
├── layouts/              # 页面布局骨架组件
├── pages/                # 页面级组件 (一个文件代表一个页面)
├── routes/               # 路由配置
├── services/             # 数据服务层
│   ├── http/             # HTTP基础服务 (Axios实例, 拦截器, 缓存)
│   └── api/              # API模块 (按业务拆分)
├── store/                # 全局状态管理 (Redux)
├── theme/                # 主题与UI组件系统 (原子设计)
│   ├── components/       # UI基础组件 (atoms, molecules, etc.)
│   ├── hooks/            # UI组件专用逻辑Hooks (如 useToast)
│   ├── providers/        # 主题/全局上下文提供者
│   ├── styles/           # 样式工具与常量
│   └── tokens.js         # 设计令牌
├── types/                # (建议新增, for TS) 全局类型定义
├── utils/                # 通用工具函数
├── App.js                # 应用根组件
└── index.js              # 应用渲染入口
```

## 3.2 文件命名规范

- **组件 (Pages, Components, Theme)**: **PascalCase** (`ProductDetail.js`, `BasePage.js`, `Button.js`)。
- **Hooks**: **camelCase**，以`use`开头 (`useAuth.js`, `useToast.js`)。
- **其他 (utils, services, constants)**: **camelCase** (`format.js`, `userService.js`)。
- **样式文件**: 与关联的组件同名 (`ProductDetail.css`)。 