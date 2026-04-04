# 星轨人生 - 仓库结构说明

## 目录结构

```
star-track-life/
├── www/                      # ⭐ 主要工作目录（iOS 打包源）
│   ├── index.html            # 主页面
│   ├── app-v2.js             # 核心应用逻辑
│   ├── i18n-core.js          # 国际化核心模块
│   ├── i18n-ui.js            # UI 翻译数据
│   ├── ziwei-bio-core.js     # 人物小传生成引擎
│   ├── fine-chart-engine.js  # 紫微斗数排盘引擎
│   └── ...                   # 其他模块
│
├── docs/                     # 旧版文档和备份
├── star-track-life0/         # 旧版本（有更完整的行为描述数据）
├── star-track-life2.0/       # 另一个版本
│
├── capacitor.config.json     # Capacitor iOS 配置
└── I18N_OPTIMIZATION_LOG.md  # 优化工作日志
```

## 关键文件说明

### 国际化 (i18n)

| 文件 | 作用 |
|------|------|
| `www/i18n-core.js` | 语言管理器，提供 `I18nCore.t()`, `getStarName()`, `getPalaceName()` |
| `www/i18n-ui.js` | 三语言 UI 文案数据 `UI_TEXT['zh'|'zh-TW'|'en']` |
| `www/ziwei-i18n-stars.js` | 星曜名称翻译 |
| `www/ziwei-bio-core.js` | 包含 `ATTR_LABEL_TO_ZH` 属性值翻译映射 |

### 核心引擎

| 文件 | 作用 |
|------|------|
| `www/fine-chart-engine.js` | 排盘引擎，导出 `ZiweiEngine` 和 `FineChartEngine` |
| `www/chart-to-bio-bridge.js` | 排盘结果到小传的桥接层 |
| `www/ziwei-bio-core.js` | 人物小传生成核心，`_sc2tw()` 简繁转换 |

### 应用入口

| 文件 | 作用 |
|------|------|
| `www/index.html` | 单页应用入口，包含语言选择器 |
| `www/app-v2.js` | 主应用逻辑，步骤流程控制 |

## 翻译调用链

```
用户点击语言按钮
    ↓
switchLang(lang) 或 pickLang(lang)
    ↓
I18nCore.setLanguage(lang)
    ↓
localStorage.setItem('star_track_lang', lang)
window.CURRENT_LANG = lang
    ↓
updatePageLanguage(lang)
    ↓
document.querySelectorAll('[data-i18n]') → 更新文本
renderDynamicContent() → 重新渲染动态内容
```

## 版本对比

| 版本 | 特点 |
|------|------|
| `star-track-life/www/` | 当前版本，iOS 打包源 |
| `star-track-life0/` | 旧版本，有更完整的 `_SC2TW_MAP` (246条 vs 209条) |
| `star-track-life2.0/` | 另一个版本 |

## 常见问题

### Q: 为什么翻译不生效？

检查以下项：
1. `localStorage.getItem('star_track_lang')` 是否正确
2. `window.UI_TEXT` 是否存在
3. `window.CURRENT_LANG` 是否同步
4. 浏览器缓存是否清除（版本号 `?v=XXX`）

### Q: 主星不显示？

检查 `FineChartEngine.generateChart()` 参数：
- 必须传 `birthYear`，不是 `year`
- 返回的 `palaces[idx].mainStars` 数组

### Q: 小传内容还是中文？

`ziwei-bio-core.js` 的叙事文本硬编码中文，需要：
1. 建立英文叙事模板
2. 或集成翻译 API
