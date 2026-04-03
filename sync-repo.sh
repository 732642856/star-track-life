#!/bin/bash
# 使用 GitHub 仓库完整资料替换当前项目

echo "🔄 开始使用 GitHub 仓库完整资料..."
echo ""

SRC_DIR="/Users/wuyongnaren/Desktop/star-track-life2.0-temp"
DEST_DIR="/Users/wuyongnaren/Desktop/星轨人生pro"

cd "$DEST_DIR"

# 1. 备份当前项目的自定义文件
echo "📦 备份自定义文件..."
mkdir -p .backup-custom
cp i18n-core.js .backup-custom/ 2>/dev/null
cp i18n-styles.css .backup-custom/ 2>/dev/null
cp preload.js .backup-custom/ 2>/dev/null
cp main.js .backup-custom/ 2>/dev/null
cp -r www .backup-custom/ 2>/dev/null
cp -r dist .backup-custom/ 2>/dev/null
cp -r node_modules .backup-custom/ 2>/dev/null
cp package*.json .backup-custom/ 2>/dev/null
cp electron-builder.json .backup-custom/ 2>/dev/null
cp entitlements.plist .backup-custom/ 2>/dev/null
cp sign-app.sh .backup-custom/ 2>/dev/null
cp xcode-project .backup-custom/ -r 2>/dev/null

echo "  ✅ 已备份自定义文件到 .backup-custom/"

# 2. 同步仓库文件（排除 .git 目录）
echo ""
echo "📥 同步仓库文件..."

# 使用 rsync 同步，排除 .git 目录
rsync -av --exclude='.git' --exclude='.github' "$SRC_DIR/" "$DEST_DIR/"

echo "  ✅ 文件同步完成"

# 3. 恢复自定义文件
echo ""
echo "🔄 恢复自定义文件..."
cp .backup-custom/i18n-core.js . 2>/dev/null
cp .backup-custom/i18n-styles.css . 2>/dev/null
cp .backup-custom/preload.js . 2>/dev/null
cp .backup-custom/main.js . 2>/dev/null
cp .backup-custom/package*.json . 2>/dev/null
cp .backup-custom/electron-builder.json . 2>/dev/null
cp .backup-custom/entitlements.plist . 2>/dev/null
cp .backup-custom/sign-app.sh . 2>/dev/null

# 恢复构建相关目录
cp -r .backup-custom/node_modules . 2>/dev/null
cp -r .backup-custom/dist . 2>/dev/null
cp -r .backup-custom/xcode-project . 2>/dev/null

echo "  ✅ 已恢复自定义文件"

# 4. 确保 www 目录有国际化支持
echo ""
echo "🌐 确保 www 目录有国际化支持..."
cp i18n-core.js www/ 2>/dev/null
cp i18n-styles.css www/ 2>/dev/null
cp -r i18n-data www/ 2>/dev/null

echo "  ✅ 已复制国际化文件到 www/"

# 5. 更新 index.html 添加国际化支持
echo ""
echo "📝 更新 index.html 国际化支持..."

# 检查是否已有语言切换器
if ! grep -q "lang-switcher" index.html; then
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
    
    echo "  ✅ 已添加语言切换器"
else
    echo "  ⏭️  语言切换器已存在"
fi

# 检查是否已有 i18n 脚本引用
if ! grep -q "i18n-core.js" index.html; then
    sed -i '' 's/<script src="ziwei-complete.js/<script src="i18n-core.js"><\/script>\
    <script src="i18n-data\/i18n-ui.js"><\/script>\
    <script src="ziwei-complete.js/' index.html
    echo "  ✅ 已添加 i18n 脚本引用"
else
    echo "  ⏭️  i18n 脚本引用已存在"
fi

# 6. 添加国际化函数到 app-v2.js
echo ""
echo "📝 确保 app-v2.js 有国际化函数..."
if ! grep -q "function switchLanguage" app-v2.js; then
    # 追加国际化函数
    cat >> app-v2.js << 'I18N_FUNCTIONS'

// ==================== 国际化语言切换 ====================

function switchLanguage(lang) {
    if (typeof I18nCore === 'undefined') {
        console.error('[i18n] I18nCore 未加载');
        return;
    }
    const oldLang = I18nCore.getLanguage();
    if (!I18nCore.setLanguage(lang)) return;
    updateLanguageButtons(lang);
    updatePageLanguage(lang);
    showLanguageToast(lang);
    console.log('[i18n] 语言已切换:', oldLang, '→', lang);
}

function updateLanguageButtons(activeLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === activeLang);
    });
}

function updatePageLanguage(lang) {
    if (typeof I18nCore === 'undefined' || typeof UI_TEXT === 'undefined') return;
    const ui = UI_TEXT[lang] || UI_TEXT['zh'];
    document.title = ui.appName + ' - ' + ui.appSlogan;
    document.documentElement.lang = lang === 'zh-TW' ? 'zh-TW' : lang === 'en' ? 'en' : 'zh-CN';
}

function showLanguageToast(lang) {
    const langNames = { 'zh': '简体中文', 'zh-TW': '繁體中文', 'en': 'English' };
    const toast = document.createElement('div');
    toast.className = 'lang-toast';
    toast.textContent = '🌐 ' + langNames[lang];
    toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(0,0,0,0.8);color:#fff;border-radius:24px;font-size:14px;z-index:10000;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
}

function initLanguage() {
    if (typeof I18nCore !== 'undefined') {
        I18nCore.init();
        updateLanguageButtons(I18nCore.getLanguage());
        updatePageLanguage(I18nCore.getLanguage());
    }
}

function t(key) { return typeof I18nCore !== 'undefined' ? I18nCore.t(key) : key; }
function tStar(starName) { return typeof I18nCore !== 'undefined' ? I18nCore.getStarName(starName) : starName; }
function tPalace(palaceName) { return typeof I18nCore !== 'undefined' ? I18nCore.getPalaceName(palaceName) : palaceName; }

window.addEventListener('languageChanged', function(e) {
    updateLanguageButtons(e.detail.lang);
    updatePageLanguage(e.detail.lang);
});

document.addEventListener('DOMContentLoaded', function() { setTimeout(initLanguage, 100); });
window.switchLanguage = switchLanguage;
window.t = t;
window.tStar = tStar;
window.tPalace = tPalace;
I18N_FUNCTIONS
    echo "  ✅ 已添加国际化函数"
else
    echo "  ⏭️  国际化函数已存在"
fi

echo ""
echo "✅ 完成！仓库资料已完整同步"
echo ""
echo "统计："
echo "  - JS 文件: $(ls -1 *.js 2>/dev/null | wc -l | tr -d ' ')"
echo "  - i18n 文件: $(ls -1 i18n-data/*.js 2>/dev/null | wc -l | tr -d ' ')"
echo "  - 总文件数: $(find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.backup-custom/*' | wc -l | tr -d ' ')"
