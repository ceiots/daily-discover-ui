/**
 * 钩子函数索引文件
 * 导出所有主题相关的钩子函数
 */

// 导出所有钩子
import { useToast } from './useToast';
import { useNavBar } from './useNavBar';

export { useToast };
export { useNavBar };

// 默认导出
export default {
  useToast,
  useNavBar
}; 