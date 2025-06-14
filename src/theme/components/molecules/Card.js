/**
 * Card 分子组件
 * 基于原子组件构建的卡片组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useComponentPerformance } from '../../utils/performance';

/**
 * 卡片组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子元素
 * @param {React.ReactNode} props.title - 卡片标题
 * @param {React.ReactNode} props.subtitle - 卡片副标题
 * @param {string|React.ReactNode} props.cover - 卡片封面
 * @param {React.ReactNode|React.ReactNode[]} props.actions - 卡片操作区
 * @param {boolean} props.bordered - 是否显示边框
 * @param {boolean} props.hoverable - 是否显示悬停效果
 * @param {string} props.shadow - 阴影大小：'none', 'sm', 'md', 'lg', 'xl'
 * @param {string} props.className - 卡片容器类名
 * @param {string} props.bodyClassName - 卡片内容类名
 * @param {string} props.headerClassName - 卡片头部类名
 * @param {string} props.footerClassName - 卡片底部类名
 * @returns {React.ReactElement} 卡片组件
 */
const Card = ({
  children,
  title,
  subtitle,
  cover,
  actions,
  bordered = true,
  hoverable = false,
  shadow = 'sm',
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  ...props
}) => {
  // 性能监控
  useComponentPerformance('Card');
  
  // 阴影样式映射
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  // 组合所有样式
  const cardClasses = classNames(
    'bg-white rounded-lg overflow-hidden',
    {
      'border border-neutral-200': bordered,
      'transition-shadow duration-300 hover:shadow-md': hoverable,
    },
    shadowClasses[shadow],
    className
  );

  // 卡片头部
  const renderHeader = () => {
    if (!title && !subtitle && !cover) return null;

    return (
      <div className={classNames('', headerClassName)}>
        {cover && (
          <div className="card-cover">
            {typeof cover === 'string' ? (
              <img src={cover} alt={title} className="w-full h-auto" />
            ) : (
              cover
            )}
          </div>
        )}
        {(title || subtitle) && (
          <div className="p-4">
            {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
            {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
          </div>
        )}
      </div>
    );
  };

  // 卡片底部
  const renderFooter = () => {
    if (!actions) return null;

    return (
      <div className={classNames('p-4 border-t border-neutral-200', footerClassName)}>
        <div className="flex justify-end space-x-2">
          {Array.isArray(actions) ? actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          )) : actions}
        </div>
      </div>
    );
  };

  return (
    <div className={cardClasses} {...props}>
      {renderHeader()}
      <div className={classNames('p-4', bodyClassName)}>
        {children}
      </div>
      {renderFooter()}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  cover: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  footerClassName: PropTypes.string,
};

// 添加displayName用于性能监控
Card.displayName = 'Card';

export default Card; 