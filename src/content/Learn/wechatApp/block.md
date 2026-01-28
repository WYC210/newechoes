---
title: "block"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

# block 用法

`<block>` 只用于包裹，不会渲染成节点，常用于配合 `wx:if` 或 `wx:for`。

## 示例：配合 wx:if

```html
<block wx:if="{{show}}">
  <view>view1</view>
  <view>view2</view>
</block>
```

## 说明

适合一次性控制多个组件的显示与隐藏。
