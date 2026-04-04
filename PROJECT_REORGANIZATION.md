# 星轨人生 - 项目结构说明 & 整理方案

## 一、当前项目结构分析

### 📁 目录结构总览

```
star-track-life/
├── www/                      ⭐ 当前生产版本 (iOS 打包源)
│   ├── index.html            主入口 (377KB - 含内联样式/脚本)
│   ├── app-v2.js             核心应用逻辑 (59KB)
│   ├── i18n-core.js          国际化核心模块
│   ├── i18n-ui.js            UI 翻译数据 (三语言)
│   ├── ziwei-bio-core.js     人物小传生成引擎 (426KB)
│   ├── fine-chart-engine.js  紫微斗数排盘引擎
│   ├── chart-to-bio-bridge.js 排盘→小传桥接层
│   ├── styles-v2.css         当前使用的样式
│   └── i18n-data/            备用 i18n 数据
│
├── docs/                      📦 文档和备份集合
│   ├── www/                  ⚠️ 旧版完整备份 (61 files)
│   │   ├── index.html        旧版入口
│   │   ├── app-v2.js         旧版应用逻辑
│   │   ├── i18n-ui.js        旧版翻译
│   │   └── ...
│   ├── i18n-data/            旧版 i18n 数据备份
│   ├── ios/                  旧版 iOS 相关文件
│   ├── android/              旧版 Android 相关文件
│   └── xcode-project/        旧版 Xcode 项目
│
├── i18n-data/                 📋 主版本 i18n 数据 (23 files)
│   ├── i18n-ui.js            翻译数据
│   ├── ziwei-bio-core.js     翻译后的小传引擎
│   └── ...
│
├── i18n-data.backup/          📋 i18n 数据备份 (23 files)
│
├── ios/                       📦 iOS 构建配置
│   └── App/                   Capacitor iOS 项目
│
├── android/                   📦 Android 构建配置
│   └── app/                   Capacitor Android 项目
│
└── .github/workflows/         ⚙️ CI/CD 配置
    └── ios-build.yml         iOS 自动构建
```

---

## 二、文件分类清单

### 🔴 冗余/备份文件 (可清理)

| 文件 | 说明 | 建议 |
|------|------|------|
| `*.bak` | 备份文件 | 移到 `backup/` 目录 |
| `docs/www/` | 旧版完整备份 | 评估后删除或归档 |
| `docs/i18n-data/` | 旧版 i18n 备份 | 与主版对比后删除 |
| `docs/ios/`, `docs/android/` | 旧版移动端 | 与根目录对比后删除 |
| `i18n-data.backup/` | i18n 备份 | 与主版合并后删除 |
| `star-track-life0/` | 旧版本仓库 | 评估后删除或独立仓库 |
| `star-track-life2.0/` | 另一个旧版本 | 评估后删除或独立仓库 |

### 🟡 主版本文件 (保留)

| 文件 | 说明 |
|------|------|
| `www/` | ⭐ 当前生产版本，所有开发聚焦此处 |
| `i18n-data/` | 翻译数据源 |
| `index.html` | 主入口 (377KB，含完整内联代码) |
| `app-v2.js` | 核心逻辑 |
| `ziwei-bio-core.js` | 小传引擎 (最大文件) |
| `package.json` | 项目依赖 |
| `capacitor.config.json` | 移动端配置 |

### 🟢 开发辅助文件

| 文件 | 说明 |
|------|------|
| `REPOSITORY_STRUCTURE.md` | 仓库结构说明 (刚恢复) |
| `I18N_OPTIMIZATION_LOG.md` | 优化工作日志 (刚恢复) |
| `*.sh` | 构建/部署脚本 |
| `.github/workflows/` | CI/CD 配置 |

---

## 三、Git 仓库分析

### 📊 分支状态

```
main                    ⭐ 当前活跃分支 (最新: eeba6ee)
├── remotes/origin/main  主分支远程
├── remotes/origin/backup-v1.0.2  (旧备份)
├── remotes/origin/i18n-fix-optimization  (i18n 修复分支)
└── remotes/origin/master  (旧主分支)
```

### 📝 提交历史 (最近15条)

| 提交 | 说明 |
|------|------|
| eeba6ee | fix: 添加缺失的 STAR_SIHUA_WOUND 中文变量定义 |
| 134977a | sync: 使用本地最新版本覆盖远程 |
| 391787d | sync: 使用本地最新版本 |
| b55f43c | 添加iOS构建工作流 |
| 0e5a111 | 更新v2.0 |
| f530d4e | fix: 统一 Mac Bundle ID |
| ... | |

### ⚠️ 问题

1. **提交信息混乱** - 多次 "sync" 覆盖，版本历史不清晰
2. **分支过多** - 3个远程分支，实际只用 main
3. **本地修改未提交** - 当前有 staged 和 unstaged 修改

---

## 四、推荐整理方案

### 🎯 阶段1: 清理冗余 (立即可做)

1. 删除 `*.bak` 文件 (移动到 backup 目录)
2. 评估并删除 `docs/` 中的完全重复备份
3. 删除 `i18n-data.backup/`

### 🎯 阶段2: 统一版本

1. 确定 `www/` 为唯一生产目录
2. 移除根目录的重复文件 (index.html, app-v2.js 等)
3. 统一 i18n 数据源到 `i18n-data/`

### 🎯 阶段3: Git 整理

1. 合并或删除多余分支
2. 整理提交历史 (如需要)
3. 添加 `.gitignore` 规则
4. 打标签 (如 v2.0, v2.1)

### 🎯 阶段4: 文档完善

1. 更新 `README.md`
2. 完善 `REPOSITORY_STRUCTURE.md`
3. 创建 `CHANGELOG.md`

---

## 五、下一步行动

1. **你确认**: 是否同意上述清理方案?
2. **需要决策**: 
   - `docs/` 目录是否完全删除?
   - 旧版本 `star-track-life0/`, `star-track-life2.0/` 如何处理?
3. **当前状态**: 我可以在你确认后立即执行清理

---

*最后更新: 2026-04-04*
*创建者: CodeBuddy AI*