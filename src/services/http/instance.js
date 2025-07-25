import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_TIMEOUT = 10000; // 10 seconds timeout

/**
 * Axios实例 - 应用的HTTP客户端基础配置
 * 所有API请求都应使用此实例或其扩展实例
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // 支持跨域携带Cookie
});

/**
 * 请求拦截器 - 在请求发送前添加认证信息等
 */
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加X-Requested-With头，帮助后端识别AJAX请求
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // 打印请求信息
    console.log(`[HTTP] ${config.method.toUpperCase()} ${config.url}`, config);
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器 - 统一处理响应和错误
 */
httpClient.interceptors.response.use(
  (response) => {
    // 打印响应信息
    console.log(`[HTTP] Response from ${response.config.url}:`, response.data);
    // 仅返回服务器响应的数据部分
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      console.error(`[HTTP] Error ${error.response.status} from ${error.config?.url}:`, error.response.data);
      
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并重定向到登录页
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          // 避免在登录页面重定向，防止无限循环
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          // 权限不足
          console.error('权限不足:', error.response.data);
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在:', error.response.data);
          break;
        default:
          console.error('服务器错误:', error.response.data);
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      console.error('网络错误,请检查您的网络连接:', error.request);
      console.error('请求详情:', error.config);
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient; 