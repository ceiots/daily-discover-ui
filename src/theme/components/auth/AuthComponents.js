import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// 容器和布局组件
export const AuthPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.page};
  background-image: linear-gradient(135deg, rgba(91, 71, 232, 0.02) 0%, rgba(0, 0, 0, 0) 100%);
  position: relative;
  padding: ${({ theme }) => theme.spacing.md};
  padding-top: max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-top));
  padding-bottom: max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-bottom));
  box-sizing: border-box;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: -10%;
    right: -5%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(91, 71, 232, 0.05) 0%, rgba(91, 71, 232, 0) 70%);
    z-index: 0;
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(91, 71, 232, 0.03) 0%, rgba(91, 71, 232, 0) 70%);
    z-index: 0;
  }
`;

export const AuthContentWrapper = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidthForm};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xxl};
  }
`;

export const LogoContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -${({ theme }) => theme.spacing.md};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(to right, rgba(91, 71, 232, 0), rgba(91, 71, 232, 0.6), rgba(91, 71, 232, 0));
  }
`;

export const Logo = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.light} 0%, ${({ theme }) => theme.colors.primary.main} 100%);
    transform: rotate(45deg);
    box-shadow: 0 2px 10px rgba(91, 71, 232, 0.2);
  }
  
  &::after {
    content: "DD";
    position: relative;
    color: white;
    font-size: 24px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  letter-spacing: -0.5px;
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
`;

// 表单组件
export const FormContainer = styled.form`
  /* No additional styling needed */
`;

export const InputGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl}; 
  position: relative;
`;

// 底部边框聚焦动画
const focusAnimation = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

// 浮动标签动画
const floatLabel = keyframes`
  from {
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
    transform: translateY(0);
  }
  to {
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    transform: translateY(-20px);
  }
`;

export const FloatingLabel = styled.label`
  position: absolute;
  left: 0;
  top: ${props => props.$isActive ? '-20px' : '8px'};
  font-size: ${props => props.$isActive 
    ? ({ theme }) => theme.typography.fontSize.xs 
    : ({ theme }) => theme.typography.fontSize.sm};
  color: ${props => props.$isActive 
    ? ({ theme }) => theme.colors.primary.main 
    : ({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;
  pointer-events: none;
  
  ${props => props.$isActive && `
    animation: ${floatLabel} 0.2s ease forwards;
  `}
`;

export const BorderlessInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.main};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
  }
  
  &:focus + div {
    transform: scaleX(1);
  }
`;

export const FocusBorder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary.main};
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
`;

export const CompactButton = styled.button`
  min-width: 120px;
  height: 40px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary.main}, ${({ theme }) => theme.colors.primary.dark});
  color: ${({ theme }) => theme.colors.text.onPrimary};
  border: none;
  border-radius: ${props => props.$pill 
    ? '20px' 
    : ({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(91, 71, 232, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.text.disabled};
    box-shadow: none;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(91, 71, 232, 0.25);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(91, 71, 232, 0.15);
  }
`;

export const ButtonsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  justify-content: center;
`;

export const CompactCodeButton = styled(CompactButton)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  height: 32px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.main};
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  box-shadow: none;
  
  &:hover:not(:disabled) {
    background: rgba(91, 71, 232, 0.05);
    box-shadow: none;
    transform: none;
  }
`;

export const VerificationCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// 页脚组件
export const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const AuthLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  font-size: inherit;
  display: inline-block;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primary.main};
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }

  &:hover {
    text-decoration: none;
    
    &::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`; 