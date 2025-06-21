/**
 * API常量配置
 * 这个文件定义了所有与API调用相关的常量
 */

// API基础配置
export const API_VERSION = 'v1';
export const API_BASE_URL = `https://dailydiscover.top/daily-discover`;
export const API_TIMEOUT = 30000; // 30秒

// 各模块API路径
export const API_PATHS = {
  // 用户认证
  AUTH: {
    LOGIN: `/api/${API_VERSION}/users/login`,
    REGISTER: `/api/${API_VERSION}/users/register`,
    LOGOUT: `/api/${API_VERSION}/auth/logout`,
    REFRESH_TOKEN: `/api/${API_VERSION}/auth/refresh`,
    FORGOT_PASSWORD_REQUEST_CODE: `/api/${API_VERSION}/users/password/reset/code`,
    RESET_PASSWORD_SUBMIT: `/api/${API_VERSION}/users/password/reset`,
    VERIFY_CODE: `/api/${API_VERSION}/auth/verify`,
    SEND_CODE: `/api/${API_VERSION}/auth/send-code`,
    SEND_EMAIL_CODE: `/api/${API_VERSION}/users/send-code`,
  },
  
  // 用户管理
  USER: {
    PROFILE: `/api/${API_VERSION}/user/profile`,
    UPDATE_PROFILE: `/api/${API_VERSION}/user/profile`,
    ADDRESSES: `/api/${API_VERSION}/user/addresses`,
    PAYMENT_PASSWORD: `/api/${API_VERSION}/user/payment-password`,
  },
  
  // 商品相关
  PRODUCT: {
    LIST: `/api/${API_VERSION}/products`,
    DETAIL: (id) => `/api/${API_VERSION}/products/${id}`,
    RECOMMEND: `/api/${API_VERSION}/products/recommend`,
    CATEGORIES: `/api/${API_VERSION}/categories`,
  },
  
  // 订单相关
  ORDER: {
    LIST: `/api/${API_VERSION}/orders`,
    DETAIL: (id) => `/api/${API_VERSION}/orders/${id}`,
    CREATE: `/api/${API_VERSION}/orders`,
    PAY: (id) => `/api/${API_VERSION}/orders/${id}/pay`,
    CANCEL: (id) => `/api/${API_VERSION}/orders/${id}/cancel`,
    CONFIRM: (id) => `/api/${API_VERSION}/orders/${id}/confirm`,
  },
  
  // 购物车
  CART: {
    LIST: `/api/${API_VERSION}/cart`,
    ADD: `/api/${API_VERSION}/cart`,
    UPDATE: (id) => `/api/${API_VERSION}/cart/${id}`,
    DELETE: (id) => `/api/${API_VERSION}/cart/${id}`,
    CLEAR: `/api/${API_VERSION}/cart/clear`,
  },
  
  // 店铺
  SHOP: {
    DETAIL: (id) => `/api/${API_VERSION}/shops/${id}`,
    CREATE: `/api/${API_VERSION}/shops`,
    UPDATE: (id) => `/api/${API_VERSION}/shops/${id}`,
    PRODUCTS: (id) => `/api/${API_VERSION}/shops/${id}/products`,
    SETTLEMENT: (id) => `/api/${API_VERSION}/shops/${id}/settlement`,
  },
  
  // AI服务
  AI: {
    ASSISTANT: `/api/${API_VERSION}/ai/assistant`,
    RECOMMEND: `/api/${API_VERSION}/ai/recommend`,
    GENERATE_ARTICLE: `/api/${API_VERSION}/ai/article`,
    CUSTOMER_SERVICE: `/api/${API_VERSION}/ai/customer-service`,
  },
  
  // 内容服务
  CONTENT: {
    LIST: `/api/${API_VERSION}/contents`,
    DETAIL: (id) => `/api/${API_VERSION}/contents/${id}`,
    CREATE: `/api/${API_VERSION}/contents`,
    UPDATE: (id) => `/api/${API_VERSION}/contents/${id}`,
    DELETE: (id) => `/api/${API_VERSION}/contents/${id}`,
  },
  
  // 视频服务
  VIDEO: {
    LIST: `/api/${API_VERSION}/videos`,
    DETAIL: (id) => `/api/${API_VERSION}/videos/${id}`,
    RECOMMEND: `/api/${API_VERSION}/videos/recommend`,
    VIEW: (id) => `/api/${API_VERSION}/videos/${id}/view`,
  },
  
  // 游戏服务
  GAME: {
    LIST: `/api/${API_VERSION}/games`,
    SCORE: (id) => `/api/${API_VERSION}/games/${id}/score`,
  },
};

// 状态码定义
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 响应结果状态码
export const RESULT_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  TOKEN_EXPIRED: 10001,
  PERMISSION_DENIED: 10002,
  RESOURCE_NOT_FOUND: 10003,
  INVALID_PARAMS: 10004,
};

// 缓存设置
export const CACHE_CONFIG = {
  // 缓存有效期(单位:秒)
  TTL: {
    SHORT: 60,          // 1分钟
    MEDIUM: 300,        // 5分钟
    LONG: 3600,         // 1小时
    EXTRA_LONG: 86400,  // 24小时
  },
  // 缓存前缀
  PREFIX: 'dd_cache_',
}; 