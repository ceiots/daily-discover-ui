import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import LoginForm from '../../components/auth/LoginForm';
import { Tabs, TabList, Tab, TabPanel } from '../../components/common/Tabs';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #5B47E8; /* 主色延伸至状态栏 */
  padding: 20px;
  padding-top: env(safe-area-inset-top); /* 适配刘海屏 */
  box-sizing: border-box;
`;

const FormWrapper = styled.div`
  padding: 30px 40px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const LoginPage = () => {
  return (
    <LoginPageContainer>
      <Helmet>
        <title>登录 - Daily Discover</title>
        <meta name="description" content="登录您的Daily Discover账户，开启您的个性化体验" />
      </Helmet>
      <FormWrapper>
        <Tabs defaultValue="password">
          <TabList>
            <Tab value="password">密码登录</Tab>
            <Tab value="sms">手机登录</Tab>
          </TabList>
          <TabPanel value="password">
            <LoginForm />
          </TabPanel>
          <TabPanel value="sms">
            {/* 手机登录表单，MVP阶段可留空 */}
            <p style={{ color: '#666', padding: '40px 0' }}>手机登录功能开发中...</p>
          </TabPanel>
        </Tabs>
      </FormWrapper>
    </LoginPageContainer>
  );
};

export default LoginPage; 