---
title: "3hidden"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

在小程序中，直接使用 
```html
hidden=" {{ condition}"也能控制元素的显示与隐藏:
1 <view hidden="{{ condition }}">
```
条件为 true 隐藏，条件为 false 显示`</view>`

hidden 与 wx:if 的区别，wx:if 是控制元素的显示和隐藏，隐藏即条件为 False 看不见
hidden 则是切换状态，不管条件是否满足都可见
