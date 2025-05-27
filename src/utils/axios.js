import axios from 'axios';
import { API_BASE_URL } from '../config';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // 新添加的代码：从本地存储中获取 userId 并添加到请求头
        const userId = localStorage.getItem('userId');
        if (userId) {
            config.headers['userId'] = userId;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('401 错误：用户身份验证信息无效或过期，清除本地存储并跳转登录页');
                    // 清除本地存储的认证信息
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userInfo');
                    // 重定向到登录页
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('没有权限访问该资源');
                    break;
                case 500:
                    console.error('服务器错误');
                    break;
                default:
                    console.error('请求失败:', error.response.data);
            }
        } else if (error.request) {
            console.error('网络错误，请检查网络连接');
        } else {
            console.error('请求配置错误:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;
