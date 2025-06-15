import { useEffect, useRef } from 'react';

/**
 * 组件性能监控钩子
 * @param {string} componentName - 组件名称
 */
const useComponentPerformance = (componentName) => {
  const mountTime = useRef(null);

  useEffect(() => {
    mountTime.current = performance.now();
    console.log(`${componentName} mounted.`);

    return () => {
      const unmountTime = performance.now();
      const renderTime = unmountTime - mountTime.current;
      console.log(`${componentName} unmounted after ${renderTime.toFixed(2)} ms.`);
    };
  }, [componentName]);
};

export default useComponentPerformance; 