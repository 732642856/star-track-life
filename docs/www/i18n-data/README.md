# 双语资源索引 (i18n-data)

本目录包含来自 `star-track-life0` 的所有双语数据文件。

## 文件清单

| 文件名 | 大小 | 说明 |
|--------|------|------|
| `ziwei-i18n-complete.js` | 62KB | 完整双语紫微斗数引擎 |
| `ziwei-i18n-stars.js` | 3.5KB | 双语星曜基础数据 |
| `ziwei-patterns-i18n.js` | 18KB | 双语 144 种命盘格局 |
| `ziwei-psychology-i18n.js` | 33KB | 双语心理学分析 |
| `ziwei-star-details-i18n.js` | 26KB | 双语星曜详解 |
| `ziwei-bio-core.js` | 450KB | 双语命盘生物核心 |
| `era-data-i18n.js` | 27KB | 双语时代背景数据 |
| `character-bio-generator-i18n.js` | 45KB | 双语人物小传生成器 |
| `character-bio-enhanced-generator-i18n.js` | 26KB | 双语增强生成器 |
| `character-bio-data-i18n.js` | 438B | 双语人物数据 |
| `character-20-questions-i18n.js` | 24KB | 双语 20 问探测 |
| `chart-to-bio-bridge.js` | 98KB | 命盘到小传桥接 |
| `chart-storage-i18n.js` | 829B | 双语存储 |
| `face-reading-generator-i18n.js` | 22KB | 双语面相生成 |
| `signature-details-generator-i18n.js` | 20KB | 双语签名详解 |
| `fine-chart-engine-i18n.js` | 23KB | 双语精细命盘引擎 |
| `writing-resources-i18n.js` | 37KB | 双语写作资源 |
| `writing-lexicon-generator.js` | 12KB | 写作词典生成器 |
| `writing-library-enhancer.js` | 16KB | 写作库增强 |
| `rich-word-library.js` | 40KB | 丰富词汇库 |
| `ziwei-word-library.js` | - | 紫微词库 |
| `i18n-ui.js` | 62KB | 双语 UI 界面 |

## 使用方式

```javascript
// 引入双语星曜数据
<script src="i18n-data/ziwei-i18n-stars.js"></script>

// 设置语言
ZiweiI18n.setLanguage('en'); // 或 'zh', 'zh-TW'

// 获取双语内容
const starName = ZiweiI18n.getStarName('紫微', 'en'); // "Zi Wei"
```

## 对照表

| 中文 | English | 繁體中文 |
|------|---------|----------|
| 紫微 | Zi Wei | 紫微 |
| 天机 | Tian Ji | 天機 |
| 太阳 | Tai Yang | 太陽 |
| 武曲 | Wu Qu | 武曲 |
| 天同 | Tian Tong | 天同 |
| ... | ... | ... |

---
*本目录由 star-track-life0 整合而来，保留所有原始数据完整性。*
