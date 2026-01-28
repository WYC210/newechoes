---
title: "@import导入"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

# @import 导入（WXSS）

在小程序 `wxss` 中使用 `@import` 导入其他样式文件。

## 规则

- 路径需要使用引号
- 通常使用相对路径

## 示例

```css
@import "common.wxss";
@import "../../styles/variables.wxss";
```

导入后即可直接使用对应的 class。
