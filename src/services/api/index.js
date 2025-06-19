/**
 * API服务统一导出
 * 集中管理所有API调用服务
 */

// 导入API服务
import { authService } from './authService';
import { userService } from './userService';
import { productService } from './productService';
import { orderService } from './orderService';
import { cartService } from './cartService';
import { shopService } from './shopService';
import { aiService } from './aiService';
import { contentService } from './contentService';
import { videoService } from './videoService';
import { gameService } from './gameService';

// 统一导出API服务
export {
  authService,
  userService,
  productService,
  orderService,
  cartService,
  shopService,
  aiService,
  contentService,
  videoService,
  gameService
};

// 创建API服务实例
export default {
  auth: authService,
  user: userService,
  product: productService,
  order: orderService,
  cart: cartService,
  shop: shopService,
  ai: aiService,
  content: contentService,
  video: videoService,
  game: gameService
}; 