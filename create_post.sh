#!/bin/bash

# 获取脚本所在目录的上级目录（假设脚本在项目根目录）
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# 如果没有提供参数，使用交互式输入
if [ "$#" -lt 2 ]; then
    read -rp "请输入文章标题: " TITLE
    read -rp "请输入文章路径 (例如: web/my-post)，也可以为空: " PATH_ARG
else
    TITLE=$1
    PATH_ARG=$2
fi

# 检查输入是否为空
if [ -z "$TITLE" ] ; then
    echo "错误: 标题不能为空"
    echo "使用方法: $0 <标题> <路径>"
    echo "示例: $0 \"我的新文章\" \"web/my-post\""
    exit 1
fi

# 获取当前时间，格式化为ISO 8601格式
CURRENT_DATE=$(date +"%Y-%m-%dT%H:%M:%S%:z")

# 构建完整的文件路径
CONTENT_DIR="$PROJECT_ROOT/src/content"
FULL_PATH="$CONTENT_DIR/$PATH_ARG"

# 确保路径存在
mkdir -p "$FULL_PATH"

# 构建最终的文件路径
FILENAME="$FULL_PATH/$(basename "$TITLE").md"
ABSOLUTE_PATH="$(cd "$(dirname "$FILENAME")" 2>/dev/null && pwd)/$(basename "$FILENAME")"

# 检查文件是否已存在
if [ -f "$FILENAME" ]; then
    echo "错误: 文章已存在: $ABSOLUTE_PATH"
    read -rp "按回车键退出..." 
    exit 1
fi

# 创建markdown文件
cat > "$FILENAME" << EOF
---
title: "$TITLE"
date: $CURRENT_DATE
tags: []
---
hello,world
EOF

echo "已创建新文章: $ABSOLUTE_PATH"
read -rp "按回车键退出..." 