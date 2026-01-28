---
title: "label"
date: 2024-10-06T19:08:00Z
tags: ["HTML+CSS"]
---

# label 标签

`<label>` 用于关联表单控件，点击文字即可聚焦/触发对应控件。

## 关联方式

1. 使用 `for` + `id` 绑定
2. 直接包裹表单控件

## 示例

```html
<label for="male">男</label>
<input type="radio" name="sex" id="male">

<label>
  <input type="checkbox" name="agree">
  我已阅读并同意
</label>
```

## 注意事项

- `for` 的值必须与控件 `id` 相同
- 更利于可访问性与表单可用性
