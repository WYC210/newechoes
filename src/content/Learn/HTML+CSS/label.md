---
title: "label"
date: 2024-10-06T19:08:00Z
tags: ["HTML+CSS"]
---

### label 标签说明
`<label>` 标签可以绑定表单的元素，通过 `for` 属性和表单元素的 `id` 属性进行匹配。当用户点击 `<label>` 标签时，与之关联的表单元素会获得焦点。

### 代码示例
```html
<label for="male">男</label>
<input type="radio" name="sex" id="male">
<label for="female">女</label>
<input type="radio" name="sex" id="female">
```
### 注意事项
1. `<label>` 标签的 `for` 属性的值必须与表单元素的 `id` 属性的值相同，才能实现关联。
2. `<label>` 标签可以包含表单元素，也可以不包含。如果包含表单元素，点击 `<label>` 标签时，会自动触发表单元素的点击事件。
3. `<label>` 标签的 `for` 属性的值可以是多个表单元素的 `id` 属性的值，这样多个表单元素就可以与同一个 `<label>` 标签关联。