#!/bin/bash

# 星轨人生 macOS 版本快速启动脚本
# Quick Start Script for Star Track Life macOS

set -e

echo "🌟 星轨人生 macOS 快速启动"
echo "=============================="

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
echo -e "${BLUE}检查 Node.js 版本...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}⚠️  Node.js 版本过低，建议升级到 20+${NC}"
    echo "当前版本: $(node -v)"
fi

# 安装依赖
echo -e "${BLUE}安装依赖...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ 依赖已存在，跳过安装${NC}"
fi

# 选择运行模式
echo ""
echo "请选择运行模式:"
echo "1) 🚀 开发模式 (Development) - 启用开发者工具"
echo "2) 📦 生产模式 (Production) - 模拟生产环境"
echo "3) 🔨 构建应用 (Build) - 构建 DMG 安装包"
echo "4) 🧹 清理缓存 (Clean) - 清理 node_modules 和缓存"
echo ""
read -p "输入选项 (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}启动开发模式...${NC}"
        NODE_ENV=development npm start
        ;;
    2)
        echo -e "${BLUE}启动生产模式...${NC}"
        npm start
        ;;
    3)
        echo -e "${BLUE}构建 macOS 应用...${NC}"
        echo ""
        echo "选择构建目标:"
        echo "1) DMG 安装包 (Universal - 推荐)"
        echo "2) Mac App Store 版本"
        echo "3) ZIP 压缩包"
        echo ""
        read -p "输入选项 (1-3): " build_choice
        
        case $build_choice in
            1)
                npm run build:mac:dmg
                echo -e "${GREEN}✅ DMG 构建完成!${NC}"
                echo "输出目录: dist/"
                ;;
            2)
                npm run build:mas
                echo -e "${GREEN}✅ Mac App Store 版本构建完成!${NC}"
                ;;
            3)
                npm run build:mac
                echo -e "${GREEN}✅ ZIP 构建完成!${NC}"
                ;;
            *)
                echo -e "${YELLOW}❌ 无效选项${NC}"
                exit 1
                ;;
        esac
        ;;
    4)
        echo -e "${BLUE}清理缓存...${NC}"
        rm -rf node_modules dist
        rm -f package-lock.json
        echo -e "${GREEN}✅ 清理完成，请重新安装依赖${NC}"
        ;;
    *)
        echo -e "${YELLOW}❌ 无效选项${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 完成!${NC}"
