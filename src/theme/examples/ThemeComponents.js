import React, { useState } from 'react';
import { 
  BasePage, 
  Button, 
  Card, 
  unifiedTheme, 
  styleUtils, 
  PageTemplate 
} from '../index';
import { useTheme } from '../ThemeProvider';

/**
 * 主题组件展示页
 * 用于展示和测试主题系统中的组件
 */
const ThemeComponentsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('buttons');
  
  const tabStyle = {
    container: {
      display: 'flex',
      borderBottom: `1px solid ${theme.colors.neutral[300]}`,
      marginBottom: '24px',
    },
    tab: {
      padding: '12px 24px',
      cursor: 'pointer',
      fontWeight: 600,
      color: theme.colors.neutral[600],
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    activeTab: {
      color: theme.colors.primary,
    },
    indicator: {
      position: 'absolute',
      bottom: '-1px',
      left: 0,
      right: 0,
      height: '3px',
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: '2px',
      borderTopRightRadius: '2px',
    }
  };
  
  // 按钮展示区域
  const ButtonsSection = () => {
    return (
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">按钮组件</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">按钮类型</h3>
          <div className="flex flex-wrap gap-4">
            <Button type="primary">主要按钮</Button>
            <Button type="secondary">次要按钮</Button>
            <Button type="outline">边框按钮</Button>
            <Button type="text">文本按钮</Button>
            <Button type="danger">危险按钮</Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">按钮状态</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button type="primary">默认按钮</Button>
            <Button type="primary" loading={true}>加载中</Button>
            <Button type="primary" disabled>禁用按钮</Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">按钮尺寸</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button type="primary" size="small">小号按钮</Button>
            <Button type="primary" size="medium">中号按钮</Button>
            <Button type="primary" size="large">大号按钮</Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">块级按钮</h3>
          <div className="max-w-md">
            <Button type="primary" block className="mb-2">块级主要按钮</Button>
            <Button type="secondary" block>块级次要按钮</Button>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">带图标按钮</h3>
          <div className="flex flex-wrap gap-4">
            <Button 
              type="primary" 
              icon={<i className="fas fa-plus" style={{ marginRight: '8px' }}></i>}
            >
              创建新项目
            </Button>
            <Button 
              type="outline" 
              icon={<i className="fas fa-download" style={{ marginRight: '8px' }}></i>}
            >
              下载文件
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // 卡片展示区域
  const CardsSection = () => {
    return (
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">卡片组件</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            title="基础卡片" 
            subtitle="卡片基本用法展示"
          >
            <p className="text-neutral-600">这是一个基础卡片示例，展示了卡片的基本结构和样式。</p>
          </Card>
          
          <Card 
            title="带封面图卡片" 
            subtitle="带图片的卡片示例"
            cover="https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
          >
            <p className="text-neutral-600">卡片可以包含封面图，增强视觉呈现效果。</p>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card 
            title="带操作按钮的卡片" 
            actions={[
              <Button type="text" key="edit">编辑</Button>,
              <Button type="primary" key="view">查看</Button>
            ]}
          >
            <p className="text-neutral-600">卡片底部可以添加操作按钮，方便用户进行相关操作。</p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverable>
            <h3 className="font-medium text-lg mb-2">悬停效果卡片</h3>
            <p className="text-neutral-600">鼠标悬停时会有阴影效果增强的卡片。</p>
          </Card>
          
          <Card bordered={false} shadow="lg">
            <h3 className="font-medium text-lg mb-2">无边框卡片</h3>
            <p className="text-neutral-600">没有边框但有较深阴影的卡片。</p>
          </Card>
          
          <Card className="bg-primary-50">
            <h3 className="font-medium text-lg mb-2">自定义背景卡片</h3>
            <p className="text-neutral-600">可以自定义背景颜色的卡片。</p>
          </Card>
        </div>
      </div>
    );
  };
  
  // 表单控件展示区域
  const FormSection = () => {
    const [formState, setFormState] = useState({
      username: '',
      password: '',
      remember: false,
      gender: '',
      description: ''
    });
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormState({
        ...formState,
        [name]: type === 'checkbox' ? checked : value
      });
    };
    
    const inputStyle = {
      width: '100%',
      height: '44px',
      padding: '0 16px',
      border: `1.5px solid ${theme.colors.neutral[300]}`,
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      marginBottom: '16px',
    };
    
    const labelStyle = {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: theme.colors.neutral[700],
      marginBottom: '6px',
    };
    
    return (
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">表单控件</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <form className="mb-8">
              <div className="mb-4">
                <label style={labelStyle} htmlFor="username">用户名</label>
                <input 
                  id="username"
                  name="username"
                  type="text" 
                  placeholder="请输入用户名"
                  value={formState.username}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              
              <div className="mb-4">
                <label style={labelStyle} htmlFor="password">密码</label>
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="请输入密码"
                  value={formState.password}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              
              <div className="mb-4">
                <label style={labelStyle}>性别</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male"
                      checked={formState.gender === 'male'}
                      onChange={handleChange}
                      className="mr-2"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    男
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female"
                      checked={formState.gender === 'female'}
                      onChange={handleChange}
                      className="mr-2"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    女
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label style={labelStyle} htmlFor="description">个人简介</label>
                <textarea 
                  id="description"
                  name="description"
                  placeholder="请输入个人简介"
                  value={formState.description}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    ...inputStyle,
                    height: 'auto',
                    padding: '12px 16px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="remember" 
                    checked={formState.remember}
                    onChange={handleChange}
                    className="mr-2"
                    style={{ 
                      accentColor: theme.colors.primary,
                      width: '18px',
                      height: '18px'
                    }}
                  />
                  <span className="text-neutral-700">记住我</span>
                </label>
              </div>
              
              <Button type="primary" block>提交表单</Button>
            </form>
          </div>
          
          <Card title="表单数据预览" subtitle="实时更新">
            <pre style={{
              backgroundColor: theme.colors.neutral[100],
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto'
            }}>
              {JSON.stringify(formState, null, 2)}
            </pre>
          </Card>
        </div>
      </div>
    );
  };

  // 渲染当前活动标签页内容
  const renderContent = () => {
    switch (activeTab) {
      case 'buttons':
        return <ButtonsSection />;
      case 'cards':
        return <CardsSection />;
      case 'forms':
        return <FormSection />;
      default:
        return <ButtonsSection />;
    }
  };

  return (
    <PageTemplate
      title="主题组件示例"
      subtitle="展示各种UI组件的使用和样式"
      backgroundStyle="gradient"
    >
      {/* 标签页导航 */}
      <div style={tabStyle.container}>
        <div 
          style={{
            ...tabStyle.tab,
            ...(activeTab === 'buttons' ? tabStyle.activeTab : {})
          }}
          onClick={() => setActiveTab('buttons')}
        >
          按钮
          {activeTab === 'buttons' && <div style={tabStyle.indicator} />}
        </div>
        <div 
          style={{
            ...tabStyle.tab,
            ...(activeTab === 'cards' ? tabStyle.activeTab : {})
          }}
          onClick={() => setActiveTab('cards')}
        >
          卡片
          {activeTab === 'cards' && <div style={tabStyle.indicator} />}
        </div>
        <div 
          style={{
            ...tabStyle.tab,
            ...(activeTab === 'forms' ? tabStyle.activeTab : {})
          }}
          onClick={() => setActiveTab('forms')}
        >
          表单
          {activeTab === 'forms' && <div style={tabStyle.indicator} />}
        </div>
      </div>
      
      {/* 内容区域 */}
      {renderContent()}
    </PageTemplate>
  );
};

export default ThemeComponentsPage; 