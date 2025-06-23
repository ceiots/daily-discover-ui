import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import RegisterForm from '../../components/auth/RegisterForm';
import { Tabs, TabList, Tab, TabPanel } from '../../components/common/Tabs';

const RegisterPageContainer = styled.div`
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

const RegisterPage = () => {
  return (
    <RegisterPageContainer>
      <Helmet>
        <title>注册 - Daily Discover</title>
        <meta name="description" content="创建您的Daily Discover账户，开始您的个性化探索之旅" />
      </Helmet>
      <FormWrapper>
        <Tabs defaultValue="email">
          <TabList>
            <Tab value="email">邮箱注册</Tab>
            <Tab value="sms">手机注册</Tab>
          </TabList>
          <TabPanel value="email">
            <RegisterForm />
          </TabPanel>
          <TabPanel value="sms">
            {/* 手机注册表单，MVP阶段可留空 */}
            <p style={{ color: '#666', padding: '40px 0' }}>手机注册功能开发中...</p>
          </TabPanel>
        </Tabs>
      </FormWrapper>
    </RegisterPageContainer>
  );
};

export default RegisterPage; 