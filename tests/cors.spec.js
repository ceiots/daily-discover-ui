import { test, expect } from '@playwright/test';

/**
 * CORS配置测试套件
 * 目的：验证API网关的CORS配置是否正确，允许前端应用进行跨域请求
 */
test.describe('CORS Configuration Tests', () => {
  test('API Gateway should have proper CORS headers for preflight requests', async ({ page, request }) => {
    // 1. 设置一个服务器，监听浏览器发出的请求
    await page.route('**/api/v1/users/send-code**', route => {
      // 记录请求，但不拦截，让它继续发送到实际服务器
      console.log(`Detected request to: ${route.request().url()}`);
      route.continue();
    });

    // 2. 导航到注册页面
    await page.goto('http://localhost:3000/register');
    
    // 3. 填写邮箱并点击发送验证码按钮
    await page.fill('input[name="demo0000"]', 'ceiots0013@126.com');
    
    // 4. 创建一个Promise来捕获网络请求的结果
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/v1/users/send-code')
    );
    
    // 5. 点击发送验证码按钮
    await page.click('button:has-text("发送验证码")');
    
    try {
      // 6. 等待响应并检查
      const response = await responsePromise;
      
      // 7. 验证CORS头
      const headers = response.headers();
      console.log('Response headers:', headers);
      
      // 检查关键的CORS头
      expect(headers['access-control-allow-origin']).toBeDefined();
      // 检查是否包含当前源
      expect(['http://localhost:3000', 'https://dailydiscover.top', '*'].includes(headers['access-control-allow-origin'])).toBeTruthy();
      expect(headers['access-control-allow-methods']).toBeDefined();
      expect(headers['access-control-allow-credentials']).toBe('true');
      
      // 8. 检查状态码 (即使有CORS头，如果业务逻辑错误也可能返回非200状态码)
      expect(response.status()).toBeLessThan(500); // 不应该是服务器错误
      
    } catch (error) {
      // 如果请求失败，记录错误并使测试失败
      console.error('CORS test failed:', error);
      
      // 获取当前页面的网络请求日志
      const requests = await page.context().pages()[0].evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter(entry => entry.name.includes('send-code'))
          .map(entry => ({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            transferSize: entry.transferSize
          }));
      });
      
      console.log('Network requests:', requests);
      throw error; // 重新抛出错误，使测试失败
    }
  });

  test('Direct API request should include CORS headers', async ({ request }) => {
    // 直接使用Playwright的request API发送OPTIONS预检请求
    const response = await request.fetch(
      'https://dailydiscover.top/daily-discover/api/v1/users/send-code?email=test@example.com&type=2',
      {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET', // 改为GET请求
          'Access-Control-Request-Headers': 'Content-Type'
        }
      }
    );
    
    // 检查预检请求的响应
    expect(response.ok()).toBeTruthy();
    
    const headers = response.headers();
    console.log('OPTIONS response headers:', headers);
    
    // 验证关键CORS头
    expect(headers['access-control-allow-origin']).toBeDefined();
    // 检查是否包含当前源
    expect(['http://localhost:3000', 'https://dailydiscover.top', '*'].includes(headers['access-control-allow-origin'])).toBeTruthy();
    expect(headers['access-control-allow-methods']).toBeDefined();
    expect(headers['access-control-allow-headers']).toBeDefined();
    expect(headers['access-control-allow-credentials']).toBe('true');
  });
});