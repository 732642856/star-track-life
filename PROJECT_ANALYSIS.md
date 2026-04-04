# 星轨人生 - 项目问题分析与改进方案

**创建时间**: 2026-04-04

---

## 一、过去项目失败/问题原因分析

### 1. 目录结构混乱

| 问题 | 原因 | 影响 |
|------|------|------|
| 多处存放相同文件 | 根目录、www/、docs/、i18n-data/ 都有相同文件 | 不知道哪个是最新版本 |
| 备份文件泛滥 | *.bak, *.backup, 多个备份目录 | 占用空间，难以维护 |
| 入口文件不明 | index.html 在多个位置 | 修改错文件 |

### 2. 信息遗漏原因

| 问题 | 原因 | 改进 |
|------|------|------|
| 引擎文件不完整 | 只复制了精简版，遗漏完整版 | 建立文件清单 |
| i18n数据未使用 | 不知道哪些文件需要 | 建立索引文档 |
| 翻译不生效 | 入口文件位置错误 | 明确入口路径 |

### 3. 代码同步问题

| 问题 | 原因 | 改进 |
|------|------|------|
| 本地修改未推送 | 多个仓库/分支混乱 | 单一仓库+单一分支 |
| 版本覆盖 | "sync"提交覆盖历史 | 明确提交信息 |

---

## 二、当前仓库状态

### GitHub 仓库

| 仓库 | 大小 | 内容 | 状态 |
|------|------|------|------|
| star-track-life | ~1.6MB | 主应用+iOS构建 | ✅ 活跃 |
| star-track-life0 | 72MB | 双语数据 | ⚠️ 已合并 |
| star-track-life2.0 | 3MB | 完整引擎 | ⚠️ 已合并 |

### 本地仓库结构 (star-track-life)

```
star-track-life/
├── www/                    ⭐ 唯一生产版本 (64 files)
├── docs/www/               📦 历史备份 (参考用)
├── docs/                   旧版完整代码
├── i18n-data/              i18n数据 (23 files)
├── ios/                    iOS配置
├── android/                Android配置
├── .github/workflows/       CI/CD配置
└── 配置文件
```

---

## 三、索引系统（防止遗漏）

### 文件清单

| 类型 | 路径 | 说明 |
|------|------|------|
| 入口 | www/index.html | 唯一入口 |
| 核心逻辑 | www/app-v2.js | 主应用逻辑 |
| i18n核心 | www/i18n-core.js | 语言切换 |
| i18n数据 | www/i18n-ui.js | UI翻译 |
| 小传引擎 | www/ziwei-bio-core.js | 人物生成 |
| 排盘引擎 | www/fine-chart-engine.js | 星盘计算 |
| 样式 | www/styles-v2.css | 主样式 |

### 关键依赖链

```
index.html
  ├── i18n-core.js (语言核心)
  ├── i18n-ui.js (翻译数据)
  ├── app-v2.js (主逻辑)
  │   ├── ziwei-bio-core.js (小传)
  │   ├── fine-chart-engine.js (排盘)
  │   └── chart-to-bio-bridge.js (桥接)
  └── styles-v2.css
```

---

## 四、改进方案

### 1. 开发流程

```
开发步骤:
1. 修改聚焦 www/ 目录
2. 本地测试: python3 -m http.server 8888
3. 推送: git push origin main
4. 构建: GitHub Actions 自动构建
5. 下载IPA上传App Store
```

### 2. 禁止事项

- ❌ 禁止在根目录修改与 www/ 相同的文件
- ❌ 禁止创建 *.bak 备份文件
- ❌ 禁止推送到多个分支

### 3. 文件命名规范

- 生产版本: 正常命名
- 备份: 移动到 backup/ 目录
- 测试: 使用 .test.js 后缀

### 4. 提交信息规范

```
feat: 新功能
fix: 修复bug
chore: 整理/构建
docs: 文档更新
```

---

## 五、常见问题快速排查

| 问题 | 检查项 |
|------|---------|
| 翻译不生效 | 1. index.html是否最新 2. i18n-core.js是否加载 3. CURRENT_LANG是否定义 |
| 构建失败 | 1. package.json是否存在 2. ios/目录是否完整 3. 证书是否有效 |
| 功能异常 | 1. console报错 2. 依赖是否加载 3. 函数是否挂载到window |

---

## 六、下次迭代清单

- [ ] 确认 www/ 为唯一生产目录
- [ ] 更新 README.md 开发流程
- [ ] 建立完整的文件索引文档
- [ ] 考虑删除 star-track-life0 和 star-track-life2.0 仓库（或归档）

---

*分析完成，帮助后续迭代*