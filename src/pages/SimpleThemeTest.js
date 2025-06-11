import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

const SimpleThemeTest = () => {
  const { mode, toggleMode, current } = useTheme();
  
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: current.background, color: current.text }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">主题系统测试页面</h1>
        <p className="mb-4">当前主题模式: <strong>{mode}</strong></p>
        
        <button 
          onClick={toggleMode}
          className="px-4 py-2 mb-8 rounded-md"
          style={{ 
            backgroundColor: current.primary,
            color: '#fff',
            border: 'none'
          }}
        >
          切换主题模式
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="p-4 rounded-lg shadow-md" 
            style={{ 
              backgroundColor: current.background, 
              borderColor: current.border,
              borderWidth: '1px',
              boxShadow: current.shadow
            }}
          >
            <h2 className="text-xl font-semibold mb-2">卡片组件</h2>
            <p>这是一个使用主题系统样式的卡片组件。</p>
          </div>
          
          <div 
            className="p-4 rounded-lg shadow-md" 
            style={{ 
              backgroundColor: current.background, 
              borderColor: current.border,
              borderWidth: '1px',
              boxShadow: current.shadow
            }}
          >
            <h2 className="text-xl font-semibold mb-2">按钮示例</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                className="px-3 py-1 rounded-md"
                style={{ backgroundColor: current.primary, color: '#fff' }}
              >
                主按钮
              </button>
              <button 
                className="px-3 py-1 rounded-md"
                style={{ 
                  backgroundColor: 'transparent', 
                  borderColor: current.primary,
                  borderWidth: '1px',
                  color: current.primary
                }}
              >
                次按钮
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleThemeTest; 