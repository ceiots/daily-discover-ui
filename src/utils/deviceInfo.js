/**
 * 生成一个唯一的设备ID（如果本地存储中没有的话）
 * 在实际应用中，可能会使用更可靠的设备指纹库
 */
function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

/**
 * 获取设备信息
 * @returns {object} 包含设备信息的对象
 */
export function getDeviceInfo() {
  return {
    deviceId: getOrCreateDeviceId(),
    deviceType: 5, // 5 for PC/Web
    deviceModel: navigator.platform,
    osVersion: navigator.userAgent, // 简单获取User Agent
    appVersion: '1.0.0', // 你的Web App版本号
  };
}