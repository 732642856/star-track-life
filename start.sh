#!/bin/bash
# 星轨人生 Pro - 快速启动脚本

echo "🌟 星轨人生 Pro - 启动中..."
echo ""

PROJECT_DIR="/Users/wuyongnaren/Desktop/星轨人生pro"
cd "$PROJECT_DIR"

# 检查参数
if [ "$1" == "test" ]; then
    echo "📋 打开国际化测试页面..."
    open "$PROJECT_DIR/www/test-i18n.html"
    exit 0
fi

if [ "$1" == "web" ]; then
    echo "🌐 打开 Web 版本..."
    open "$PROJECT_DIR/www/index.html"
    exit 0
fi

if [ "$1" == "build" ]; then
    echo "📦 打包 Mac 应用..."
    npm run build:mac
    echo "✅ 打包完成！"
    echo "应用位置: $PROJECT_DIR/dist/mac/星轨人生.app"
    open "$PROJECT_DIR/dist/mac/"
    exit 0
fi

# 默认：启动 Electron 开发模式
echo "🚀 启动 Electron 开发模式..."
echo ""
npm run dev
