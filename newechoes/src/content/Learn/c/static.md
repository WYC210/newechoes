---
title: "static"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

在 C 语言中，`static` 关键字可以用于修饰全局变量和函数。当 `static` 修饰全局变量时，这个全局变量的外部链接属性就变成了内部链接属性，其他源文件（`.c`）就不能再使用这个全局变量了。

#### 示例代码
```c
// file1.c
#include <stdio.h>

// 定义一个静态全局变量
static int global_var = 10; 

void print_global_var() {
    printf("global_var = %d\n", global_var);
}
```

```c
// file2.c
#include <stdio.h>

// 定义一个静态全局变量
static int global_var = 20; 

void print_global_var() {
    printf("global_var = %d\n", global_var);
}
```

```c
// main.c
#include <stdio.h>

extern void print_global_var();

int main() {
    print_global_var();
    return 0;
}
```

#### 编译和运行
```bash
gcc file1.c file2.c main.c -o main
./main
```

#### 输出结果
```bash
main.c: In function ‘main’:
main.c:4:16: error: conflicting types for ‘print_global_var’
  4 | extern void print_global_var();
    |                ^~~~~~~~~~~~~~~
file1.c:5:6: note: previous declaration of ‘print_global_var’ was here
  5 | void print_global_var() {
    
}
    |      ^~~~~~~~~~~~~~~
```