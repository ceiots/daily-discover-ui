import React, { useEffect } from 'react';

// 默认内联占位图片，直接编码避免外部依赖
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjYWFhIj7lm77niYflt7LliqDovb08L3RleHQ+PC9zdmc+';

// 这个组件会在挂载时修复所有图片
const FixImages = () => {
  useEffect(() => {
    // 处理所有图片加载错误
    const handleAllImageErrors = () => {
      const allImages = document.querySelectorAll('img');
      
      allImages.forEach(img => {
        // 确保宽度不超出
        img.style.maxWidth = '100%';
        
        // 为所有图片添加错误处理
        img.onerror = function(e) {
          // 阻止重复触发
          e.target.onerror = null;
          // 替换为默认图片
          e.target.src = DEFAULT_IMAGE;
        };
        
        // 去除所有ai-public.mastergo.com域名的图片
        if (img.src.includes('ai-public.mastergo.com')) {
          img.src = DEFAULT_IMAGE;
        }
      });
    };
    
    // 立即处理一次
    handleAllImageErrors();
    
    // 监听 DOM 变化，处理新添加的图片
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          handleAllImageErrors();
        }
      });
    });
    
    // 开始观察整个文档
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // 这个组件不渲染任何内容
  return null;
};

export default FixImages; 