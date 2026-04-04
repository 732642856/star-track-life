# 星轨人生 - 项目结构说明

**最后更新**: 2026-04-04

---

## 当前项目结构

```
star-track-life/
├── www/                      ⭐ 唯一生产版本
│   ├── index.html            主入口
│   ├── app-v2.js            核心应用逻辑
│   ├── i18n-core.js         国际化核心
│   ├── i18n-ui.js           UI翻译数据
│   ├── ziwei-bio-core.js    人物小传引擎
│   └── ...
│
├── docs/www/                  📦 历史版本备份 (68 files)
│   └── (旧版完整代码供参考)
│
├── ios/                      📱 iOS 构建配置
├── android/                   🤖 Android 构建配置
├── .github/workflows/         ⚙️ CI/CD 配置
│
└── 配置文件
    ├── package.json
    ├── capacitor.config.json
    └── README.md
```

---

## 整理记录

| 日期 | 操作 |
|------|------|
| 2026-04-04 | 删除 `*.bak` 备份文件 |
| 2026-04-04 | 删除 `docs/ios/`, `docs/android/`, `docs/xcode-project/` |
| 2026-04-04 | 删除 `i18n-data.backup/` |
| 2026-04-04 | 删除根目录重复文件 (与 `www/` 重复的 js/html/css) |
| 2026-04-04 | 删除 `docs/i18n-data/` |

---

## 开发工作流

```
1. 开发修改 → www/ 目录
2. 本地测试 → http://localhost:8888
3. 推送GitHub → git push
4. iOS构建 → GitHub Actions 自动构建
5. 下载IPA → 上传App Store Connect
```

---

## 注意事项

- **所有代码修改聚焦 `www/` 目录**
- `docs/www/` 保留作为历史参考
- 根目录只保留配置文件和文档

---

*整理完成，项目结构清晰*