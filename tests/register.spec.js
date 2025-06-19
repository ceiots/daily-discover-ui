import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  test('should load and check for errors', async ({ page }) => {
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });

    await page.goto('http://localhost:3000/register');

    // Wait for a fixed amount of time for the page to render
    await page.waitForTimeout(5000);

    // Log all messages for debugging
    console.log('All console logs:', consoleLogs);

    // Check for any console errors
    const errorLogs = consoleLogs.filter(log => log.type() === 'error');
    expect(errorLogs).toHaveLength(0);
  });
}); 