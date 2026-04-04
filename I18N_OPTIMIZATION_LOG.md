# i18n 优化工作日志

## 2024-01-XX 优化记录

### 发现的核心问题

1. **localStorage 键名不统一**
   - `i18n-core.js` 使用 `startrack-lang`
   - `index.html` 和其他文件使用 `star_track_lang`
   - **已修复**: 统一为 `star_track_lang`

2. **UI_TEXT 未挂载到 window**
   - `i18n-ui.js` 使用 `const UI_TEXT = {...}` 声明
   - `const`/`let` 声明的变量不会自动成为 `window` 属性
   - **已修复**: 显式添加 `window.UI_TEXT = UI_TEXT`

3. **主星显示丢失**
   - `app-v2.js` 调用 `generateChart({ year: ... })`
   - `FineChartEngine` 期望 `birthYear`
   - **已修复**: 参数名统一为 `birthYear`

### 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `www/i18n-core.js` | 统一 localStorage 键名，同步 CURRENT_LANG |
| `www/i18n-ui.js` | 显式挂载 UI_TEXT/UI_DYNAMIC 到 window |
| `www/app-v2.js` | 修复参数名，添加翻译调用，暴露函数到 window |
| `www/index.html` | 版本号强制刷新，onclick 安全检查 |
| `www/ziwei-bio-core.js` | 添加 Reserved 映射 |

### 待解决问题

1. **小传生成内容仍是中文**
   - `ziwei-bio-core.js` 的叙事文本硬编码中文
   - 需要建立完整的英文叙事模板
   - 或使用 AI 翻译 API

2. **部分 UI 文本未翻译**
   - 对比面板 `generateComparison()` 中的分析文本
   - Toast 提示信息

### 下次工作建议

1. 检查 `ziwei-bio-core.js` 中的 `_generateXXXDesc` 函数
2. 考虑建立 `bio-templates-en.js` 英文叙事模板
3. 测试所有页面的语言切换

### 测试方法

```bash
# 启动本地服务器
cd /workspace/star-track-life/www
python3 -m http.server 8000

# 访问
http://localhost:8000
```

### Git 分支信息

- 当前分支: `i18n-fix-optimization`
- 提交: `6157931`
- 基于: `main` 分支的 `e93d334` 提交
