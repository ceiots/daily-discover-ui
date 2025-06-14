// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* 每个测试的最大超时时间 */
  timeout: 30 * 1000,
  expect: {
    /**
     * 断言的最大等待时间
     * @see https://playwright.dev/docs/api/class-locatorassertions
     */
    timeout: 5000
  },
  /* 如果一个测试失败，最多重试1次 */
  retries: 1,
  /* 不同测试工作者之间共享的上下文 */
  workers: 1,
  /* 测试报告输出 */
  reporter: 'html',
  /* 为每个测试准备一个单独的测试上下文 */
  use: {
    /* 自动截图，用于失败的测试 */
    screenshot: 'only-on-failure',
    /* 收集追踪信息，用于调试 */
    trace: 'retain-on-failure',
    /* 基本URL配置，所有相对URL都会使用这个基础URL */
    baseURL: 'http://localhost:3000',
  },

  /* 配置不同的浏览器 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* 移动设备测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
}); 