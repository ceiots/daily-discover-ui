import { theme } from '../../tokens';

/**
 * 输入框组样式 - 用于水平排列输入框和按钮
 * 特别优化了验证码输入框与按钮的对齐问题
 */
export const inputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
};

/**
 * 复选框容器样式 - 优化了复选框和标签的对齐
 */
export const checkboxContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
  marginTop: '6px', // 微调，确保视觉上更平衡
};

/**
 * 验证码按钮样式 - 确保与输入框高度一致
 */
export const codeButtonStyle = {
  height: '42px', // 与输入框保持一致的高度
  minWidth: '96px',
  padding: '0 12px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  border: 'none',
  backgroundColor: theme.colors.primary[500],
  color: 'white',
  transition: theme.transitions.fast,
  cursor: 'pointer',
};

/**
 * 禁用状态的验证码按钮样式
 */
export const disabledCodeButtonStyle = {
  ...codeButtonStyle,
  backgroundColor: theme.colors.neutral[200],
  color: theme.colors.neutral[500],
  cursor: 'not-allowed',
};

/**
 * 表单控件基础样式 - 用于所有表单输入元素
 */
export const formControlBaseStyle = {
  width: '100%',
  height: '42px',
  padding: '10px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.colors.neutral[300],
  transition: theme.transitions.fast,
  backgroundColor: 'white',
};

/**
 * 表单控件聚焦样式
 */
export const formControlFocusStyle = {
  outline: 'none',
  borderColor: theme.colors.primary[500],
  boxShadow: `0 0 0 2px rgba(91, 71, 232, 0.2)`,
};

/**
 * 表单控件错误样式
 */
export const formControlErrorStyle = {
  borderColor: theme.colors.error,
  boxShadow: `0 0 0 2px rgba(220, 38, 38, 0.2)`,
};

/**
 * 表单标签样式
 */
export const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: theme.colors.neutral[700],
};

/**
 * 错误消息样式
 */
export const errorMessageStyle = {
  marginTop: '4px',
  fontSize: '12px',
  color: theme.colors.error,
};

/**
 * 提交按钮样式
 */
export const submitButtonStyle = {
  width: '100%',
  height: '44px',
  marginTop: '20px',
  padding: '0',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: theme.colors.primary[500],
  color: 'white',
  fontSize: '15px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: theme.transitions.fast,
};

/**
 * 表单组样式
 */
export const formGroupStyle = {
  marginBottom: '16px',
};

/**
 * 底部链接样式
 */
export const bottomLinkStyle = {
  marginTop: '16px',
  textAlign: 'center',
  fontSize: '14px',
};

/**
 * 页脚文本样式
 */
export const footerTextStyle = {
  marginTop: '24px',
  textAlign: 'center',
  fontSize: '12px',
  color: theme.colors.neutral[500],
}; 