---
title: "3hidden"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

# hidden 属性

在小程序中，可用 `hidden` 控制显示与隐藏。

```html
<view hidden="{{condition}}">内容</view>
```

当 `condition` 为 `true` 时隐藏，为 `false` 时显示。

## 与 wx:if 的区别

- `hidden`：节点仍在，只是切换显示状态
- `wx:if`：条件不满足时节点会被销毁
