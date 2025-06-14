import React, { Component } from 'react';

/**
 * 全局错误边界组件
 * 用于捕获和处理React组件树中的JavaScript错误
 */
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    
    // 绑定方法
    this.handleRetry = this.handleRetry.bind(this);
  }

  /**
   * 当子组件抛出错误时调用
   * 返回新的状态用于更新组件
   */
  static getDerivedStateFromError(error) {
    // 更新状态，以便下一次渲染显示fallback UI
    return { hasError: true };
  }

  /**
   * 当捕获到错误时调用
   * 可以在此处执行副作用，如日志记录
   */
  componentDidCatch(error, errorInfo) {
    // 更新错误和错误信息状态
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // 记录错误到控制台
    console.error('组件错误:', error);
    console.error('组件堆栈:', errorInfo.componentStack);

    // 可以在这里添加错误上报逻辑
    this.logError(error, errorInfo);
  }

  /**
   * 错误日志记录
   * 可以将错误上报到服务器或第三方监控服务
   */
  logError(error, errorInfo) {
    // 示例: 发送错误到API
    if (process.env.NODE_ENV === 'production') {
      try {
        // 错误上报逻辑，例如使用fetch发送到日志服务器
        /* 
        fetch('/api/error-logging', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: error.toString(),
            componentStack: errorInfo.componentStack,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        });
        */
      } catch (loggingError) {
        // 避免错误处理中的错误导致问题
        console.error('错误上报失败:', loggingError);
      }
    }
  }

  /**
   * 重置错误状态
   */
  handleRetry() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    // 如果有错误，显示fallback UI
    if (this.state.hasError) {
      // 可以根据错误类型显示不同的UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h2>抱歉，出现了一些问题</h2>
            <p>我们正在尽快修复这个问题</p>
            {process.env.NODE_ENV !== 'production' && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary>错误详情</summary>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
            <div className="error-boundary-actions">
              <button onClick={this.handleRetry} className="retry-button">
                重试
              </button>
              <button onClick={() => window.location.reload()} className="reload-button">
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 没有错误，正常渲染子组件
    return this.props.children;
  }
}

export default GlobalErrorBoundary; 