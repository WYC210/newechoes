---
title: "Clion_make"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

#### CMake 项目配置
在 CLion 中使用 CMake 进行项目配置时，可以按照以下步骤进行：

```c
cmake_minimum_required(VERSION 3.26)
project(CLions C)

# 按照书本要求设定 C 语言版本
set(CMAKE_C_STANDARD 23)

# 设定构建运行路径，避免污染根目录
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/.archive)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/.library)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/.runtime)
set(LIBRARY_OUTPUT_PATH ${CMAKE_SOURCE_DIR}/.path)

# 遍历项目根目录下所有的 .c 文件，自动添加
file(GLOB_RECURSE files *.c **/*.c)
foreach (file ${files})
    string(REGEX REPLACE ".+/(.+)\\..*" "\\1" exe ${file})
    add_executable(${exe} ${file}
            Clions/try/try02.c)
    message(\ \ \ \ --\ \[${exe}.c\]\ will\ be\ compiled\ to\ \'.runtime/${exe}.exe\')
endforeach ()
```

首先指定了 CMake 的最低版本和项目名称，然后设置了 C 语言的标准版本。接着，通过 set 命令设定了构建输出路径，避免污染项目根目录。最后，使用 file 命令遍历项目根目录下的所有 .c 文件，并通过 foreach 循环为每个 .c 文件添加可执行目标，同时输出编译信息。



