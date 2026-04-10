const { app, BrowserWindow, Menu, ipcMain, screen, nativeTheme, dialog, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// 配置日志
log.transports.file.level = 'info';
log.info('Application starting...');

// 窗口状态存储
const windowStore = new Store({
  name: 'window-state',
  defaults: {
    width: 1400,
    height: 900,
    x: undefined,
    y: undefined,
    maximized: false,
    fullscreen: false
  }
});

// 应用设置存储
const appSettings = new Store({
  name: 'app-settings',
  defaults: {
    language: 'zh',
    theme: 'system',
    sidebarCollapsed: false,
    recentFiles: [],
    autoSave: true,
    fontSize: 14
  }
});

// 全局变量
let mainWindow = null;
let currentLang = appSettings.get('language');
let isQuitting = false;

// 多语言菜单配置
const MENU_TEXTS = {
  'zh': {
    appName: '星轨人生',
    edit: '编辑',
    view: '视图',
    window: '窗口',
    help: '帮助',
    language: '语言',
    theme: '主题',
    file: '文件',
    about: '关于星轨人生',
    aboutDetail: '基于紫微斗数144种命盘、108颗星曜体系的人物角色生成工具。\n\n版本: 2.1 Pro',
    langZH: '简体中文',
    langZHTW: '繁體中文',
    langEN: 'English',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    newWindow: '新建窗口',
    showMainWindow: '显示主窗口',
    openFile: '打开文件',
    saveFile: '保存',
    exportChar: '导出角色',
    preferences: '偏好设置...',
    services: '服务',
    hide: '隐藏',
    hideOthers: '隐藏其他',
    showAll: '显示全部',
    quit: '退出',
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',
    reload: '重新加载',
    forceReload: '强制刷新',
    toggleDevTools: '开发者工具',
    actualSize: '实际大小',
    zoomIn: '放大',
    zoomOut: '缩小',
    toggleFullscreen: '全屏',
    minimize: '最小化',
    zoom: '缩放',
    front: '前置所有窗口',
    learnMore: '了解更多',
    documentation: '文档',
    checkUpdate: '检查更新',
    clearRecent: '清除最近打开'
  },
  'zh-TW': {
    appName: '星軌人生',
    edit: '編輯',
    view: '視圖',
    window: '視窗',
    help: '幫助',
    language: '語言',
    theme: '主題',
    file: '檔案',
    about: '關於星軌人生',
    aboutDetail: '基於紫微斗數144種命盤、108顆星曜體系的人物角色生成工具。\n\n版本: 2.1 Pro',
    langZH: '简体中文',
    langZHTW: '繁體中文',
    langEN: 'English',
    themeLight: '淺色',
    themeDark: '深色',
    themeSystem: '跟隨系統',
    newWindow: '新建視窗',
    showMainWindow: '顯示主視窗',
    openFile: '開啟檔案',
    saveFile: '儲存',
    exportChar: '匯出角色',
    preferences: '偏好設定...',
    services: '服務',
    hide: '隱藏',
    hideOthers: '隱藏其他',
    showAll: '顯示全部',
    quit: '結束',
    undo: '復原',
    redo: '重做',
    cut: '剪下',
    copy: '複製',
    paste: '貼上',
    selectAll: '全選',
    reload: '重新載入',
    forceReload: '強制更新',
    toggleDevTools: '開發者工具',
    actualSize: '實際大小',
    zoomIn: '放大',
    zoomOut: '縮小',
    toggleFullscreen: '全螢幕',
    minimize: '最小化',
    zoom: '縮放',
    front: '前置所有視窗',
    learnMore: '了解更多',
    documentation: '文件',
    checkUpdate: '檢查更新',
    clearRecent: '清除最近開啟'
  },
  'en': {
    appName: 'Star Track Life',
    edit: 'Edit',
    view: 'View',
    window: 'Window',
    help: 'Help',
    language: 'Language',
    theme: 'Theme',
    file: 'File',
    about: 'About Star Track Life',
    aboutDetail: 'Character creation tool based on Zi Wei Dou Shu astrology.\n\nVersion: 2.1 Pro',
    langZH: '简体中文',
    langZHTW: '繁體中文',
    langEN: 'English',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    newWindow: 'New Window',
    showMainWindow: 'Show Main Window',
    openFile: 'Open File',
    saveFile: 'Save',
    exportChar: 'Export Character',
    preferences: 'Preferences...',
    services: 'Services',
    hide: 'Hide',
    hideOthers: 'Hide Others',
    showAll: 'Show All',
    quit: 'Quit',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    reload: 'Reload',
    forceReload: 'Force Reload',
    toggleDevTools: 'Developer Tools',
    actualSize: 'Actual Size',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    toggleFullscreen: 'Toggle Full Screen',
    minimize: 'Minimize',
    zoom: 'Zoom',
    front: 'Bring All to Front',
    learnMore: 'Learn More',
    documentation: 'Documentation',
    checkUpdate: 'Check for Updates',
    clearRecent: 'Clear Recent'
  }
};

/**
 * 获取窗口显示区域（确保窗口在可见范围内）
 */
function getValidWindowBounds(width, height, x, y) {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  
  // 默认居中显示
  if (x === undefined || y === undefined) {
    return {
      width: Math.min(width, primaryDisplay.workArea.width - 100),
      height: Math.min(height, primaryDisplay.workArea.height - 100),
      x: Math.round((primaryDisplay.workArea.width - width) / 2),
      y: Math.round((primaryDisplay.workArea.height - height) / 2)
    };
  }
  
  // 检查窗口是否在任何显示器范围内
  const isVisible = displays.some(display => {
    const { workArea } = display;
    return x < workArea.x + workArea.width &&
           x + width > workArea.x &&
           y < workArea.y + workArea.height &&
           y + height > workArea.y;
  });
  
  // 如果不可见，重置为居中
  if (!isVisible) {
    return {
      width: Math.min(width, primaryDisplay.workArea.width - 100),
      height: Math.min(height, primaryDisplay.workArea.height - 100),
      x: Math.round((primaryDisplay.workArea.width - width) / 2),
      y: Math.round((primaryDisplay.workArea.height - height) / 2)
    };
  }
  
  return { width, height, x, y };
}

/**
 * 创建主窗口
 */
function createWindow() {
  // 恢复窗口状态
  const windowState = windowStore.store;
  const validBounds = getValidWindowBounds(
    windowState.width,
    windowState.height,
    windowState.x,
    windowState.y
  );
  
  mainWindow = new BrowserWindow({
    ...validBounds,
    minWidth: 900,
    minHeight: 600,
    title: MENU_TEXTS[currentLang].appName,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: false,
      defaultFontFamily: {
        standard: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
        serif: 'Georgia, "Times New Roman"',
        sansSerif: 'system-ui, -apple-system, sans-serif',
        monospace: 'Menlo, Monaco, "Courier New", monospace'
      }
    },
    // macOS 原生外观
    trafficLightPosition: { x: 15, y: 15 },
    titleBarStyle: 'hiddenInset',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1a1a1a' : '#ffffff',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    // 性能优化
    show: false
  });
  
  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'www', 'index.html'));
  }
  
  // 窗口准备好后再显示，避免闪烁
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (windowState.maximized) {
      mainWindow.maximize();
    }
    if (windowState.fullscreen) {
      mainWindow.setFullScreen(true);
    }
  });
  
  // 保存窗口状态
  const saveWindowState = () => {
    if (!mainWindow) return;
    
    const bounds = mainWindow.getBounds();
    windowStore.set({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      maximized: mainWindow.isMaximized(),
      fullscreen: mainWindow.isFullScreen()
    });
  };
  
  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);
  mainWindow.on('maximize', saveWindowState);
  mainWindow.on('unmaximize', saveWindowState);
  mainWindow.on('enter-full-screen', saveWindowState);
  mainWindow.on('leave-full-screen', saveWindowState);
  
  // macOS: 关闭窗口但不退出应用
  mainWindow.on('close', (event) => {
    if (!isQuitting && process.platform === 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // 创建应用菜单
  createMenu();
  
  // 创建 Touch Bar (macOS)
  if (process.platform === 'darwin') {
    createTouchBar();
  }
  
  // 监听深色模式变化
  nativeTheme.on('updated', () => {
    if (mainWindow) {
      mainWindow.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    }
  });
  
  return mainWindow;
}

/**
 * 创建应用菜单
 */
function createMenu() {
  const texts = MENU_TEXTS[currentLang];
  const recentFiles = appSettings.get('recentFiles') || [];
  
  const template = [
    {
      label: texts.appName,
      submenu: [
        {
          label: texts.about,
          click: () => showAboutDialog()
        },
        { type: 'separator' },
        {
          label: texts.preferences,
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-preferences');
            }
          }
        },
        { type: 'separator' },
        {
          label: texts.services,
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: texts.hide,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: texts.hideOthers,
          accelerator: 'Command+Shift+H',
          role: 'hideOthers'
        },
        {
          label: texts.showAll,
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: texts.quit,
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: texts.file,
      submenu: [
        {
          label: texts.newWindow,
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow()
        },
        { type: 'separator' },
        {
          label: texts.openFile,
          accelerator: 'CmdOrCtrl+O',
          click: () => openFileDialog()
        },
        {
          label: texts.saveFile,
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('save-file');
            }
          }
        },
        { type: 'separator' },
        {
          label: texts.exportChar,
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('export-character');
            }
          }
        },
        { type: 'separator' },
        {
          label: '最近打开',
          submenu: recentFiles.length > 0 ? [
            ...recentFiles.map(file => ({
              label: path.basename(file),
              click: () => openRecentFile(file)
            })),
            { type: 'separator' },
            {
              label: texts.clearRecent,
              click: () => {
                appSettings.set('recentFiles', []);
                createMenu();
              }
            }
          ] : [{ label: '没有最近文件', enabled: false }]
        }
      ]
    },
    {
      label: texts.edit,
      submenu: [
        { role: 'undo', label: texts.undo },
        { role: 'redo', label: texts.redo },
        { type: 'separator' },
        { role: 'cut', label: texts.cut },
        { role: 'copy', label: texts.copy },
        { role: 'paste', label: texts.paste },
        { role: 'selectAll', label: texts.selectAll }
      ]
    },
    {
      label: texts.view,
      submenu: [
        {
          label: texts.reload,
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) mainWindow.webContents.reload();
          }
        },
        {
          label: texts.forceReload,
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) mainWindow.webContents.reloadIgnoringCache();
          }
        },
        {
          label: texts.toggleDevTools,
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        {
          label: texts.actualSize,
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (mainWindow) mainWindow.webContents.setZoomLevel(0);
          }
        },
        {
          label: texts.zoomIn,
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            if (mainWindow) {
              const level = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(level + 0.5);
            }
          }
        },
        {
          label: texts.zoomOut,
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) {
              const level = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(level - 0.5);
            }
          }
        },
        { type: 'separator' },
        {
          label: texts.toggleFullscreen,
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click: () => {
            if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    },
    {
      label: texts.window,
      submenu: [
        {
          label: texts.newWindow,
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (BrowserWindow.getAllWindows().length === 0) {
              createWindow();
            } else if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            }
          }
        },
        {
          label: texts.showMainWindow,
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            } else {
              createWindow();
            }
          }
        },
        { type: 'separator' },
        {
          label: texts.minimize,
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: texts.zoom,
          role: 'zoom'
        },
        { type: 'separator' },
        {
          label: texts.front,
          role: 'front'
        },
        { type: 'separator' },
        {
          role: 'window',
          label: texts.window
        }
      ]
    },
    {
      label: texts.language,
      submenu: [
        {
          label: texts.langZH,
          type: 'radio',
          checked: currentLang === 'zh',
          click: () => switchLanguage('zh')
        },
        {
          label: texts.langZHTW,
          type: 'radio',
          checked: currentLang === 'zh-TW',
          click: () => switchLanguage('zh-TW')
        },
        {
          label: texts.langEN,
          type: 'radio',
          checked: currentLang === 'en',
          click: () => switchLanguage('en')
        }
      ]
    },
    {
      label: texts.theme,
      submenu: [
        {
          label: texts.themeLight,
          type: 'radio',
          checked: appSettings.get('theme') === 'light',
          click: () => setTheme('light')
        },
        {
          label: texts.themeDark,
          type: 'radio',
          checked: appSettings.get('theme') === 'dark',
          click: () => setTheme('dark')
        },
        {
          label: texts.themeSystem,
          type: 'radio',
          checked: appSettings.get('theme') === 'system',
          click: () => setTheme('system')
        }
      ]
    },
    {
      label: texts.help,
      submenu: [
        {
          label: texts.documentation,
          click: () => {
            shell.openExternal('https://github.com/yourusername/star-track-life/wiki');
          }
        },
        {
          label: texts.learnMore,
          click: () => {
            shell.openExternal('https://github.com/yourusername/star-track-life');
          }
        },
        { type: 'separator' },
        {
          label: texts.checkUpdate,
          click: () => {
            autoUpdater.checkForUpdatesAndNotify();
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * 创建 Touch Bar (macOS)
 */
function createTouchBar() {
  // Touch Bar 支持需要在 preload.js 中暴露相关 API
  // 这里先预留接口
  if (mainWindow) {
    mainWindow.webContents.send('init-touchbar');
  }
}

/**
 * 显示关于对话框
 */
function showAboutDialog() {
  if (!mainWindow) return;
  
  const texts = MENU_TEXTS[currentLang];
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: texts.about,
    message: `${texts.appName} Pro`,
    detail: texts.aboutDetail,
    buttons: ['OK'],
    icon: path.join(__dirname, 'icon-512x512.png')
  });
}

/**
 * 打开文件对话框
 */
async function openFileDialog() {
  if (!mainWindow) return;
  
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: '角色文件', extensions: ['stchar', 'json'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    openRecentFile(result.filePaths[0]);
  }
}

/**
 * 打开最近文件
 */
function openRecentFile(filePath) {
  if (!mainWindow) return;
  
  mainWindow.webContents.send('open-file', filePath);
  
  // 更新最近文件列表
  let recentFiles = appSettings.get('recentFiles') || [];
  recentFiles = recentFiles.filter(f => f !== filePath);
  recentFiles.unshift(filePath);
  recentFiles = recentFiles.slice(0, 10); // 保留最近10个
  appSettings.set('recentFiles', recentFiles);
  
  createMenu(); // 刷新菜单
}

/**
 * 切换语言
 */
function switchLanguage(lang) {
  if (currentLang === lang) return;
  
  currentLang = lang;
  appSettings.set('language', lang);
  
  // 更新菜单
  createMenu();
  
  // 通知渲染进程
  if (mainWindow) {
    mainWindow.webContents.send('language-changed', lang);
  }
  
  log.info(`Language switched to: ${lang}`);
}

/**
 * 设置主题
 */
function setTheme(theme) {
  appSettings.set('theme', theme);
  
  if (theme === 'system') {
    nativeTheme.themeSource = 'system';
  } else {
    nativeTheme.themeSource = theme;
  }
  
  if (mainWindow) {
    mainWindow.webContents.send('theme-changed', theme === 'system' 
      ? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
      : theme
    );
  }
}

// IPC 处理
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-settings', () => {
  return appSettings.store;
});

