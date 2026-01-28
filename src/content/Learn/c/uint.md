---
title: "uint"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

# unsigned int / uint

在 C 中常用的是 `unsigned int`，用于表示非负整数。具体范围取决于平台位数（常见 32 位为 0 ~ 2^32 - 1）。

如果需要固定宽度的无符号整数，推荐使用 `<stdint.h>` 中的类型，例如 `uint32_t`、`uint16_t` 等。

## 示例

```c
#include <stdint.h>

unsigned int count = 10;
uint32_t size = 1024;
```

## 补充

- `unsigned int` 常用格式符是 `%u`
- 固定宽度类型可配合 `PRIu32` 等宏输出
