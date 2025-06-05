import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';
import '../theme.css';

/**
 * ShopInfo component - displays shop avatar and name in a consistent way
 * @param {Object} props - Component props
 * @param {string} props.shopName - Name of the shop
 * @param {string} props.shopAvatarUrl - URL to the shop's avatar image
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {Object} props.style - Additional styles to apply
 */

const ShopInfo = ({ shopName, shopAvatarUrl, size = 'sm', style = {} }) => {
  const theme = useTheme();
  
  // Size variants
  const sizes = {
    sm: {
      container: { padding: '6px 8px' },
      avatar: { width: '16px', height: '16px', marginRight: '6px' },
      text: { fontSize: theme.fontSize.xs }
    },
    md: {
      container: { padding: '8px 10px' },
      avatar: { width: '20px', height: '20px', marginRight: '8px' },
      text: { fontSize: theme.fontSize.sm }
    },
    lg: {
      container: { padding: '10px 12px' },
      avatar: { width: '24px', height: '24px', marginRight: '10px' },
      text: { fontSize: theme.fontSize.base }
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
            border: `1px solid ${theme.colors.neutral[200]}`,
            ...sizeStyle.avatar
          }}
        />
      )}
      <span 
        style={{
          color: theme.colors.neutral[500],
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

export default ShopInfo; 