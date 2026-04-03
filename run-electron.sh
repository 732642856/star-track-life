#!/bin/bash
# 星轨人生 Pro - Electron 启动脚本

echo "🚀 启动星轨人生 Pro..."
echo ""

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

# 启动 Electron
npm run dev
