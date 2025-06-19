import styled from 'styled-components';

// 颜色定义
const PRIMARY_COLOR = '#5B47E8'; // 主色：靛青色

/**
 * 认证页面的根容器
 * - 使用 flex 布局将内容垂直和水平居中
 * - min-height: 100vh 确保容器至少占满整个视口高度
 * - padding-bottom 为底部导航栏预留空间
 */
export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 垂直居中 */
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 24px 12px;
  box-sizing: border-box;
`;

/**
 * 认证页面的内容卡片
 * 提供一个白色的、带圆角和阴影的容器
 */
export const AuthCard = styled.div`
  width: 100%;
  max-width: 360px; /* 稍微加宽以适应内容 */
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/**
 * 认证页面卡片的头部
 * 用于显示标题和描述
 */
export const AuthHeader = styled.div`
  padding: 24px 20px;
  background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #4A3CD9 100%);
  color: white;
  text-align: center;
`;

/**
 * 认证页面的主标题
 */
export const AuthTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

/**
 * 认证页面的表单容器
 */
export const AuthForm = styled.form`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`; 