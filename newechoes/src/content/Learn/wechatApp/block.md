---
title: "block"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

2.结合 <block>使用 wx:if
如果要一次性控制多个组件的展示与隐藏，可以使用一个<block></block>标签将多个组件包装起来，并在<block>标签上使用 wx:if 控制属性，示例如下:
1 <block wx:if="{{true}}">
<view> view1 </view>
<view> view2 </view>
4 </block>
注意: <block>并不是一个组件，它只是一个包裹性质的容器，不会在页面中做任何渲染。
