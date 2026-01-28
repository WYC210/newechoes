---
title: "text"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

# text 与 rich-text

## text

`<text>` 可通过 `selectable` 控制是否允许长按复制。

```html
<text selectable>可长按复制：1234566</text>
<text selectable="false">不可长按复制：232455</text>
```

## rich-text

`<rich-text>` 用于渲染简单 HTML 片段。

```html
<rich-text nodes="<h1 style='color:red'>标题</h1>"></rich-text>
```
