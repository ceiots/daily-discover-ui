import styled from 'styled-components';
import { colors, typography, spacing, radius, shadows, transitions } from '../tokens';

// 页面容器 - 使用更现代的背景设计
export const PageWrapper = styled.div`
  background-color: ${colors.bgLight};
  background-image: 
    radial-gradient(circle at 90% 10%, rgba(91, 71, 232, 0.07), transparent 400px),
    radial-gradient(circle at 10% 90%, rgba(232, 97, 79, 0.05), transparent 300px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: ${spacing[14]} ${spacing[4]} ${spacing[5]}; /* 56px 16px 20px */
  position: relative;
  overflow-x: hidden;
`;

// 超简化的顶部导航 - 减少渲染复杂度
export const MicroNavBar = styled.div`
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  height: ${spacing[14]}; /* 56px */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${spacing[4]}; /* 0 16px */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 100;
  box-shadow: ${shadows.xs};
`;

// 更紧凑的Logo
export const Logo = styled.div`
  font-size: ${typography.fontSize['2xl']}; /* 1.2rem -> 20px */
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.textMain};
  letter-spacing: ${typography.letterSpacing.tight}; /* -0.3px */
  
  span {
    color: ${colors.primary};
  }
`;

// 更紧凑的导航链接
export const NavLinks = styled.div`
  display: flex;
  gap: ${spacing[4.5]}; /* 18px */
  
  a {
    color: ${colors.textMain};
    text-decoration: none;
    font-size: ${typography.fontSize.lg}; /* 0.95rem -> 15px */
    font-weight: ${typography.fontWeight.medium};
    transition: color ${transitions.normal}, background-color ${transitions.normal};
    padding: ${spacing[1.5]} ${spacing[3]}; /* 6px 12px */
    border-radius: ${radius.md}; /* 8px */
    
    &:hover {
      color: ${colors.primary};
    }

    &.active {
      background-color: ${colors.state.focus};
      color: ${colors.primary};
      font-weight: ${typography.fontWeight.semibold};
    }
  }
`;

// 重新设计的表单卡片 - 无边框设计
export const AuthCard = styled.div`
  width: 100%;
  max-width: 380px;
  padding: ${spacing[4]} ${spacing[4]}; /* 16px 16px */
  background: transparent;
`;

// 表单标题 - 更紧凑
export const FormTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']}; /* 1.8rem -> 24px */
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textMain};
  margin-bottom: ${spacing[4]}; /* 16px */
  text-align: center;
  letter-spacing: ${typography.letterSpacing.tight}; /* -0.5px */
`;

// 表单容器
export const Form = styled.form`
  width: 100%;
`;

// 输入框组 - 更紧凑
export const InputGroup = styled.div`
  margin-bottom: ${spacing[2.5]}; /* 10px */
  position: relative;
`;

// 标签 - 更小更紧凑
export const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing[1]}; /* 4px */
  font-size: ${typography.fontSize.base}; /* 0.8rem -> 13px */
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textMain};
  
  i {
    margin-right: ${spacing[1.5]}; /* 6px */
    color: ${colors.primary};
    font-size: ${typography.fontSize.xl}; /* 0.95rem -> 17px */
  }
`;

// 输入框 - 无边框设计，更紧凑
export const Input = styled.input`
  width: 100%;
  height: ${spacing[10]}; /* 40px */
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: ${radius.md}; /* 10px */
  padding: 0 ${spacing[3]}; /* 0 12px */
  font-size: ${typography.fontSize.lg}; /* 0.9rem -> 15px */
  color: ${colors.textMain};
  box-shadow: ${shadows.xs};
  transition: all ${transitions.normal};
  
  &:focus {
    outline: none;
    background: ${colors.white};
    box-shadow: 0 3px 8px ${colors.state.focus};
  }
  
  &::placeholder {
    color: ${colors.neutral[400]};
    font-size: ${typography.fontSize.base}; /* 0.8rem -> 13px */
  }
`;

// 验证码输入框组
export const VerificationGroup = styled.div`
  display: flex;
  gap: ${spacing[1.5]}; /* 6px */
`;

// 验证码按钮 - 更紧凑
export const CodeButton = styled.button`
  flex-shrink: 0;
  height: ${spacing[10]}; /* 40px */
  padding: 0 ${spacing[3]}; /* 0 12px */
  background: rgba(91, 71, 232, 0.08);
  color: ${colors.primary};
  border: none;
  border-radius: ${radius.md}; /* 10px */
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.base}; /* 0.8rem -> 13px */
  cursor: pointer;
  transition: all ${transitions.normal};
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: rgba(91, 71, 232, 0.12);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 提交按钮 - 更紧凑
export const SubmitButton = styled.button`
  width: 100%;
  height: ${spacing[10]}; /* 40px */
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: ${radius.md}; /* 10px */
  font-size: ${typography.fontSize.lg}; /* 0.9rem -> 15px */
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  margin-top: ${spacing[3]}; /* 12px */
  transition: all ${transitions.normal};
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${colors.state.focus};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

// 分隔线 - 更紧凑
export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing[4]} 0; /* 16px 0 */
  color: ${colors.neutral[400]};
  font-size: ${typography.fontSize.sm}; /* 0.75rem -> 11px */
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.07);
  }
  
  span {
    padding: 0 ${spacing[2]}; /* 0 8px */
  }
`;

// 错误消息 - 更紧凑
export const ErrorMessage = styled.div`
  color: ${colors.secondary};
  font-size: ${typography.fontSize.sm}; /* 0.75rem -> 11px */
  margin-top: ${spacing[0.5]}; /* 2px */
  padding-left: ${spacing[0.5]}; /* 2px */
`;

// 进度条 - 更紧凑
export const ProgressBar = styled.div`
  height: 3px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
  margin-bottom: ${spacing[3]}; /* 12px */
  overflow: hidden;
`;

export const ProgressIndicator = styled.div`
  height: 100%;
  background: linear-gradient(to right, ${colors.primary}, #4A3CD9);
  width: ${props => props.$progress}%;
  transition: width ${transitions.normal};
`;

// 底部链接 - 更紧凑
export const BottomLink = styled.div`
  text-align: center;
  margin-top: ${spacing[3.5]}; /* 14px */
  font-size: ${typography.fontSize.base}; /* 0.8rem -> 13px */
  color: ${colors.neutral[600]};
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    font-weight: ${typography.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 忘记密码链接
export const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: ${spacing[1.5]}; /* 6px */
  margin-bottom: ${spacing[2.5]}; /* 10px */
  font-size: ${typography.fontSize.base}; /* 0.8rem -> 13px */
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    font-weight: ${typography.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 微信登录按钮 - 更紧凑
export const WeChatButton = styled.button`
  width: 100%;
  height: ${spacing[10]}; /* 40px */
  background: ${colors.success}; /* 微信的绿色 */
  color: ${colors.white};
  border: none;
  border-radius: ${radius.md}; /* 10px */
  font-size: ${typography.fontSize.lg}; /* 0.9rem -> 15px */
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  margin-top: ${spacing[3]}; /* 12px */
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #06AD56;
    box-shadow: 0 3px 8px rgba(7, 193, 96, 0.15);
  }
  
  &::before {
    content: '\f1d7';
    font-family: 'Font Awesome 5 Brands';
    margin-right: ${spacing[2]}; /* 8px */
    font-size: ${typography.fontSize['2xl']}; /* 1.1rem -> 20px */
  }
`; 