import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';

const ThemeShowcasePage = () => {
  const { mode, toggleMode, current, colors, typography, spacing, shadows } = useTheme();
  const [activeTab, setActiveTab] = useState('components');
  
  return (
    <div className="min-h-screen transition-colors duration-300" 
         style={{ backgroundColor: current.background, color: current.text }}>
      
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 p-4 shadow-md" 
              style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>每日发现</h1>
          <button 
            onClick={toggleMode}
            className="px-4 py-2 rounded-md transition-colors"
            style={{ 
              backgroundColor: current.primary,
              color: '#fff',
            }}
          >
            {mode === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
          </button>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">主题系统展示</h2>
          <p className="mb-4">当前主题模式: <strong>{mode}</strong></p>
          <p className="mb-2">这个页面展示了&quot;每日发现&quot;应用的设计系统和主题组件。</p>
        </div>
        
        {/* 标签导航 */}
        <div className="flex mb-6 border-b" style={{ borderColor: current.border }}>
          {['components', 'colors', 'typography', 'spacing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-2 ${activeTab === tab ? 'border-b-2 font-medium' : ''}`}
              style={{ 
                borderColor: activeTab === tab ? colors.primary : 'transparent',
                color: activeTab === tab ? colors.primary : current.text
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* 组件展示 */}
        {activeTab === 'components' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 按钮组件 */}
            <div className="p-6 rounded-lg shadow-md" 
                 style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
              <h3 className="text-xl font-semibold mb-4">按钮组件</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <button className="px-4 py-2 rounded-md" 
                        style={{ backgroundColor: colors.primary, color: '#fff' }}>
                  主按钮
                </button>
                <button className="px-4 py-2 rounded-md" 
                        style={{ backgroundColor: colors.secondary, color: '#fff' }}>
                  次按钮
                </button>
                <button className="px-4 py-2 rounded-md border" 
                        style={{ borderColor: colors.primary, color: colors.primary }}>
                  描边按钮
                </button>
                <button className="px-4 py-2 rounded-md" 
                        style={{ backgroundColor: colors.danger, color: '#fff' }}>
                  危险按钮
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-md text-sm" 
                        style={{ backgroundColor: colors.primary, color: '#fff' }}>
                  小按钮
                </button>
                <button className="px-4 py-2 rounded-md" 
                        style={{ backgroundColor: colors.primary, color: '#fff' }}>
                  中按钮
                </button>
                <button className="px-4 py-2 rounded-md text-lg" 
                        style={{ backgroundColor: colors.primary, color: '#fff' }}>
                  大按钮
                </button>
                <button className="px-4 py-2 rounded-md" disabled
                        style={{ backgroundColor: colors.neutral[300], color: colors.neutral[500] }}>
                  禁用按钮
                </button>
              </div>
            </div>
            
            {/* 卡片组件 */}
            <div className="p-6 rounded-lg shadow-md" 
                 style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
              <h3 className="text-xl font-semibold mb-4">卡片组件</h3>
              <div className="rounded-lg border p-4 mb-4" 
                   style={{ borderColor: current.border }}>
                <h4 className="font-medium mb-2">基础卡片</h4>
                <p className="text-sm" style={{ color: mode === 'dark' ? colors.neutral[400] : colors.neutral[600] }}>
                  这是一个基础卡片组件，用于展示内容。
                </p>
              </div>
              <div className="rounded-lg shadow-md p-4" 
                   style={{ boxShadow: shadows.medium }}>
                <h4 className="font-medium mb-2">阴影卡片</h4>
                <p className="text-sm" style={{ color: mode === 'dark' ? colors.neutral[400] : colors.neutral[600] }}>
                  带有阴影效果的卡片组件。
                </p>
              </div>
            </div>
            
            {/* 表单组件 */}
            <div className="p-6 rounded-lg shadow-md" 
                 style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
              <h3 className="text-xl font-semibold mb-4">表单组件</h3>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">用户名</label>
                <input 
                  type="text" 
                  placeholder="请输入用户名" 
                  className="w-full px-3 py-2 rounded-md border"
                  style={{ 
                    backgroundColor: mode === 'dark' ? colors.neutral[800] : '#fff',
                    borderColor: current.border,
                    color: current.text
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">密码</label>
                <input 
                  type="password" 
                  placeholder="请输入密码" 
                  className="w-full px-3 py-2 rounded-md border"
                  style={{ 
                    backgroundColor: mode === 'dark' ? colors.neutral[800] : '#fff',
                    borderColor: current.border,
                    color: current.text
                  }}
                />
              </div>
              <button className="w-full px-4 py-2 rounded-md" 
                      style={{ backgroundColor: colors.primary, color: '#fff' }}>
                登录
              </button>
            </div>
            
            {/* 标签组件 */}
            <div className="p-6 rounded-lg shadow-md" 
                 style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
              <h3 className="text-xl font-semibold mb-4">标签组件</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded-full" 
                      style={{ backgroundColor: colors.primary, color: '#fff' }}>
                  主标签
                </span>
                <span className="px-2 py-1 text-xs rounded-full" 
                      style={{ backgroundColor: colors.secondary, color: '#fff' }}>
                  次标签
                </span>
                <span className="px-2 py-1 text-xs rounded-full border" 
                      style={{ borderColor: colors.primary, color: colors.primary }}>
                  描边标签
                </span>
                <span className="px-2 py-1 text-xs rounded-full" 
                      style={{ backgroundColor: colors.success, color: '#fff' }}>
                  成功
                </span>
                <span className="px-2 py-1 text-xs rounded-full" 
                      style={{ backgroundColor: colors.warning, color: '#fff' }}>
                  警告
                </span>
                <span className="px-2 py-1 text-xs rounded-full" 
                      style={{ backgroundColor: colors.danger, color: '#fff' }}>
                  危险
                </span>
              </div>
            </div>
            
            {/* 商品卡片 */}
            <div className="p-6 rounded-lg shadow-md" 
                 style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
              <h3 className="text-xl font-semibold mb-4">商品卡片</h3>
              <div className="rounded-lg overflow-hidden border" 
                   style={{ borderColor: current.border }}>
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">商品图片</span>
                </div>
                <div className="p-3">
                  <h4 className="font-medium mb-1 line-clamp-2">每日发现精选商品标题示例文本</h4>
                  <p className="text-sm mb-2" style={{ color: mode === 'dark' ? colors.neutral[400] : colors.neutral[600] }}>
                    商品简短描述信息
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold" style={{ color: colors.danger }}>¥99.00</span>
                    <button className="px-3 py-1 rounded-md text-sm" 
                            style={{ backgroundColor: colors.primary, color: '#fff' }}>
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 导航组件 */}
            <div className="p-6 rounded-lg shadow-md" 
                 style={{ backgroundColor: current.background, boxShadow: current.shadow }}>
              <h3 className="text-xl font-semibold mb-4">导航组件</h3>
              <div className="flex justify-around p-3 rounded-lg" 
                   style={{ backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.neutral[100] }}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full mb-1" 
                       style={{ backgroundColor: colors.primary }}></div>
                  <span className="text-xs" style={{ color: colors.primary }}>每日</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full mb-1" 
                       style={{ backgroundColor: mode === 'dark' ? colors.neutral[600] : colors.neutral[400] }}></div>
                  <span className="text-xs">发现</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full mb-1" 
                       style={{ backgroundColor: mode === 'dark' ? colors.neutral[600] : colors.neutral[400] }}></div>
                  <span className="text-xs">我的</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 颜色展示 */}
        {activeTab === 'colors' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">颜色系统</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="h-20 rounded-md mb-2" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs opacity-70">{colors.primary}</p>
              </div>
              <div>
                <div className="h-20 rounded-md mb-2" style={{ backgroundColor: colors.secondary }}></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs opacity-70">{colors.secondary}</p>
              </div>
              <div>
                <div className="h-20 rounded-md mb-2" style={{ backgroundColor: colors.success }}></div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs opacity-70">{colors.success}</p>
              </div>
              <div>
                <div className="h-20 rounded-md mb-2" style={{ backgroundColor: colors.danger }}></div>
                <p className="text-sm font-medium">Danger</p>
                <p className="text-xs opacity-70">{colors.danger}</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-3">中性色</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(weight => (
                <div key={weight}>
                  <div 
                    className="h-12 rounded-md mb-1" 
                    style={{ backgroundColor: colors.neutral[weight] }}
                  ></div>
                  <p className="text-xs">Neutral {weight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 排版展示 */}
        {activeTab === 'typography' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">排版系统</h3>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-3">标题</h4>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold">H1 标题</h1>
                  <p className="text-xs mt-1 opacity-70">4xl / Bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">H2 标题</h2>
                  <p className="text-xs mt-1 opacity-70">3xl / Bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">H3 标题</h3>
                  <p className="text-xs mt-1 opacity-70">2xl / Semibold</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">H4 标题</h4>
                  <p className="text-xs mt-1 opacity-70">xl / Semibold</p>
                </div>
                <div>
                  <h5 className="text-lg font-medium">H5 标题</h5>
                  <p className="text-xs mt-1 opacity-70">lg / Medium</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">正文</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-base">基础正文 - 这是一段示例文本，用于展示基础正文的样式。每日发现致力于为用户提供个性化的内容和商品推荐。</p>
                  <p className="text-xs mt-1 opacity-70">base</p>
                </div>
                <div>
                  <p className="text-sm">小号文本 - 这是一段示例文本，用于展示小号文本的样式。适合用于辅助说明、注释等次要信息。</p>
                  <p className="text-xs mt-1 opacity-70">sm</p>
                </div>
                <div>
                  <p className="text-xs">超小号文本 - 这是一段示例文本，用于展示超小号文本的样式。适合用于极小的提示信息。</p>
                  <p className="text-xs mt-1 opacity-70">xs</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 间距展示 */}
        {activeTab === 'spacing' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">间距系统</h3>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-3">水平间距</h4>
              <div className="flex items-center mb-6" style={{ backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.neutral[100] }}>
                {[1, 2, 3, 4, 6, 8].map(space => (
                  <div 
                    key={space}
                    className={`h-16 border-r last:border-r-0`}
                    style={{ 
                      width: `${space * 0.25}rem`,
                      borderColor: colors.primary,
                      backgroundColor: colors.primary,
                      opacity: 0.7
                    }}
                  >
                    <div className="text-xs text-center text-white mt-2">{space}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">垂直间距</h4>
              <div style={{ backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.neutral[100] }}>
                {[1, 2, 3, 4, 6, 8].map(space => (
                  <div 
                    key={space}
                    className="w-full border-b last:border-b-0 flex items-center justify-center"
                    style={{ 
                      height: `${space * 0.25}rem`,
                      borderColor: colors.primary,
                      backgroundColor: colors.primary,
                      opacity: 0.7
                    }}
                  >
                    <div className="text-xs text-white">{space}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* 底部导航 */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t" 
              style={{ 
                backgroundColor: current.background, 
                borderColor: current.border,
                boxShadow: shadows.upward
              }}>
        <div className="container mx-auto flex justify-around">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full mb-1" 
                 style={{ backgroundColor: colors.primary }}></div>
            <span className="text-xs" style={{ color: colors.primary }}>每日</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full mb-1" 
                 style={{ backgroundColor: mode === 'dark' ? colors.neutral[600] : colors.neutral[400] }}></div>
            <span className="text-xs">发现</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full mb-1" 
                 style={{ backgroundColor: mode === 'dark' ? colors.neutral[600] : colors.neutral[400] }}></div>
            <span className="text-xs">我的</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThemeShowcasePage; 