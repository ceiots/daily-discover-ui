import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../../constants/api';

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
  }
});

/**
 * 请求拦截器 - 在请求发送前添加认证信息等
 */
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器 - 统一处理响应和错误
 */
httpClient.interceptors.response.use(
  (response) => {
    // 仅返回服务器响应的数据部分
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并重定向到登录页
          localStorage.removeItem('auth_token');
          window.location.href = '/account/login';
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
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient; 