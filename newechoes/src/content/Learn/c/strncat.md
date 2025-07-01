---
title: "strncat"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

`strncat` 是 C 语言中用于连接两个字符串的函数，它与 `strcat` 函数类似，但具有更安全的特性，允许指定要附加的最大字符数，这样可以有效避免缓冲区溢出等安全问题。

#### 函数原型
```c
char *strncat(char *dest, const char *src, size_t n);
```

#### 参数
- `dest`：目标字符串，即要附加到的字符串。
- `src`：源字符串，即要附加的字符串。
- `n`：要附加的最大字符数。

#### 返回值
返回指向目标字符串 `dest` 的指针。

#### 功能
`strncat` 函数将源字符串 `src` 的前 `n` 个字符连接到目标字符串 `dest` 的末尾。如果源字符串的长度小于 `n`，则仅连接源字符串的所有字符。如果源字符串的长度大于或等于 `n`，则仅连接源字符串的前 `n` 个字符。

#### 示例
```c
#include <stdio.h>
#include <string.h>

int main() {
    char dest[50] = "Hello, ";
    const char *src = "world!";
    size_t n = 5; // 附加源字符串的前 5 个字符

    strncat(dest, src, n);

    printf("Result: %s\n", dest); // 输出: Hello, world!
    return 0;
}
```
#### 注意事项
在使用 strncat 函数之前，必须确保目标字符串具有足够的空间来容纳结果，以避免缓冲区溢出。此外，还应该注意 n 参数的设置，确保它不会超过目标字符串的可用空间