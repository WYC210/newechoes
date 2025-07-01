---
title: "sizeof"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

在 C 语言中，`sizeof` 是一个操作符，用于获取数据类型或变量所占用的字节数。

#### 基本用法示例
```c
#include <stdio.h>

int main() {
    int x = 10;
    // 通过变量名计算变量所属数据类型占用内存大小
    printf("x: %zu\n", sizeof(x)); 
    // 通过类型名称计算各基本数据类型所占用内存大小
    printf("int: %zu\n", sizeof(int)); 
    printf("char: %zu\n", sizeof(char)); 
    printf("float: %zu\n", sizeof(float)); 
    printf("double: %zu\n", sizeof(double)); 
    return 0;
}