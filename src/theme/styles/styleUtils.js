/**
 * 样式工具函数 - 提供统一的样式生成方式
 */
import { UI_COLORS, UI_SIZES, UI_BORDERS, UI_SHADOWS, UI_ANIMATIONS } from './uiConstants';

/**
 * 创建输入框样式
 * @param {boolean} hasError - 是否有错误
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 输入框样式对象
 */
export const createInputStyles = (hasError = false, customStyles = {}) => ({
  height: UI_SIZES.INPUT_HEIGHT,
  fontSize: UI_SIZES.FONT_MEDIUM,
  padding: UI_SIZES.INPUT_SPACING,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: hasError ? UI_COLORS.ERROR : UI_COLORS.BORDER_LIGHT,
  borderRadius: UI_BORDERS.RADIUS_SMALL,
  backgroundColor: UI_COLORS.BG_WHITE,
  color: UI_COLORS.TEXT_DARK,
  transition: UI_ANIMATIONS.FAST,
  width: '100%',
  boxSizing: 'border-box',
  '&:focus': {
    borderColor: UI_COLORS.PRIMARY,
    boxShadow: `0 0 0 2px ${UI_COLORS.PRIMARY_SHADOW}`,
    outline: 'none',
  },
  '&::placeholder': {
    color: UI_COLORS.TEXT_PLACEHOLDER,
  },
  ...customStyles,
});

/**
 * 创建按钮样式
 * @param {string} variant - 按钮变体: 'primary', 'secondary', 'outline', 'text'
 * @param {boolean} disabled - 是否禁用
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 按钮样式对象
 */
export const createButtonStyles = (variant = 'primary', disabled = false, customStyles = {}) => {
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: UI_SIZES.BUTTON_HEIGHT,
    fontSize: UI_SIZES.FONT_MEDIUM,
    fontWeight: '500',
    padding: `0 ${UI_SIZES.BUTTON_PADDING}`,
    borderRadius: UI_BORDERS.RADIUS_SMALL,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: UI_ANIMATIONS.NORMAL,
    border: 'none',
    outline: 'none',
    opacity: disabled ? '0.6' : '1',
    width: '100%',
    boxSizing: 'border-box',
    ...customStyles,
  };

  // 变体样式
  const variantStyles = {
    primary: {
      backgroundColor: UI_COLORS.PRIMARY,
      color: UI_COLORS.TEXT_WHITE,
      boxShadow: disabled ? 'none' : UI_SHADOWS.BUTTON,
      '&:hover': disabled ? {} : {
        backgroundColor: UI_COLORS.PRIMARY_HOVER,
        boxShadow: UI_SHADOWS.BUTTON_HOVER,
      },
      '&:active': disabled ? {} : {
        transform: 'scale(0.98)',
        boxShadow: UI_SHADOWS.BUTTON_ACTIVE,
      },
    },
    secondary: {
      backgroundColor: UI_COLORS.SECONDARY,
      color: UI_COLORS.TEXT_WHITE,
      boxShadow: disabled ? 'none' : UI_SHADOWS.BUTTON,
      '&:hover': disabled ? {} : {
        backgroundColor: UI_COLORS.SECONDARY_HOVER,
        boxShadow: UI_SHADOWS.BUTTON_HOVER,
      },
      '&:active': disabled ? {} : {
        transform: 'scale(0.98)',
        boxShadow: UI_SHADOWS.BUTTON_ACTIVE,
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: UI_COLORS.PRIMARY,
      border: `1px solid ${UI_COLORS.PRIMARY}`,
      '&:hover': disabled ? {} : {
        backgroundColor: UI_COLORS.PRIMARY_LIGHT,
      },
      '&:active': disabled ? {} : {
        transform: 'scale(0.98)',
      },
    },
    text: {
      backgroundColor: 'transparent',
      color: UI_COLORS.PRIMARY,
      boxShadow: 'none',
      '&:hover': disabled ? {} : {
        backgroundColor: UI_COLORS.PRIMARY_LIGHT,
      },
      '&:active': disabled ? {} : {
        transform: 'scale(0.98)',
      },
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
  };
};

/**
 * 创建表单标签样式
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 表单标签样式对象
 */
export const createLabelStyles = (customStyles = {}) => ({
  display: 'block',
  fontSize: UI_SIZES.FONT_SMALL,
  color: UI_COLORS.TEXT_MEDIUM,
  marginBottom: UI_SIZES.LABEL_MARGIN,
  fontWeight: '500',
  ...customStyles,
});

/**
 * 创建卡片样式
 * @param {string} elevation - 卡片阴影级别: 'none', 'low', 'medium', 'high'
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 卡片样式对象
 */
export const createCardStyles = (elevation = 'low', customStyles = {}) => {
  const shadowMap = {
    none: 'none',
    low: UI_SHADOWS.CARD_LOW,
    medium: UI_SHADOWS.CARD_MEDIUM,
    high: UI_SHADOWS.CARD_HIGH,
  };

  return {
    backgroundColor: UI_COLORS.BG_WHITE,
    borderRadius: UI_BORDERS.RADIUS_MEDIUM,
    boxShadow: shadowMap[elevation],
    padding: UI_SIZES.CARD_PADDING,
    transition: UI_ANIMATIONS.NORMAL,
    ...customStyles,
  };
};

/**
 * 创建表单容器样式
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 表单容器样式对象
 */
export const createFormContainerStyles = (customStyles = {}) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: UI_SIZES.FORM_MAX_WIDTH,
  margin: '0 auto',
  padding: UI_SIZES.CONTAINER_PADDING,
  ...customStyles,
});

