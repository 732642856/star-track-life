# 技术支持页面部署指南

## 📄 页面位置
`/docs/support/index.html` - 双语技术支持页面

## 🚀 GitHub Pages 部署步骤

### 1. 提交代码到 GitHub
```bash
cd /Users/wuyongnaren/WorkBuddy/20260404132413/star-track-life
git add docs/support/
git commit -m "Add bilingual support page for App Store"
git push origin master
```

### 2. 启用 GitHub Pages
1. 打开仓库设置：`https://github.com/732642856/star-track-life/settings`
2. 左侧菜单选择 **Pages**
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **master**，文件夹选择 **/docs**
5. 点击 **Save**

### 3. 访问技术支持页面
- 页面地址：`https://732642856.github.io/star-track-life/docs/support/`
- 等待 2-5 分钟后即可访问

### 4. App Store Connect 填写
1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. 选择「星轨人生」应用
3. 进入 **App 信息**
4. 在「技术支持网址」填写：
   ```
   https://732642856.github.io/star-track-life/docs/support/
   ```

## ✅ 页面包含内容

| 模块 | 中文 | English |
|------|------|---------|
| FAQ | ✅ | ✅ |
| 联系方式 | ✅ | ✅ |
| 隐私政策链接 | ✅ | ✅ |
| 版本信息 | ✅ | ✅ |
| 自动语言切换 | ✅ | ✅ |

## 📧 联系邮箱修改
编辑 `docs/support/index.html` 第 185 行：
```html
<a href="mailto:startracklife@example.com">startracklife@example.com</a>
```
改为你的真实邮箱。

## 🔄 更新页面
修改后重新提交：
```bash
git add docs/support/index.html
git commit -m "Update support page"
git push origin master
```

GitHub Pages 会自动更新（可能需要 1-2 分钟刷新缓存）。

## 📝 注意事项
- 邮箱目前是占位符，请替换为真实邮箱
- 隐私政策页面使用现有的 `docs/privacy.html`
- 页面支持响应式，手机和桌面都能正常显示
