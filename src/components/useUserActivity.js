import { useEffect } from 'react';
import { useAuth } from '../../App';
import instance from '../../utils/axios';

export const useUserActivity = (productId, categoryId) => {
  const { userInfo } = useAuth();
  
  // 记录页面浏览
  useEffect(() => {
    const recordView = async () => {
      if (!userInfo || !userInfo.id || !productId) return;
      
      try {
        await instance.post('/user/browsing/record', {
          userId: userInfo.id,
          productId: productId,
          categoryId: categoryId,
          browseTime: new Date().toISOString()
        });
      } catch (error) {
        console.error('记录浏览历史失败:', error);
      }
    };
    
    recordView();
    
    // 记录停留时间
    const startTime = Date.now();
    return () => {
      const duration = (Date.now() - startTime) / 1000; // 秒
      if (duration > 5 && userInfo && userInfo.id) { // 只记录停留超过5秒的浏览
        instance.post('/user/browsing/duration', {
          userId: userInfo.id,
          productId: productId,
          categoryId: categoryId,
          duration: duration
        }).catch(error => {
          console.error('记录浏览时长失败:', error);
        });
      }
    };
  }, [userInfo, productId, categoryId]);
};

