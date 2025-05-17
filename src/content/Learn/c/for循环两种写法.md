---
title: "for循环两种写法"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

int i ;
for(i = 0 ; i < length ; i++){

}
for 循环完变量 i 并不会销毁而是等于 length
for(int i = 0; i < length ; i++){

}

```
for循环完变量i被销毁了
c语言默认是第一种写法
```
