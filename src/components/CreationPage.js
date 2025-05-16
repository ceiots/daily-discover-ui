import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreationPage.css';

const CreationPage = () => {
  const navigate = useNavigate();

  const handleContentCreation = () => {
    navigate('/content-creation');
  };

  const handleEcommerceCreation = () => {
    navigate('/ecommerce-creation');
  };

  return (
    <div className="creation-page-container pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">创作中心</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-16 px-4">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">选择创作类型</h2>
          <p className="text-gray-500 text-sm">选择您想要创建的内容类型</p>
        </div>

        {/* 创作选项卡片 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 图文创作卡片 */}
          <div 
            className="creation-card bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            onClick={handleContentCreation}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-pen-fancy text-primary text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium">图文创作</h3>
                <p className="text-gray-500 text-xs mt-1">创建文章、图片等内容</p>
              </div>
              <i className="fas fa-chevron-right text-gray-300"></i>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-gray-50 rounded p-2 flex flex-col items-center">
                <i className="fas fa-file-alt text-gray-400 mb-1"></i>
                <span className="text-xs text-gray-500">文章</span>
              </div>
              <div className="bg-gray-50 rounded p-2 flex flex-col items-center">
                <i className="fas fa-image text-gray-400 mb-1"></i>
                <span className="text-xs text-gray-500">图片</span>
              </div>
              <div className="bg-gray-50 rounded p-2 flex flex-col items-center">
                <i className="fas fa-video text-gray-400 mb-1"></i>
                <span className="text-xs text-gray-500">视频</span>
              </div>
            </div>
          </div>

          {/* 电商创建卡片 */}
          { <div 
            className="creation-card bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            onClick={handleEcommerceCreation}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-shopping-bag text-primary text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium">电商创建</h3>
                <p className="text-gray-500 text-xs mt-1">创建商品、店铺等电商内容</p>
              </div>
              <i className="fas fa-chevron-right text-gray-300"></i>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-gray-50 rounded p-2 flex flex-col items-center">
                <i className="fas fa-box text-gray-400 mb-1"></i>
                <span className="text-xs text-gray-500">商品</span>
              </div>
              <div className="bg-gray-50 rounded p-2 flex flex-col items-center">
                <i className="fas fa-store text-gray-400 mb-1"></i>
                <span className="text-xs text-gray-500">店铺</span>
              </div>
              {/* <div className="bg-gray-50 rounded p-2 flex flex-col items-center">
                <i className="fas fa-tags text-gray-400 mb-1"></i>
                <span className="text-xs text-gray-500">优惠</span>
              </div> */}
            </div>
          </div> }
        </div>

        {/* 最近创作 */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-medium mb-3">最近创作</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-20 text-gray-400">
              <p className="text-sm">暂无最近创作内容</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CreationPage;
