/**
 * Toast Hook
 * 提供Toast消息显示的逻辑
 */
import { useToastContext } from '../../providers/ToastContext';

/**
 * Toast Hook
 * @returns {Object} Toast控制对象
 */
const useToast = () => {
  return useToastContext();
};

export default useToast; 