---
title: "extern"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

# extern 用法

`extern` 用于声明在其他文件中定义的变量或函数。

## 示例：函数声明与定义

**add.h**

```c
#ifndef ADD_H
#define ADD_H

int add(int x, int y);

#endif
```

**add.c**

```c
#include "add.h"

int add(int x, int y) {
    return x + y;
}
```

**main.c**

```c
#include <stdio.h>
#include "add.h"

int main(void) {
    int a = 2;
    int b = 3;
    printf("%d\n", add(a, b));
    return 0;
}
```

## 示例：全局变量声明

**counter.h**

```c
extern int counter;
```

**counter.c**

```c
int counter = 0;
```


