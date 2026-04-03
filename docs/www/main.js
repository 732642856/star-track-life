const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

// 当前语言（从设置读取或默认中文）
let currentLang = 'zh';

// 多语言菜单配置
const MENU_TEXTS = {
  'zh': {
    appName: '星轨人生',
    edit: '编辑',
    view: '视图',
    window: '窗口',
    help: '帮助',
    language: '语言',
    about: '关于星轨人生',
    aboutDetail: '基于紫微斗数144种命盘、108颗星曜体系的人物角色生成工具。\n\n版本: 2.0 Pro',
    langZH: '简体中文',
    langZHTW: '繁體中文',
    langEN: 'English'
  },
  'zh-TW': {
    appName: '星軌人生',
    edit: '編輯',
    view: '視圖',
    window: '視窗',
    help: '幫助',
    language: '語言',
    about: '關於星軌人生',
    aboutDetail: '基於紫微斗數144種命盤、108顆星曜體系的人物角色生成工具。\n\n版本: 2.0 Pro',
    langZH: '简体中文',
    langZHTW: '繁體中文',
    langEN: 'English'
  },
  'en': {
    appName: 'Star Track Life',
    edit: 'Edit',
    view: 'View',
    window: 'Window',
    help: 'Help',
    language: 'Language',
    about: 'About Star Track Life',
    aboutDetail: 'Character creation tool based on Zi Wei Dou Shu astrology.\n\nVersion: 2.0 Pro',
    langZH: '简体中文',
    langZHTW: '繁體中文',
    langEN: 'English'
  }
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: MENU_TEXTS[currentLang].appName,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    // macOS specific
    trafficLightPosition: { x: 15, y: 15 },
    titleBarStyle: 'hiddenInset',
    // 支持深色模式
    backgroundColor: '#FFFFFF'
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'www', 'index.html'));
  }

  // 创建应用菜单
  createMenu(mainWindow);

  // Handle window close on macOS
  mainWindow.on('closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  return mainWindow;
}

/**
 * 创建应用菜单（支持多语言）
 */
function createMenu(mainWindow) {
  const texts = MENU_TEXTS[currentLang];
  
  const template = [
    {
      label: texts.appName,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: texts.edit,
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: texts.view,
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: texts.window,
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ]
    },
    {
      label: texts.language,
      submenu: [
        {
          label: texts.langZH,
          type: 'radio',
          checked: currentLang === 'zh',
          click: () => switchLanguage('zh', mainWindow)
        },
        {
          label: texts.langZHTW,
          type: 'radio',
          checked: currentLang === 'zh-TW',
          click: () => switchLanguage('zh-TW', mainWindow)
        },
        {
          label: texts.langEN,
          type: 'radio',
          checked: currentLang === 'en',
          click: () => switchLanguage('en', mainWindow)
        }
      ]
    },
    {
      label: texts.help,
      submenu: [
        {
          label: texts.about,
          click: async () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: texts.about,
              message: MENU_TEXTS[currentLang].appName + ' Pro',
              detail: texts.aboutDetail
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * 切换语言
 */
function switchLanguage(lang, mainWindow) {
  if (currentLang === lang) return;
  
  currentLang = lang;
  
  // 更新菜单
  createMenu(mainWindow);
  
  // 通知渲染进程切换语言
  mainWindow.webContents.executeJavaScript(`
    if (typeof switchLanguage === 'function') {
      switchLanguage('${lang}');
    }
  `).catch(err => {
    console.log('Language switch in renderer failed:', err);
  });
  
  console.log(`[Electron] Language switched to: ${lang}`);
}

// IPC 通信：接收渲染进程的语言切换请求
ipcMain.on('switch-language', (event, lang) => {
  currentLang = lang;
  const mainWindow = BrowserWindow.fromWebContents(event.sender);
  if (mainWindow) {
    createMenu(mainWindow);
  }
});

// IPC 通信：获取当前语言
ipcMain.handle('get-language', () => {
  return currentLang;
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
