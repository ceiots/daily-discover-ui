/**
 * 分析与监控工具
 * 提供用户行为分析和性能监控功能
 */

/**
 * 事件类型枚举
 */
export const EventTypes = {
  // 用户行为事件
  CLICK: 'click',
  VIEW: 'view',
  SCROLL: 'scroll',
  INPUT: 'input',
  SUBMIT: 'submit',
  ERROR: 'error',
  
  // 性能事件
  PERFORMANCE: 'performance',
  LOAD: 'load',
  RENDER: 'render',
  NETWORK: 'network',
};

/**
 * 默认分析配置
 */
const DEFAULT_CONFIG = {
  enabled: true,
  sampleRate: 1.0, // 采样率，1.0表示100%
  userId: null,
  sessionId: null,
  endpoint: null, // 数据上报端点
  bufferSize: 10, // 缓冲区大小，达到此数量时自动发送
  autoSend: true, // 是否自动发送数据
  debug: false, // 调试模式
};

/**
 * 分析管理器类
 */
class AnalyticsManager {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.eventBuffer = [];
    this.initialized = false;
    
    // 生成会话ID
    if (!this.config.sessionId) {
      this.config.sessionId = this._generateSessionId();
    }
  }
  
  /**
   * 初始化分析管理器
   * @param {Object} config - 配置对象
   */
  init(config = {}) {
    this.config = { ...this.config, ...config };
    
    if (this.config.enabled && typeof window !== 'undefined') {
      // 注册性能监听器
      this._setupPerformanceObservers();
      
      // 注册全局错误监听
      window.addEventListener('error', this._handleError.bind(this));
      window.addEventListener('unhandledrejection', this._handleRejection.bind(this));
      
      this.initialized = true;
      this._debug('Analytics initialized', this.config);
    }
    
    return this;
  }
  
  /**
   * 跟踪事件
   * @param {string} eventType - 事件类型
   * @param {Object} eventData - 事件数据
   */
  track(eventType, eventData = {}) {
    if (!this.config.enabled || !this.initialized) return;
    
    // 应用采样率
    if (Math.random() > this.config.sampleRate) return;
    
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      sessionId: this.config.sessionId,
      userId: this.config.userId,
      url: typeof window !== 'undefined' ? window.location.href : null,
      data: eventData,
    };
    
    this._addToBuffer(event);
    this._debug('Event tracked', event);
    
    return this;
  }
  
  /**
   * 跟踪组件渲染
   * @param {string} componentName - 组件名称
   * @param {Object} performanceData - 性能数据
   */
  trackRender(componentName, performanceData = {}) {
    return this.track(EventTypes.RENDER, {
      component: componentName,
      ...performanceData,
    });
  }
  
  /**
   * 跟踪用户点击
   * @param {string} elementId - 元素ID或描述
   * @param {Object} metadata - 额外元数据
   */
  trackClick(elementId, metadata = {}) {
    return this.track(EventTypes.CLICK, {
      element: elementId,
      ...metadata,
    });
  }
  
  /**
   * 跟踪页面浏览
   * @param {string} pageName - 页面名称
   * @param {Object} metadata - 额外元数据
   */
  trackPageView(pageName, metadata = {}) {
    return this.track(EventTypes.VIEW, {
      page: pageName,
      ...metadata,
    });
  }
  
  /**
   * 跟踪错误
   * @param {Error} error - 错误对象
   * @param {Object} metadata - 额外元数据
   */
  trackError(error, metadata = {}) {
    return this.track(EventTypes.ERROR, {
      message: error.message,
      stack: error.stack,
      ...metadata,
    });
  }
  
  /**
   * 手动发送缓冲区中的事件
   */
  flush() {
    if (!this.config.enabled || !this.initialized || this.eventBuffer.length === 0) return;
    
    if (this.config.endpoint) {
      this._sendToEndpoint(this.eventBuffer)
        .then(() => {
          this._debug('Events sent successfully', this.eventBuffer);
          this.eventBuffer = [];
        })
        .catch(error => {
          this._debug('Failed to send events', error);
        });
    } else {
      this._debug('Events would be sent (no endpoint configured)', this.eventBuffer);
      this.eventBuffer = [];
    }
    
    return this;
  }
  
  /**
   * 设置用户ID
   * @param {string} userId - 用户ID
   */
  setUserId(userId) {
    this.config.userId = userId;
    return this;
  }
  
  /**
   * 添加事件到缓冲区
   * @private
   * @param {Object} event - 事件对象
   */
  _addToBuffer(event) {
    this.eventBuffer.push(event);
    
    // 自动发送
    if (this.config.autoSend && this.eventBuffer.length >= this.config.bufferSize) {
      this.flush();
    }
  }
  
  /**
   * 发送数据到端点
   * @private
   * @param {Array} events - 事件数组
   * @returns {Promise} - Promise对象
   */
  _sendToEndpoint(events) {
    return fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          sessionId: this.config.sessionId,
        },
      }),
    });
  }
  
  /**
   * 设置性能观察器
   * @private
   */
  _setupPerformanceObservers() {
    if (typeof PerformanceObserver === 'undefined') return;
    
    // 观察长任务
    try {
      const longTaskObserver = new PerformanceObserver(entries => {
        entries.getEntries().forEach(entry => {
          this.track(EventTypes.PERFORMANCE, {
            metric: 'longTask',
            duration: entry.duration,
            startTime: entry.startTime,
          });
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      this._debug('Long task observer not supported', e);
    }
    
    // 观察资源加载
    try {
      const resourceObserver = new PerformanceObserver(entries => {
        entries.getEntries().forEach(entry => {
          // 只跟踪慢资源 (>500ms)
          if (entry.duration > 500) {
            this.track(EventTypes.NETWORK, {
              metric: 'slowResource',
              resource: entry.name,
              duration: entry.duration,
              initiatorType: entry.initiatorType,
            });
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      this._debug('Resource observer not supported', e);
    }
  }
  
  /**
   * 处理全局错误
   * @private
   * @param {ErrorEvent} event - 错误事件
   */
  _handleError(event) {
    this.trackError(event.error || new Error(event.message), {
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  }
  
  /**
   * 处理未处理的Promise拒绝
   * @private
   * @param {PromiseRejectionEvent} event - Promise拒绝事件
   */
  _handleRejection(event) {
    this.trackError(event.reason || new Error('Unhandled Promise rejection'), {
      type: 'unhandledRejection',
    });
  }
  
  /**
   * 生成会话ID
   * @private
   * @returns {string} 会话ID
   */
  _generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * 输出调试信息
   * @private
   * @param {string} message - 消息
   * @param {*} data - 数据
   */
  _debug(message, data) {
    if (this.config.debug && typeof console !== 'undefined') {
      console.log(`[Analytics] ${message}`, data);
    }
  }
}

// 创建单例实例
const analytics = new AnalyticsManager();

export default analytics; 