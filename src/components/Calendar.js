import React from 'react';
import './Calendar.css';

const DailySelection = () => {
  return (
      <body className="text-gray-800 text-sm">
                <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">

                <header className="bg-primary text-white p-3">
                    <div className="flex justify-between items-center">
                    <div className="flex items-center">
                    <button className="text-white mr-2" id="prevDay"><i className="fas fa-chevron-left"></i></button>
                    <div>
                    <h1 className="text-lg font-semibold" id="currentDate">2025年1月3日</h1>
                    <p className="text-xs" id="lunarDate">农历腊月廿八 星期三</p>
                    </div>
                    <button className="text-white ml-2" id="nextDay"><i className="fas fa-chevron-right"></i></button>
                    </div>
                    <div className="flex items-center">
                    <i className="fas fa-calendar text-sm mr-2"></i>
                    <i className="fas fa-sun text-sm mr-2"></i>
                    <span className="text-sm" id="temperature">20°C</span>
                    </div>
                    </div>
                </header>

                <main className="flex-grow p-4 mb-16">

                        <section className="mb-6 bg-gradient-to-r from-primary to-indigo-500 rounded-lg p-4 text-white">
                        <h2 className="text-base font-semibold mb-2">AI助手</h2>
                        <div className="flex items-start">
                        <img src="https://ai-public.mastergo.com/ai/img_res/a5bb22994e55aad0f1dd10d5e239240a.jpg" alt="AI助手" className="w-10 h-10 rounded-full mr-3"/>
                        <div className="flex-grow">
                        <p className="text-xs mb-2">您好！今天我能为您做些什么？</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                        <button className="bg-white bg-opacity-20 text-xs py-1 px-2 rounded-full !rounded-button">日程安排</button>
                        <button className="bg-white bg-opacity-20 text-xs py-1 px-2 rounded-full !rounded-button">天气预报</button>
                        <button className="bg-white bg-opacity-20 text-xs py-1 px-2 rounded-full !rounded-button">生活建议</button>
                        </div>
                        <div className="flex items-center">
                        <input type="text" placeholder="输入您的问题..." className="flex-grow text-xs p-2 rounded-l-full !rounded-button bg-white bg-opacity-20 border-none focus:outline-none focus:ring-0 text-white placeholder-white placeholder-opacity-70"/>
                        <button className="bg-white bg-opacity-30 text-xs py-2 px-3 rounded-r-full !rounded-button">
                        <i className="fas fa-paper-plane"></i>
                        </button>
                        </div>
                        </div>
                        </div>
                        </section>

                        <section className="mb-6">
                        <h2 className="text-base font-semibold mb-2 text-primary">今日提示</h2>
                        <ul className="space-y-2">
                        <li className="flex items-start">
                        <i className="fas fa-briefcase text-primary mr-2 mt-1 text-xs"></i>
                        <p className="text-xs">会议准备：已备好晨会和产品评审会议材料，建议提前5分钟进入会议室</p>
                        </li>
                        <li className="flex items-start">
                        <i className="fas fa-lightbulb text-primary mr-2 mt-1 text-xs"></i>
                        <p className="text-xs">设计建议：下午的UI设计复盘会议，可以重点关注用户反馈和数据分析</p>
                        </li>
                        <li className="flex items-start">
                        <i className="fas fa-heart text-primary mr-2 mt-1 text-xs"></i>
                        <p className="text-xs">健康提醒：会议间隙注意适当休息，保持颈椎舒适，多喝水保持水分</p>
                        </li>
                        </ul>
                        </section>

                        <section className="mb-6 bg-primary bg-opacity-5 rounded-lg p-4">
                        <h2 className="text-base font-semibold mb-3 text-primary">每日发现</h2>
                        <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                        <img src="https://ai-public.mastergo.com/ai/img_res/478a3d09562a8d8b1689ea48cf980c23.jpg" alt="智能水杯" className="w-full h-20 object-cover rounded-lg mb-2"/>
                        <h3 className="text-xs font-medium text-center truncate">智能水杯</h3>
                        <p className="text-[10px] text-center text-gray-500">温度提醒</p>
                        <p className="text-xs font-semibold text-center text-primary mt-1">¥199</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                        <img src="https://ai-public.mastergo.com/ai/img_res/b1b51e2a101e7ef64265265c4cb99301.jpg" alt="人体工学椅" className="w-full h-20 object-cover rounded-lg mb-2"/>
                        <h3 className="text-xs font-medium text-center truncate">人体工学椅</h3>
                        <p className="text-[10px] text-center text-gray-500">舒适办公</p>
                        <p className="text-xs font-semibold text-center text-primary mt-1">¥1,299</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                        <img src="https://ai-public.mastergo.com/ai/img_res/63f98702070617620481ac6ea8dff875.jpg" alt="护眼台灯" className="w-full h-20 object-cover rounded-lg mb-2"/>
                        <h3 className="text-xs font-medium text-center truncate">护眼台灯</h3>
                        <p className="text-[10px] text-center text-gray-500">智能调光</p>
                        <p className="text-xs font-semibold text-center text-primary mt-1">¥68</p>
                        </div>
                        </div>
                        </section>
                        
                        <section className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-semibold text-primary">今日安排</h2>
                        <button className="text-primary text-sm">
                        <i className="fas fa-plus"></i>
                        </button>
                        </div>
                        <ul className="space-y-2">
                        <li className="flex items-center">
                        <span className="text-xs font-medium mr-2">09:30</span>
                        <span className="bg-primary bg-opacity-10 text-primary text-xs py-1 px-2 rounded">晨会 - 敏捷开发小组</span>
                        </li>
                        <li className="flex items-center">
                        <span className="text-xs font-medium mr-2">10:00</span>
                        <span className="bg-primary bg-opacity-10 text-primary text-xs py-1 px-2 rounded">产品评审会议 - 线上会议室</span>
                        </li>
                        <li className="flex items-center">
                        <span className="text-xs font-medium mr-2">14:00</span>
                        <span className="bg-primary bg-opacity-10 text-primary text-xs py-1 px-2 rounded">UI设计复盘 - 设计部门</span>
                        </li>
                        </ul>
                        </section>

                        <section>
                        <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-semibold text-primary">今日日记</h2>
                        <button className="text-primary text-sm">
                        <i className="fas fa-edit"></i>
                        </button>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-600">记录美好时光</p>
                            <p className="text-xs mt-2">完成了日程安排并准备好了会议材料，希望今天的评审会议能顺利进行。下午还要参加UI设计复盘，期待能有新的突破。</p>
                        </div>
                    </section>
                </main>
          </div>
     </body>
  );
};

export default DailySelection;