ipcMain.handle('set-setting', (event, key, value) => {
  appSettings.set(key, value);
  return true;
});

ipcMain.handle('add-recent-file', (event, filePath) => {
  let recentFiles = appSettings.get('recentFiles') || [];
  recentFiles = recentFiles.filter(f => f !== filePath);
  recentFiles.unshift(filePath);
  recentFiles = recentFiles.slice(0, 10);
  appSettings.set('recentFiles', recentFiles);
  createMenu();
  return true;
});

// App 生命周期
app.whenReady().then(() => {
  log.info('App is ready');
  
  createWindow();
  
  // macOS: 设置 Dock 菜单（修复审核问题：关闭窗口后重新打开的选项）
  if (process.platform === 'darwin') {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: '新建窗口',
        click: () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
          } else if (mainWindow) {
            mainWindow.show();
          }
        }
      },
      {
        label: '显示主窗口',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          } else {
            createWindow();
          }
        }
      },
      { type: 'separator' },
      {
        label: '最近文件',
        submenu: (() => {
          const recentFiles = appSettings.get('recentFiles') || [];
          if (recentFiles.length === 0) {
            return [{ label: '没有最近文件', enabled: false }];
          }
          return recentFiles.slice(0, 5).map(filePath => ({
            label: path.basename(filePath),
            click: () => {
              if (!mainWindow) createWindow();
              openRecentFile(filePath);
            }
          }));
        })()
      }
    ]);
    app.dock.setMenu(dockMenu);
    
    // 点击 Dock 图标时的行为
    app.dock.setIcon(path.join(__dirname, 'icon-512x512.png'));
  }
  
  // macOS: 点击 dock 图标重新显示窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
  
  // 自动更新检查（生产环境）
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('open-file', (event, path) => {
  event.preventDefault();
  openRecentFile(path);
});

// 自动更新事件
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  log.info(`Download progress: ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
  autoUpdater.quitAndInstall();
});
