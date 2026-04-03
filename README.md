# 星轨人生 Pro - 紫微斗数人物角色生成工具

![Version](https://img.shields.io/badge/version-Pro-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

> 基于紫微斗数 144 种命盘、108 颗星曜体系，实现"人物基础属性输入 → 自动匹配紫微命盘 → 生成完整人物小传"的全流程智能创作工具。

## 🌟 核心功能

### 1. 六大模块完整整合

| 模块 | 功能 | 来源 |
|------|------|------|
| 命盘引擎 | 115+星曜安星、三方四正、大限流年流月推演 | star-track-life2.0 |
| 双语数据 | 中英双语星曜、命盘、心理学解读 | star-track-life0 |
| 人物小传 | 20问探测 + 增强生成 + 深度刻画 | 两者整合 |
| 时代背景 | 古代/近代/现代多时代人物塑造 | 两者整合 |
| 面相生成 | 人物外貌特征自动生成 | star-track-life2.0 |
| 写作资源 | 丰富词汇库、签名详解、创作指南 | 两者整合 |

### 2. 支持语言

- 🇨🇳 简体中文
- 🇹🇼 繁體中文
- 🇺🇸 English

### 3. 多端支持

- 📱 **iOS App** - 原生 Swift 构建
- 🤖 **Android App** - Capacitor 跨平台打包
- 🌐 **Web App** - PWA 支持，离线可用

## 📁 项目结构

```
star-track-life-pro/
├── i18n-data/                    # ⭐ 双语数据（来自 star-track-life0）
│   ├── ziwei-i18n-complete.js   # 完整双语引擎
│   ├── ziwei-i18n-stars.js      # 双语星曜数据
│   ├── ziwei-patterns-i18n.js   # 双语命盘格局
│   ├── ziwei-psychology-i18n.js # 双语心理学
│   └── ...
├── www/                         # Web 资源
├── src/                         # 源代码
├── android/                    # Android 原生项目
├── ios/                         # iOS 原生项目
├── ziwei-*.js                   # 紫微斗数核心引擎
├── character-*.js               # 人物小传生成
├── era-data.js                  # 时代背景数据
├── face-reading-*.js             # 面相生成
├── writing-*.js                 # 写作资源
├── capacitor.config.json        # Capacitor 配置
└── package.json
```

## 🚀 快速开始

### Web 版本

直接在浏览器打开 `index.html` 即可使用。

### iOS 构建

```bash
cd ios/App
npm install
npx cap sync ios
npx cap open ios
```

### Android 构建

```bash
npx cap sync android
npx cap open android
```

## 📖 使用流程

1. **选择时代** - 古代/近代/现代
2. **输入信息** - 性别、年龄、出生年
3. **设定时辰** - 子丑寅卯...配合刻度
4. **选择属性** - 职业、家庭、人生经历
5. **生成命盘** - 自动排盘，展示三方四正
6. **生成小传** - 完整人物角色设定

## 📚 核心数据

### 紫微斗数星曜体系（108颗）

包含主星、辅星、杂曜、流年星等完整分类。

### 144 种命盘格局

涵盖各类富贵格局、凶险格局、特殊格局。

### 双语对照

所有星曜、格局、心理学描述均提供中英双语。

## 🔧 技术栈

- **前端**: Vanilla JavaScript, HTML5, CSS3
- **移动端**: Capacitor + Swift/Java
- **数据**: LocalStorage 持久化
- **离线**: Service Worker PWA 支持

## 📝 文档

- [安装使用说明](./安装使用说明.md)
- [版本说明 v2](./版本说明-v2.md)
- [整合方案](./整合方案.md)
- [人物小传集成说明](./人物小传集成说明.md)

## 🤝 整合来源

| 项目 | 贡献内容 |
|------|---------|
| **star-track-life** | iOS App 基础架构 |
| **star-track-life0** | 双语数据、国际化 UI |
| **star-track-life2.0** | 完整紫微斗数引擎 v2.0 |

## 📄 License

MIT License

---

*星轨人生 Pro - 用紫微斗数点亮角色创作*
