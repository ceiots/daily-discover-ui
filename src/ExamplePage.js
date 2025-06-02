import React, { useState } from 'react';
import { BasePage, Button, Card, useTheme } from './theme';

/**
 * 示例页面 - 展示如何使用主题系统
 */
const ExamplePage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 模拟加载
  const handleLoadData = () => {
    setLoading(true);
    setError(null);
    
    // 模拟API请求
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70%成功率
      if (success) {
        setLoading(false);
      } else {
        setError('加载数据失败，请重试');
        setLoading(false);
      }
    }, 1500);
  };

  // 头部左侧返回按钮
  const headerLeft = (
    <button className="btn" onClick={() => console.log('返回')}>
      <i className="fas fa-arrow-left"></i>
    </button>
  );

  // 头部右侧更多按钮
  const headerRight = (
    <button className="btn" onClick={() => console.log('更多')}>
      <i className="fas fa-ellipsis-v"></i>
    </button>
  );

  return (
    <BasePage
      title="主题系统示例"
      headerTitle="主题系统示例"
      headerLeft={headerLeft}
      headerRight={headerRight}
      loading={loading}
      error={error}
      onRefresh={handleLoadData}
    >
      <div className="animate-fade-in">
        {/* 主题色展示 */}
        <Card title="主题色展示" className="animate-slide-up">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: theme.colors.primary.light,
                borderRadius: theme.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              浅紫
            </div>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: theme.colors.primary.main,
                borderRadius: theme.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              主紫
            </div>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: theme.colors.primary.dark,
                borderRadius: theme.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              深紫
            </div>
          </div>
        </Card>

        {/* 按钮展示 */}
        <Card title="按钮组件" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button variant="primary">主按钮</Button>
            <Button variant="secondary">次按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="primary" size="sm">小按钮</Button>
            <Button variant="primary" size="lg">大按钮</Button>
            <Button variant="primary" disabled>禁用按钮</Button>
            <Button 
              variant="primary" 
              icon={<i className="fas fa-plus" style={{ marginRight: '4px' }}></i>}
            >
              图标按钮
            </Button>
          </div>
        </Card>

        {/* 卡片展示 */}
        <Card 
          title="卡片组件" 
          subtitle="支持标题、副标题和页脚" 
          className="animate-slide-up" 
          style={{ animationDelay: '0.2s' }}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="outline" size="sm">取消</Button>
              <Button variant="primary" size="sm">确认</Button>
            </div>
          }
        >
          <p className="text-secondary">
            这是卡片内容区域，可以放置任何内容。卡片组件支持不同的阴影和内边距设置。
          </p>
        </Card>

        {/* 可点击卡片 */}
        <Card 
          title="可点击卡片" 
          onClick={() => alert('卡片被点击了')}
          className="animate-slide-up" 
          style={{ animationDelay: '0.3s' }}
          shadow="md"
        >
          <p className="text-secondary">点击此卡片会触发事件</p>
        </Card>

        {/* CSS类展示 */}
        <Card title="CSS类展示" className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="form-group">
            <label className="form-label">表单输入框</label>
            <input type="text" className="form-control" placeholder="请输入内容" />
          </div>
          
          <div className="divider"></div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span className="badge">默认</span>
            <span className="badge badge-success">成功</span>
            <span className="badge badge-warning">警告</span>
            <span className="badge badge-error">错误</span>
            <span className="badge badge-info">信息</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="text-primary">主色文本</p>
            <p className="text-secondary">次要文本</p>
            <p className="text-disabled">禁用文本</p>
            <p className="text-hint">提示文本</p>
          </div>
        </Card>

        {/* 加载按钮 */}
        <div className="animate-slide-up" style={{ marginTop: '16px', animationDelay: '0.5s' }}>
          <Button 
            variant="primary" 
            block 
            onClick={handleLoadData}
            disabled={loading}
          >
            {loading ? '加载中...' : '点击加载数据'}
          </Button>
        </div>
      </div>
    </BasePage>
  );
};

export default ExamplePage; 