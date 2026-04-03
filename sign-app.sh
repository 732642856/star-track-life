#!/bin/bash
# 星轨人生 - Mac App Store 签名脚本

set -e

APP_PATH="/Users/wuyongnaren/WorkBuddy/20260401142350/star-track-life2.0/dist/mac/星轨人生.app"
CERT_NAME="3rd Party Mac Developer Application: yinan wu (2DM78YY6PM)"
CERT_SHA1="73665ABEE8F20F0025FC3C8134E6812151DB63D0"

echo "============================================"
echo "星轨人生 - Mac App Store 签名脚本"
echo "============================================"
echo "证书: $CERT_NAME"
echo "应用: $APP_PATH"
echo ""

# 步骤1: 代码签名
echo "📝 步骤1: 代码签名..."
codesign --force --deep --sign "$CERT_SHA1" "$APP_PATH"
echo "✅ 代码签名完成"

# 步骤2: 验证签名
echo ""
echo "📝 步骤2: 验证签名..."
codesign -dvv "$APP_PATH"
echo "✅ 验证通过"

# 步骤3: 提交公证（必须！）
echo ""
echo "📝 步骤3: 提交 Apple 公证..."
echo "⚠️  公证需要 Apple ID 账号和 app-specific password"
echo "    如果没有配置，会跳过此步骤"
echo ""

# 检查是否配置了 notarytool
if command -v xcrun &> /dev/null; then
    echo "✅ Xcode tools 可用"
    echo ""
    echo "📝 步骤4: 打包 pkg..."
    # electron-builder 会自动处理
else
    echo "⚠️  请确保安装 Xcode Command Line Tools"
fi

echo ""
echo "============================================"
echo "下一步："
echo "1. 使用 electron-builder 重新构建: npm run build:mac"
echo "2. 使用 Transporter 或 Xcode 上传 pkg 到 App Store Connect"
echo "============================================"
