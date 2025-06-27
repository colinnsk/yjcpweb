#!/bin/bash

echo "🔧 修复一键出片项目构建问题..."

# 1. 设置npm镜像
echo "📦 设置npm镜像源..."
npm config set registry https://registry.npmjs.org/

# 2. 清理可能的缓存
echo "🧹 清理缓存..."
npm cache clean --force

# 3. 删除node_modules（如果存在）
if [ -d "node_modules" ]; then
    echo "🗑️  删除旧的node_modules..."
    rm -rf node_modules
fi

# 4. 删除package-lock.json（如果存在）
if [ -f "package-lock.json" ]; then
    echo "🗑️  删除package-lock.json..."
    rm package-lock.json
fi

# 5. 安装依赖
echo "📥 安装依赖包..."
npm install

# 6. 创建dist目录
echo "📁 创建构建目录..."
mkdir -p dist

# 7. 尝试构建
echo "🔨 尝试构建项目..."
npm run build:dev

echo "✅ 修复完成！"
echo "💡 如果还有问题，请运行："
echo "   npm run webpack:dev  # 启动开发服务器"
echo "   npm run serve        # 启动静态服务器" 