/**
 * 创建表单组样式
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 表单组样式对象
 */
export const createFormGroupStyles = (customStyles = {}) => ({
  marginBottom: UI_SIZES.FORM_GROUP_SPACING,
  ...customStyles,
});

/**
 * 创建错误消息样式
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 错误消息样式对象
 */
export const createErrorStyles = (customStyles = {}) => ({
  color: UI_COLORS.ERROR,
  fontSize: UI_SIZES.FONT_SMALL,
  marginTop: '4px',
  ...customStyles,
});

/**
 * 创建验证码按钮样式
 * @param {boolean} active - 是否可点击状态
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 验证码按钮样式对象
 */
export const createCodeButtonStyles = (active = true, customStyles = {}) => ({
  minWidth: '100px',
  height: UI_SIZES.INPUT_HEIGHT,
  backgroundColor: active ? UI_COLORS.PRIMARY : UI_COLORS.BG_DISABLED,
  color: active ? UI_COLORS.TEXT_WHITE : UI_COLORS.TEXT_LIGHT,
  border: 'none',
  borderRadius: UI_BORDERS.RADIUS_SMALL,
  fontSize: UI_SIZES.FONT_SMALL,
  fontWeight: '500',
  cursor: active ? 'pointer' : 'not-allowed',
  transition: UI_ANIMATIONS.NORMAL,
  boxShadow: active ? `0 0 10px ${UI_COLORS.PRIMARY_SHADOW}` : 'none',
  '&:hover': active ? {
    boxShadow: `0 0 15px ${UI_COLORS.PRIMARY_SHADOW}`,
    transform: 'translateY(-1px)',
  } : {},
  '&:active': active ? {
    transform: 'scale(0.98)',
  } : {},
  ...customStyles,
});

/**
 * 创建徽章样式
 * @param {string} type - 徽章类型: 'default', 'primary', 'success', 'warning', 'error'
 * @param {boolean} filled - 是否填充样式
 * @param {Object} customStyles - 自定义样式
 * @returns {Object} - 徽章样式对象
 */
export const createBadgeStyles = (type = 'default', filled = false, customStyles = {}) => {
  const colorMap = {
    default: {
      bg: filled ? UI_COLORS.TEXT_LIGHT : 'transparent',
      text: filled ? UI_COLORS.TEXT_WHITE : UI_COLORS.TEXT_LIGHT,
      border: UI_COLORS.TEXT_LIGHT,
    },
    primary: {
      bg: filled ? UI_COLORS.PRIMARY : 'transparent',
      text: filled ? UI_COLORS.TEXT_WHITE : UI_COLORS.PRIMARY,
      border: UI_COLORS.PRIMARY,
    },
    success: {
      bg: filled ? UI_COLORS.SUCCESS : 'transparent',
      text: filled ? UI_COLORS.TEXT_WHITE : UI_COLORS.SUCCESS,
      border: UI_COLORS.SUCCESS,
    },
    warning: {
      bg: filled ? UI_COLORS.WARNING : 'transparent',
      text: filled ? UI_COLORS.TEXT_WHITE : UI_COLORS.WARNING,
      border: UI_COLORS.WARNING,
    },
    error: {
      bg: filled ? UI_COLORS.ERROR : 'transparent',
      text: filled ? UI_COLORS.TEXT_WHITE : UI_COLORS.ERROR,
      border: UI_COLORS.ERROR,
    },
  };

  const typeColor = colorMap[type] || colorMap.default;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    fontSize: UI_SIZES.FONT_TINY,
    fontWeight: '500',
    borderRadius: UI_BORDERS.RADIUS_PILL,
    backgroundColor: typeColor.bg,
    color: typeColor.text,
    border: filled ? 'none' : `1px solid ${typeColor.border}`,
    ...customStyles,
  };
};

// 导出默认对象
export default {
  createInputStyles,
  createButtonStyles,
  createLabelStyles,
  createCardStyles,
  createFormContainerStyles,
  createFormGroupStyles,
  createErrorStyles,
  createCodeButtonStyles,
  createBadgeStyles,
}; 