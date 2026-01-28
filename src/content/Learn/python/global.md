---
title: "全局声明 "
date: 2024-10-06T19:08:00Z
tags: ["python"]
---

# global 声明全局变量

当在函数内修改全局变量时，需要使用 `global`。

```python
num = 10

def inc():
    global num
    num += 1
```

## 补充

若在嵌套函数中修改外层局部变量，应使用 `nonlocal`。
