/**
 * 表单验证工具函数
 * 提供常用的表单字段验证逻辑
 */

/**
 * 验证手机号码格式
 * @param {string} phone - 要验证的手机号码
 * @returns {boolean} - 是否是有效的手机号码
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 * 密码长度至少为8个字符，且必须包含数字和字母
 * @param {string} password - 要验证的密码
 * @returns {boolean} - 是否是有效的密码
 */
export const isValidPassword = (password) => {
  // 密码至少8位
  if (!password || password.length < 8) return false;
  // 必须包含数字
  if (!/[0-9]/.test(password)) return false;
  // 必须包含字母
  if (!/[a-zA-Z]/.test(password)) return false;
  return true;
};

/**
 * 验证密码强度并返回强度等级
 * @param {string} password - 要验证的密码
 * @returns {number} - 密码强度等级(0-4)，0表示无效，4表示非常强
 */
export const getPasswordStrength = (password) => {
  if (!password || password.length < 8) return 0;
  
  let strength = 0;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength += 1;
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength += 1;
  // 包含数字
  if (/[0-9]/.test(password)) strength += 1;
  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  // 长度超过12位
  if (password.length > 12) strength += 1;
  
  return Math.min(strength, 4);
};

/**
 * 验证电子邮箱格式
 * @param {string} email - 要验证的电子邮箱
 * @returns {boolean} - 是否是有效的电子邮箱
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证是否为空
 * @param {string} value - 要验证的值
 * @returns {boolean} - 是否为空
 */
export const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * 验证是否为数字
 * @param {string} value - 要验证的值
 * @returns {boolean} - 是否为数字
 */
export const isNumber = (value) => {
  return !isNaN(Number(value));
};

/**
 * 验证是否在指定长度范围内
 * @param {string} value - 要验证的值
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @returns {boolean} - 是否在指定长度范围内
 */
export const isLengthBetween = (value, min, max) => {
  return value.length >= min && value.length <= max;
};

/**
 * 验证两个值是否相等
 * @param {string} value1 - 第一个值
 * @param {string} value2 - 第二个值
 * @returns {boolean} - 两个值是否相等
 */
export const isEqual = (value1, value2) => {
  return value1 === value2;
};

/**
 * 集中导出所有验证函数
 */
export const validators = {
  isValidPhoneNumber,
  isValidPassword,
  getPasswordStrength,
  isValidEmail,
  isNotEmpty,
  isNumber,
  isLengthBetween,
  isEqual
};

export default validators; 