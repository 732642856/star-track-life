/**
 * Electron Preload Script
 * 星轨人生 Pro - 预加载脚本
 * 
 * 用于主进程与渲染进程之间的安全通信
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 切换语言
   * @param {string} lang - 目标语言
   */
  switchLanguage: (lang) => ipcRenderer.send('switch-language', lang),
  
  /**
   * 获取当前语言
   * @returns {Promise<string>}
   */
  getLanguage: () => ipcRenderer.invoke('get-language'),
  
  /**
   * 平台信息
   */
  platform: process.platform,
  
  /**
   * 是否为 Electron 环境
   */
  isElectron: true
});

// 语言变更监听
ipcRenderer.on('language-changed', (event, lang) => {
  if (typeof window.switchLanguage === 'function') {
    window.switchLanguage(lang);
  }
});

console.log('[Preload] Electron API 已注入');
