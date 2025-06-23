import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // 可在这里添加中间件
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      // 忽略非序列化警告的字段
      ignoredActions: ['persist/PERSIST'],
    },
  }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;