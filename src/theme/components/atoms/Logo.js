import React from 'react';
import styled from 'styled-components';
import { FiCompass } from 'react-icons/fi';
import tokens from '../../tokens';

// Logo容器
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Logo图标容器
const LogoIcon = styled.div`
  position: relative;
  width: ${({ size }) => size === 'large' ? '36px' : '30px'};
  height: ${({ size }) => size === 'large' ? '36px' : '30px'};
  margin-right: ${tokens.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size === 'large' ? '24px' : '20px'};
  color: ${({ variant }) => 
    variant === 'light' ? 'white' : tokens.colors.primary.main};
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
`;

// Logo文字容器
const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// 中文标题
const LogoTextChinese = styled.span`
  font-size: ${({ size }) => size === 'large' ? '20px' : '18px'};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${({ variant }) => 
    variant === 'light' ? 'white' : tokens.colors.text.primary};
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: ${({ variant }) => 
    variant === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

// 英文标题
const LogoTextEnglish = styled.span`
  font-size: ${({ size }) => size === 'large' ? '14px' : '12px'};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${({ variant }) => 
    variant === 'light' ? 'rgba(255, 255, 255, 0.85)' : tokens.colors.text.secondary};
  margin-top: 2px;
  text-shadow: ${({ variant }) => 
    variant === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
  line-height: 1;
`;

/**
 * Logo组件
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.variant - 变体: 'default', 'light'
 * @param {string} props.size - 尺寸: 'default', 'large'
 * @param {boolean} props.iconOnly - 是否只显示图标
 */
const Logo = React.memo(({
  variant = 'default',
  size = 'default',
  iconOnly = false,
  ...props
}) => {
  return (
    <LogoContainer {...props}>
      <LogoIcon variant={variant} size={size}>
        <FiCompass />
      </LogoIcon>
      {!iconOnly && (
        <LogoText>
          {/* <LogoTextChinese variant={variant} size={size}>每日发现</LogoTextChinese> */}
          <LogoTextEnglish variant={variant} size={size}>Daily Discover</LogoTextEnglish>
        </LogoText>
      )}
    </LogoContainer>
  );
});

Logo.displayName = 'Logo';

export default Logo; 