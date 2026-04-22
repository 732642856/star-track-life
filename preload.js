const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 Electron API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 设置管理
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  
  // 文件操作
  addRecentFile: (filePath) => ipcRenderer.invoke('add-recent-file', filePath),
  
  // 事件监听
  onLanguageChanged: (callback) => {
    ipcRenderer.on('language-changed', (event, lang) => callback(lang));
  },
  onThemeChanged: (callback) => {
    ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
  },
  onOpenFile: (callback) => {
    ipcRenderer.on('open-file', (event, filePath) => callback(filePath));
  },
  onSaveFile: (callback) => {
    ipcRenderer.on('save-file', () => callback());
  },
  onExportCharacter: (callback) => {
    ipcRenderer.on('export-character', () => callback());
  },
  onShowPreferences: (callback) => {
    ipcRenderer.on('show-preferences', () => callback());
  },
  onInitTouchBar: (callback) => {
    ipcRenderer.on('init-touchbar', () => callback());
  },
  
  // 移除监听器
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// 暴露平台信息
contextBridge.exposeInMainWorld('platform', {
  isMac: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux'
});
