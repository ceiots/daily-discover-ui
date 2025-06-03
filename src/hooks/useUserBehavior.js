import { useEffect, useRef } from 'react';
import { useAuth } from '../App';
import instance from '../utils/axios';

/**
 * 用户行为跟踪钩子
 * 
 * 用法示例:
 * 
 * ```jsx
 * // 在商品详情页中
 * const ProductDetail = ({ product }) => {
 *   const { trackView, trackClick, trackStay } = useUserBehavior({
 *     productId: product.id,
 *     categoryId: product.categoryId
 *   });
 *   
 *   // 组件加载时自动记录浏览行为
 *   // 停留时间在组件卸载时自动记录
 *   
 *   return (
 *     <div>
 *       <h1>{product.name}</h1>
 *       <button onClick={() => trackClick('buy-button')}>购买</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useUserBehavior = ({ productId, categoryId }) => {
  const { userInfo } = useAuth();
  const startTimeRef = useRef(Date.now());
  
  // 记录浏览行为
  const trackView = () => {
    if (!userInfo?.id || !productId) return;
    
    try {
      instance.post('/user/behavior/view', {
        productId,
        categoryId
      });
    } catch (error) {
      console.error('记录浏览行为失败:', error);
    }
  };
  
  // 记录点击行为
  const trackClick = (elementId, extraData = {}) => {
    if (!userInfo?.id || !productId) return;
    
    try {
      instance.post('/user/behavior/click', {
        productId,
        categoryId,
        extraData: JSON.stringify({
          elementId,
          ...extraData
        })
      });
    } catch (error) {
      console.error('记录点击行为失败:', error);
    }
  };
  
  // 记录停留行为
  const trackStay = (duration) => {
    if (!userInfo?.id || !productId) return;
    
    try {
      instance.post('/user/behavior/stay', {
        productId,
        categoryId,
        duration
      });
    } catch (error) {
      console.error('记录停留行为失败:', error);
    }
  };
  
  // 记录收藏行为
  const trackFavorite = () => {
    if (!userInfo?.id || !productId) return;
    
    try {
      instance.post('/user/behavior/record', {
        productId,
        categoryId,
        behaviorType: 'FAVORITE',
        behaviorTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('记录收藏行为失败:', error);
    }
  };
  
  // 记录评价行为
  const trackComment = (rating, content) => {
    if (!userInfo?.id || !productId) return;
    
    try {
      instance.post('/user/behavior/record', {
        productId,
        categoryId,
        behaviorType: 'COMMENT',
        behaviorTime: new Date().toISOString(),
        extraData: JSON.stringify({
          rating,
          content
        })
      });
    } catch (error) {
      console.error('记录评价行为失败:', error);
    }
  };
  
  // 记录分享行为
  const trackShare = (platform) => {
    if (!userInfo?.id || !productId) return;
    
    try {
      instance.post('/user/behavior/record', {
        productId,
        categoryId,
        behaviorType: 'SHARE',
        behaviorTime: new Date().toISOString(),
        extraData: JSON.stringify({
          platform
        })
      });
    } catch (error) {
      console.error('记录分享行为失败:', error);
    }
  };
  
  // 组件加载时记录浏览行为，卸载时记录停留时间
  useEffect(() => {
    if (userInfo?.id && productId) {
      // 记录浏览行为
      trackView();
      
      // 组件卸载时记录停留时间
      return () => {
        const duration = (Date.now() - startTimeRef.current) / 1000; // 转换为秒
        if (duration > 3) { // 只记录停留超过3秒的
          trackStay(duration);
        }
      };
    }
  }, [userInfo, productId]);
  
  return {
    trackView,
    trackClick,
    trackStay,
    trackFavorite,
    trackComment,
    trackShare
  };
}; 