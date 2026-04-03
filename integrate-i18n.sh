#!/bin/bash
# 星轨人生 Pro - 完整整合 i18n 数据

echo "🔧 整合所有 i18n 数据..."
echo ""

PROJECT_DIR="/Users/wuyongnaren/Desktop/星轨人生pro"
cd "$PROJECT_DIR"

# 1. 备份并替换为 i18n 版本（更大的版本）
echo "📦 替换为 i18n 增强版..."

# character-bio-generator (44K vs 29K)
cp character-bio-generator.js character-bio-generator.js.bak
cp i18n-data/character-bio-generator-i18n.js character-bio-generator.js
echo "  ✅ character-bio-generator.js (29K → 44K)"

# character-bio-enhanced-generator
if [ -f "i18n-data/character-bio-enhanced-generator-i18n.js" ]; then
    cp character-bio-enhanced-generator.js character-bio-enhanced-generator.js.bak 2>/dev/null
    cp i18n-data/character-bio-enhanced-generator-i18n.js character-bio-enhanced-generator.js
    echo "  ✅ character-bio-enhanced-generator.js"
fi

# 2. 复制其他 i18n 文件（这些是纯 i18n 扩展，不覆盖原文件）
echo ""
echo "📋 添加 i18n 扩展文件..."

# 这些文件是额外的 i18n 数据，不覆盖原文件
cp i18n-data/character-20-questions-i18n.js .
cp i18n-data/character-bio-data-i18n.js .
cp i18n-data/chart-storage-i18n.js .
cp i18n-data/fine-chart-engine-i18n.js .
cp i18n-data/signature-details-generator-i18n.js .
cp i18n-data/ziwei-psychology-i18n.js .
cp i18n-data/ziwei-star-details-i18n.js .

echo "  ✅ 已添加 7 个 i18n 扩展文件"

# 3. 复制词库增强文件
echo ""
echo "📚 添加词库增强..."
cp i18n-data/rich-word-library.js .
cp i18n-data/ziwei-word-library.js .
cp i18n-data/writing-library-enhancer.js .

echo "  ✅ 已添加词库增强文件"

# 4. 复制桥接引擎
echo ""
echo "🌉 添加桥接引擎..."
cp i18n-data/chart-to-bio-bridge.js .

echo "  ✅ 已添加 chart-to-bio-bridge.js"

# 5. 更新 index.html 引用（添加新的 i18n 文件）
echo ""
echo "📝 更新脚本引用..."

# 在 app-v2.js 之前添加新的 i18n 文件引用
if ! grep -q "character-20-questions-i18n" index.html; then
    sed -i '' '/<script src="app-v2.js/i\
    <!-- i18n 扩展模块 -->\
    <script src="chart-to-bio-bridge.js"><\/script>\
    <script src="rich-word-library.js"><\/script>\
    <script src="ziwei-word-library.js"><\/script>\
    <script src="writing-library-enhancer.js"><\/script>\
    <script src="character-20-questions-i18n.js"><\/script>\
    <script src="ziwei-psychology-i18n.js"><\/script>\
    <script src="ziwei-star-details-i18n.js"><\/script>\
' index.html
    echo "  ✅ 已添加 i18n 扩展脚本引用"
else
    echo "  ⏭️  脚本引用已存在，跳过"
fi

echo ""
echo "✅ 整合完成！"
echo ""
echo "整合内容："
echo "  - ✅ 替换 character-bio-generator 为 i18n 版本"
echo "  - ✅ 添加 7 个 i18n 扩展模块"
echo "  - ✅ 添加词库增强文件"
echo "  - ✅ 添加命盘-小传桥接引擎"
echo "  - ✅ 更新脚本引用"
