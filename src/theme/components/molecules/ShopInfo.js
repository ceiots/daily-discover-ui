/**
 * ShopInfo 分子组件
 * 以一致的方式展示商店头像和名称
 */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '../../useTheme';
import { useComponentPerformance } from '../../utils/performance';

/**
 * 商店信息组件
 * @param {Object} props - 组件属性
 * @param {string} props.shopName - 商店名称
 * @param {string} props.shopAvatarUrl - 商店头像图片URL
 * @param {string} props.size - 尺寸变体 ('sm', 'md', 'lg')
 * @param {Object} props.style - 要应用的附加样式
 * @returns {React.ReactElement} 商店信息组件
 */
const ShopInfo = ({ shopName, shopAvatarUrl, size = 'sm', style = {} }) => {
  // 性能监控
  useComponentPerformance('ShopInfo');
  
  const { theme } = useTheme();
  
  // 尺寸变体
  const sizes = {
    sm: {
      container: { padding: '6px 8px' },
      avatar: { width: '16px', height: '16px', marginRight: '6px' },
      text: { fontSize: theme.typography.fontSize.sm }
    },
    md: {
      container: { padding: '8px 10px' },
      avatar: { width: '20px', height: '20px', marginRight: '8px' },
      text: { fontSize: theme.typography.fontSize.base }
    },
    lg: {
      container: { padding: '10px 12px' },
      avatar: { width: '24px', height: '24px', marginRight: '10px' },
      text: { fontSize: theme.typography.fontSize.lg }
    }
  };
  
  const sizeStyle = sizes[size] || sizes.sm;
  
  return (
    <div 
      className="shop-info" 
      style={{
        display: 'flex',
        alignItems: 'center',
        ...sizeStyle.container,
        ...style
      }}
    >
      {shopAvatarUrl && (
        <img 
          src={shopAvatarUrl} 
          alt={shopName || "店铺"} 
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            border: `1px solid ${theme.colors.neutral[300]}`,
            ...sizeStyle.avatar
          }}
        />
      )}
      <span 
        style={{
          color: theme.colors.neutral[600],
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...sizeStyle.text
        }}
      >
        {shopName || "官方商城"}
      </span>
    </div>
  );
};

ShopInfo.propTypes = {
  shopName: PropTypes.string,
  shopAvatarUrl: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  style: PropTypes.object
};

// 添加displayName用于性能监控
ShopInfo.displayName = 'ShopInfo';

export default ShopInfo; 