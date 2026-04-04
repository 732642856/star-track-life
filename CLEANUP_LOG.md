# 星轨人生 - 仓库整理记录

**整理日期**: 2026-04-04

---

## 阶段1：备份文件清理 (*.bak)

### 待处理 (14个文件):

| 路径 | 大小 | 建议操作 |
|------|------|----------|
| `www/app-v2.js.bak` | 56KB | 删除 |
| `www/index.html.bak` | 389KB | 删除 |
| `www/ziwei-bio-core.js.bak` | 152KB | 删除 |
| `www/ziwei-bio-core-simple.js.bak` | 152KB | 删除 |
| `www/signature-details-generator-i18n.js.bak` | 20KB | 删除 |
| `character-bio-generator.js.bak` | 29KB | 删除 |
| `character-bio-enhanced-generator.js.bak` | 26KB | 删除 |
| `docs/www/app-v2.js.bak` | 57KB | 删除 |
| `docs/www/ziwei-bio-core.js.bak` | 385KB | 删除 |
| `docs/www/ziwei-bio-core-simple.js.bak` | 152KB | 删除 |
| `docs/www/signature-details-generator-i18n.js.bak` | 20KB | 删除 |
| `docs/www/index.html.bak` | 389KB | 删除 |
| `docs/ios/App/App/Info.plist.bak` | 小 | 删除 |
| `ios/App/App/Info.plist.bak` | 小 | 删除 |

---

## 阶段2：docs/ 目录处理

### docs/ 目录内容 (68 files in docs/www/)

| 目录 | 文件数 | 说明 |
|------|--------|------|
| `docs/www/` | 68 | 旧版完整备份 |
| `docs/i18n-data/` | 23 | 旧版i18n数据 |
| `docs/ios/` | 旧iOS配置 | 与根目录ios/重复 |
| `docs/android/` | 旧Android配置 | 与根目录android/重复 |
| `docs/xcode-project/` | 旧Xcode项目 | 可能已废弃 |

### 建议：
- `docs/www/` - **保留** (包含早期完整版本)
- `docs/i18n-data/` - 与根目录 `i18n-data/` 对比后决定
- `docs/ios/`, `docs/android/`, `docs/xcode-project/` - **删除** (与根目录重复)

---

## 阶段3：根目录冗余文件

### 与 www/ 重复的文件:
- `index.html` - 应使用 www/index.html
- `app-v2.js` - 应使用 www/app-v2.js  
- `app.js` - 旧版本，应删除
- `ziwei-bio-core.js` - 重复，应使用 www/ziwei-bio-core.js
- `styles-v2.css` - 重复，应使用 www/styles-v2.css
- `i18n-core.js` - 重复，应使用 www/i18n-core.js
- `i18n-ui.js` - 重复，应使用 www/i18n-ui.js
- `i18n-styles.css` - 重复

### 其他待清理:
- `all-js-files-merged.txt` - 临时合并文件，可删除
- `all-js-viewer.html` - 临时查看器，可删除

---

## 阶段4：i18n 数据目录

| 目录 | 文件数 | 说明 |
|------|--------|------|
| `i18n-data/` | 23 | 主力i18n数据 |
| `i18n-data.backup/` | 23 | 备份，怀疑重复 |

### 建议：
- 比对后删除 `i18n-data.backup/`

---

## 执行记录

| 阶段 | 状态 | 完成时间 |
|------|------|----------|
| 阶段1: *.bak文件 | ⏳ 待处理 | - |
| 阶段2: docs/目录 | ⏳ 待处理 | - |
| 阶段3: 根目录冗余 | ⏳ 待处理 | - |
| 阶段4: i18n数据 | ⏳ 待处理 | - |
| 阶段5: Git清理 | ⏳ 待处理 | - |
| 阶段6: 文档更新 | ⏳ 待处理 | - |

---

*最后更新: 2026-04-04 18:57*