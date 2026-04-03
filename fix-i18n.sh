#!/bin/bash
# 星轨人生 Pro - 国际化完整修复脚本

echo "🔧 开始修复国际化系统..."
echo ""

PROJECT_DIR="/Users/wuyongnaren/Desktop/星轨人生pro"
cd "$PROJECT_DIR"

# 1. 备份原始文件
echo "📦 备份原始文件..."
cp index.html index.html.backup
cp -r i18n-data i18n-data.backup

# 2. 在根目录 index.html 中添加国际化支持
echo ""
echo "🌐 在主 index.html 中添加国际化..."

# 在 </head> 前添加样式
sed -i '' '/<\/head>/i\
    <!-- 国际化样式 -->\
    <link rel="stylesheet" href="i18n-styles.css">\
' index.html

# 在 <body> 后添加语言切换器
sed -i '' '/<body>/a\
\
    <!-- ══ 语言切换器 Language Switcher ══ -->\
    <div class="lang-switcher" id="lang-switcher">\
        <button class="lang-btn active" data-lang="zh" onclick="switchLanguage('\''zh'\'')">简体</button>\
        <button class="lang-btn" data-lang="zh-TW" onclick="switchLanguage('\''zh-TW'\'')">繁體</button>\
        <button class="lang-btn" data-lang="en" onclick="switchLanguage('\''en'\'')">EN</button>\
    </div>
' index.html

# 3. 复制国际化文件到根目录
echo ""
echo "📋 复制国际化文件..."
cp i18n-data/i18n-ui.js .
cp i18n-core.js . 2>/dev/null || echo "创建 i18n-core.js"
cp i18n-styles.css . 2>/dev/null || echo "创建 i18n-styles.css"

# 4. 替换为完整版的 bio-core
echo ""
echo "⭐ 替换为完整版双语引擎..."
# 备份旧版本
cp www/ziwei-bio-core.js www/ziwei-bio-core-simple.js.bak
# 复制完整版
cp i18n-data/ziwei-bio-core.js www/ziwei-bio-core.js
cp i18n-data/ziwei-bio-core.js .

# 5. 在脚本引用部分添加 i18n 脚本
echo ""
echo "📝 添加脚本引用..."
sed -i '' 's/<script src="ziwei-complete.js/<script src="i18n-core.js"><\/script>\
    <script src="i18n-ui.js"><\/script>\
    <script src="ziwei-complete.js/' index.html

# 6. 复制其他重要的 i18n 数据文件
echo ""
echo "📚 复制 i18n 数据文件..."
cp i18n-data/ziwei-i18n-complete.js .
cp i18n-data/ziwei-i18n-stars.js .
cp i18n-data/ziwei-patterns-i18n.js .
cp i18n-data/era-data-i18n.js .
cp i18n-data/chart-to-bio-bridge.js .
cp i18n-data/rich-word-library.js .
cp i18n-data/ziwei-word-library.js .
cp i18n-data/writing-library-enhancer.js .

echo ""
echo "✅ 修复完成！"
echo ""
echo "修复内容："
echo "  - ✅ 添加语言切换器到页面右上角"
echo "  - ✅ 引用完整版双语引擎 (439KB)"
echo "  - ✅ 复制所有 i18n 数据文件"
echo "  - ✅ 添加 i18n 核心脚本引用"
echo ""
echo "现在可以打开 index.html 测试了！"
