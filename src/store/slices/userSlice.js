import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './authSlice';

// 这个文件是为了兼容现有代码而创建的，实际上我们会使用 authSlice
// 桥接方式，避免大规模修改现有代码

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // 同步到本地存储
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // 清除本地存储
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
});

// 导出 action creators
export const { setCredentials, clearCredentials } = userSlice.actions;

// 导出 thunk，使用 authSlice 中的 loginUser thunk
export const login = (credentials) => async (dispatch) => {
  try {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      // 同步设置到 userSlice
      dispatch(setCredentials({ 
        user: result.payload.user,
        token: result.payload.token
      }));
    }
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default userSlice.reducer; 