/**
 * ScrollableSection 分子组件
 * 用于横向滚动内容的可复用组件
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useComponentPerformance } from '../../utils/performance';

// 使用styled-components替换CSS
const Section = styled.div`
  margin: 16px 0;
  padding: 0 0 16px;
  background-color: ${props => props.theme.colors.background || '#f8f9fa'};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Header = styled.div`
  padding: 16px 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0;
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  color: ${props => props.theme.colors.primary};
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const Action = styled.span`
  margin-left: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.neutral[100]};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  color: ${props => props.theme.colors.neutral[600]};

  &:hover {
    background-color: ${props => props.theme.colors.neutral[200]};
    color: ${props => props.theme.colors.primary};
  }
`;

const Content = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0 16px;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  gap: 16px;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

/**
 * 可滚动部分组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子元素
 * @param {string} props.title - 标题
 * @param {React.ReactNode} props.titleIcon - 标题图标
 * @param {React.ReactNode} props.actionButton - 操作按钮
 * @param {string} props.className - 自定义类名
 * @returns {React.ReactElement} 可滚动部分组件
 */
const ScrollableSection = ({
  children,
  title,
  titleIcon,
  actionButton,
  className = "",
}) => {
  // 性能监控
  useComponentPerformance('ScrollableSection');
  
  const scrollRef = useRef(null);

  // 处理滚动
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section className={className}>
      <Header>
        <Title>
          {titleIcon && <Icon>{titleIcon}</Icon>}
          {title}
          {actionButton && <Action>{actionButton}</Action>}
        </Title>
        <Controls>
          <ControlButton
            onClick={() => handleScroll("left")}
            aria-label="向左滚动"
          >
            <i className="fas fa-chevron-left"></i>
          </ControlButton>
          <ControlButton
            onClick={() => handleScroll("right")}
            aria-label="向右滚动"
          >
            <i className="fas fa-chevron-right"></i>
          </ControlButton>
        </Controls>
      </Header>
      <Content ref={scrollRef}>
        {children}
      </Content>
    </Section>
  );
};

ScrollableSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  titleIcon: PropTypes.node,
  actionButton: PropTypes.node,
  className: PropTypes.string,
};

// 添加displayName用于性能监控
ScrollableSection.displayName = 'ScrollableSection';

export default ScrollableSection; 