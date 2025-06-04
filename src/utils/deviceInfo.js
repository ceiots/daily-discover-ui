function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent, // 浏览器UA字符串
    platform: navigator.platform,   // 操作系统平台
    language: navigator.language,   // 浏览器语言
    screen: {
      width: window.screen.width,
      height: window.screen.height
    }
    // 你还可以加更多字段，如 timezone、vendor 等
  };
}
export default getDeviceInfo;