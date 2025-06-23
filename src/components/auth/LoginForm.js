import React from 'react';
import { useLoginPage } from '../../pages/account/useLoginPage';

function LoginForm() {
  const { isLoading, formData, handleChange, handleSubmit } = useLoginPage();

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">邮箱</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
          required 
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}

export default LoginForm; 