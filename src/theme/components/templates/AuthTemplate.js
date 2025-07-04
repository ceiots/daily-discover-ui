import React from 'react';
import styled from 'styled-components';
import tokens from '../../tokens';
import Logo from '../atoms/Logo';

// 页面容器
const AuthContainer = styled.div`
  position: relative;
  overflow: hidden;
  font-family: ${tokens.typography.fontFamily};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${tokens.colors.bg.page};
`;

// 背景装饰形状 - 左上角
const Shape1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 55%;
  background-color: ${tokens.colors.primary.main};
  border-radius: 0 0 100% 0;
  z-index: 0;
`;

// 背景装饰形状 - 右侧圆形
const Shape2 = styled.div`
  position: absolute;
  top: 20%;
  right: -20%;
  width: 60%;
  height: 60%;
  background-color: rgba(91, 71, 232, 0.08);
  border-radius: 50%;
  z-index: 0;
`;

// 背景装饰形状 - 右下角
const Shape3 = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35%;
  height: 25%;
  background-color: ${tokens.colors.primary.main};
  border-radius: 100% 0 0 0;
  z-index: 0;
`;

// 应用标志
const AppLogoContainer = styled.div`
  position: absolute;
  top: calc(${tokens.spacing.xl} + ${tokens.safeArea.top});
  left: ${tokens.spacing.xl};
  z-index: 2;
`;

// 主要内容容器
const Content = styled.div`
  padding: ${tokens.spacing.xl};
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${tokens.layout.maxWidth.form};
`;

// 页脚
const FooterContainer = styled.div`
  position: absolute;
  bottom: calc(${tokens.spacing.md} + ${tokens.safeArea.bottom});
  left: 0;
  width: 100%;
  text-align: center;
  font-size: ${tokens.typography.fontSize.xs};
  color: ${tokens.colors.text.secondary};
  opacity: 0.6;
  z-index: 1;
`;

/**
 * 认证页面模板
 * 提供包含品牌装饰背景、Logo和页脚的统一布局结构
 * 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 要在模板内容区域渲染的子组件
 */
const AuthTemplate = ({ children }) => {
  return (
    <AuthContainer>
      {/* 背景装饰 */}
      <Shape1 />
      <Shape2 />
      <Shape3 />

      {/* 应用标志 */}
      <AppLogoContainer>
        <Logo variant="light" />
      </AppLogoContainer>

      {/* 主要内容 */}
      <Content>
        {children}
      </Content>
      
      {/* 页脚 */}
      <FooterContainer>
        © {new Date().getFullYear()} 每日发现
      </FooterContainer>
    </AuthContainer>
  );
};

AuthTemplate.displayName = 'AuthTemplate';

export default AuthTemplate; 