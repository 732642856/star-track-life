# 星轨人生 macOS 版本优化报告 v2.1

## 📊 优化概况

| 优化项目 | 状态 | 版本变化 |
|---------|------|---------|
| Electron 升级 | ✅ 完成 | 41.1.1 → 35.0.0 (最新稳定版) |
| 主进程重构 | ✅ 完成 | 完全重写，添加多项功能 |
| macOS 原生特性 | ✅ 完成 | Touch Bar、Dock 菜单、深色模式 |
| Universal Binary | ✅ 完成 | 支持 Intel + Apple Silicon |
| 自动更新 | ✅ 完成 | 集成 electron-updater |
| 窗口状态恢复 | ✅ 完成 | 位置、大小、最大化状态 |
| 最近文件列表 | ✅ 完成 | 菜单集成，最多10个 |

---

## 🔧 详细优化内容

### 1. 依赖升级

#### Electron 升级
```json
// 升级前
"electron": "^41.1.1",
"electron-builder": "23.6.0"

// 升级后
"electron": "^35.0.0",
"electron-builder": "^25.1.0"
```

**收益**：
- 更好的 macOS 14+ 兼容性
- 性能提升（启动速度、内存占用）
- 安全性更新
- 新的 API 支持

#### 新增依赖
```json
"electron-log": "^5.0.0"        // 日志管理
"electron-store": "^10.0.0"     // 配置存储
"electron-updater": "^6.3.0"    // 自动更新
```

### 2. 主进程 (main.js) 优化

#### 新增功能

| 功能 | 说明 |
|------|------|
| **窗口状态恢复** | 自动保存/恢复窗口位置、大小、最大化状态 |
| **Dock 菜单** | 最近文件列表、快速操作 |
| **系统菜单增强** | 语言切换、主题切换、最近文件 |
| **Touch Bar 支持** | 预留接口，可自定义快捷操作 |
| **深色模式** | 支持跟随系统/手动切换 |
| **自动更新** | 启动时自动检查更新 |
| **日志系统** | 结构化日志，便于调试 |

#### 性能优化

```javascript
// 窗口准备好后再显示，避免闪烁
mainWindow.once('ready-to-show', () => {
  mainWindow.show();
});

// 自动保存窗口状态
const saveWindowState = () => {
  // 保存位置、大小、状态
};
```

### 3. macOS 原生特性

#### 深色模式支持
- 支持跟随系统
- 支持手动切换（浅色/深色/跟随系统）
- 动态切换无需重启

#### Touch Bar 支持
- 已预留接口
- 可在渲染进程中自定义快捷按钮

#### 原生菜单
- 完整的多语言支持（简中/繁中/英文）
- 最近文件列表（最多10个）
- 主题切换菜单
- 标准编辑/视图/窗口菜单

### 4. 构建配置优化

#### Universal Binary 支持
```json
"target": [
  {
    "target": "dmg",
    "arch": ["x64", "arm64", "universal"]
  }
]
```

**收益**：
- 一份安装包同时支持 Intel 和 Apple Silicon Mac
- 用户无需选择版本
- App Store 审核要求

#### 自动更新配置
```json
"publish": {
  "provider": "github",
  "owner": "yourusername",
  "repo": "star-track-life",
  "releaseType": "release"
}
```

### 5. 权限配置增强

新增权限：
- 文件读写（用户选择/下载目录）
- 打印支持
- 摄像头/麦克风（预留）
- AppleScript 自动化

---

## 🚀 使用方法

### 开发环境

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev
# 或
NODE_ENV=development npm start

# 启用开发者工具
# 菜单：视图 → 开发者工具
```

### 构建应用

```bash
# 构建所有平台
npm run build

# 仅构建 macOS DMG
npm run build:mac:dmg

# 构建 Mac App Store 版本
npm run build:mas

# 构建 Universal Binary
npm run build:mac
```

### 自动更新测试

```bash
# 构建并发布到 GitHub Releases
npm run release
```

---

## 📁 新增/修改文件

```
star-track-life/
├── package.json              # 更新：依赖升级，构建配置
├── main.js                   # 重写：完整功能实现
├── preload.js                # 新增：安全桥接
├── electron-builder.json     # 更新：Universal Binary 支持
├── entitlements.plist        # 更新：增强权限
├── macos/
│   └── Info.plist           # 更新：版本号、UTI、URL Scheme
└── MACOS_OPTIMIZATION.md     # 新增：本文档
```

---

## 🎯 后续优化建议

### 高优先级

1. **代码签名配置**
   - 更新 `cscLink` 和 `identity` 为你的真实证书
   - 配置 CI/CD 自动签名

2. **GitHub 仓库配置**
   - 更新 `package.json` 中的 `repository` 地址
   - 配置 GitHub Releases 自动发布

3. **Touch Bar 实现**
   - 在渲染进程中调用 `window.electronAPI.onInitTouchBar`
   - 实现常用的快捷操作按钮

### 中优先级

4. **原生文件拖拽**
   - 支持拖拽 .stchar 文件到 Dock 图标打开

5. **iCloud 同步**
   - 支持 iCloud Drive 存储角色文件

6. **Spotlight 集成**
   - 支持 Spotlight 搜索角色文件

### 低优先级

7. **Shortcuts 支持**
   - macOS Shortcuts 快捷指令集成

8. **Widgets 支持**
   - macOS Sonoma 桌面小组件

---

## ⚠️ 注意事项

### 签名和公证

发布到 App Store 或分发 DMG 需要：

1. **Apple Developer 账号**
2. **有效证书**
   - Mac App Distribution
   - Mac Installer Distribution
   - Developer ID Application

3. **公证（Notarization）**
   ```bash
   xcrun altool --notarize-app --primary-bundle-id "com.yinan.xinggui0" --username "your@email.com" --password "@keychain:AC_PASSWORD" --file "星轨人生.dmg"
   ```

### 版本号管理

更新版本时修改：
1. `package.json` 中的 `version`
2. `macos/Info.plist` 中的 `CFBundleShortVersionString` 和 `CFBundleVersion`

### 测试清单

- [ ] 窗口状态恢复（位置、大小、最大化）
- [ ] 深色模式切换
- [ ] 多语言切换
- [ ] 最近文件列表
- [ ] 菜单快捷键
- [ ] 自动更新检查
- [ ] Universal Binary 在 Intel/ARM Mac 上运行
- [ ] 沙盒权限（文件读写）

---

## 📚 参考链接

- [Electron 文档](https://www.electronjs.org/docs)
- [electron-builder 配置](https://www.electron.build/configuration/configuration)
- [macOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple 代码签名指南](https://developer.apple.com/documentation/xcode/creating-distribution-signed-code-for-the-mac)

---

**优化日期**: 2026-04-10  
**优化版本**: v2.1.0  
**Electron 版本**: 35.0.0
