import axios from 'axios';

// 从环境变量或配置文件中获取API基础URL
// 根据09_USER_SERVICE.md, 所有API都有 /api 前缀, 网关会将其转发
// 这里的 baseURL 应该指向网关地址
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://dailydiscover.top/daily-discover';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
// 用于在每个请求发送前附加token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
// 用于统一处理错误和响应数据
axiosInstance.interceptors.response.use(
  (response) => {
    // 后端统一响应体结构为 { code, message, data }
    // 这里我们直接返回 data 部分，简化上层调用
    // 如果需要处理code，可以在这里进行
    if (response.data && response.data.code === 200) {
      return response.data.data;
    }
    // 对于非200的业务代码，当作错误处理
    return Promise.reject(new Error(response.data.message || 'Error'));
  },
  (error) => {
    // 处理网络错误等
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('API Error Response:', error.response.data);
      // 可以在这里做一些全局的错误处理，比如提示、登出等
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('API No Response:', error.request);
    } else {
      // 在设置请求时触发了一个错误
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 