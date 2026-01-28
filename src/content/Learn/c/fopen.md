---
title: "fopen"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

# fopen 基础

`fopen` 用于打开文件，声明在 `stdio.h` 中。

## 函数原型

```c
FILE *fopen(const char *path, const char *mode);
```

## 常见模式

| 模式 | 含义 |
| --- | --- |
| `r` | 只读，文件必须存在 |
| `w` | 只写，若存在则清空 |
| `a` | 追加，若不存在则创建 |
| `r+` | 读写，文件必须存在 |
| `w+` | 读写，若存在则清空 |
| `a+` | 读写，追加 |

可在模式后加 `b` 表示二进制模式，如 `rb`、`wb`、`ab`。

## 示例

```c
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("data.txt", "r");
    if (!fp) {
        return 1;
    }
    fclose(fp);
    return 0;
}
```
