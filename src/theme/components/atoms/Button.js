/**
 * Button 原子组件
 * 基础按钮组件，支持不同的变体和样式
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import tokens from '../../tokens';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useComponentPerformance } from '../../utils/performance';

// 光影扫过动画
const lightSweep = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// 按钮基础样式
const ButtonBase = styled.button`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${tokens.typography.fontFamily};
  font-weight: ${tokens.typography.fontWeight.semibold};
  text-align: center;
  user-select: none;
  cursor: pointer;
  transition: all ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut};
  border: none;
  outline: none;
  border-radius: ${({ pill }) => pill ? '100px' : tokens.layout.borderRadius.md};
  width: ${({ block }) => block ? '100%' : 'auto'};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* 光影效果伪元素 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    opacity: 0;
    z-index: 1;
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    
    &::before {
      animation: ${lightSweep} 1.5s ${tokens.animation.easing.easeInOut} forwards;
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: none;
  }
`;

// 主要按钮样式
const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(to right, ${tokens.colors.primary.main}, ${tokens.colors.primary.dark});
  color: ${tokens.colors.text.onPrimary};
  height: ${({ size }) => 
    size === 'large' ? '48px' :
    size === 'small' ? '32px' : 
    '40px'
  };
  padding: ${({ size }) => 
    size === 'large' ? `0 ${tokens.spacing.xl}` :
    size === 'small' ? `0 ${tokens.spacing.md}` : 
    `0 ${tokens.spacing.lg}`
  };
  font-size: ${({ size }) => 
    size === 'large' ? tokens.typography.fontSize.lg :
    size === 'small' ? tokens.typography.fontSize.xs : 
    tokens.typography.fontSize.sm
  };
  box-shadow: 0 5px 15px rgba(91, 71, 232, 0.25);

  &:hover:not(:disabled) {
    box-shadow: 0 8px 20px rgba(91, 71, 232, 0.3);
  }
`;

// 次要按钮样式
const SecondaryButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${tokens.colors.primary.main};
  border: 1px solid ${tokens.colors.primary.main};
  height: ${({ size }) => 
    size === 'large' ? '48px' :
    size === 'small' ? '32px' : 
    '40px'
  };
  padding: ${({ size }) => 
    size === 'large' ? `0 ${tokens.spacing.xl}` :
    size === 'small' ? `0 ${tokens.spacing.md}` : 
    `0 ${tokens.spacing.lg}`
  };
  font-size: ${({ size }) => 
    size === 'large' ? tokens.typography.fontSize.lg :
    size === 'small' ? tokens.typography.fontSize.xs : 
    tokens.typography.fontSize.sm
  };

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.primary.light};
  }
`;

// 文本按钮样式
const TextButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${tokens.colors.primary.main};
  height: ${({ size }) => 
    size === 'large' ? '48px' :
    size === 'small' ? '32px' : 
    '40px'
  };
  padding: ${({ size }) => 
    size === 'large' ? `0 ${tokens.spacing.lg}` :
    size === 'small' ? `0 ${tokens.spacing.sm}` : 
    `0 ${tokens.spacing.md}`
  };
  font-size: ${({ size }) => 
    size === 'large' ? tokens.typography.fontSize.lg :
    size === 'small' ? tokens.typography.fontSize.xs : 
    tokens.typography.fontSize.sm
  };

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.primary.light};
  }
`;

// 危险按钮样式
const DangerButton = styled(ButtonBase)`
  background: linear-gradient(to right, ${tokens.colors.feedback.error}, #d32f2f);
  color: ${tokens.colors.text.onPrimary};
  height: ${({ size }) => 
    size === 'large' ? '48px' :
    size === 'small' ? '32px' : 
    '40px'
  };
  padding: ${({ size }) => 
    size === 'large' ? `0 ${tokens.spacing.xl}` :
    size === 'small' ? `0 ${tokens.spacing.md}` : 
    `0 ${tokens.spacing.lg}`
  };
  font-size: ${({ size }) => 
    size === 'large' ? tokens.typography.fontSize.lg :
    size === 'small' ? tokens.typography.fontSize.xs : 
    tokens.typography.fontSize.sm
  };
  box-shadow: 0 5px 15px rgba(244, 67, 54, 0.25);

  &:hover:not(:disabled) {
    box-shadow: 0 8px 20px rgba(244, 67, 54, 0.3);
  }
`;

// 加载指示器
const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: ${({ variant }) => 
    variant === 'secondary' || variant === 'text' 
      ? tokens.colors.primary.main 
      : tokens.colors.text.onPrimary
  };
  animation: spin 0.8s linear infinite;
  margin-right: ${tokens.spacing.sm};

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 图标容器
const IconWrapper = styled.span`
  margin-right: ${tokens.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * 按钮组件
 * 支持多种变体、尺寸和状态
 * 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 按钮内容
 * @param {string} props.variant - 按钮变体：'primary', 'secondary', 'text', 'danger'
 * @param {string} props.size - 按钮尺寸：'small', 'medium', 'large'
 * @param {string} props.type - 按钮类型：'button', 'submit', 'reset'
 * @param {boolean} props.disabled - 是否禁用
 * @param {boolean} props.loading - 是否显示加载状态
 * @param {boolean} props.block - 是否块级按钮（占满容器宽度）
 * @param {boolean} props.pill - 是否胶囊形状
 * @param {React.ReactNode} props.icon - 按钮图标
 * @param {Function} props.onClick - 点击事件处理函数
 */
const Button = React.memo(({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  block = false,
  pill = false,
  icon = null,
  onClick,
  ...props
}) => {
  // 性能监控
  useComponentPerformance('Button');
  
  // 根据变体选择适合的按钮组件
  const ButtonComponent = 
    variant === 'secondary' ? SecondaryButton :
    variant === 'text' ? TextButton :
    variant === 'danger' ? DangerButton :
    PrimaryButton;

  return (
    <ButtonComponent
      type={type}
      size={size}
      disabled={disabled || loading}
      block={block}
      pill={pill}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner variant={variant} />}
      {icon && !loading && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </ButtonComponent>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'text', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  pill: PropTypes.bool,
  icon: PropTypes.node,
  onClick: PropTypes.func,
};

// 添加displayName用于性能监控
Button.displayName = 'Button';

export default Button;