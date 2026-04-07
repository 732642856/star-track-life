# 星轨人生 - macOS 桌面端打包指南

## 一、项目结构

```
star-track-life/
├── index.html              # 主页面
├── styles-v2.css           # 移动端/基础样式
├── styles-macos.css        # macOS 桌面端专属样式
├── app-v2.js               # 核心应用逻辑
├── app-desktop.js          # 桌面端增强模块
├── capacitor.config.json   # Capacitor 配置
├── package.json            # 项目配置
├── macos/
│   ├── Info.plist          # macOS 应用信息
│   └── Entitlements.plist  # 权限配置
└── ... (其他依赖文件)
```

## 二、打包步骤

### 1. 安装依赖

```bash
cd star-track-life
npm install
```

### 2. 初始化 Capacitor（首次）

```bash
npx cap init '星轨人生' com.startracklife.app --web-dir .
```

### 3. 添加 macOS 平台

```bash
npx cap add @capacitor-community/macos
```

### 4. 同步项目

```bash
npx cap sync
```

### 5. 打开 Xcode 项目

```bash
npx cap open @capacitor-community/macos
```

## 三、Xcode 配置

### 1. 签名配置
- 在 Xcode 中选择项目
- 选择 "Signing & Capabilities" 标签
- 选择你的开发者团队
- 确保 "Automatically manage signing" 已启用

### 2. 应用权限
将 `macos/Entitlements.plist` 内容添加到项目的 Entitlements 配置中。

### 3. 应用图标
在 Xcode 的 Assets.xcassets 中添加 AppIcon：
- 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024

### 4. 构建配置
- Archive: Product > Archive
- Validate: 验证应用符合 App Store 要求
- Distribute: 上传到 App Store Connect

## 四、Mac App Store 要求

### 必需项
1. **App Sandbox**: 必须启用沙盒模式
2. **代码签名**: 必须使用有效的开发者证书签名
3. **公证**: 上传到 Apple 进行公证（notarization）

### 审核注意事项
1. 应用不得使用私有 API
2. 必须支持深色模式（已在 CSS 中配置）
3. 必须支持 Retina 显示
4. 应用图标需符合 Apple 设计规范

## 五、应用截图要求

Mac App Store 截图规格：
- 分辨率: 1280 x 800 或 1440 x 900
- 格式: PNG 或 JPEG
- 数量: 至少 1 张，最多 10 张

## 六、发布流程

### 1. 本地测试
```bash
# 在模拟器中测试
# 在 Xcode 中选择目标设备，点击运行

# 在真机上测试（需要开发者账号）
# Product > Archive > Distribute App > Development
```

### 2. 上传审核
```bash
# 1. Archive
Product > Archive

# 2. 上传
Distribute App > App Store Connect

# 3. 在 App Store Connect 填写信息
- 应用描述
- 关键词
- 截图
- 隐私政策 URL
```

### 3. 等待审核
- 通常 1-3 天
- 审核通过后即可上架

## 七、常见问题

### Q1: Capacitor macOS 平台无法添加？
确保已安装 Xcode 15+ 和 Xcode Command Line Tools:
```bash
xcode-select --install
```

### Q2: 应用启动后白屏？
检查 `capacitor.config.json` 中的 `webDir` 是否正确指向项目根目录。

### Q3: 如何调试？
在 Xcode 中运行应用，查看控制台日志。也可以在 Safari 中连接调试：
- Safari > Develop > [你的 Mac] > 星轨人生

### Q4: 如何更新应用？
1. 修改代码
2. 运行 `npx cap sync`
3. 在 Xcode 中重新构建

## 八、技术支持

- Capacitor 文档: https://capacitorjs.com/docs
- Apple 开发者文档: https://developer.apple.com/documentation/
- App Store 审核指南: https://developer.apple.com/app-store/review/guidelines/
