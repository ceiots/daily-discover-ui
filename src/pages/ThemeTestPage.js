import React from 'react';
import { ThemeProvider, useTheme, Button, Card } from '../theme';

const ThemeDemo = () => {
  const theme = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold mb-6" style={{ color: theme.current.text }}>
        Theme 主题系统演示
      </h1>
      <div className="mb-4">
        <Button type="primary" className="mr-2" onClick={theme.toggleMode}>
          切换主题（当前：{theme.mode}）
        </Button>
        <Button type="secondary" className="mr-2">次要按钮</Button>
        <Button type="outline" className="mr-2">描边按钮</Button>
        <Button type="danger" className="mr-2">危险按钮</Button>
        <Button type="text">文字按钮</Button>
      </div>
      <div className="w-full max-w-md">
        <Card
          title="卡片标题"
          subtitle="副标题"
          shadow="md"
          hoverable
          actions={<Button type="primary">操作</Button>}
        >
          <p className="text-neutral-700 dark:text-neutral-200">
            这是一个主题系统下的卡片组件，支持暗黑/明亮模式切换。
          </p>
        </Card>
      </div>
    </div>
  );
};

const ThemeTestPage = () => (
  <ThemeProvider>
    <ThemeDemo />
  </ThemeProvider>
);

export default ThemeTestPage; 