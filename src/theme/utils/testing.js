/**
 * 测试辅助工具
 * 提供组件测试相关的工具函数
 */
/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';

/**
 * 使用主题包装的渲染函数
 * 用于测试需要主题上下文的组件
 * @param {React.ReactElement} ui - 要渲染的组件
 * @param {Object} options - 渲染选项
 * @param {string} options.initialMode - 初始主题模式
 * @returns {Object} 渲染结果
 */
export const renderWithTheme = (ui, { initialMode = 'light', ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider initialMode={initialMode}>
      {children}
    </ThemeProvider>
  );
  
  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * 创建一个模拟的ResizeObserver
 * 用于测试使用ResizeObserver的组件
 */
export const mockResizeObserver = () => {
  class MockResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.observations = [];
    }
    
    observe(element) {
      this.observations.push(element);
    }
    
    unobserve(element) {
      this.observations = this.observations.filter(el => el !== element);
    }
    
    disconnect() {
      this.observations = [];
    }
    
    // 手动触发回调
    triggerResize(entries) {
      this.callback(entries, this);
    }
  }
  
  window.ResizeObserver = MockResizeObserver;
  return MockResizeObserver;
};

/**
 * 创建一个模拟的IntersectionObserver
 * 用于测试使用IntersectionObserver的组件
 */
export const mockIntersectionObserver = () => {
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
      this.observations = [];
    }
    
    observe(element) {
      this.observations.push(element);
    }
    
    unobserve(element) {
      this.observations = this.observations.filter(el => el !== element);
    }
    
    disconnect() {
      this.observations = [];
    }
    
    // 手动触发回调
    triggerIntersection(entries) {
      this.callback(entries, this);
    }
  }
  
  window.IntersectionObserver = MockIntersectionObserver;
  return MockIntersectionObserver;
};

/**
 * 等待组件更新的工具函数
 * @param {number} ms - 等待毫秒数
 * @returns {Promise} Promise对象
 */
export const waitForComponentUpdate = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 创建模拟的本地存储
 * 用于测试使用localStorage的组件
 */
export const mockLocalStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    getStore: () => ({ ...store }),
    length: Object.keys(store).length
  };
};

/**
 * 创建模拟的媒体查询
 * @param {boolean} matches - 是否匹配
 * @returns {Object} 模拟的matchMedia对象
 */
export const mockMatchMedia = (matches = true) => {
  return query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  });
};

export default {
  renderWithTheme,
  mockResizeObserver,
  mockIntersectionObserver,
  waitForComponentUpdate,
  mockLocalStorage,
  mockMatchMedia
}; 