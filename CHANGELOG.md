# Changelog

所有项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added
- 添加性能优化：简繁转换函数性能提升 10-20 倍
- 添加正则表达式缓存机制

### Changed
- 优化 `_SC2TW_MAP` 数据结构：从数组改为对象映射
- 重构 `_sc2tw` 函数：使用正则批量替换替代循环遍历

### Fixed
- 修复简繁转换性能问题
- 清理项目中的备份文件和重复目录

## [2.0.0] - 2026-04-02

### Added
- 完整双语支持（简体中文、繁体中文、英文）
- 语言切换器 UI
- 命盘到小传桥接引擎
- 面相学外貌体系（萧湘识人相法 × 紫微14主星）
- 编剧理论强化（韩国编剧"事为人宜"逻辑）
- 写作词库措辞精准化
- Electron 多语言菜单支持

### Changed
- 整合 star-track-life、star-track-life0、star-track-life2.0 三个项目
- 替换为完整版双语引擎 (439KB)
- 升级国际化 UI 文案

### Fixed
- 修复语言切换器未显示的问题
- 修复引擎输出内容不完整的问题
- 修复素材文件未完全使用的问题

## [1.0.0] - 2024

### Added
- 紫微斗数命盘排盘系统
- 144种命盘格局
- 108颗星曜体系
- 人物小传生成
- 20问角色深度探测
- 时代背景系统（古代/近代/现代）

---

[Unreleased]: https://github.com/732642856/star-track-life/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/732642856/star-track-life/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/732642856/star-track-life/releases/tag/v1.0.0
