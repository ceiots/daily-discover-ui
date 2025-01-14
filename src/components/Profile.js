import React from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { userAvatar } = useAuth();

  return (
    <body>
    <div className="profile-card px-4 pt-12 pb-6 text-white">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium">个人中心</h1>
            <div className="flex gap-4">
                <i className="fas fa-bell text-lg"></i>
                <i className="fas fa-cog text-lg"></i>
            </div>
          </div>
          <div className="flex items-center">
            <img src={userAvatar} alt="用户头像" className="w-20 h-20 rounded-full object-cover mr-4" />
            <div>
                <h2 className="text-lg font-medium">陈明远</h2>
                <p className="text-sm opacity-80">分享生活，记录精彩</p>
            </div>
        </div>

        <div className="flex justify-between text-center mb-6">
            <div className="stats-item flex-1">
                <div className="text-lg font-medium">268</div>
                <div className="text-sm opacity-80">关注</div>
            </div>
            <div className="stats-item flex-1">
                <div className="text-lg font-medium">5.8k</div>
                <div className="text-sm opacity-80">粉丝</div>
            </div>
            <div className="stats-item flex-1">
                <div className="text-lg font-medium">12.6k</div>
                <div className="text-sm opacity-80">获赞</div>
            </div>
        </div>
    </div>

    <div className="px-4 mt-6">
        <div className="feature-grid">
            <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                    <i className="fas fa-heart text-primary"></i>
                </div>
                <span className="text-sm text-gray-600">我的收藏</span>
            </div>
            <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                    <i className="fas fa-history text-primary"></i>
                </div>
                <span className="text-sm text-gray-600">浏览历史</span>
            </div>
            <div className="text-center">
                <Link to="/order-list" className="flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-shopping-bag text-primary"></i>
                    </div>
                    <span className="text-sm text-gray-600">我的订单</span>
                </Link>
            </div>
        </div>
        <div className="discover-section">
            <h3 className="text-lg font-medium mb-4">每日发现</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-sm">
                    <img src="https://ai-public.mastergo.com/ai/img_res/3e73b4a61ccc12d2fb627d75d31dad9a.jpg" 
                         className="w-full h-40 object-cover" alt="发现"/>
                    <div className="p-2">
                        <h4 className="text-sm font-medium">探索城市之美</h4>
                        <p className="text-xs text-gray-500 mt-1">发现身边的精彩故事</p>
                    </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-sm">
                    <img src="https://ai-public.mastergo.com/ai/img_res/0f8e1c23603b2658a7ca17b2333e6492.jpg" 
                         className="w-full h-40 object-cover" alt="发现"/>
                    <div className="p-2">
                        <h4 className="text-sm font-medium">美食探店</h4>
                        <p className="text-xs text-gray-500 mt-1">寻找城市味蕾</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
  );
};

export default Profile; 